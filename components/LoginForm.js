// components/LoginForm.js
"use client";
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm({ toggleForm }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered) {
      setJustRegistered(true);
    }
  }, [searchParams]);

  // Redirect if already logged in
  if (status === 'authenticated') {
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: e.target.email.value,
        password: e.target.password.value,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Wait for the session to be updated
        const checkSession = async () => {
          const response = await fetch('/api/auth/session');
          const sessionData = await response.json();
          
          if (sessionData?.user?.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/');
          }
          router.refresh();
        };

        // Add a small delay to ensure session is updated
        setTimeout(checkSession, 1000);
      }
    } catch (err) {
      setError('An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {justRegistered && (
        <div className="success-message">
          Registration successful! Please login.
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required 
        />
      </div>
      <button 
        type="submit" 
        className="btn" 
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="login-links">
        <a href="#" onClick={(e) => {
          e.preventDefault();
          toggleForm();
        }}>
          <p>Don&apos;t have an account?</p>
        </a>
      </div>
    </form>
  );
}