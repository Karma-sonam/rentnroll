// components/Header.js
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoading = status === 'loading';

  // Debug: Log the pathname to verify the condition
  console.log('Current pathname:', pathname);

  // Suppress Header for admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header>
      <div className="container">
        <div id="branding">
          <Link href="/">
            <Image src="/logo.png" alt="Rent'n'Roll Logo" className="logo" width={100} height={100} />
          </Link>
        </div>
        <nav>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/cars">Cars</Link></li>
            <li><Link href="/booking">Book Now</Link></li>
            {!isLoading && (
              status === 'authenticated' ? (
                <li>
                  <ProfileDropdown />
                </li>
              ) : (
                <li><Link href="/login">Login</Link></li>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}