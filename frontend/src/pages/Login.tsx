import { useState } from "react";
import { login as loginApi } from '../api/auth.api';
import { useAuth } from "../auth/AuthContext"

const Login = () => {
    const { auth } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await loginApi(email, password);
        auth(res.access_token, res.refresh_token, res.user);
    }

    return (
        <form onSubmit={submit}>
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-400 dark:bg-white/3 ">
                <div className="px-6 py-5">
                    <h3 className="text-base font-medium text-gray-400 text-gray-900">Login Form</h3>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-gray-400 sm:p-6">
                    <div className="space-y-6">
                        <form className=" undefined">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <div className="relative">
                                    <input
                                        placeholder="Email address"
                                        className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs 
                                            placeholder:text-gray-400 focus:outline-hidden focus:ring-3  bg-transparent text-gray-400 border-gray-300 
                                            focus:border-brand-300 focus:ring-brand-500/20"
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)}
                                      />
                                </div>
                            </div>
                            <div className="col-span-full">
                                <div className="relative">
                                    <input 
                                        placeholder="Password" 
                                        className=" h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs 
                                            placeholder:text-gray-400 focus:outline-hidden focus:ring-3  bg-transparent text-gray-400 border-gray-300 
                                            focus:border-brand-300 focus:ring-brand-500/20" 
                                        type="password" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-span-full">
                                <button 
                                    className="inline-flex items-center justify-center gap-2 rounded-lg transition w-full px-4 py-3 
                                        text-sm bg-blue-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Login;