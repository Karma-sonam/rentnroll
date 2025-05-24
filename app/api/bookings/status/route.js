import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Function to automatically update booking statuses
async function updateBookingStatuses() {
  const now = new Date();

  // Update PENDING bookings to ACTIVE if start date has passed
  await prisma.rental.updateMany({
    where: {
      status: 'PENDING',
      startDate: {
        lte: now
      }
    },
    data: {
      status: 'ACTIVE'
    }
  });

  // Update ACTIVE bookings to COMPLETED if end date has passed
  await prisma.rental.updateMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        lte: now
      }
    },
    data: {
      status: 'COMPLETED'
    }
  });

  // Make cars available for completed bookings
  const completedBookings = await prisma.rental.findMany({
    where: {
      status: 'COMPLETED',
      car: {
        available: false
      }
    },
    select: {
      carId: true
    }
  });

  if (completedBookings.length > 0) {
    await prisma.car.updateMany({
      where: {
        id: {
          in: completedBookings.map(booking => booking.carId)
        }
      },
      data: {
        available: true
      }
    });
  }
}

// GET endpoint to fetch all bookings with automatic status updates
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update statuses before fetching
    await updateBookingStatuses();

    // Fetch all bookings with updated statuses
    const bookings = await prisma.rental.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        car: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error updating and fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
} 