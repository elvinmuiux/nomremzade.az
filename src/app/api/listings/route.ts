import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import path from 'path';
import { promises as fs } from 'fs';

// Define the structure of a listing
interface Listing {
  id: string;
  prefix: string;
  number: string;
  price: number;
  type: 'standard' | 'gold' | 'premium';
  contact_phone?: string;
  description?: string;
  createdAt?: string;
}

// Zod schema for validating the POST request body
const createListingSchema = z.object({
  prefix: z.string().min(2, 'Prefix must be 2 or 3 digits'),
  number: z.string().min(7, 'Number must be 7 digits'),
  price: z.number().positive('Price must be a positive number'),
  type: z.enum(['standard', 'gold', 'premium']),
  contact_phone: z.string().optional(),
  description: z.string().optional(),
});

const dataDir = path.join(process.cwd(), 'public', 'data');

// Helper function to get directory path based on type
function getTypeDirectory(type: 'standard' | 'gold' | 'premium'): string {
  switch (type) {
    case 'standard':
      return path.join(dataDir, 'standard');
    case 'gold':
      return path.join(dataDir, 'gold');
    case 'premium':
      return path.join(dataDir, 'premium');
    default:
      return path.join(dataDir, 'standard');
  }
}

// Helper function to extract prefix from phone number
function extractPrefixFromPhone(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  if (cleaned.length >= 3) {
    return cleaned.substring(0, 3);
  }
  return '';
}

// Helper function to get file config based on prefix
function getFileConfig(prefix: string): { file: string, key: string } | null {
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
  return prefixToFileMap[prefix] || null;
}

// Helper function to find and remove a listing from all possible locations
async function findAndRemoveListing(id: string): Promise<{ listing: Listing, oldType: string, oldPrefix: string } | null> {
  const types: Array<'standard' | 'gold' | 'premium'> = ['standard', 'gold', 'premium'];
  const prefixes = ['010', '050', '051', '055', '060', '070', '077', '099'];

  for (const type of types) {
    const typeDir = getTypeDirectory(type);
    
    for (const prefix of prefixes) {
      const fileConfig = getFileConfig(prefix);
      if (!fileConfig) continue;
      
      const filePath = path.join(typeDir, fileConfig.file);
      
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        const adsArray = data[fileConfig.key] || [];
        
        const listingIndex = adsArray.findIndex((item: Listing) => {
          return item.id?.toString() === id.toString();
        });
        
        if (listingIndex !== -1) {
          const listing = adsArray[listingIndex];
          // Remove from current location
          adsArray.splice(listingIndex, 1);
          data[fileConfig.key] = adsArray;
          await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          
          return { listing, oldType: type, oldPrefix: prefix };
        }
      } catch {
        // File doesn't exist or can't be read, continue
        continue;
      }
    }
  }
  
  return null;
}

// Get all listings from all JSON files
export async function GET() {
  try {
    const allListings: Listing[] = [];
    
    // Define the types and their corresponding directories
    const typeDirectories = [
      { type: 'standard' as const, dir: path.join(dataDir, 'standard') },
      { type: 'gold' as const, dir: path.join(dataDir, 'gold') },
      { type: 'premium' as const, dir: path.join(dataDir, 'premium') }
    ];

    for (const { type, dir } of typeDirectories) {
      try {
        // Check if directory exists
        await fs.access(dir);
        const files = await fs.readdir(dir);
        console.log(`Reading ${type} directory:`, dir, 'Files:', files);
        
        for (const file of files) {
          if (file.endsWith('.json')) {
            const filePath = path.join(dir, file);
            try {
              const fileContent = await fs.readFile(filePath, 'utf-8');
              const data = JSON.parse(fileContent);
              console.log(`File ${filePath} content:`, data.length, 'items');
              
              // Handle both direct array format and nested object format
              if (Array.isArray(data)) {
                // Direct array format (new format)
                const listings = data.map((item: Record<string, unknown>) => {
                  return {
                    id: String(item.id || `${Date.now()}-${Math.floor(Math.random() * 1000000)}`),
                    prefix: String(item.prefix || ''),
                    number: String(item.number || ''),
                    price: Number(item.price || 0),
                    contact_phone: String(item.contact_phone || ''),
                    type: type, // Use directory type
                    is_sold: Boolean(item.is_sold || false),
                    description: String(item.description || ''),
                    created_at: String(item.created_at || new Date().toISOString())
                  };
                });
                allListings.push(...listings);
                console.log(`Added ${listings.length} listings from ${filePath}`);
              } else {
                // Handle JSON structure with keys like azercellAds, bakcellAds, etc. (old format)
                Object.keys(data).forEach(key => {
                  if (Array.isArray(data[key])) {
                    const listings = data[key].map((item: Record<string, unknown>) => {
                      const phoneNumber = String(item.phoneNumber || '');
                      const fullNumber = phoneNumber.replace(/[^0-9]/g, '');
                      const prefix = extractPrefixFromPhone(phoneNumber);
                    const numberWithoutPrefix = fullNumber.substring(prefix.length);
                    
                    const listing: Listing = {
                      id: item.id?.toString() || `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                      prefix: prefix,
                      number: numberWithoutPrefix,
                      price: Number(item.price) || 0,
                      type: type,
                      contact_phone: String(item.contactPhone || ''),
                      description: String(item.description || ''),
                      createdAt: String(item.createdAt || new Date().toISOString())
                    };
                    return listing;
                  });
                  allListings.push(...listings);
                }
              });
              }
            } catch (e) {
              console.error(`Error parsing JSON from ${filePath}:`, e);
            }
          }
        }
      } catch {
        // Directory doesn't exist, skip
        console.log(`Directory ${dir} doesn't exist, skipping`);
      }
    }

    // Sort by creation date if available, otherwise just return
    allListings.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
    });

    // Return with cache busting headers
    return new NextResponse(JSON.stringify(allListings), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ error: 'An error occurred while fetching listings.' }, { status: 500 });
  }
}

// Create a new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { prefix, number, price, type, contact_phone, description } = validation.data;

    // Create the new listing in the format expected by JSON files
    const newListingForJson = {
      id: Date.now(), // Use timestamp as ID for JSON files
      phoneNumber: `${prefix}-${number}`,
      price: price,
      contactPhone: contact_phone || '050-444-44-22',
      type: type,
      isVip: type === 'premium',
      description: description || `${type} nömrə`
    };

    // Determine which JSON file to update based on prefix
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

    const fileConfig = prefixToFileMap[prefix];
    if (!fileConfig) {
      return NextResponse.json({ error: `Unsupported prefix: ${prefix}` }, { status: 400 });
    }

    // Get the target directory based on type
    const targetDir = getTypeDirectory(type);
    const filePath = path.join(targetDir, fileConfig.file);

    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Read existing data
    let data: Record<string, unknown[]> = {};
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

    // Add the new listing
    data[fileConfig.key].push(newListingForJson);

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Return the listing in the format expected by the frontend
    const responseListingData: Listing = {
      id: `${Date.now()}-${prefix}${number}`,
      prefix,
      number,
      price,
      type,
      contact_phone,
      description,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(responseListingData, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json({ error: 'An error occurred while creating the listing.' }, { status: 500 });
  }
}

// Update a listing with auto-migration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { prefix, number, price, type, contact_phone, description } = validation.data;
    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    // Find and remove the existing listing
    const existingListing = await findAndRemoveListing(id);
    if (!existingListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Get the new file configuration
    const fileConfig = getFileConfig(prefix);
    if (!fileConfig) {
      return NextResponse.json({ error: `Unsupported prefix: ${prefix}` }, { status: 400 });
    }

    // Create the updated listing for JSON storage
    const updatedListingForJson = {
      id: existingListing.listing.id, // Keep the original ID
      phoneNumber: `${prefix}-${number}`,
      price: price,
      contactPhone: contact_phone || existingListing.listing.contact_phone || '050-444-44-22',
      type: type,
      isVip: type === 'premium',
      description: description || existingListing.listing.description || `${type} nömrə`,
      createdAt: existingListing.listing.createdAt || new Date().toISOString()
    };

    // Get the target directory based on new type
    const targetDir = getTypeDirectory(type);
    const filePath = path.join(targetDir, fileConfig.file);

    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Read existing data from target file
    let data: Record<string, unknown[]> = {};
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

    // Add the updated listing to the new location
    data[fileConfig.key].push(updatedListingForJson);

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Return the listing in the format expected by the frontend
    const responseListingData: Listing = {
      id: id,
      prefix,
      number,
      price,
      type,
      contact_phone,
      description,
      createdAt: updatedListingForJson.createdAt
    };

    return NextResponse.json(responseListingData);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json({ error: 'An error occurred while updating the listing.' }, { status: 500 });
  }
}

// Delete a listing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    // Find and remove the listing using the helper function
    const deletedListing = await findAndRemoveListing(id);
    
    if (!deletedListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the listing.' }, { status: 500 });
  }
}
