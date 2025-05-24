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

    // Check if booking is within 1 hour of creation
    const bookingTime = new Date(booking.createdAt);
    const now = new Date();
    const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);

    if (hoursDiff > 1 || booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Bookings can only be cancelled within 1 hour of creation and must be in PENDING status' },
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
          status: 'CANCELLED'
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
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
} 