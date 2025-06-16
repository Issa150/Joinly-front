import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Option, Typography } from '@material-tailwind/react';
import { Role, UpdateProfileType } from '../../../interface/ProfileTypes';
import { getUserProfileGeneral, updateProfile } from '../../../api/my_profileApi';
import { UserProfileType } from '../../../interface/user';
import { useAuth } from '../../../contexts/AuthContext';

interface ChildComponentAProps {
    isFormUpdate: boolean;
    setIsFormUpdate: (value: boolean) => void;
}

function UpdateGeneralUserInfoForm({ isFormUpdate, setIsFormUpdate }: ChildComponentAProps) {
    const [formData, setFormData] = useState<UpdateProfileType>({
        firstname: '',
        lastname: '',
        role: undefined,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [cancelBtnToggle, setcancelBtnToggle] = useState<string | null>('Annuler');
    const { loginContext } = useAuth();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
        setImageFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('firstname', formData.firstname || '');
            formDataToSend.append('lastname', formData.lastname || '');
            formDataToSend.append('role', formData.role ? formData.role.toString() : '');
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }
            const response = await updateProfile(formDataToSend);

            if(response.status === 200 || response.status === 201) {
                setMessage('Profile updated successfully!');
                loginContext(response.data)
                setcancelBtnToggle('Retour au profil');
            }

        } catch (err: any) {
            setError(err.message || 'An error occurred.');
            console.error('Error updating profile:', err);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileData: UserProfileType = await getUserProfileGeneral();
                setFormData({
                    firstname: profileData.firstname || '',
                    lastname: profileData.lastname || '',
                    role: profileData.role as Role | undefined,
                });
            } catch (err: any) {
                console.error('Error fetching user profile:', err);
                setError(err.message || 'Failed to fetch user profile.');
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Update basic informations</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="First Name"
                    name="firstname"
                    value={formData.firstname || ''}
                    onChange={handleChange}
                />
                <Input
                    label="Last Name"
                    name="lastname"
                    value={formData.lastname || ''}
                    onChange={handleChange}
                />
                <Select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={(value) => setFormData({ ...formData, role: value as Role })}
                >
                    <Option value="" disabled>Sélectionnez votre statut</Option>
                    <Option value="PARTICIPANT">Participant</Option>
                    <Option value="ORGANIZER">Organisateur</Option>
                </Select>
                <Input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                />
                {imagePreview && (
                    <div className="mt-2">
                        <Typography variant="small" className="mb-1">Aperçu de l'image:</Typography>
                        <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="max-h-40 rounded-md shadow-sm"
                        />
                    </div>
                )}
                <div className="space-x-4">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Update Profile</Button>
                    <Button type='reset' onClick={() => setIsFormUpdate(!isFormUpdate)} className="bg-red-500 text-white"> {cancelBtnToggle} </Button>
                </div>
            </form>
            {message && <p className="text-green-500 mt-4">{message}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}

export default UpdateGeneralUserInfoForm;