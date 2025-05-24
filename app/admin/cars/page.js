// app/admin/cars/page.js
'use client';
import { useState, useEffect } from 'react';
import AddCarModal from '@/components/AddCarModal';
import Image from 'next/image';

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carToEdit, setCarToEdit] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/cars');
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data = await response.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      setError('Failed to load cars. Please try again later.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = () => {
    setCarToEdit(null);
    setShowModal(true);
  };

  const handleEditCar = (car) => {
    setCarToEdit(car);
    setShowModal(true);
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete car');
      }

      // Remove the deleted car from the state
      setCars(cars.filter(car => car.id !== carId));
    } catch (error) {
      console.error('Error deleting car:', error);
      setError('Failed to delete car. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCarToEdit(null);
    fetchCars(); // Refresh the car list after adding/editing
  };

  return (
    <div className="admin-content">
      <div className="container">
        <div className="page-header">
          <h1>Manage Cars</h1>
          <button className="btn" onClick={handleAddCar}>Add New Car</button>
        </div>

        <div className="content-section">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="filters">
            <select className="filter-select">
              <option value="">All Categories</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
            </select>
            <select className="filter-select">
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Brand & Model</th>
                <th>Type</th>
                <th>Price/Day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8">Loading...</td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan="8">No cars available</td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.id}</td>
                    <td>
                      <Image 
                        src={car.imageUrl || '/placeholder-car.jpg'} 
                        alt={car.name} 
                        width={50}
                        height={50}
                        className="car-thumbnail"
                        style={{ objectFit: 'cover' }}
                      />
                    </td>
                    <td>{car.name}</td>
                    <td>{`${car.brand} ${car.model}`}</td>
                    <td>{car.type}</td>
                    <td>Nu. {car.price}/day</td>
                    <td>{car.available ? 'Available' : 'Not Available'}</td>
                    <td>
                      <button 
                        className="btn btn-small"
                        onClick={() => handleEditCar(car)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleDeleteCar(car.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <AddCarModal 
          closeModal={closeModal} 
          carToEdit={carToEdit}
        />
      )}
    </div>
  );
}
