// components/CarCard.js
import Image from 'next/image';

export default function CarCard({ car }) {
  return (
    <div className="car-card">
      <div className="car-img">
        <Image src={car.image} alt={`${car.make} ${car.model}`} width={300} height={200} />
      </div>
      <div className="car-info">
        <h3>{car.make} {car.model}</h3>
        <p>Type: {car.type}</p>
        <p className="car-price">Nu. {car.price}/day</p>
        <a href={`/booking?car=${car.id}`} className="btn">Book Now</a>
      </div>
    </div>
  );
}