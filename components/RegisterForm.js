// components/RegisterForm.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm({ toggleForm }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // Validate passwords match
    if (formData.password !== e.target['confirm-password'].value) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful, redirect to login
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="name">Full Name:</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required 
          minLength="6" 
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input 
          type="password" 
          id="confirm-password" 
          name="confirm-password" 
          required 
          minLength="6" 
        />
      </div>
      <button 
        type="submit" 
        className="btn" 
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className="login-links">
        <a href="#" onClick={(e) => {
          e.preventDefault();
          toggleForm();
        }}>
          Already have an account? Login
        </a>
      </div>
    </form>
  );
}