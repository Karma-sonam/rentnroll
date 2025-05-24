// app/login/page.js
"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '../../components/LoginForm';
import RegisterForm from '../../components/RegisterForm';

function LoginFormWrapper() {
  const [activeForm, setActiveForm] = useState('login');
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered')) {
      setActiveForm('login');
    }
  }, [searchParams]);

  return (
    <div className={`login-container ${activeForm === 'login' ? '' : 'hidden'}`}>
      <h2>Login</h2>
      <LoginForm toggleForm={() => setActiveForm('register')} />
    </div>
  );
}

function RegisterFormWrapper() {
  const [activeForm, setActiveForm] = useState('login');
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered')) {
      setActiveForm('login');
    }
  }, [searchParams]);

  return (
    <div className={`register-container ${activeForm === 'register' ? '' : 'hidden'}`}>
      <h2>Register</h2>
      <RegisterForm toggleForm={() => setActiveForm('login')} />
    </div>
  );
}

export default function Login() {
  return (
    <div id="login-form">
      <div className="container">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginFormWrapper />
          <RegisterFormWrapper />
        </Suspense>
      </div>
    </div>
  );
}