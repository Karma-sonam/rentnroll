// components/Footer.js
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Suppress Footer for admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer>
      <div className="container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Rent&apos;n&apos;Roll provides quality car rental services across Bhutan since 2025. We offer the best vehicles at competitive prices.</p>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@rentnroll.com</p>
          <p>Phone: +975 777777</p>
          <p>Address: CST, Phuentsholing</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/cars">Cars</Link></li>
            <li><Link href="/booking">Book Now</Link></li>
          </ul>
        </div>
        <div className="copyright">
          <p>© 2025 Rent n Roll. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}