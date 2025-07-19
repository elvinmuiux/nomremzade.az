import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import path from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';

// Define the structure of a listing
interface Listing {
  id: string;
  prefix: string;
  number: string;
  price: number;
  type: 'standard' | 'gold' | 'premium';
  contact_phone?: string;
  description?: string;
  is_sold?: boolean;
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

// Get all listings from all JSON files
export async function GET() {
  try {
    const allListings: Listing[] = [];
    const dirents = await fs.readdir(dataDir, { withFileTypes: true });

    for (const dirent of dirents) {
      const direntPath = path.join(dataDir, dirent.name);
      if (dirent.isDirectory()) {
        const subFiles = await fs.readdir(direntPath);
        for (const file of subFiles) {
          if (file.endsWith('.json')) {
            const filePath = path.join(direntPath, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            try {
              const listings = JSON.parse(fileContent);
              if (Array.isArray(listings)) {
                allListings.push(...listings);
              }
            } catch (e) {
              console.error(`Error parsing JSON from ${filePath}:`, e);
            }
          }
        }
      }
    }

    // Sort by creation date if available, otherwise just return
    allListings.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
    });

    return NextResponse.json(allListings);
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

    const { prefix, ...rest } = validation.data;

    const newListing: Listing = {
      id: crypto.randomUUID(),
      prefix,
      ...rest,
      is_sold: false,
      createdAt: new Date().toISOString(),
    };

    // Determine the file path based on the listing type or prefix
    const folder = newListing.type === 'gold' ? 'gold' : 'elan';
    const targetDir = path.join(dataDir, folder);
    const filePath = path.join(targetDir, `${prefix}.json`);

    await fs.mkdir(targetDir, { recursive: true });

    let listings: Listing[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      listings = JSON.parse(fileContent);
    } catch {
      // File doesn't exist or is empty, it will be created/overwritten
    }

    listings.push(newListing);
    await fs.writeFile(filePath, JSON.stringify(listings, null, 2));

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json({ error: 'An error occurred while creating the listing.' }, { status: 500 });
  }
}

// Update a listing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    // Find and update the listing in the appropriate JSON file
    const dataFiles = [
      { file: '010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
      { file: '050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
      { file: '051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
      { file: '055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
      { file: '060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' },
      { file: '070.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '070' },
      { file: '077.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '077' },
      { file: '099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' },
      // Gold numbers
      { file: 'gold/010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
      { file: 'gold/050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
      { file: 'gold/051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
      { file: 'gold/055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
      { file: 'gold/06.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' },
      { file: 'gold/070.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '070' },
      { file: 'gold/077.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '077' },
      { file: 'gold/099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' },
      // Premium numbers (elan)
      { file: 'elan/010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
      { file: 'elan/050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
      { file: 'elan/051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
      { file: 'elan/055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
      { file: 'elan/060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' },
      { file: 'elan/070.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '070' },
      { file: 'elan/077.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '077' },
      { file: 'elan/099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' }
    ];

    let found = false;
    let updatedListing = null;

    for (const dataFile of dataFiles) {
      try {
        const filePath = path.join(dataDir, dataFile.file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        const adsArray = data[dataFile.key] || [];
        
        const listingIndex = adsArray.findIndex((item: Record<string, unknown>) => {
          const phoneNumber = String(item.phoneNumber || '');
          return `${id}`.includes(phoneNumber) || phoneNumber.includes(`${id}`.split('-')[1] || '');
        });

        if (listingIndex !== -1) {
          // Update the listing
          const originalListing = adsArray[listingIndex];
          adsArray[listingIndex] = {
            ...originalListing,
            price: updateData.price || originalListing.price,
            description: updateData.description || originalListing.description,
            contactPhone: updateData.contact_phone || originalListing.contactPhone,
            type: updateData.type || originalListing.type,
            isVip: updateData.type === 'premium' || originalListing.isVip,
            is_sold: updateData.is_sold !== undefined ? updateData.is_sold : originalListing.is_sold
          };

          // Write back to file
          data[dataFile.key] = adsArray;
          await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          
          updatedListing = adsArray[listingIndex];
          found = true;
          break;
        }
      } catch (error) {
        console.error(`Error updating in ${dataFile.file}:`, error);
        continue;
      }
    }

    if (!found) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing: updatedListing });
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

    // Find and delete the listing from the appropriate JSON file
    const dataFiles = [
      { file: '010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
      { file: '050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
      { file: '051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
      { file: '055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
      { file: '060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' },
      { file: '070.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '070' },
      { file: '077.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '077' },
      { file: '099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' },
      // Gold numbers
      { file: 'gold/010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
      { file: 'gold/050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
      { file: 'gold/051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
      { file: 'gold/055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
      { file: 'gold/06.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' },
      { file: 'gold/070.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '070' },
      { file: 'gold/077.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '077' },
      { file: 'gold/099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' },
      // Premium numbers (elan)
      { file: 'elan/010.json', key: 'azercellAds', provider: 'Azercell', prefix: '010' },
      { file: 'elan/050.json', key: 'azercellAds', provider: 'Azercell', prefix: '050' },
      { file: 'elan/051.json', key: 'azercellAds', provider: 'Azercell', prefix: '051' },
      { file: 'elan/055.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '055' },
      { file: 'elan/060.json', key: 'naxtelAds', provider: 'Naxtel', prefix: '060' },
      { file: 'elan/070.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '070' },
      { file: 'elan/077.json', key: 'narmobileAds', provider: 'Nar Mobile', prefix: '077' },
      { file: 'elan/099.json', key: 'bakcellAds', provider: 'Bakcell', prefix: '099' }
    ];

    let found = false;

    for (const dataFile of dataFiles) {
      try {
        const filePath = path.join(dataDir, dataFile.file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        const adsArray = data[dataFile.key] || [];
        
        const listingIndex = adsArray.findIndex((item: Record<string, unknown>) => {
          const phoneNumber = String(item.phoneNumber || '');
          return `${id}`.includes(phoneNumber) || phoneNumber.includes(`${id}`.split('-')[1] || '');
        });

        if (listingIndex !== -1) {
          // Remove the listing
          adsArray.splice(listingIndex, 1);

          // Write back to file
          data[dataFile.key] = adsArray;
          await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          
          found = true;
          break;
        }
      } catch (error) {
        console.error(`Error deleting from ${dataFile.file}:`, error);
        continue;
      }
    }

    if (!found) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the listing.' }, { status: 500 });
  }
}
