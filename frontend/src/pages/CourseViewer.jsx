import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, PlayCircle, FileText, HelpCircle, ChevronRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const API_BASE = process.env.REACT_APP_API_URL ||
    (window.location.hostname === 'localhost' ? 'http://localhost:8080' : window.location.origin);

const CourseViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState({}); // { "moduleId-lessonIndex": true }
    const [quizMode, setQuizMode] = useState(false); // New state for quiz taking
    const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [quizScore, setQuizScore] = useState(null);

    // Init data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Get Course Data (Try API first, then local)
                let courseData = null;
                try {
                    const res = await axios.get(`${API_BASE}/api/courses/${id}`);
                    courseData = res.data;
                } catch (e) {
                    console.warn("API Course fetch failed, checking local storage...");
                    const localCourses = JSON.parse(localStorage.getItem('createdCourses') || '[]');
                    courseData = localCourses.find(c => c.id === id);
                }

                if (!courseData) {
                    console.error("Course not found");
                    setLoading(false);
                    return;
                }
                setCourse(courseData);

                // 2. Get Enrollment / Progress Data
                // Only if logged in and using API
                const token = localStorage.getItem('token'); // Assuming JWT stored here
                if (token) {
                    try {
                        // Check if enrolled by filtering user enrollments for this course
                        const enrollRes = await axios.get(`${API_BASE}/api/enrollments/`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const myEnrollment = enrollRes.data.find(e => e.course_id === id || e.course_id === parseInt(id));

                        if (myEnrollment) {
                            setEnrollment(myEnrollment);
                            setProgress(myEnrollment.progress_data || {});
                        } else {
                            // Attempt to auto-enroll for testing student experience immediately
                            try {
                                const newEnrollRes = await axios.post(`${API_BASE}/api/enrollments/`, {
                                    user_id: JSON.parse(localStorage.getItem('user') || '{}').id, // Or handle safely
                                    course_id: parseInt(id) || 0 // assuming int ID for PG
                                }, { headers: { Authorization: `Bearer ${token}` } });
                                setEnrollment(newEnrollRes.data);
                            } catch (enrollErr) {
                                console.log("Auto-enroll skipped/failed (likely local course ID string vs int constraint or duplicate)");
                            }
                        }
                    } catch (e) {
                        console.warn("Enrollment fetch failed", e);
                    }
                }
            } catch (err) {
                console.error("Load flow error", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleMarkComplete = async () => {
        const lessonKey = `${activeModule}-${activeLesson}`;

        // Optimistic UI update
        const newProgress = { ...progress, [lessonKey]: true };
        setProgress(newProgress);

        // Trigger small confetti for lesson completion
        confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.8 },
            disableForReducedMotion: true,
            colors: ['#3b82f6', '#10b981']
        });

        if (enrollment) {
            try {
                await axios.patch(`${API_BASE}/api/enrollments/${enrollment.id}`, {
                    progress_data: newProgress
                    // Simple progress tracking
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } catch (e) {
                console.error("Failed to save progress", e);
            }
        }
    };

    const handleNext = () => {
        // Reset quiz states when moving to next section
        setQuizMode(false);
        setQuizScore(null);
        setCurrentQuizQuestion(0);
        setAnswers({});

        if (activeLesson < (course.modules[activeModule]?.content.length || 0) - 1) {
            setActiveLesson(activeLesson + 1);
        } else if (activeModule < (course.modules.length || 0) - 1) {
            setActiveModule(activeModule + 1);
            setActiveLesson(0);
        } else if (activeModule === course.modules.length - 1 && !quizMode && course.finalExam?.length > 0) {
            // End of lessons but have a Final Exam
            setQuizMode(true);
        } else {
            // End of course
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            alert("Congratulations! You've reached the end of the course.");
            navigate('/dashboard');
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Course not found (404)</h2>
                    <Link to="/dashboard" className="text-blue-600 font-bold hover:underline">Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    const currentModule = course.modules[activeModule];
    const currentLesson = currentModule?.content[activeLesson];
    const isCompleted = progress[`${activeModule}-${activeLesson}`];

    // Calculate total progress
    const totalLessons = course.modules.reduce((acc, m) => acc + m.content.length, 0);
    const completedCount = Object.keys(progress).length; // naive count
    const percentComplete = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] mt-16 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-80 border-r border-gray-100 bg-gray-50 overflow-y-auto hidden lg:block h-full">
                    <div className="p-6 border-b border-gray-100">
                        <Link to="/dashboard" className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center hover:text-gray-900 transition-colors mb-6">
                            <ArrowLeft size={12} className="mr-2" /> Back to Dashboard
                        </Link>
                        <h1 className="text-lg font-extrabold text-gray-900 line-clamp-2 leading-tight mb-4">{course.title}</h1>

                        {/* Progress Bar */}
                        <div className="mb-2 flex justify-between text-xs font-bold text-gray-500">
                            <span>{percentComplete}% Complete</span>
                            <span>{completedCount}/{totalLessons} Lessons</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${percentComplete}%` }}></div>
                        </div>
                    </div>

                    <nav className="p-4 space-y-4">
                        {course.modules.map((module, mIdx) => (
                            <div key={module.id || mIdx}>
                                <button
                                    onClick={() => setActiveModule(mIdx)}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between outline-none ${activeModule === mIdx ? 'text-blue-900 bg-blue-50/50' : 'text-gray-700 hover:text-gray-900'}`}
                                >
                                    <span className="font-bold text-sm line-clamp-1">Module {mIdx + 1}: {module.title}</span>
                                    <ChevronRight size={14} className={`text-gray-400 transition-transform ${activeModule === mIdx ? 'rotate-90' : ''}`} />
                                </button>

                                {activeModule === mIdx && (
                                    <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                                        {module.content.map((lesson, lIdx) => {
                                            const isDone = progress[`${mIdx}-${lIdx}`];
                                            const isActive = activeLesson === lIdx;
                                            return (
                                                <button
                                                    key={lIdx}
                                                    onClick={() => setActiveLesson(lIdx)}
                                                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center transition-all group ${isActive ? 'bg-white shadow-sm ring-1 ring-black/5 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                                                >
                                                    <span className={`mr-2.5 flex-shrink-0 `}>
                                                        {isDone ? <CheckCircle size={16} className="text-green-500" /> : (
                                                            lesson.type === 'video' ? '📽️' : lesson.type === 'quiz' ? '❓' : lesson.type === 'file' ? '📁' : '📄'
                                                        )}
                                                    </span>
                                                    <span className={`line-clamp-1 ${isDone ? 'line-through opacity-70' : ''}`}>{lesson.text}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Viewer */}
                <main className="flex-1 overflow-y-auto bg-white p-6 md:p-12 lg:p-16 h-full">
                    <div className="max-w-4xl mx-auto pb-24">
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                                    Module {activeModule + 1} • Lesson {activeLesson + 1}
                                </div>
                                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                                    {currentLesson?.text || "Welcome to the Lesson"}
                                </h2>
                            </div>
                            <div className="hidden md:block">
                                {!isCompleted ? (
                                    <button
                                        onClick={handleMarkComplete}
                                        className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 rounded-xl text-sm font-bold text-gray-600 transition-all shadow-sm"
                                    >
                                        <CheckCircle size={16} /> <span>Mark Complete</span>
                                    </button>
                                ) : (
                                    <span className="flex items-center text-green-600 font-bold text-sm px-5 py-2.5 bg-green-50 rounded-xl border border-green-100">
                                        <CheckCircle size={16} className="mr-2" /> Completed
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Lesson Content Area */}
                        <div className="bg-gray-50 rounded-[2rem] border border-gray-100 p-8 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden mb-10 shadow-inner">
                            {/* Ambient BG */}
                            <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900 rounded-full blur-[150px]"></div>
                            </div>

                            {quizMode ? (
                                <div className="max-w-2xl w-full z-10 text-left">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-bold">{quizScore !== null ? 'Results' : 'Assessment'}</h3>
                                        <span className="text-sm font-medium text-gray-500">Question {currentQuizQuestion + 1} of {(currentModule?.quiz?.length || course.finalExam?.length)}</span>
                                    </div>

                                    {quizScore !== null ? (
                                        <div className="text-center py-10">
                                            <div className="text-6xl mb-6">{quizScore >= 80 ? '🎉' : '📚'}</div>
                                            <h4 className="text-3xl font-bold mb-2">You scored {quizScore}%</h4>
                                            <p className="text-gray-500 mb-8">{quizScore >= 80 ? 'Excellent work! You have mastered this content.' : 'Not quite there yet. Review the material and try again.'}</p>
                                            <button
                                                onClick={() => { setQuizMode(false); setQuizScore(null); }}
                                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20"
                                            >
                                                Return to Lesson
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            {(() => {
                                                const questions = activeModule === course.modules.length - 1 && quizMode && !currentModule.quiz?.length ? course.finalExam : (currentModule?.quiz || []);
                                                const q = questions[currentQuizQuestion];
                                                if (!q) return <p>No questions found.</p>;
                                                return (
                                                    <>
                                                        <p className="text-xl font-medium text-gray-900 mb-8">{q.question}</p>
                                                        <div className="space-y-3">
                                                            {q.options.map((option, oIdx) => (
                                                                <button
                                                                    key={oIdx}
                                                                    onClick={() => setAnswers({ ...answers, [currentQuizQuestion]: option })}
                                                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all font-medium ${answers[currentQuizQuestion] === option ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                                                >
                                                                    {option}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <div className="mt-10 flex justify-end">
                                                            {currentQuizQuestion < questions.length - 1 ? (
                                                                <button
                                                                    disabled={!answers[currentQuizQuestion]}
                                                                    onClick={() => setCurrentQuizQuestion(currentQuizQuestion + 1)}
                                                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold disabled:opacity-30"
                                                                >
                                                                    Next Question
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    disabled={!answers[currentQuizQuestion]}
                                                                    onClick={() => {
                                                                        let correct = 0;
                                                                        questions.forEach((qu, i) => {
                                                                            if (answers[i] === qu.correct_answer) correct++;
                                                                        });
                                                                        const score = Math.round((correct / questions.length) * 100);
                                                                        setQuizScore(score);
                                                                    }}
                                                                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/20"
                                                                >
                                                                    Submit Assessment
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            ) : currentLesson?.type === 'video' ? (
                                <div className="w-full h-full flex flex-col items-center z-10 text-center">
                                    <div className="w-full aspect-video bg-black rounded-2xl flex items-center justify-center shadow-2xl mb-8 relative group overflow-hidden border border-gray-800">
                                        <PlayCircle size={80} className="text-white/30 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-500 cursor-pointer z-20" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                        <div className="absolute bottom-6 left-8 right-8 z-20 text-left">
                                            <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all">
                                                <div className="h-full bg-blue-500 w-1/3 relative"></div>
                                            </div>
                                            <div className="flex justify-between text-xs font-medium text-gray-400 mt-3">
                                                <span>04:20</span>
                                                <span>12:45</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 font-medium">Video Source: {currentLesson.text}</p>
                                </div>
                            ) : currentLesson?.type === 'quiz' || (currentModule?.quiz?.length > 0 && currentLesson?.text?.toLowerCase().includes('quiz')) ? (
                                <div className="max-w-md w-full z-10 text-center">
                                    <div className="w-20 h-20 bg-white shadow-xl shadow-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-50">
                                        <HelpCircle size={40} className="text-purple-600" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold mb-4 text-gray-900">Module Quiz</h3>
                                    <p className="text-gray-500 mb-10 leading-relaxed">Test your understanding of {currentModule.title}. You'll need an 80% to pass.</p>
                                    <button
                                        onClick={() => setQuizMode(true)}
                                        className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 active:scale-95"
                                    >
                                        Start Quiz
                                    </button>
                                </div>
                            ) : (
                                <div className="text-left w-full max-w-2xl z-10">
                                    <div className="prose prose-lg prose-blue max-w-none">
                                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                            {currentLesson?.text || "Welcome to the course! Use the sidebar to navigate through lessons."}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons (Footer) */}
                        <div className="flex justify-between items-center ">
                            <button
                                disabled={activeLesson === 0 && activeModule === 0}
                                onClick={() => {
                                    if (activeLesson > 0) setActiveLesson(activeLesson - 1);
                                    else if (activeModule > 0) {
                                        setActiveModule(activeModule - 1);
                                        setActiveLesson(course.modules[activeModule - 1].content.length - 1);
                                    }
                                }}
                                className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-30 flex items-center"
                            >
                                <ChevronRight size={20} className="mr-2 rotate-180" /> Previous
                            </button>

                            <div className="flex gap-4">
                                {!isCompleted && (
                                    <button
                                        onClick={handleMarkComplete}
                                        className="md:hidden px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center"
                                    >
                                        <CheckCircle size={20} />
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="px-10 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 flex items-center active:scale-95"
                                >
                                    {activeLesson === currentModule.content.length - 1 && activeModule === course.modules.length - 1 ? 'Finish' : 'Next Lesson'}
                                    <ChevronRight size={20} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CourseViewer;
