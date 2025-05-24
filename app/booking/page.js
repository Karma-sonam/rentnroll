// app/booking/page.js
import BookingForm from '../../components/BookingForm';

export default function Booking() {
  return (
    <div id="booking-form">
      <div className="container">
        <h2>Book Your Car</h2>
        <BookingForm />
      </div>
    </div>
  );
}