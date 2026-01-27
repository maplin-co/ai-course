import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login and set a flag
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', e.target[0].value);
        navigate('/ai-resources');
    };

    return (
        <div className="bg-gray-50 flex min-h-screen">
            {/* Left side: Value Prop */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 text-white p-20 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                    <div className="absolute top-1/2 -left-24 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center space-x-2 mb-20">
                        <div
                            className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/40">
                            L</div>
                        <span className="text-2xl font-bold">LearnFlow</span>
                    </Link>

                    <h1 className="text-5xl font-extrabold leading-tight mb-8">Welcome Back to <br /><span
                        className="text-blue-400">LearnFlow.</span></h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-md">Continue building your academy and managing your student growth with AI.</p>
                </div>

                <div className="relative z-10 pt-20 border-t border-white/10">
                    <p className="text-gray-500 text-sm">"The AI features saved me 20 hours of work every week. I can't imagine running my business without it."
                    </p>
                    <div className="mt-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&q=85&w=100"
                                alt="Avatar" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest">Mark Thompson</p>
                            <p className="text-[10px] text-gray-400">Founder, FinanceAcademy</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full lg:w-1/2 p-6 md:p-20 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-2">Sign In</h2>
                    <p className="text-gray-500 mb-10">Enter your credentials to access your dashboard.</p>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email
                                Address</label>
                            <input type="email" required
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="john@company.com" />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                <Link to="#" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Forgot?</Link>
                            </div>
                            <input type="password" required
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter your password" />
                        </div>

                        <button type="submit"
                            className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold shadow-xl shadow-gray-500/20 hover:bg-gray-800 transition-all flex items-center justify-center group">
                            Sign In to Dashboard
                            <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </form>

                    <p className="text-center mt-10 text-sm text-gray-500">New to LearnFlow? <Link to="/signup"
                        className="text-blue-600 font-bold">Start 7-Day Free Trial</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
