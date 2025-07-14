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
  is_sold?: boolean;
}

// Zod schema for validating the PUT request body
const updateListingSchema = z.object({
  prefix: z.string().min(1).optional(),
  number: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  type: z.enum(['standard', 'gold', 'premium']).optional(),
  contact_phone: z.string().optional(),
  description: z.string().optional(),
  is_sold: z.boolean().optional(),
}).partial(); // Allow partial updates

const dataDir = path.join(process.cwd(), 'public', 'data');

interface FindResult {
  filePath: string;
  listings: Listing[];
  listing: Listing;
  index: number;
}

// Helper function to find a listing by ID
async function findListing(id: string): Promise<FindResult | null> {
  try {
    const searchInDirectory = async (dirPath: string): Promise<FindResult | null> => {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
          const result = await searchInDirectory(filePath);
          if (result) return result;
        } else if (path.extname(file) === '.json') {
          const content = await fs.readFile(filePath, 'utf-8');
          const listings: Listing[] = JSON.parse(content);
          const index = listings.findIndex((l) => String(l.id) === id);
          if (index !== -1) {
            return {
              filePath,
              listings,
              listing: listings[index],
              index,
            };
          }
        }
      }
      return null;
    };

    return await searchInDirectory(dataDir);
  } catch (error) {
    console.error(`Error finding listing ${id}:`, error);
    throw new Error('Failed to search for listing.');
  }
}

// Get a single listing by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const result = await findListing(id);
    if (!result) {
      return NextResponse.json({ error: `Listing with ID ${id} not found.` }, { status: 404 });
    }
    return NextResponse.json(result.listing);
  } catch (error) {
     console.error(`Error fetching listing ${id}:`, error);
     return NextResponse.json({ error: 'An error occurred while fetching the listing.' }, { status: 500 });
  }
}

// Update a listing by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const result = await findListing(id);
    if (!result) {
      return NextResponse.json({ error: `Listing with ID ${id} not found.` }, { status: 404 });
    }

    const body = await request.json();
    const validation = updateListingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', issues: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const updatedListing = { ...result.listing, ...validation.data };
    result.listings[result.index] = updatedListing;

    await fs.writeFile(result.filePath, JSON.stringify(result.listings, null, 2));

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error(`Error updating listing ${id}:`, error);
    return NextResponse.json({ error: 'An error occurred while updating the listing.' }, { status: 500 });
  }
}

// Delete a listing by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const result = await findListing(id);
    if (!result) {
      return NextResponse.json({ error: `Listing with ID ${id} not found.` }, { status: 404 });
    }

    result.listings.splice(result.index, 1);
    await fs.writeFile(result.filePath, JSON.stringify(result.listings, null, 2));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting listing ${id}:`, error);
    return NextResponse.json({ error: 'An error occurred while deleting the listing.' }, { status: 500 });
  }
}
