"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
      } catch (error) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess('Registration successful!');
        setEmail('');
        setPassword('');
        setTimeout(() => router.push('/login'), 2000); // Redirect to login after 2 seconds
      } else {
        setError(result.error || 'Failed to register');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Registration</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-lg font-semibold text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-semibold text-gray-700" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}
