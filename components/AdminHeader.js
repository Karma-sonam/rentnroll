// components/AdminHeader.js
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="admin-header">
      <div className="container">
        <div id="branding">
          <Link href="/admin">
            <Image src="/logo.png" alt="Rent'n'Roll Logo" className="logo" width={100} height={100} />
          </Link>
        </div>
        <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
        <nav className={`${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link href="/admin" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
            <li><Link href="/admin/cars" onClick={() => setIsMenuOpen(false)}>Manage Cars</Link></li>
            <li><Link href="/admin/bookings" onClick={() => setIsMenuOpen(false)}>Manage Bookings</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}