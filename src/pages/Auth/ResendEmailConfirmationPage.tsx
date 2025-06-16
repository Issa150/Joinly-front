// src/pages/Auth/ResendConfirmationEmailPage.tsx
import { useEffect, useState } from 'react';
import { Input, Typography, Button } from '@material-tailwind/react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { resendVerificationEmail } from '../../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResendConfirmationEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check if the email is passed in the state from the previous page
    useEffect(() => {
    }, []);

    const formik = useFormik({
        initialValues: {
            email: email || '', // Prefill if available
        },
        validationSchema: object({
            email: string()
                .email('Invalid email format')
                .required('Email is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await resendVerificationEmail(values.email);
                setMessage(response.message);
                setError(null); // Clear any previous errors
            } catch (err: any) {
                setError(err.message || 'Failed to resend email. Please try again.');
                setMessage(null); // Clear any previous messages
            }
        },
    });

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <Typography variant="h4" className="text-center mb-4 text-joinly_blue-contraste">
                    Resend Confirmation Email
                </Typography>
                {message && <Typography className="text-green-500 text-center">{message}</Typography>}
                {error && <Typography className="text-red-500 text-center">{error}</Typography>}
                <form onSubmit={formik.handleSubmit} className="mt-4">
                    <Input
                        onChange={formik.handleChange}
                        value={email}
                        name='email'
                        id='email'
                        size="lg"
                        placeholder="example@mail.com"
                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    />
                    {formik.errors.email && formik.touched.email && (
                        <p className="text-red-500">{formik.errors.email as string}</p>
                    )}
                <div className="mt-4 flex justify-between gap-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-800 text-white">
                        Resend Email
                    </Button>
                    <Button onClick={() => navigate('/signin')} className="bg-joinly_blue-principale text-white">
                        Back to Sign In
                    </Button>
                </div>
                </form>
            </div>
        </div>
    );
}