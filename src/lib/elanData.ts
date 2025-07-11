// Utility functions for managing elan (ad) data
export interface ElanNumber {
  id: number;
  phoneNumber: string;
  price: number;
  contactPhone: string;
  type: 'premium' | 'gold' | 'standard';
  isVip: boolean;
  description: string;
  provider: string;
  prefix: string;
  status: 'active' | 'inactive';
  dateAdded: string;
  category: 'premium' | 'gold' | 'standard';
}

export interface ElanData {
  premium: ElanNumber[];
  gold: ElanNumber[];
  standard: ElanNumber[];
}

// Get prefix from phone number
export function getPrefix(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned.substring(0, 3);
}

// Load elan data for a specific prefix
export async function loadElanData(prefix: string): Promise<ElanData> {
  try {
    const response = await fetch(`/data/elan/${prefix}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load data for prefix ${prefix}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading elan data for prefix ${prefix}:`, error);
    return { premium: [], gold: [], standard: [] };
  }
}

// Load all elan data (all prefixes)
export async function loadAllElanData(): Promise<ElanData> {
  const prefixes = ['050', '051', '055', '061', '099', '070', '077', '060', '010'];
  const allData: ElanData = { premium: [], gold: [], standard: [] };

  for (const prefix of prefixes) {
    try {
      const data = await loadElanData(prefix);
      allData.premium.push(...data.premium);
      allData.gold.push(...data.gold);
      allData.standard.push(...data.standard);
    } catch (error) {
      console.error(`Error loading data for prefix ${prefix}:`, error);
    }
  }

  return allData;
}

// Add a new number to the appropriate JSON file
export async function addNewNumber(numberData: Omit<ElanNumber, 'id' | 'dateAdded'>): Promise<boolean> {
  try {
    const prefix = getPrefix(numberData.phoneNumber);
    
    // Load existing data
    const existingData = await loadElanData(prefix);
    
    // Generate new ID
    const allNumbers = [...existingData.premium, ...existingData.gold, ...existingData.standard];
    const maxId = allNumbers.length > 0 ? Math.max(...allNumbers.map(n => n.id)) : 0;
    
    // Create new number entry
    const newNumber: ElanNumber = {
      ...numberData,
      id: maxId + 1,
      dateAdded: new Date().toISOString(),
      prefix,
      provider: prefix
    };
    
    // Add to appropriate category
    switch (numberData.type) {
      case 'premium':
        existingData.premium.push(newNumber);
        break;
      case 'gold':
        existingData.gold.push(newNumber);
        break;
      case 'standard':
        existingData.standard.push(newNumber);
        break;
    }
    
    // In a real application, you would save this back to the server
    // For now, we'll just log it since we can't write to JSON files from client-side
    console.log(`New ${numberData.type} number added:`, newNumber);
    console.log(`Updated data for prefix ${prefix}:`, existingData);
    
    return true;
  } catch (error) {
    console.error('Error adding new number:', error);
    return false;
  }
}

// Filter numbers by operator
export function filterByOperator(data: ElanData, operator: string): ElanData {
  if (operator === 'all') return data;
  
  const operatorPrefixes: { [key: string]: string[] } = {
    'azercell': ['050', '051', '055', '099'],
    'bakcell': ['050', '055', '099'],
    'nar-mobile': ['070', '077'],
    'naxtel': ['060', '010']
  };
  
  const prefixes = operatorPrefixes[operator] || [];
  
  return {
    premium: data.premium.filter(num => prefixes.includes(num.prefix)),
    gold: data.gold.filter(num => prefixes.includes(num.prefix)),
    standard: data.standard.filter(num => prefixes.includes(num.prefix))
  };
}

// Filter numbers by prefix
export function filterByPrefix(data: ElanData, prefix: string): ElanData {
  if (prefix === 'all') return data;
  
  return {
    premium: data.premium.filter(num => num.prefix === prefix),
    gold: data.gold.filter(num => num.prefix === prefix),
    standard: data.standard.filter(num => num.prefix === prefix)
  };
}

// Search numbers by query
export function searchNumbers(data: ElanData, query: string): ElanData {
  if (!query.trim()) return data;
  
  const searchQuery = query.toLowerCase().replace(/\D/g, '');
  
  return {
    premium: data.premium.filter(num => 
      num.phoneNumber.replace(/\D/g, '').includes(searchQuery) ||
      num.description.toLowerCase().includes(query.toLowerCase())
    ),
    gold: data.gold.filter(num => 
      num.phoneNumber.replace(/\D/g, '').includes(searchQuery) ||
      num.description.toLowerCase().includes(query.toLowerCase())
    ),
    standard: data.standard.filter(num => 
      num.phoneNumber.replace(/\D/g, '').includes(searchQuery) ||
      num.description.toLowerCase().includes(query.toLowerCase())
    )
  };
}

// Get statistics
export function getStatistics(data: ElanData) {
  return {
    totalNumbers: data.premium.length + data.gold.length + data.standard.length,
    premiumCount: data.premium.length,
    goldCount: data.gold.length,
    standardCount: data.standard.length,
    totalValue: [
      ...data.premium,
      ...data.gold,
      ...data.standard
    ].reduce((sum, num) => sum + num.price, 0)
  };
}
