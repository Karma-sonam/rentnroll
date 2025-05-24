import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth.config';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const booking = await prisma.rental.findUnique({
      where: {
        id: params.id
      },
      include: {
        car: true
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (booking.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Only active bookings can be extended' },
        { status: 400 }
      );
    }

    // Extend booking by 24 hours
    const newEndDate = new Date(booking.endDate);
    newEndDate.setHours(newEndDate.getHours() + 24);

    const updatedBooking = await prisma.rental.update({
      where: {
        id: params.id
      },
      data: {
        endDate: newEndDate,
        totalPrice: booking.totalPrice + booking.car.price // Add one day's price
      },
      include: {
        car: true
      }
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error extending booking:', error);
    return NextResponse.json(
      { error: 'Failed to extend booking' },
      { status: 500 }
    );
  }
} 