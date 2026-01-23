import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { BarChart3, BookOpen, Globe, Users, Plus, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Total Students', value: '1,284', grow: '+12%', icon: <Users className="text-blue-600" /> },
        { label: 'Course Revenue', value: '$12,450', grow: '+8%', icon: <BarChart3 className="text-purple-600" /> },
        { label: 'Active Courses', value: '12', grow: '0%', icon: <BookOpen className="text-green-600" /> },
        { label: 'Site Visits', value: '45.2K', grow: '+24%', icon: <Globe className="text-orange-600" /> },
    ];

    const courses = [
        { id: 1, title: 'Mastering React & Framer Motion', students: 450, progress: 85, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400' },
        { id: 2, title: 'AI-Driven Content Strategy 2026', students: 820, progress: 40, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400' },
        { id: 3, title: 'Modern UI/UX Design Systems', students: 310, progress: 95, image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=400' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Creator! 👋</h1>
                        <p className="text-gray-500">Here's what's happening in your academy today.</p>
                    </div>
                    <Link to="/course-builder" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 group">
                        <Plus className="mr-2" size={20} />
                        Create New Course
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.grow.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                                    {stat.grow}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Course List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold text-gray-900">Your Recent Courses</h2>
                            <Link to="#" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                        </div>
                        <div className="grid gap-6">
                            {courses.map((course) => (
                                <div key={course.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 py-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{course.title}</h3>
                                                <div className="flex items-center text-xs text-gray-400 font-medium">
                                                    <Users size={14} className="mr-1" />
                                                    {course.students} Students
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full mt-4">
                                                <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth</span>
                                                <span className="text-[10px] font-bold text-blue-600">{course.progress}% Completed</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <Link to="/course-builder" className="flex-1 py-2 text-center bg-gray-50 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">Edit Content</Link>
                                            <Link to="#" className="flex-1 py-2 text-center bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">View Analytics</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Suggestions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 px-2">FlowAI Suggestions</h2>
                        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10">
                                <Globe size={120} className="absolute -top-10 -right-10" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm italic font-bold text-blue-300">AI</div>
                                <h3 className="text-xl font-bold mb-4 leading-tight">Scale your earnings with Email Loops.</h3>
                                <p className="text-blue-100 text-sm mb-8 leading-relaxed">I've detected a drop in student retention for Module 2. Let's set up an automated re-engagement campaign today.</p>
                                <button className="w-full py-4 bg-white text-indigo-900 rounded-xl font-bold flex items-center justify-center hover:bg-blue-50 transition-all group">
                                    Apply Strategy
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-sm mb-4">Quick Links</h4>
                            <div className="space-y-3">
                                <Link to="/site-builder" className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mr-3 group-hover:bg-orange-600 group-hover:text-white transition-all">🌐</div>
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Site Editor</span>
                                </Link>
                                <Link to="/ai-resources" className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-all">✨</div>
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">AI Tools</span>
                                </Link>
                                <Link to="/analytics" className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-3 group-hover:bg-purple-600 group-hover:text-white transition-all">📊</div>
                                    <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Revenue</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
