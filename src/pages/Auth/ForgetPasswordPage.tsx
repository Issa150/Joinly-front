// src/pages/ForgetPasswordPage.tsx
import React, { useState } from 'react';
import { forgotPassword } from '../../api/auth';
import { Button, Input } from '@material-tailwind/react';

function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forget Password</h2>
        <p className="text-gray-600 mb-4 text-center">Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Send Reset Link
          </Button>
        </form>
        {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default ForgetPasswordPage;