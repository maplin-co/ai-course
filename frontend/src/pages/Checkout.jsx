import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Shield, CreditCard, Lock } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            navigate('/success');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Header />
            <main className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold mb-4">Complete Your <span className="text-blue-600">Upgrade</span></h1>
                    <p className="text-gray-500">Starting your 7-day free trial of LearnFlow Pro.</p>
                </div>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Payment Form */}
                    <div className="md:col-span-3">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <CreditCard className="mr-3 text-blue-600" />
                                Payment Method
                            </h2>
                            <form className="space-y-4" onSubmit={handleCheckout}>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Card Number</label>
                                    <div className="relative">
                                        <input type="text" placeholder="•••• •••• •••• ••••" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                                            <div className="w-6 h-4 bg-gray-200 rounded"></div>
                                            <div className="w-6 h-4 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Expiry</label>
                                        <input type="text" placeholder="MM/YY" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">CVC</label>
                                        <input type="text" placeholder="•••" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div className="py-6 border-t border-gray-50 mt-8">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            "Start Free Trial"
                                        )}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                                    By clicking "Start Free Trial", you agree to our Terms of Service. You will not be charged until your trial ends. Cancel anytime.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold mb-6">Plan Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">LearnFlow Pro</span>
                                    <span className="font-bold">$99/mo</span>
                                </div>
                                <div className="flex justify-between text-green-600">
                                    <span>7-Day Trial</span>
                                    <span className="font-bold">-$99.00</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-50 flex justify-between">
                                <span className="font-bold">Due Today</span>
                                <span className="text-2xl font-black text-gray-900">$0.00</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <div className="flex items-center mb-4 text-blue-600">
                                <Shield size={20} className="mr-2" />
                                <span className="font-bold text-sm">Secure Checkout</span>
                            </div>
                            <p className="text-xs text-blue-500 leading-relaxed">
                                Your information encrypted with 256-bit SSL and processed securely via FlowCommerce.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
