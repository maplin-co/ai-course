import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Settings = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Header />
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Account <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Settings</span></h1>
                    <p className="text-gray-500">Manage your profile, billing, and notification preferences.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row border-b border-gray-100">
                        <button className="px-8 py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-blue-50/50">General</button>
                        <button className="px-8 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Billing</button>
                        <button className="px-8 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">Team</button>
                        <button className="px-8 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50">API Keys</button>
                    </div>

                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-8 py-4 font-medium text-sm transition-colors ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`px-8 py-4 font-medium text-sm transition-colors ${activeTab === 'billing' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Billing
                        </button>
                        <button className="px-8 py-4 font-medium text-sm text-gray-500 hover:text-gray-900 transition-colors">Team</button>
                        <button className="px-8 py-4 font-medium text-sm text-gray-500 hover:text-gray-900 transition-colors">API Keys</button>
                    </div>

                    <div className="p-8">
                        {activeTab === 'general' ? (
                            <div className="space-y-6 max-w-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input type="text" defaultValue="Alex Johnson" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" defaultValue="alex@example.com" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all" />
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                            <p className="text-sm text-gray-500">Receive weekly digests</p>
                                        </div>
                                        <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                                            <p className="text-sm text-gray-500">Receive product updates</p>
                                        </div>
                                        <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold mb-6">Manage Subscription</h2>
                                <PaymentSettings />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Settings;
