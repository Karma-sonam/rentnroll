import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/auth.config';

const prisma = new PrismaClient();

// PATCH update booking status
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const booking = await prisma.rental.update({
      where: {
        id: params.id
      },
      data: {
        status
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        car: true
      }
    });

    // If booking is completed or cancelled, make the car available again
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      await prisma.car.update({
        where: {
          id: booking.carId
        },
        data: {
          available: true
        }
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
} 