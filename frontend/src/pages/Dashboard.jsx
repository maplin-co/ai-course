import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                        🎉
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                        Your academy has been successfully launched. This is a demo dashboard for the prototype.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
                        <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50">
                            <div className="font-bold text-lg mb-2">Course Builder</div>
                            <p className="text-sm text-gray-500 mb-4">Start creating your first AI-generated course.</p>
                            <button className="text-blue-600 font-bold text-sm hover:underline">Launch Tool →</button>
                        </div>
                        <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50">
                            <div className="font-bold text-lg mb-2">Student Analytics</div>
                            <p className="text-sm text-gray-500 mb-4">Track progress and engagement in real-time.</p>
                            <button className="text-blue-600 font-bold text-sm hover:underline">View Stats →</button>
                        </div>
                        <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50">
                            <div className="font-bold text-lg mb-2">Settings</div>
                            <p className="text-sm text-gray-500 mb-4">Configure your domain and payment methods.</p>
                            <button className="text-blue-600 font-bold text-sm hover:underline">Manage →</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
