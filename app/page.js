// app/page.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const cars = await response.json();
      setFeaturedCars(cars.slice(0, 3)); // Show first 3 cars as featured
    } catch (err) {
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section id="showcase">
        <div className="container">
          <h1>Welcome to Rent-N-Roll</h1>
          <p>Your trusted partner for car rentals in Bhutan</p>
        </div>
      </section>

      <section id="featured-cars">
        <div className="container">
          <h2>Featured Cars</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="car-grid">
            {featuredCars.map((car) => (
              <div key={car.id} className="car-card">
                <div className="car-img">
                  <Image 
                    src={car.imageUrl || '/cars/default-car.jpg'} 
                    alt={car.name}
                    width={400}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="car-info">
                  <h3>{car.name}</h3>
                  <p>{car.brand} {car.model} ({car.year})</p>
                  <p className="car-price">Nu. {car.price} per day</p>
                  <Link href={`/booking?car=${car.id}`} className="btn">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all-container">
            <Link href="/cars" className="btn btn-secondary">
              View All Cars
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}