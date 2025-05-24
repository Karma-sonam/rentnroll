// components/AdminDashboard.js
export default function AdminDashboard() {
  return (
    <section id="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Cars</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Registered Users</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>Nu. 0</p>
        </div>
      </div>
      <h3>Recent Bookings</h3>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Customer</th>
            <th>Car</th>
            <th>Dates</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan="5">No recent bookings</td></tr>
        </tbody>
      </table>
    </section>
  );
}