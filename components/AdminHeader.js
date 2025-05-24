// components/AdminHeader.js
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

export default function AdminHeader() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="admin-header">
      <div className="container">
        <div id="branding">
          <Link href="/admin">
            <Image src="/logo.png" alt="Rent'n'Roll Logo" className="logo" width={100} height={100} />
          </Link>
        </div>
        <nav>
          <ul>
            <li><Link href="/admin">Dashboard</Link></li>
            <li><Link href="/admin/cars">Manage Cars</Link></li>
            <li><Link href="/admin/bookings">Manage Bookings</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}