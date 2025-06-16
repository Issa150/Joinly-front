// src/pages/profile/forms/ChangeEmailForm.tsx
import React, { useState } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { ChangeEmailType } from '../../../interface/ProfileTypes';
import { changeEmail } from '../../../api/my_profileApi';

function ChangeEmailForm() {
  const [emailData, setEmailData] = useState<ChangeEmailType>({
    newEmail: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await changeEmail(emailData);
      setMessage(response.message);
      console.log('Email changed:', response);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error('Error changing email:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Changer le mail</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nouvel e-mail"
          type="email"
          name="newEmail"
          value={emailData.newEmail}
          onChange={handleChange}
        />
        <Input
          label="Mot de passe"
          type="password"
          name="password"
          value={emailData.password}
          onChange={handleChange}
        />
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Change Email
        </Button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default ChangeEmailForm;