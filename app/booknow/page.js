'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function BookNow() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    carId: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      router.push('/profile');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="booknow-page" style={{ paddingTop: '100px' }}>
      <div className="container">
        <h1>Book a Car</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="carId">Select Car</label>
            <select
              id="carId"
              value={formData.carId}
              onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
              required
            >
              <option value="">Select a car</option>
              {/* Add car options here */}
            </select>
          </div>
          <button type="submit" className="btn">Book Now</button>
        </form>
      </div>
    </div>
  );
} 