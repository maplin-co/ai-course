import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CourseBuilder = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Header />
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Smart <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Course Builder</span></h1>
                    <p className="text-gray-500">Drag, drop, and automate your curriculum creation with AI.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl flex h-[700px] border border-gray-100 overflow-hidden">
                    {/* Sidebar Tools */}
                    <aside className="w-[260px] bg-white border-r border-gray-100 p-6 hidden md:block">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Components</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-grab hover:bg-white hover:shadow-sm transition-all">
                                <span className="mr-3">📄</span>
                                <span className="text-sm font-medium">Text Lesson</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-grab hover:bg-white hover:shadow-sm transition-all">
                                <span className="mr-3">📽️</span>
                                <span className="text-sm font-medium">Video Player</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-grab hover:bg-white hover:shadow-sm transition-all">
                                <span className="mr-3">❓</span>
                                <span className="text-sm font-medium">Interactive Quiz</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-grab hover:bg-white hover:shadow-sm transition-all">
                                <span className="mr-3">📁</span>
                                <span className="text-sm font-medium">Downloadable File</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center cursor-grab hover:bg-white hover:shadow-sm transition-all text-blue-600">
                                <span className="mr-3">✨</span>
                                <span className="text-sm font-bold tracking-tight">AI Multi-Generator</span>
                            </div>
                        </div>

                        <div className="mt-12 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <p className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Pro Tip</p>
                            <p className="text-[11px] text-gray-600 leading-relaxed">Type <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded">/ai</kbd> anywhere to trigger the AI lesson writer.</p>
                        </div>
                    </aside>

                    {/* Editor Canvas */}
                    <section className="flex-1 p-8 bg-white flex flex-col">
                        <div className="border-2 border-dashed border-gray-100 rounded-3xl p-10 flex-1 overflow-y-auto space-y-6">
                            {/* Module 1 */}
                            <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 transition-all group">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <span className="text-blue-600 font-bold mr-3">1.0</span>
                                        <h4 className="font-bold text-lg">Introduction to Modern Architecture</h4>
                                    </div>
                                    <button className="text-gray-300 hover:text-gray-500">···</button>
                                </div>
                                <div className="space-y-2">
                                    <div className="p-3 bg-gray-50 rounded-lg text-sm flex items-center">
                                        <span className="mr-3">📽️</span> The History of Skyscraper Design (12:45)
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg text-sm flex items-center">
                                        <span className="mr-3">📄</span> Module Summary & Reading List
                                    </div>
                                </div>
                            </div>

                            {/* Module 2 */}
                            <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 opacity-60">
                                <div className="flex items-center mb-4">
                                    <span className="text-gray-400 font-bold mr-3">2.0</span>
                                    <h4 className="font-bold text-lg text-gray-400">Structural Foundations...</h4>
                                </div>
                            </div>

                            {/* AI Insertion Point */}
                            <div className="py-10 text-center border-2 border-dashed border-blue-100 rounded-3xl bg-blue-50/30 cursor-pointer hover:bg-blue-50 transition-colors">
                                <div className="inline-flex items-center text-blue-600 font-bold">
                                    <span className="mr-2">✨</span> Generate next 3 modules with FlowAI
                                </div>
                                <p className="text-xs text-blue-400 mt-2">Personalized based on current course trajectory</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CourseBuilder;
