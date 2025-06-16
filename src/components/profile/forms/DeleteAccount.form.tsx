// src/pages/profile/forms/DeleteAccountForm.tsx
import  { useState } from 'react';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { deleteProfile } from '../../../api/my_profileApi';

function DeleteAccountForm() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleOpen = () => setOpen(!open);

  const handleDelete = async () => {
    try {
      await deleteProfile();
      setMessage('Account deleted successfully.');
      setInterval(() =>{
          logout();
          navigate('/signin');
      },3000)
      
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error('Error deleting account:', err);
    }
    setOpen(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Delete Account</h2>
      <Button color="red" onClick={handleOpen}>
        Delete Account
      </Button>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Confirm Account Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete your account? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={handleOpen} className="mr-1">
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </Dialog>

      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default DeleteAccountForm;