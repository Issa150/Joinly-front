// src/pages/ActivateAccountPage.tsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Typography } from '@material-tailwind/react';
import { activateAccount } from '../../api/auth';

function ActivateAccountPage() {
    const { token } = useParams();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const activate = async () => {
            if (token) {
                try {
                    const data = await activateAccount(token);
                    setMessage(data.message);
                    setLoading(false);
                } catch (err: any) {
                    setLoading(false);
                    
                    if (err.response && err.response.data) {
                        const errorData = err.response.data;
                        setError(errorData.message);
                        if (errorData.error === 'TOKEN_EXPIRED') {
                            setEmail(errorData.email);
                        }
                    } else {
                        setError("An error occurred while activating your account. Please try again later.");
                    }
                }
            } else {
                setError('Invalid activation token.');
                setLoading(false);
            }
        };

        activate();
    }, [token]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <Typography variant="h4" className="text-center mb-4 text-joinly_blue-contraste">
                    Activate Your Account
                </Typography>
                {loading && <Typography className="text-center">Activating your account...</Typography>}
                {message && <Typography className="text-green-500 text-center">{message}</Typography>}
                {error && (
                    <div className="text-red-500 text-center">
                        <Typography>{error}</Typography>
                        {email ? (
                            <Typography className="mt-2">
                                If you need a new activation email, please <Link to="/resend-confirmation-email" state={{ email }} className="text-blue-500 underline">click here</Link>.
                            </Typography>
                        ) : (
                            <Typography className="mt-2">
                                Please go to sign in page.
                            </Typography>
                        )}
                    </div>
                )}
                <div className="mt-4 text-center">
                    <Link  to={'/signin'} className="bg-joinly_blue-principale text-white px-4 py-2 rounded">Back to Sign In</Link>
                </div>
            </div>  
        </div>
    );
}

export default ActivateAccountPage;