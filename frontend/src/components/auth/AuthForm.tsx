import { useState } from 'react';
import type { AuthFormProps } from '../../types/props/auth/AuthFormProps';
import toast from "react-hot-toast";
import type { AuthResponse } from '../../types/auth/AuthResponse';

export default function AuthForm({ authApi, onLoginSuccess }: AuthFormProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistration, setIsRegistration] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isRegistration) {
                await authApi.register({ firstName, lastName, email, password });

                const loginResponse: AuthResponse = await authApi.login({ email, password });

                console.log("Token received after registration:", loginResponse.token);

                if (loginResponse.token) {
                    onLoginSuccess(loginResponse.token);
                }
            } else {
                const response: AuthResponse = await authApi.login({ email, password });
                
                console.log("Token received after login:", response.token);

                if (response.token) {
                    onLoginSuccess(response.token);
                } else {
                    toast.error(response.message || "Login failed.");
                }
            }
        } catch (err) {
            toast.error("An error occurred.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#fafaf9] p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-stone-200/60">

                <h2 className="text-4xl font-bold text-stone-900 mb-10 tracking-tight text-center">
                    {isRegistration ? "Sign up" : "Sign in"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegistration && (
                        <div className="space-y-6">
                            <input
                                type="text" placeholder="Firstname" value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-stone-50 text-stone-900 p-4 rounded-2xl border border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all placeholder-stone-400"
                            />

                            <input
                                type="text" placeholder="Lastname" value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-stone-50 text-stone-900 p-4 rounded-2xl border border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all placeholder-stone-400"
                            />
                        </div>
                    )}

                    <input
                        type="email" placeholder="Email address" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 text-stone-900 p-4 rounded-2xl border border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all placeholder-stone-400"
                    />
                    <input
                        type="password" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-stone-50 text-stone-900 p-4 rounded-2xl border border-stone-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none transition-all placeholder-stone-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-5 rounded-2xl transition duration-300 transform active:scale-[0.98] shadow-lg shadow-amber-500/25 mt-2"
                    >
                        {isRegistration ? "Register" : "Login"}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-200"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-stone-400">or</span></div>
                </div>

                <p className="text-center text-sm text-stone-500">
                    {isRegistration ? "Member already?" : "New here?"}{" "}
                    <button
                        onClick={() => setIsRegistration(!isRegistration)}
                        className="text-amber-600 font-bold hover:text-amber-700 transition-colors"
                    >
                        {isRegistration ? "Sign in" : "Sign up"}
                    </button>
                </p>
            </div>
        </div>
    );
}