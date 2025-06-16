// src/pages/profile/forms/ChangePasswordForm.tsx
import React, { useState } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { ChangePasswordType } from '../../../interface/ProfileTypes';
import { changePassword } from '../../../api/my_profileApi';

function ChangePasswordForm() {
  const [passwordData, setPasswordData] = useState<ChangePasswordType>({
    oldPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await changePassword(passwordData);
      setMessage(response.message);
      console.log('Password changed:', response);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error('Error changing password:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Changer le mot de passe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Le mot de passe actuel"
          type="password"
          name="oldPassword"
          value={passwordData.oldPassword}
          onChange={handleChange}
        />
        <Input
          label="Nouveau mot de passe"
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
        />
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Change Password
        </Button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default ChangePasswordForm;