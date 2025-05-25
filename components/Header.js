// components/Header.js
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfileDropdown from './ProfileDropdown';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoading = status === 'loading';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debug: Log the pathname to verify the condition
  console.log('Current pathname:', pathname);

  // Suppress Header for admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="container">
        <div id="branding">
          <Link href="/">
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
            <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link href="/cars" onClick={() => setIsMenuOpen(false)}>Cars</Link></li>
            <li><Link href="/booking" onClick={() => setIsMenuOpen(false)}>Book Now</Link></li>
            {!isLoading && (
              status === 'authenticated' ? (
                <li>
                  <ProfileDropdown />
                </li>
              ) : (
                <li><Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}