// app/admin/bookings/page.js
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ManageBookings() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/status');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchBookings();
      // Set up automatic refresh every minute
      const interval = setInterval(fetchBookings, 60000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      // Refresh bookings after manual status change
      fetchBookings();
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = !filterStatus || booking.status === filterStatus;
    const matchesDate = !filterDate || 
      new Date(booking.startDate).toISOString().split('T')[0] === filterDate;
    return matchesStatus && matchesDate;
  });

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="admin-content">
      <div className="container">
        <div className="page-header">
          <h1>Manage Bookings</h1>
        </div>

        <div className="content-section">
          <div className="filters">
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <input 
              type="date" 
              className="filter-date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8">No bookings available</td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>
                      {booking.user.name}<br />
                      <small>{booking.user.email}</small>
                    </td>
                    <td>
                      {booking.car.brand} {booking.car.model}<br />
                      <small>{booking.car.year}</small>
                    </td>
                    <td>{new Date(booking.startDate).toLocaleString()}</td>
                    <td>{new Date(booking.endDate).toLocaleString()}</td>
                    <td>${booking.totalPrice}</td>
                    <td>
                      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => {/* Add view details handler */}}
                        >
                          View
                        </button>
                        {booking.status === 'PENDING' && (
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleStatusChange(booking.id, 'ACTIVE')}
                          >
                            Activate
                          </button>
                        )}
                        {booking.status === 'ACTIVE' && (
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}