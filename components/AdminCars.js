// components/AdminCars.js
import AddCarModal from './AddCarModal';

export default function AdminCars() {
  return (
    <section id="manage-cars">
      <h2>Manage Cars</h2>
      <button className="btn">Add New Car</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Make & Model</th>
            <th>Type</th>
            <th>Price/Day</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan="7">No cars available</td></tr>
        </tbody>
      </table>
      <AddCarModal />
    </section>
  );
}