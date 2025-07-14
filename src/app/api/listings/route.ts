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
