import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { BookOpen, Clock, Users, ArrowRight, Star, Search, Filter } from 'lucide-react';
import API_BASE from '../api_config';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/courses/`);
                setCourses(response.data);

                // Fetch enrollments if logged in
                const token = localStorage.getItem('token');
                if (token) {
                    const enrRes = await axios.get(`${API_BASE}/api/enrollments/`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setEnrollments(enrRes.data.map(e => e.course_id));
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                // Fallback dummy data for demo if API fails
                setCourses([
                    {
                        id: 1,
                        title: "Introduction to AI Engineering",
                        description: "Learn how to build and deploy modern AI applications using LLMs and agentic frameworks.",
                        instructor: "Dr. Sarah Mitchell",
                        rating: 4.9,
                        students: 1240,
                        duration: "12 Hours",
                        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
                    },
                    {
                        id: 2,
                        title: "Mastering Advanced Python",
                        description: "Deep dive into asynchronous programming, decorators, and high-performance Python patterns.",
                        instructor: "James Wilson",
                        rating: 4.8,
                        students: 2300,
                        duration: "8 Hours",
                        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800"
                    },
                    {
                        id: 3,
                        title: "Full-Stack Web Development 2026",
                        description: "From React 19 to Next.js 16, master the latest web technologies used by elite tech companies.",
                        instructor: "Alex Chen",
                        rating: 4.9,
                        students: 4500,
                        duration: "45 Hours",
                        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <Header />

            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-24 px-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                </div>
                
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 mb-8 animate-in fade-in slide-in-from-bottom duration-700">
                        <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                        <span className="text-sm font-bold uppercase tracking-widest">New Courses Added Weekly</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
                        Master the Skills of <br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">the Future.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Explore our curated catalog of expert-led courses designed to help you build, scale, and innovate.
                    </p>
                    
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-blue-600/20 blur-xl group-hover:bg-blue-600/30 transition-all rounded-full"></div>
                        <div className="relative flex bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm shadow-2xl">
                            <div className="flex items-center pl-4 pr-3">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search courses, technologies, instructors..." 
                                className="bg-transparent border-none focus:ring-0 text-white flex-grow py-3 text-lg outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button className="bg-blue-600 hover:bg-blue-700 h-auto px-8 rounded-xl font-bold">
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2 italic">Available Courses</h2>
                        <p className="text-gray-500 font-medium">{filteredCourses.length} premium courses currently available</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <Button variant="outline" className="rounded-xl border-gray-200 flex items-center gap-2 font-bold tracking-tight bg-white">
                            <Filter size={18} />
                            Filter By
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-3xl border border-gray-100 h-96 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course) => (
                            <div 
                                key={course.id} 
                                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                            >
                                <div className="aspect-video relative overflow-hidden">
                                    <img 
                                        src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"} 
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                                            Premium Course
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center text-yellow-500 gap-1">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs font-black">{course.rating || '4.9'}</span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                        <div className="flex items-center text-gray-500 gap-1">
                                            <Users size={14} />
                                            <span className="text-xs font-bold">{course.students || '0'}+ Learners</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1 italic">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">
                                        {course.description || "Start your journey in mastering this subject with expert-led guidance and hands-on projects."}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-gray-400 italic">
                                            <Clock size={16} />
                                            <span className="text-sm font-medium">{course.duration || "8 Hours"}</span>
                                        </div>
                                        {enrollments.includes(course.id) ? (
                                            <Link to="/learner-dashboard">
                                                <Button className="rounded-xl font-bold bg-green-600 hover:bg-green-700 transition-all flex items-center gap-2">
                                                    Continue Lesson
                                                    <ArrowRight size={16} />
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link to={`/checkout?course_id=${course.id}`}>
                                                <Button className="rounded-xl font-bold bg-gray-900 group-hover:bg-blue-600 transition-all flex items-center gap-2">
                                                    Enroll Now
                                                    <ArrowRight size={16} />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredCourses.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 tracking-tighter">No courses found</h3>
                        <p className="text-gray-500 mb-8">We couldn't find any courses matching "{searchTerm}"</p>
                        <Button onClick={() => setSearchTerm('')} variant="outline" className="rounded-xl font-bold">Clear Filters</Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Courses;
