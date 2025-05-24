import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth.config';

const prisma = new PrismaClient();

// GET all cars
export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(cars || []);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST new car (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, brand, model, year, price, imageUrl, type, available } = body;

    // Validate required fields
    if (!name || !brand || !model || !year || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      return NextResponse.json(
        { error: 'Invalid year' },
        { status: 400 }
      );
    }

    // Validate price
    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Create the car
    const car = await prisma.car.create({
      data: {
        name,
        brand,
        model,
        year: parseInt(year),
        price: parseFloat(price),
        imageUrl,
        type,
        available: available ?? true,
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create car' },
      { status: 500 }
    );
  }
}
