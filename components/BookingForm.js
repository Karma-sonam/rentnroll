// components/BookingForm.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BookingModal from './BookingModal';

export default function BookingForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cars, setCars] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    carId: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    location: ''
  });
  const [showBookings, setShowBookings] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Fetch available cars and user's bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsResponse, bookingsResponse] = await Promise.all([
          fetch('/api/cars'),
          fetch('/api/bookings/user')
        ]);
        
        const carsData = await carsResponse.json();
        const bookingsData = await bookingsResponse.json();
        
        setCars(carsData.filter(car => car.available));
        setUserBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const calculateTotalPrice = () => {
    if (!formData.carId || !formData.pickupDate || !formData.returnDate) return 0;

    const selectedCar = cars.find(car => car.id === formData.carId);
    if (!selectedCar) return 0;

    const startDate = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const endDate = new Date(`${formData.returnDate}T${formData.returnTime}`);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    return (selectedCar.price * days).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const startDate = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
      const endDate = new Date(`${formData.returnDate}T${formData.returnTime}`);

      // Validate dates
      if (startDate >= endDate) {
        throw new Error('Return date must be after pickup date');
      }

      const bookingData = {
        carId: formData.carId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: calculateTotalPrice()
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setShowSuccess(true);
      // Refresh bookings list
      const bookingsResponse = await fetch('/api/bookings/user');
      const bookingsData = await bookingsResponse.json();
      setUserBookings(bookingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExtendBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/extend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to extend booking');
      }

      // Refresh bookings list
      const bookingsResponse = await fetch('/api/bookings/user');
      const bookingsData = await bookingsResponse.json();
      setUserBookings(bookingsData);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Refresh bookings list
      const bookingsResponse = await fetch('/api/bookings/user');
      const bookingsData = await bookingsResponse.json();
      setUserBookings(bookingsData);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete booking');
      }

      // Refresh bookings list
      const bookingsResponse = await fetch('/api/bookings/user');
      const bookingsData = await bookingsResponse.json();
      setUserBookings(bookingsData);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const canCancelBooking = (booking) => {
    const bookingTime = new Date(booking.createdAt);
    const now = new Date();
    const hoursDiff = (now - bookingTime) / (1000 * 60 * 60);
    return hoursDiff <= 1 && booking.status === 'PENDING';
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="booking-header">
        <h3>Make a New Booking</h3>
        <button 
          onClick={() => setShowBookings(!showBookings)}
          className="btn view-btn"
        >
          {showBookings ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {showBookings && (
        <div className="user-bookings">
          {userBookings.length === 0 ? (
            <p>No bookings found</p>
          ) : (
            <div className="bookings-list">
              {userBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <h4>{booking.car.brand} {booking.car.model}</h4>
                    <p>Pickup: {new Date(booking.startDate).toLocaleString()}</p>
                    <p>Return: {new Date(booking.endDate).toLocaleString()}</p>
                    <p>Total: Nu. {booking.totalPrice}</p>
                    <p>Status: <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span></p>
                  </div>
                  <div className="booking-actions">
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      className="btn view-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!showSuccess ? (
        <form id="booking-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="carId">Select Car:</label>
            <select 
              id="carId" 
              value={formData.carId} 
              onChange={handleChange} 
              required
            >
              <option value="">-- Select a Car --</option>
              {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} ({car.year}) - Nu. {car.price}/day
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pickupDate">Pickup Date:</label>
            <input 
              type="date" 
              id="pickupDate" 
              value={formData.pickupDate} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="pickupTime">Pickup Time:</label>
            <input 
              type="time" 
              id="pickupTime" 
              value={formData.pickupTime} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="returnDate">Return Date:</label>
            <input 
              type="date" 
              id="returnDate" 
              value={formData.returnDate} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="returnTime">Return Time:</label>
            <input 
              type="time" 
              id="returnTime" 
              value={formData.returnTime} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Pickup Location:</label>
            <select 
              id="location" 
              value={formData.location} 
              onChange={handleChange} 
              required
            >
              <option value="">-- Select Location --</option>
              <option value="Thimphu">Thimphu</option>
              <option value="Paro">Paro</option>
              <option value="Phuentsholing">Phuentsholing</option>
              <option value="Punakha">Punakha</option>
              <option value="Wangdue Phodrang">Wangdue Phodrang</option>
            </select>
          </div>
          {formData.carId && formData.pickupDate && formData.returnDate && (
            <div className="total-price">
              Total Price: Nu. {calculateTotalPrice()}
            </div>
          )}
          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Complete Booking'}
          </button>
        </form>
      ) : (
        <div id="booking-success">
          <h3>Booking Confirmed!</h3>
          <p>Your booking has been successfully created.</p>
          <p>We will contact you shortly with more details.</p>
          <button 
            className="btn" 
            onClick={() => {
              setShowSuccess(false);
              setFormData({
                carId: '',
                pickupDate: '',
                pickupTime: '',
                returnDate: '',
                returnTime: '',
                location: ''
              });
            }}
          >
            Make Another Booking
          </button>
        </div>
      )}

      {selectedBooking && (
        <BookingModal 
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onBookingUpdate={async () => {
            try {
              const bookingsResponse = await fetch('/api/bookings/user');
              const bookingsData = await bookingsResponse.json();
              setUserBookings(bookingsData);
            } catch (error) {
              console.error('Error refreshing bookings:', error);
            }
          }}
        />
      )}
    </div>
  );
}
