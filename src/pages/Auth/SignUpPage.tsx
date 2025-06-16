import { useState } from 'react';
import { Input, Select, Option, Typography } from '@material-tailwind/react';
import { useFormik } from 'formik';
import { object, ref, string } from 'yup';
import { signup } from '../../api/auth';
import { SignUpFormInterface } from '../../interface/AuthTypes';


export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [response, setResponse] = useState<string | null>(null);
    const [responseType, setResponseType] = useState<'success' | 'error' | null>(null);

    // const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // initializing the value
    const [form, setForm] = useState<SignUpFormInterface>({
        lastname: '',
        firstname: '',
        email: '',
        role: "PARTICIPANT",
        password: '',
        confirmPassword: ''
    });

    // Validation schema
    const formSchema = object().shape({
        firstname: string()
            .min(2, 'Le prénom doit comporter au moins 2 caractères')
            .matches(/^[a-zA-Z]+$/, 'Le prénom ne peut pas contenir de chiffres')
            .required('Le prénom est requis'),

        lastname: string()
            .min(2, 'Le nom de famille doit comporter au moins 2 caractères')
            .matches(/^[a-zA-Z]+$/, 'Le nom de famille ne peut pas contenir de chiffres')
            .required('Le nom de famille est requis'),

        email: string()
            .email('Format d\'email invalide')
            .required('L\'email est requis'),

        role: string()
            .oneOf(["PARTICIPANT", "ORGANIZER"], 'La role doit être "Participant" ou "Organisateur"')
            .required('La role est requis'),

        password: string()
            .min(8, 'Le mot de passe doit comporter au moins 8 caractères')
            .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
            .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
            .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
            .required('Le mot de passe est requis'),

        confirmPassword: string()
            .oneOf([ref('password')], 'Les mots de passe doivent correspondre')
            .required('La confirmation du mot de passe est requise'),
    });

    // Formik form handle change and submit
    const formik = useFormik({
        initialValues: form,

        validationSchema: formSchema,

        onSubmit: async (values) => {
            try {
                // Calling the signup function with the form values
                const res = await signup(values);
                setResponse(res.data.message);
                setResponseType('success');
            } catch (err: any) { 
                setResponse(err.message || 'An error occurred during sign-in.');
                console.error('Signup failed:', err);
            }
        },
    });


    return (
        <>
            <main className='h-screen flex xs_custom:items-center sm:p-3'>

                <div className='xs_custom:w-fit w-full relative overflow-hidden px-8 pt-12 pb-5 mx-auto xs_custom:px-12 xs_custom:rounded-xl shadow-custom'>
                    <div>
                        <h1 className="text-center text-6xl mb-8 text-white font-bold">Joinly</h1>
                        <div className="w-80 min-w-64 sm:min-w-96 mx-auto bg-white p-2 xs_custom:px-4 rounded-lg shadow-custom xs_custom:py-4">

                            <span className="bg-[linear-gradient(175deg,_#27187E,_#758BFD)] w-circle_style aspect-square rounded-full absolute -z-1 left-1/2 -translate-x-1/2 -top-450"></span>
                            <Typography variant="h4" className="text-center text-2xl text-joinly_blue-contraste">Créer ton compte</Typography>

                            <form onSubmit={formik.handleSubmit} method="post" className="grid grid-cols-1 gap-1">
                                <fieldset>
                                    <label htmlFor="lastname" className='block mb-1 text-joinly_blue-contraste'>Nom</label>
                                    <Input
                                        onChange={formik.handleChange}
                                        value={formik.values.lastname}
                                        name='lastname'
                                        id='lastname'
                                        size="lg"
                                        placeholder="name"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                    />
                                    {formik.errors.lastname && formik.touched.lastname ? <p className="text-red-500 -- cy-error" data-cy="msg-error">{formik.errors.lastname}</p> : null}
                                </fieldset>

                                <fieldset>
                                    <label htmlFor="firstname" className='block mb-1 text-joinly_blue-contraste'>Prénom</label>
                                    <Input
                                        onChange={formik.handleChange}
                                        value={formik.values.firstname} // Corrected from firstName to firstname
                                        name='firstname'
                                        id='firstname'
                                        size="lg"
                                        placeholder="Prènom"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                    />
                                    {formik.errors.firstname && formik.touched.firstname ? <p className="text-red-500 -- cy-error" data-cy="msg-error">{formik.errors.firstname}</p> : null}
                                </fieldset>

                                <fieldset>
                                    <label htmlFor="email" className='block mb-1 text-joinly_blue-contraste'>Email</label>
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
                                    {formik.errors.email && formik.touched.email ? <p className="text-red-500 -- cy-error" data-cy="msg-error">{formik.errors.email}</p> : null}
                                </fieldset>

                                <fieldset>
                                    <label htmlFor="role" className='block mb-1 text-joinly_blue-contraste'>Statut</label>
                                    <Select
                                        onChange={(value) => formik.setFieldValue('role', value)}
                                        value={formik.values.role}
                                        name='role'
                                        id='role'
                                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                        data-cy="role-select"
                                    >
                                        <Option value="" disabled>Sélectionnez votre statut</Option>
                                        <Option value="PARTICIPANT" data-cy="role-participant">Participant</Option>
                                        <Option value="ORGANIZER" data-cy="role-organizer">Organisateur</Option>

                                    </Select >
                                    {formik.errors.role && formik.touched.role ? <p className="text-red-500 -- cy-error" data-cy="msg-error">{formik.errors.role}</p> : null}
                                </fieldset>

                                <fieldset>
                                    <label htmlFor="password" className='block mb-1 text-joinly_blue-contraste'>Mot de passe</label>
                                    <div className="relative">
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
                                            }}
                                        />
                                        <p
                                            onClick={togglePasswordVisibility}
                                            className="cursor-pointer text-blue-600 underline text-xs">
                                            {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                        </p>

                                    </div>
                                    {formik.errors.password && formik.touched.password ? <p className="text-red-500 -- cy-error" data-cy="password-error">{formik.errors.password}</p> : null}
                                </fieldset>

                                <fieldset>
                                    <label htmlFor="confirmPassword" className='block mb-1 text-joinly_blue-contraste'>Confirmez votre mot de passe</label>
                                    <div className="relative">
                                        <Input
                                            onChange={formik.handleChange}
                                            value={formik.values.confirmPassword}
                                            name='confirmPassword'
                                            id='confirmPassword'
                                            size="lg"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="********"
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        <p
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="cursor-pointer text-blue-600 underline text-xs">
                                            {showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                        </p>
                                    </div>
                                    {formik.errors.confirmPassword && formik.touched.confirmPassword ? <p className="text-red-500 -- cy-error" data-cy="password-match-error">{formik.errors.confirmPassword}</p> : null}
                                </fieldset>

                                <button className="block w-full rounded py-2 pl-1.5 pr-3 text-base font-bold text-white bg-joinly_blue-principale" type='submit'>Enregistrer</button>
                                {response && (
                                    <div className={`mt-4 p-4 rounded ${responseType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {response}
                                    </div>
                                )}                               
                                <a href='/signin' className='block underline decoration-solid text-blue-600'>Vous avez déjà un compte?</a>
                            </form>
                        </div>
                    </div>
                </div>
            </main >
        </>
    )
}
