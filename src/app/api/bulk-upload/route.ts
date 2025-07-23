import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import path from 'path';
import { promises as fs } from 'fs';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
// Dynamic import for pdf-parse to avoid build issues

// Define the structure for parsed phone numbers
interface ParsedNumber {
  phoneNumber: string;
  prefix: string;
  operator: string;
  price?: number;
  type: 'standard' | 'gold' | 'premium';
  isValid: boolean;
  error?: string;
}

interface ExistingListing {
  phoneNumber: string;
  price?: number;
  [key: string]: unknown;
}

interface BulkUploadResult {
  success: ParsedNumber[];
  errors: ParsedNumber[];
  duplicates: ParsedNumber[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
  };
}

// Validation schema for bulk upload
const bulkUploadSchema = z.object({
  defaultType: z.enum(['standard', 'gold', 'premium']),
  defaultPrice: z.number().positive().optional(),
  contactPhone: z.string().optional(),
});

const dataDir = path.join(process.cwd(), 'public', 'data');

// Prefix to operator mapping
const prefixToOperator: { [key: string]: string } = {
  '010': 'Azercell',
  '050': 'Azercell', 
  '051': 'Azercell',
  '055': 'Bakcell',
  '060': 'Naxtel',
  '070': 'Nar Mobile',
  '077': 'Nar Mobile',
  '099': 'Bakcell'
};

// Prefix to file mapping
const prefixToFileMap: { [key: string]: { file: string, key: string } } = {
  '010': { file: '010.json', key: 'azercellAds' },
  '050': { file: '050.json', key: 'azercellAds' },
  '051': { file: '051.json', key: 'azercellAds' },
  '055': { file: '055.json', key: 'bakcellAds' },
  '060': { file: '060.json', key: 'naxtelAds' },
  '070': { file: '070.json', key: 'narmobileAds' },
  '077': { file: '077.json', key: 'narmobileAds' },
  '099': { file: '099.json', key: 'bakcellAds' }
};

// Phone number validation and parsing
function parsePhoneNumber(input: string): { isValid: boolean; prefix: string; number: string; formatted: string; error?: string } {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '');
  
  // Check if it's a valid Azerbaijan mobile number (10 digits starting with supported prefixes)
  if (digits.length !== 10) {
    return { isValid: false, prefix: '', number: '', formatted: '', error: 'Number must be 10 digits' };
  }
  
  const prefix = digits.substring(0, 3);
  const number = digits.substring(3);
  
  if (!prefixToOperator[prefix]) {
    return { isValid: false, prefix, number, formatted: '', error: `Unsupported prefix: ${prefix}` };
  }
  
  const formatted = `${prefix}-${number.substring(0, 3)}-${number.substring(3, 5)}-${number.substring(5)}`;
  
  return { isValid: true, prefix, number, formatted };
}

// Extract phone numbers from text
function extractPhoneNumbers(text: string): string[] {
  // Regex patterns for different phone number formats
  const patterns = [
    /\b0[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2}\b/g, // 050-123-45-67 or 050 123 45 67
    /\b0[0-9]{9}\b/g, // 0501234567
    /\b[0-9]{3}[-\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2}\b/g, // 050-123-45-67 without leading 0
  ];
  
  const numbers: string[] = [];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      numbers.push(...matches);
    }
  });
  
  return [...new Set(numbers)]; // Remove duplicates
}

// Parse different file types
async function parseFile(buffer: Buffer, filename: string): Promise<string[]> {
  const extension = path.extname(filename).toLowerCase();
  
  try {
    switch (extension) {
      case '.pdf':
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(buffer);
        return extractPhoneNumbers(pdfData.text);
        
      case '.xlsx':
      case '.xls':
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        let excelText = '';
        
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const sheetText = XLSX.utils.sheet_to_txt(sheet);
          excelText += sheetText + '\n';
        });
        
        return extractPhoneNumbers(excelText);
        
      case '.docx':
        const docResult = await mammoth.extractRawText({ buffer });
        return extractPhoneNumbers(docResult.value);
        
      case '.txt':
        const textContent = buffer.toString('utf-8');
        return extractPhoneNumbers(textContent);
        
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  } catch (error) {
    console.error(`Error parsing file ${filename}:`, error);
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Process and validate phone numbers
function processPhoneNumbers(
  phoneNumbers: string[], 
  defaultType: 'standard' | 'gold' | 'premium',
  defaultPrice?: number
): ParsedNumber[] {
  const processed: ParsedNumber[] = [];
  
  phoneNumbers.forEach(phoneStr => {
    const parsed = parsePhoneNumber(phoneStr);
    
    const processedNumber: ParsedNumber = {
      phoneNumber: parsed.isValid ? parsed.formatted : phoneStr,
      prefix: parsed.prefix,
      operator: prefixToOperator[parsed.prefix] || 'Unknown',
      price: defaultPrice || 50, // Default price if not specified
      type: defaultType,
      isValid: parsed.isValid,
      error: parsed.error
    };
    
    processed.push(processedNumber);
  });
  
  return processed;
}

// Check for duplicates in existing JSON files
async function checkForDuplicates(numbers: ParsedNumber[]): Promise<{ existing: ParsedNumber[], new: ParsedNumber[] }> {
  const existing: ParsedNumber[] = [];
  const newNumbers: ParsedNumber[] = [];
  
  for (const number of numbers) {
    if (!number.isValid) {
      newNumbers.push(number);
      continue;
    }
    
    const fileConfig = prefixToFileMap[number.prefix];
    if (!fileConfig) {
      newNumbers.push(number);
      continue;
    }
    
    try {
      // Check in all three locations (standard, gold, premium)
      const locations = [
        path.join(dataDir, fileConfig.file),
        path.join(dataDir, 'gold', fileConfig.file),
        path.join(dataDir, 'elan', fileConfig.file)
      ];
      
      let isDuplicate = false;
      
      for (const filePath of locations) {
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(fileContent);
          const existingNumbers = data[fileConfig.key] || [];
          
          const duplicate = existingNumbers.find((item: ExistingListing) => 
            item.phoneNumber === number.phoneNumber
          );
          
          if (duplicate) {
            existing.push(number);
            isDuplicate = true;
            break;
          }
        } catch {
          // File doesn't exist, continue
        }
      }
      
      if (!isDuplicate) {
        newNumbers.push(number);
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
      newNumbers.push(number);
    }
  }
  
  return { existing, new: newNumbers };
}

// Save numbers to appropriate JSON files
async function saveNumbersToFiles(numbers: ParsedNumber[], contactPhone: string = '050-444-44-22'): Promise<void> {
  // Group numbers by prefix and type
  const groupedNumbers: { [key: string]: ParsedNumber[] } = {};
  
  numbers.forEach(number => {
    if (!number.isValid) return;
    
    const key = `${number.prefix}-${number.type}`;
    if (!groupedNumbers[key]) {
      groupedNumbers[key] = [];
    }
    groupedNumbers[key].push(number);
  });
  
  // Save each group to appropriate file
  for (const [key, numberGroup] of Object.entries(groupedNumbers)) {
    const [prefix, type] = key.split('-');
    const fileConfig = prefixToFileMap[prefix];
    
    if (!fileConfig) continue;
    
    // Determine folder based on type
    let targetFolder = '';
    if (type === 'premium') {
      targetFolder = 'elan';
    } else if (type === 'gold') {
      targetFolder = 'gold';
    }
    
    const filePath = targetFolder 
      ? path.join(dataDir, targetFolder, fileConfig.file)
      : path.join(dataDir, fileConfig.file);
    
    // Ensure directory exists
    if (targetFolder) {
      await fs.mkdir(path.join(dataDir, targetFolder), { recursive: true });
    }
    
    // Read existing data
    let data: Record<string, ExistingListing[]> = {};
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch {
      // File doesn't exist, create new structure
      data = { [fileConfig.key]: [] };
    }
    
    // Ensure the key exists
    if (!data[fileConfig.key]) {
      data[fileConfig.key] = [];
    }
    
    // Add new numbers
    numberGroup.forEach(number => {
      const newEntry = {
        id: Date.now() + Math.random(), // Unique ID
        phoneNumber: number.phoneNumber,
        price: number.price,
        contactPhone: contactPhone,
        type: number.type,
        isVip: number.type === 'premium',
        description: `${number.type} nömrə`,
        is_sold: false
      };
      
      data[fileConfig.key].push(newEntry);
    });
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const defaultType = formData.get('defaultType') as string;
    const defaultPrice = formData.get('defaultPrice') as string;
    const contactPhone = formData.get('contactPhone') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Validate form data
    const validation = bulkUploadSchema.safeParse({
      defaultType,
      defaultPrice: defaultPrice ? Number(defaultPrice) : undefined,
      contactPhone
    });
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid form data', 
        issues: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse file and extract phone numbers
    const extractedNumbers = await parseFile(buffer, file.name);
    
    if (extractedNumbers.length === 0) {
      return NextResponse.json({ 
        error: 'No phone numbers found in the uploaded file' 
      }, { status: 400 });
    }
    
    // Process and validate phone numbers
    const processedNumbers = processPhoneNumbers(
      extractedNumbers, 
      validation.data.defaultType,
      validation.data.defaultPrice
    );
    
    // Separate valid and invalid numbers
    const validNumbers = processedNumbers.filter(n => n.isValid);
    const invalidNumbers = processedNumbers.filter(n => !n.isValid);
    
    // Check for duplicates
    const { existing: duplicates, new: newNumbers } = await checkForDuplicates(validNumbers);
    
    const result: BulkUploadResult = {
      success: newNumbers,
      errors: invalidNumbers,
      duplicates,
      summary: {
        total: processedNumbers.length,
        valid: newNumbers.length,
        invalid: invalidNumbers.length,
        duplicates: duplicates.length
      }
    };
    
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An error occurred during bulk upload' 
    }, { status: 500 });
  }
}

// Confirm and save the bulk upload
export async function PUT(request: NextRequest) {
  try {
    const { numbers, contactPhone } = await request.json();
    
    if (!Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json({ error: 'No numbers to save' }, { status: 400 });
    }
    
    // Save numbers to appropriate JSON files
    await saveNumbersToFiles(numbers, contactPhone || '050-444-44-22');
    
    return NextResponse.json({ 
      message: `Successfully saved ${numbers.length} phone numbers`,
      count: numbers.length 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Bulk save error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An error occurred while saving numbers' 
    }, { status: 500 });
  }
}
