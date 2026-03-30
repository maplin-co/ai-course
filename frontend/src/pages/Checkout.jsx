import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, CreditCard, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

import API_BASE from '../api_config';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currency, setCurrency] = useState('BWP');
    const [customerInfo, setCustomerInfo] = useState({
        firstName: localStorage.getItem('userName')?.split(' ')[0] || 'John',
        lastName: localStorage.getItem('userName')?.split(' ')[1] || 'Doe',
        email: localStorage.getItem('userEmail') || 'student@example.com'
    });

    // In a real app, these would come from the previous page's state or cart
    // const { course } = location.state || {};
    const basePriceUSD = 49.99;
    const exchangeRate = 13.5; // Example USD to BWP rate
    
    const course = {
        title: "Complete AI Art Mastery",
        price: currency === 'USD' ? basePriceUSD : Math.round(basePriceUSD * exchangeRate),
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"
    };

    const handleDPOPayment = async () => {
        setLoading(true);
        try {
            // 1. Create DPO Token
            const response = await axios.post(`${API_BASE}/api/payments/dpo/create-token`, {
                amount: course.price,
                currency: currency,
                service_description: `Purchase: ${course.title}`,
                customer_email: customerInfo.email,
                customer_first_name: customerInfo.firstName,
                customer_last_name: customerInfo.lastName,
                redirect_url: `${window.location.origin}/success`,
                back_url: `${window.location.origin}/checkout`
            });

            const { result, paymentUrl, transToken, resultExplanation } = response.data;

            if (result === "000") {
                // 2. Simulate Enrollment on Backend
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        await axios.post(`${API_BASE}/api/enrollments/`, {
                            user_id: localStorage.getItem('userId') || 'current',
                            course_id: 1 // Example ID
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                    }
                } catch (e) { console.error("Auto-enrollment error:", e); }

                // 3. Redirect
                alert(`${resultExplanation}\n\nRedirecting to your Learner Portal...\nCurrency: ${currency}\nAmount: ${course.price}\nToken: ${transToken}`);

                setTimeout(() => {
                    navigate('/learner-dashboard');
                }, 2000);
            } else {
                alert(`Payment creation failed: ${resultExplanation}`);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to initiate payment. " + (error.response?.data?.detail || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Header />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Secure Checkout
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Complete your purchase via DPO (Direct Pay Online)
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Order Summary */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Currency</label>
                                <div className="flex p-1 bg-gray-100 rounded-xl">
                                    <button 
                                        onClick={() => setCurrency('BWP')}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${currency === 'BWP' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                    >
                                        🇧🇼 BWP (Pula)
                                    </button>
                                    <button 
                                        onClick={() => setCurrency('USD')}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${currency === 'USD' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                    >
                                        🇺🇸 USD (Dollar)
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <span className="text-gray-600">{course.title}</span>
                                <span className="font-bold text-gray-900">{currency === 'USD' ? '$' : 'P'}{course.price}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 text-lg font-extrabold">
                                <span>Total Due</span>
                                <span className="text-blue-600">{currency === 'USD' ? '$' : 'P'}{course.price}</span>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center text-sm text-gray-500">
                                    <CheckCircle size={16} className="text-green-500 mr-2" />
                                    <span>Instant Access to Course Content</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <CheckCircle size={16} className="text-green-500 mr-2" />
                                    <span>Supported in Botswana & Internationally</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center mb-6">
                                <ShieldCheck className="text-green-600 mr-3" size={28} />
                                <div>
                                    <h3 className="font-bold text-gray-900">DPO Secure Checkout</h3>
                                    <p className="text-xs text-gray-500">Official Payment Partner for Botswana</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="First Name"
                                            value={customerInfo.firstName}
                                            onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Last Name"
                                            value={customerInfo.lastName}
                                            onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="email@example.com"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
                                <p className="text-sm text-blue-800 leading-relaxed font-medium">
                                    Supports <strong>Orange Money, Mascom MyZaka</strong>, and all major Credit/Debit Cards in Botswana.
                                </p>
                            </div>

                            <button
                                onClick={handleDPOPayment}
                                disabled={loading}
                                className="w-full py-5 bg-[#2c3e50] text-white rounded-xl font-bold text-lg hover:bg-[#34495e] transition-all shadow-lg shadow-gray-400/20 active:scale-[0.98] flex items-center justify-center relative overflow-hidden"
                            >
                                {loading && (
                                    <div className="absolute inset-0 bg-white/20 flex items-center justify-center z-10">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                )}
                                <span>Proceed to Secure Payment</span>
                                <ArrowRight className="ml-2" />
                            </button>

                            <div className="mt-6 flex justify-center items-center space-x-6 opacity-60">
                                <span className="text-[10px] font-bold uppercase text-gray-400">Trusted By:</span>
                                <div className="flex space-x-3 grayscale">
                                    <CreditCard size={20} />
                                    <ShieldCheck size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center text-gray-400 text-sm">
                                <Lock size={14} className="mr-1" />
                                <span>Secured by DPO Pay Business</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
