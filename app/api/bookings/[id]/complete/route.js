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
        { error: 'Only active bookings can be completed' },
        { status: 400 }
      );
    }

    // Update booking status and make car available again
    const [updatedBooking] = await prisma.$transaction([
      prisma.rental.update({
        where: {
          id: params.id
        },
        data: {
          status: 'COMPLETED'
        }
      }),
      prisma.car.update({
        where: {
          id: booking.carId
        },
        data: {
          available: true
        }
      })
    ]);

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error completing booking:', error);
    return NextResponse.json(
      { error: 'Failed to complete booking' },
      { status: 500 }
    );
  }
} 