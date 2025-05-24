'use client';
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleAdminPanel = () => {
    router.push('/admin');
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="profile-icon">
          {session?.user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            <p className="user-name">{session?.user?.name}</p>
            <p className="user-email">{session?.user?.email}</p>
            <p className="user-role">{session?.user?.role || 'User'}</p>
          </div>
          <div className="dropdown-divider"></div>
          {session?.user?.role === 'ADMIN' && (
            <button onClick={handleAdminPanel} className="dropdown-item">
              Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="dropdown-item">
            Logout
          </button>
        </div>
      )}
    </div>
  );
} 