// src/pages/ResetPasswordPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import { Button, Input } from '@material-tailwind/react';



function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setrepeatNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Invalid reset link.');
      return;
    }

    try {
      console.log("⭐⭐⭐", {newPassword,repeatNewPassword});
      const response = await resetPassword(token, newPassword, repeatNewPassword);
      
      setResetSuccess(true);
      setMessage(response.message);
      // navigate('/signin')
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setResetSuccess(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
        <p className="text-gray-600 mb-4 text-center">Enter your old and new password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full"
          />
          <Input
            type="password"
            label="Repeat new Password"
            value={repeatNewPassword}
            onChange={(e) => setrepeatNewPassword(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Reset Password
          </Button>
          {resetSuccess && ( // Conditionally render the button
            <Button onClick={() => navigate('/signin')} className="bg-joinly_blue-principale text-white mt-4 w-full">
              Back to Sign In
            </Button>
          )}

        </form>
        {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPasswordPage;