import React, { useState } from 'react';

export default function BookingModal({ booking, onClose, onBookingUpdate }) {
  const [isCancelling, setIsCancelling] = useState(false);

  if (!booking) return null;

  const handleCancelBooking = async () => {
    if (isCancelling) return;
    
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      // Call the onBookingUpdate callback to refresh the bookings list
      if (onBookingUpdate) {
        await onBookingUpdate();
      }
      
      onClose();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Booking Details</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="booking-details">
          <div className="detail-group">
            <h3>Car Information</h3>
            <p><strong>Car:</strong> {booking.car.brand} {booking.car.model}</p>
            <p><strong>Year:</strong> {booking.car.year}</p>
            <p><strong>Price per day:</strong> ${booking.car.price}</p>
          </div>

          <div className="detail-group">
            <h3>Rental Period</h3>
            <p><strong>Pickup:</strong> {new Date(booking.startDate).toLocaleString()}</p>
            <p><strong>Return:</strong> {new Date(booking.endDate).toLocaleString()}</p>
          </div>

          <div className="detail-group">
            <h3>Booking Information</h3>
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </p>
            <p><strong>Created:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
          </div>

          <div className="booking-actions">
            {booking.status === 'ACTIVE' && (
              <button 
                className="btn extend-btn"
                onClick={() => {
                  // Handle extend booking
                  onClose();
                }}
              >
                Extend Booking
              </button>
            )}
            {booking.status === 'PENDING' && (
              <button 
                className="btn cancel-btn"
                onClick={handleCancelBooking}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}
            {booking.status === 'ACTIVE' && (
              <button 
                className="btn complete-btn"
                onClick={() => {
                  // Handle complete booking
                  onClose();
                }}
              >
                Complete Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 