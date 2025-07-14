import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Elanı ID-yə görə yeniləyən funksiya
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
    const data = await request.json();
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        prefix: data.prefix,
        number: data.number,
        price: parseFloat(data.price),
        type: data.type,
        contact_phone: data.contact_phone,
        description: data.description,
        is_sold: data.is_sold,
      },
    });
    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error(`Error updating listing ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while updating the listing.' },
      { status: 500 }
    );
  }
}

// Elanı ID-yə görə silən funksiya
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
    await prisma.listing.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting listing ${context.params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the listing.' },
      { status: 500 }
    );
  }
}
