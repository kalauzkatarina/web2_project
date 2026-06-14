import { useState } from 'react';
import type { AuthFormProps } from '../../types/props/auth/AuthFormProps';
import { toast } from "react-toastify";
import type { AuthResponse } from '../../types/auth/AuthResponse';
import { validateLogin, validateRegister } from '../../api_services/validators/auth/AuthValidator';
import axios from 'axios';
import type { LoginErrors, RegisterErrors } from '../../types/auth/AuthErrors';

export default function AuthForm({ authApi, onLoginSuccess }: AuthFormProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistration, setIsRegistration] = useState(false);

    const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
    const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});

    const clearError = (field: string) => {
        if (isRegistration) {
            setRegisterErrors(prev => ({ ...prev, [field]: undefined }));
        } else {
            setLoginErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegistration) {
            const errors = validateRegister(firstName, lastName, email, password);
            if (Object.keys(errors).length > 0) {
                setRegisterErrors(errors);
                return;
            }
            setRegisterErrors({});
        } else {
            const errors = validateLogin(email, password);
            if (Object.keys(errors).length > 0) {
                setLoginErrors(errors);
                return;
            }
            setLoginErrors({});
        }

        try {
            if (isRegistration) {
                await authApi.register({ firstName, lastName, email, password });
                const loginResponse: AuthResponse = await authApi.login({ email, password });
                if (loginResponse.token) onLoginSuccess(loginResponse.token);
            } else {
                const response: AuthResponse = await authApi.login({ email, password });
                if (response.token) {
                    onLoginSuccess(response.token);
                } else {
                    toast.error(response.message || "Login failed.");
                }
            }
        } catch (error: unknown) {
            if (axios.isAxiosError<AuthResponse>(error)) {
                toast.error(
                    error.response?.data?.message ??
                    "An error occurred."
                );
            } else {
                toast.error("An error occurred.");
            }
        }
    };

    const ErrorMsg = ({ message }: { message?: string }) =>
        message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

    const inputClass = (hasError: boolean) =>
        `w-full bg-stone-50 text-stone-900 p-4 rounded-2xl border transition-all placeholder-stone-400 focus:outline-none
        ${hasError
            ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400/20"
            : "border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
        }`;

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#fafaf9] p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-stone-200/60">

                <h2 className="text-4xl font-bold text-stone-900 mb-10 tracking-tight text-center">
                    {isRegistration ? "Sign up" : "Sign in"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {isRegistration && (
                        <>
                            <div>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={firstName}
                                    onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
                                    className={inputClass(!!registerErrors.firstName)}
                                />
                                <ErrorMsg message={registerErrors.firstName} />
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={lastName}
                                    onChange={(e) => { setLastName(e.target.value); clearError("lastName"); }}
                                    className={inputClass(!!registerErrors.lastName)}
                                />
                                <ErrorMsg message={registerErrors.lastName} />
                            </div>
                        </>
                    )}

                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                            className={inputClass(
                                !!(isRegistration ? registerErrors.email : loginErrors.email)
                            )}
                        />
                        <ErrorMsg message={isRegistration ? registerErrors.email : loginErrors.email} />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                            className={inputClass(
                                !!(isRegistration ? registerErrors.password : loginErrors.password)
                            )}
                        />
                        <ErrorMsg message={isRegistration ? registerErrors.password : loginErrors.password} />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-5 rounded-2xl transition duration-300 transform active:scale-[0.98] shadow-lg shadow-amber-500/25 mt-2"
                    >
                        {isRegistration ? "Register" : "Login"}
                    </button>

                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-stone-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-stone-400">or</span>
                    </div>
                </div>

                <p className="text-center text-sm text-stone-500">
                    {isRegistration ? "Member already?" : "New here?"}{" "}
                    <button
                        onClick={() => {
                            setIsRegistration(!isRegistration);
                            setLoginErrors({});
                            setRegisterErrors({});
                        }}
                        className="text-amber-600 font-bold hover:text-amber-700 transition-colors"
                    >
                        {isRegistration ? "Sign in" : "Sign up"}
                    </button>
                </p>

            </div>
        </div>
    );
}