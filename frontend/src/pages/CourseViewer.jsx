import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, PlayCircle, FileText, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';

const CourseViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);

    useEffect(() => {
        // Load course data
        const localCourses = JSON.parse(localStorage.getItem('createdCourses') || '[]');
        const foundCourse = localCourses.find(c => c.id === id);

        if (foundCourse) {
            setCourse(foundCourse);
        } else {
            // Check for mock data/API fallback if needed
            // For now, if not found, redirect to dashboard
            console.error("Course not found:", id);
        }
    }, [id]);

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Course not found</h2>
                    <Link to="/dashboard" className="text-blue-600 font-bold hover:underline flex items-center justify-center">
                        <ArrowLeft className="mr-2" size={18} /> Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const currentModule = course.modules[activeModule];
    const currentLesson = currentModule?.content[activeLesson];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="flex h-[calc(100-64px)] mt-16 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-80 border-r border-gray-100 bg-gray-50 overflow-y-auto hidden lg:block">
                    <div className="p-6 border-b border-gray-100">
                        <Link to="/dashboard" className="text-gray-500 text-sm flex items-center hover:text-gray-900 transition-colors mb-4">
                            <ArrowLeft size={14} className="mr-2" /> Back to Dashboard
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 line-clamp-2">{course.title}</h1>
                        <div className="mt-4 flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <BookOpen size={14} className="mr-2" /> {course.modules.length} Modules
                        </div>
                    </div>

                    <nav className="p-4">
                        {course.modules.map((module, mIdx) => (
                            <div key={module.id} className="mb-4">
                                <button
                                    onClick={() => setActiveModule(mIdx)}
                                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${activeModule === mIdx ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'hover:bg-white text-gray-700'}`}
                                >
                                    <span className="font-bold text-sm line-clamp-1">{module.title || `Module ${mIdx + 1}`}</span>
                                    <ChevronRight size={16} className={activeModule === mIdx ? 'rotate-90 transition-transform' : ''} />
                                </button>

                                {activeModule === mIdx && (
                                    <div className="mt-2 ml-2 space-y-1">
                                        {module.content.map((lesson, lIdx) => (
                                            <button
                                                key={lIdx}
                                                onClick={() => setActiveLesson(lIdx)}
                                                className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center transition-colors ${activeLesson === lIdx ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-white'}`}
                                            >
                                                <span className="mr-2 text-lg">
                                                    {lesson.type === 'video' ? '📽️' : lesson.type === 'quiz' ? '❓' : lesson.type === 'file' ? '📁' : '📄'}
                                                </span>
                                                <span className="line-clamp-1">{lesson.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Viewer */}
                <main className="flex-1 overflow-y-auto bg-white p-8 md:p-12 lg:p-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-10">
                            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                                Module {activeModule + 1} • Lesson {activeLesson + 1}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                                {currentLesson?.text || "Welcome to the Lesson"}
                            </h2>
                        </div>

                        {/* Lesson Content Area */}
                        <div className="bg-gray-50 rounded-[2.5rem] border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px]"></div>
                            </div>

                            {currentLesson?.type === 'video' ? (
                                <div className="w-full h-full flex flex-col items-center">
                                    <div className="w-full aspect-video bg-gray-900 rounded-3xl flex items-center justify-center shadow-2xl mb-8 relative group overflow-hidden">
                                        <PlayCircle size={80} className="text-white/20 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-500 cursor-pointer" />
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-1/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 italic">Video lesson: {currentLesson.text}</p>
                                </div>
                            ) : currentLesson?.type === 'quiz' ? (
                                <div className="max-w-md w-full">
                                    <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                        <HelpCircle size={40} className="text-purple-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 italic">Ready for a quick quiz?</h3>
                                    <p className="text-gray-600 mb-10">Test your knowledge on "{currentLesson.text}" and earn points towards your certificate.</p>
                                    <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20">
                                        Start Quiz
                                    </button>
                                </div>
                            ) : currentLesson?.type === 'file' ? (
                                <div className="max-w-md w-full">
                                    <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                        <FileText size={40} className="text-orange-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 italic">Resource Available</h3>
                                    <p className="text-gray-600 mb-10">Download documentation and worksheets for "{currentLesson.text}".</p>
                                    <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20">
                                        Download Files (.PDF)
                                    </button>
                                </div>
                            ) : (
                                <div className="text-left w-full">
                                    <div className="prose prose-blue max-w-none">
                                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                        </p>
                                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                        </p>
                                        <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl my-10 font-bold italic text-blue-900">
                                            "Knowledge is power. Information is liberating. Education is the premise of progress, in every society, in every family."
                                        </div>
                                        <p className="text-lg text-gray-700 leading-relaxed">
                                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-100">
                            <button
                                disabled={activeLesson === 0 && activeModule === 0}
                                onClick={() => {
                                    if (activeLesson > 0) {
                                        setActiveLesson(activeLesson - 1);
                                    } else if (activeModule > 0) {
                                        setActiveModule(activeModule - 1);
                                        setActiveLesson(course.modules[activeModule - 1].content.length - 1);
                                    }
                                }}
                                className="px-6 py-3 rounded-xl font-bold text-gray-500 border border-gray-100 hover:bg-gray-50 transition-all disabled:opacity-30 flex items-center"
                            >
                                <ChevronRight size={18} className="mr-2 rotate-180" /> Previous
                            </button>
                            <button
                                onClick={() => {
                                    if (activeLesson < currentModule.content.length - 1) {
                                        setActiveLesson(activeLesson + 1);
                                    } else if (activeModule < course.modules.length - 1) {
                                        setActiveModule(activeModule + 1);
                                        setActiveLesson(0);
                                    } else {
                                        alert("Congratulations! You've reached the end of the course.");
                                        navigate('/dashboard');
                                    }
                                }}
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center"
                            >
                                {activeLesson === currentModule.content.length - 1 && activeModule === course.modules.length - 1 ? 'Finish Course' : 'Next Lesson'}
                                <ChevronRight size={18} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default CourseViewer;
