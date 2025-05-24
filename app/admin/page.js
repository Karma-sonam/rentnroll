// app/admin/page.js
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userCount, setUserCount] = useState(0);
  const [carCount, setCarCount] = useState(0);
  const [activeRentalsCount, setActiveRentalsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for session to be loaded
    if (status === 'loading') return;

    // Check authentication and role
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated' || session?.user?.role !== 'ADMIN') return;
      
      try {
        const [usersResponse, carsResponse, activeRentalsResponse] = await Promise.all([
          fetch('/api/users/count'),
          fetch('/api/cars/count'),
          fetch('/api/bookings/active/count')
        ]);

        const usersData = await usersResponse.json();
        const carsData = await carsResponse.json();
        const activeRentalsData = await activeRentalsResponse.json();

        if (usersData.count !== undefined) {
          setUserCount(usersData.count);
        }
        if (carsData.count !== undefined) {
          setCarCount(carsData.count);
        }
        if (activeRentalsData.count !== undefined) {
          setActiveRentalsCount(activeRentalsData.count);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session]);

  // Show loading state while checking authentication
  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  // Don't render anything if not authenticated or not admin
  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
    return null;
  }

  return (
    <div className="admin-content">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{userCount}</p>
          </div>
          <div className="stat-card">
            <h3>Total Cars</h3>
            <p>{carCount}</p>
          </div>
          <div className="stat-card">
            <h3>Active Rentals</h3>
            <p>{activeRentalsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}