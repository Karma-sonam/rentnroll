// components/AdminBookings.js
export default function AdminBookings() {
  return (
    <section id="manage-bookings">
      <h2>Manage Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Car</th>
            <th>Pickup Date</th>
            <th>Return Date</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan="8">No bookings available</td></tr>
        </tbody>
      </table>
    </section>
  );
}