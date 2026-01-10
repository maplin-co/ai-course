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

                    <div className="p-8 space-y-8">
                        {/* Profile Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Information</h3>
                            <div className="flex items-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gray-200 mr-6"></div>
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Upload New Photo</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">First Name</label>
                                    <input type="text" defaultValue="John" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                                    <input type="text" defaultValue="Doe" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input type="email" defaultValue="john.doe@example.com" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-700">Email Notifications</p>
                                        <p className="text-xs text-gray-500">Receive weekly digests about your academy performance.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-700">Two-Factor Authentication</p>
                                        <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 flex justify-end">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Settings;
