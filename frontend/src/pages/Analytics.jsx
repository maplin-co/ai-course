import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Analytics = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Header />
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Student <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Analytics</span></h1>
                    <p className="text-gray-500">Track engagement, completion rates, and learning outcomes in real-time.</p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Students</p>
                        <h3 className="text-3xl font-bold text-gray-900">1,248</h3>
                        <p className="text-xs text-green-500 font-bold mt-2">↑ 12% from last month</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Completion</p>
                        <h3 className="text-3xl font-bold text-gray-900">86%</h3>
                        <p className="text-xs text-green-500 font-bold mt-2">↑ 4% from last month</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Active Now</p>
                        <h3 className="text-3xl font-bold text-gray-900">42</h3>
                        <p className="text-xs text-blue-500 font-bold mt-2">Currently learning</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
                        <h3 className="text-3xl font-bold text-gray-900">$12,450</h3>
                        <p className="text-xs text-green-500 font-bold mt-2">↑ 8% from last month</p>
                    </div>
                </div>

                {/* Charts Area Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[400px]">
                        <h3 className="font-bold text-lg mb-6">Engagement Over Time</h3>
                        <div className="flex items-end justify-between h-64 space-x-2">
                            {[40, 60, 45, 70, 80, 50, 65, 85, 90, 75, 60, 95].map((h, i) => (
                                <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group">
                                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-4 font-bold uppercase">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg mb-6">Top Performing Courses</h3>
                        <div className="space-y-6">
                            {[
                                { name: "AI for Designers", students: 450, color: "bg-purple-500" },
                                { name: "Web Dev Bootcamp", students: 320, color: "bg-blue-500" },
                                { name: "Digital Marketing", students: 210, color: "bg-green-500" },
                                { name: "Data Science 101", students: 180, color: "bg-yellow-500" }
                            ].map((course, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-gray-700">{course.name}</span>
                                        <span className="text-gray-500">{course.students} students</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${course.color} rounded-full`} style={{ width: `${(course.students / 500) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Analytics;
