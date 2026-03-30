import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { BookOpen, GraduationCap, Clock, CheckCircle, ChevronRight, Layout, Play, Lock, AlertCircle } from 'lucide-react';
import API_BASE from '../api_config';

const LearnerDashboard = () => {
    const [user, setUser] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trialStatus, setTrialStatus] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // Fetch User Profile
                const userRes = await axios.get(`${API_BASE}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userRes.data);

                // Check Trial Status
                if (userRes.data.trial_ends_at) {
                    const expiry = new Date(userRes.data.trial_ends_at);
                    const now = new Date();
                    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                    setTrialStatus({
                        isExpired: diffDays <= 0,
                        daysLeft: Math.max(0, diffDays),
                        expiryDate: expiry.toLocaleDateString()
                    });
                }

                // Fetch Enrollments
                const enrollRes = await axios.get(`${API_BASE}/api/enrollments/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEnrollments(enrollRes.data);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Mock data for demo
                setUser({ full_name: "Learner", email: "student@example.com", plan: "Basic" });
                setEnrollments([
                    { id: '1', course_id: 1, title: 'Introduction to AI Engineering', progress: 45 },
                    { id: '2', course_id: 2, title: 'Mastering Advanced Python', progress: 10 }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 italic">Student Dashboard</h1>
                        <p className="text-gray-500 font-medium tracking-tight">Welcome back, <span className="text-gray-900 font-bold">{user?.full_name}</span>! Ready to continue your journey?</p>
                    </div>
                    
                    {trialStatus && !trialStatus.isExpired && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Trial Status</p>
                                <p className="text-sm font-bold text-blue-900">{trialStatus.daysLeft} days remaining in your trial</p>
                            </div>
                            <Link to="/pricing">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 font-bold rounded-lg ml-4">Upgrade</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Expiration Alert */}
                {trialStatus?.isExpired && user?.subscription_status !== 'active' && (
                    <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8 animate-pulse shadow-lg">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
                            <Lock size={32} />
                        </div>
                        <div className="text-center md:text-left flex-grow">
                            <h3 className="text-2xl font-black text-red-900 mb-2 tracking-tighter italic">Trial Expired</h3>
                            <p className="text-red-700 leading-relaxed max-w-2xl font-medium">Your 7-day trial access to premium lessons has ended. Upgrade to a paid plan to unlock your progress and continue learning.</p>
                        </div>
                        <Link to="/pricing">
                            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 h-14 rounded-xl font-bold shadow-xl shadow-red-200">Unlock All Content</Button>
                        </Link>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Progress Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <BookOpen className="text-blue-600" />
                                    Active Courses
                                </h2>
                                <Link to="/courses" className="text-sm font-bold text-blue-600 hover:underline">Browse More</Link>
                            </div>

                            {enrollments.length === 0 ? (
                                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <GraduationCap className="text-blue-200" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No active enrollments</h3>
                                    <p className="text-gray-500 mb-8">Start your first course today to build your academy.</p>
                                    <Link to="/courses">
                                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold px-8">Find a Course</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {enrollments.map((enr) => (
                                        <div key={enr.id} className="group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition-all border-l-4 border-l-blue-600">
                                            <div className="w-20 h-20 bg-gray-900 rounded-xl flex-shrink-0 flex items-center justify-center text-white overflow-hidden relative">
                                                <div className="absolute inset-0 bg-blue-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                                <Play size={24} className="relative z-10" />
                                            </div>
                                            
                                            <div className="flex-grow text-center md:text-left">
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">{enr.title || 'Untitled Course'}</h4>
                                                <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> Last accessed yesterday</span>
                                                </div>
                                                
                                                {/* Simple Progress Bar */}
                                                <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs mx-auto md:mx-0">
                                                    <div className="bg-blue-600 h-full transition-all" style={{ width: `${enr.progress || 0}%` }}></div>
                                                </div>
                                            </div>
                                            
                                            <Link to={`/course/${enr.course_id}`}>
                                                <Button variant="outline" className="rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all px-6">
                                                    Continue Lesson
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                            <h3 className="text-xl font-black mb-6 tracking-tighter italic">Your Activity</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">12</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lessons Completed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                        <Layout size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">2</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Courses</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">450</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Experience Points</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-10 pt-10 border-t border-gray-50">
                                <Button className="w-full h-12 bg-gray-900 hover:bg-gray-800 rounded-xl font-bold flex items-center justify-center gap-2">
                                    View Achievements
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                            <h3 className="text-xl font-black mb-2 tracking-tighter italic">AI Assistant</h3>
                            <p className="text-sm text-blue-100 mb-6 leading-relaxed font-medium">Stuck on a concept? Your personalized AI tutor is ready to help you analyze your lessons.</p>
                            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black rounded-xl py-6 h-auto">Ask LearnAI Bot</Button>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LearnerDashboard;
