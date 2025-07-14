import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Bütün elanları gətirən funksiya
export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching listings.' },
      { status: 500 }
    );
  }
}

// Yeni elan yaradan funksiya
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newListing = await prisma.listing.create({
      data: {
        prefix: data.prefix,
        number: data.number,
        price: parseFloat(data.price),
        type: data.type, // 'elan', 'gold', 'premium'
        contact_phone: data.contact_phone,
        description: data.description,
      },
    });
    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the listing.' },
      { status: 500 }
    );
  }
}
