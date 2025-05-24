// app/login/page.js
"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';

function LoginContent() {
  const [activeForm, setActiveForm] = useState('login');
  const searchParams = useSearchParams();

  // Show login form if redirected from registration
  useEffect(() => {
    if (searchParams.get('registered')) {
      setActiveForm('login');
    }
  }, [searchParams]);

  return (
    <div id="login-form">
      <div className="container">
        <div className={`login-container ${activeForm === 'login' ? '' : 'hidden'}`}>
          <h2>Login</h2>
          <LoginForm toggleForm={() => setActiveForm('register')} />
        </div>
        <div className={`register-container ${activeForm === 'register' ? '' : 'hidden'}`}>
          <h2>Register</h2>
          <RegisterForm toggleForm={() => setActiveForm('login')} />
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}