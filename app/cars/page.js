// app/cars/page.js
import CarCard from '../../components/CarCard';
import prisma from '../../lib/prisma';

async function getCars() {
  try {
    const cars = await prisma.car.findMany({
      where: {
        available: true
      }
    });
    return cars;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export default async function Cars() {
  const cars = await getCars();

  return (
    <div>
      <section id="car-listings">
        <div className="container">
          <h2>Available Cars</h2>
          <div className="filter-options">
            <select>
              <option>All Types</option>
              <option>sedan</option>
              <option>suv</option>
              <option>luxury</option>
              <option>pickup</option>
              <option>hatchback</option>
            </select>
            <select>
              <option>All Prices</option>
              <option>0 - 2,000 Nu/day</option>
              <option>2,000 - 4,000 Nu/day</option>
              <option>4,000+ Nu/day</option>
            </select>
          </div>
          <div className="car-grid">
            {cars.map(car => (
              <CarCard 
                key={car.id} 
                car={{
                  id: car.id,
                  make: car.brand,
                  model: car.model,
                  type: car.type,
                  price: car.price,
                  image: car.imageUrl || '/cars/default-car.jpg'
                }} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}