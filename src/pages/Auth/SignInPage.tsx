import { useState } from 'react';
import { Input, Typography } from '@material-tailwind/react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { checkAuthentication, login as mainLogin } from '../../api/auth';
import { Link, useNavigate } from 'react-router-dom';
import { SigninFormInterface } from '../../interface/user';
import { useAuth } from '../../contexts/AuthContext';
import { LoginSuccessResponse } from '../../interface/AuthTypes';

interface ErrorMessageType {
    message: string;
    emailError?: boolean;
    passwordError?: boolean;
    email?: string;
    activationError?: boolean;
    error?: string;
}

export default function SignInPage() {
    const { loginContext } = useAuth();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<ErrorMessageType | null>(null);
    const navigate = useNavigate();
    const [resendEmail, setResendEmail] = useState<string | null>(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [form, setForm] = useState<SigninFormInterface>({
        email: '',
        password: '',
    });


    let formSchema = object({
        email: string()
            .email('Format d\'email invalide')
            .required('L\'email est requis'),

        password: string()
            .required('Le mot de passe est requis'),
    });

    const formik = useFormik({
        initialValues: form,

        validationSchema: formSchema,

        onSubmit: async (values) => {
            try {
                const response = await mainLogin(values.email, values.password);
                const authData: LoginSuccessResponse | ErrorMessageType = response.data;
                if ('accessToken' in authData && 'refreshToken' in authData) {
                    // It's a LoginSuccessResponse
                    localStorage.setItem('accessToken', authData.accessToken);
                    localStorage.setItem('refreshToken', authData.refreshToken);

                    const profileData = await checkAuthentication(); // type ??
                    if (profileData) {
                        loginContext(profileData);
                        navigate('/');
                    } else {
                        console.error('Failed to get profile data');
                    }
                }

            } catch (err: any) { // type ??
                console.error('Sign-in failed:', err.message);
                if (err && err.message) {
                    setError(err);

                    if (err.email) setResendEmail(err.email);

                }
                else {
                    setError({ message: 'Failed to activate account. Please try again.' });
                }
            }
        },
    });


    return (
        <>
            <main className='h-screen flex xs_custom:items-center sm:p-3 bg-blue-50'>
                <div className='xs_custom:w-fit w-full relative isolate overflow-hidden px-8 pt-12 pb-5 mx-auto xs_custom:px-12 xs_custom:rounded-xl shadow-custom bg-white'>
                    <div>
                        <h1 className="text-center text-6xl mb-8 text-white font-bold">Joinly</h1>
                        <div className="w-80 min-w-64 sm:min-w-96 mx-auto bg-white p-2 xs_custom:px-4 rounded-lg shadow-custom xs_custom:py-4">
                            <span className="bg-[linear-gradient(175deg,_#27187E,_#758BFD)] w-circle_style aspect-square rounded-full absolute -z-1 left-1/2 -translate-x-1/2 -top-450"></span>
                            <Typography variant="h4" className="text-center text-2xl">Connectez vous</Typography>

                            {error?.activationError && <p className="text-center text-red-500 -- cy-error" data-cy="server-res-error">{error.message}</p>}


                            {!resendEmail && (
                                <form onSubmit={formik.handleSubmit} method="post" className="grid grid-cols-1 gap-1">
                                    <fieldset>
                                        <label htmlFor="email" className='block mb-1'>Email</label>
                                        <Input
                                            onChange={formik.handleChange}
                                            value={formik.values.email}
                                            name='email'
                                            id='email'
                                            size="lg"
                                            placeholder="exemple@mail.com"
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        {formik.errors.email && formik.touched.email ? <p className="text-red-500 -- cy-error" data-cy="email-error">{formik.errors.email}</p> : null}
                                        {error?.emailError && <p className="text-red-500 -- cy-error" data-cy="email-error">{error.message}</p>}
                                    </fieldset>

                                    <fieldset>
                                        <label htmlFor="password" className='block mb-1'>Mot de passe</label>
                                        <Input
                                            onChange={formik.handleChange}
                                            value={formik.values.password}
                                            name='password'
                                            id='password'
                                            size="lg"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="********"
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }} />
                                        <p
                                            onClick={togglePasswordVisibility}
                                            className="cursor-pointer text-blue-600 underline mt-1 text-xs">
                                            {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                        </p>
                                        {formik.errors.password && formik.touched.password ? <p className="text-red-500 -- cy-error" data-cy="password-error">{formik.errors.password}</p> : null}
                                        {error?.passwordError && <p className="text-red-500 -- cy-error" data-cy="email-error">{error.message}</p>}
                                    </fieldset>

                                    <button type="submit" className="block w-full rounded py-2 pl-1.5 pr-3 text-base font-bold text-white bg-joinly_blue-principale">Enregistrer</button>
                                    <Link to={'/signup'} className='block underline decoration-solid text-blue-600'>Vous avez déjà un compte?</Link>
                                    <Link to={'/forgot-password'} className='block underline decoration-solid text-gray-600'>Mot de pass oublié?</Link>
                                </form>
                            )}



                            {resendEmail && (
                                <>
                                    <Link
                                        to="/resend-confirmation-email"
                                        state={{ email: resendEmail }}
                                        className="mt-5 text-center block w-full rounded py-2 pl-1.5 pr-3 text-base font-bold text-white bg-joinly_blue-principale">
                                        Resend Confirmation Email
                                    </Link>
                                    <p className='text-center text-gray-500'>{resendEmail}</p>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}