import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/auth.config';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const count = await prisma.rental.count({
      where: {
        status: 'ACTIVE'
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting active rentals count:', error);
    return NextResponse.json(
      { error: 'Failed to get active rentals count' },
      { status: 500 }
    );
  }
} 