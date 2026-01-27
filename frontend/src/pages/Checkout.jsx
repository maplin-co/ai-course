import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldCheck, Lock, CreditCard, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // In a real app, these would come from the previous page's state or cart
    // const { course } = location.state || {};
    const course = {
        title: "Complete AI Art Mastery",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"
    };

    const handleDPOPayment = async () => {
        setLoading(true);
        try {
            // 1. Create DPO Token
            const response = await axios.post(`${API_BASE}/api/payments/dpo/create-token`, {
                amount: course.price,
                currency: "USD",
                service_description: `Purchase: ${course.title}`,
                customer_email: "student@example.com", // Should be form input
                customer_first_name: "John",
                customer_last_name: "Doe"
            });

            const { result, paymentUrl, transToken } = response.data;

            if (result === "000") {
                // 2. Redirect to DPO Payment Page
                // In production: window.location.href = paymentUrl;

                // For this demo since the URL is a mock, we'll simulate a "Success" flow
                alert(`Redirecting to DPO Secure Payment...\nToken: ${transToken}`);

                setTimeout(() => {
                    navigate('/success');
                }, 1500);

            } else {
                alert("Payment creation failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to initiate payment.");
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
                        Complete your purchase to verify your enrollment.
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
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Summary</h2>
                            <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                <span className="text-gray-600">{course.title}</span>
                                <span className="font-bold text-gray-900">${course.price}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 text-lg font-extrabold">
                                <span>Total Due</span>
                                <span className="text-blue-600">${course.price}</span>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center text-sm text-gray-500">
                                    <CheckCircle size={16} className="text-green-500 mr-2" />
                                    <span>Instant Access to Course Content</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <CheckCircle size={16} className="text-green-500 mr-2" />
                                    <span>completion Certificate Included</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <CheckCircle size={16} className="text-green-500 mr-2" />
                                    <span>30-Day Money-Back Guarantee</span>
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
                                    <h3 className="font-bold text-gray-900">Secure Payment</h3>
                                    <p className="text-xs text-gray-500">Encrypted 256-bit SSL transaction</p>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    We use <strong>DPO Pay</strong> (Direct Pay Online) for secure African and Global payments. You can pay via Credit Card or Mobile Money.
                                </p>
                            </div>

                            <button
                                onClick={handleDPOPayment}
                                disabled={loading}
                                className="w-full py-5 bg-[#2c3e50] text-white rounded-xl font-bold text-lg hover:bg-[#34495e] transition-all shadow-lg shadow-gray-400/20 active:scale-[0.98] flex items-center justify-center relative overflow-hidden"
                            >
                                {loading && (
                                    <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                )}
                                <span>Pay with DPO Secure</span>
                                <ArrowRight className="ml-2" />
                            </button>

                            <div className="mt-6 flex justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                                {/* Payment Logos Placeholder */}
                                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center text-gray-400 text-sm">
                                <Lock size={14} className="mr-1" />
                                <span>Payments processed securely by Direct Pay Online</span>
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
