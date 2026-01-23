import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Play, Layout, Users } from 'lucide-react';

const Success = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 animate-bounce-slow">
                            <CheckCircle size={64} fill="currentColor" stroke="white" strokeWidth={1} />
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to LearnFlow!</h1>
                    <p className="text-xl text-gray-500 mb-12">Your account is ready and your path to scaling is active.</p>

                    <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4"><Layout size={20} /></div>
                            <h3 className="font-bold text-gray-900 mb-2">Build Course</h3>
                            <p className="text-xs text-gray-500 mb-4">Use FlowAI to generate your first curriculum in seconds.</p>
                            <Link to="/course-builder" className="text-blue-600 text-xs font-bold flex items-center">Start Now <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" /></Link>
                        </div>
                        <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100 group hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-4"><Play size={20} /></div>
                            <h3 className="font-bold text-gray-900 mb-2">Watch Tutorial</h3>
                            <p className="text-xs text-gray-500 mb-4">A 3-minute quickstart guide to mastering the platform.</p>
                            <Link to="#" className="text-purple-600 text-xs font-bold flex items-center">Watch Video <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" /></Link>
                        </div>
                        <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 group hover:bg-white hover:shadow-lg transition-all">
                            <div className="w-10 h-10 bg-orange-600 text-white rounded-xl flex items-center justify-center mb-4"><Users size={20} /></div>
                            <h3 className="font-bold text-gray-900 mb-2">Join Community</h3>
                            <p className="text-xs text-gray-500 mb-4">Connect with 35,000+ creators sharing secrets.</p>
                            <Link to="#" className="text-orange-600 text-xs font-bold flex items-center">Request Entry <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" /></Link>
                        </div>
                    </div>

                    <Link to="/dashboard" className="inline-flex items-center px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20">
                        Go to My Dashboard
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Success;
