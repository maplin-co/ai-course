import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Plus } from 'lucide-react';

// Sortable Module Item Component
const SortableModule = ({ id, module, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 transition-all group mb-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <button {...attributes} {...listeners} className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                        <GripVertical size={20} />
                    </button>
                    <span className="text-blue-600 font-bold mr-3">{module.id}</span>
                    <h4 className="font-bold text-lg">{module.title}</h4>
                </div>
                <button onClick={() => onDelete(id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="space-y-2 pl-10">
                {module.content.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm flex items-center">
                        <span className="mr-3">{item.type === 'video' ? '📽️' : '📄'}</span>
                        {item.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CourseBuilder = () => {
    // Course Metadata State
    const [courseTitle, setCourseTitle] = useState("Introduction to Modern Architecture");
    const [courseDescription, setCourseDescription] = useState("Drag, drop, and automate your curriculum creation with AI.");

    // Modules State
    const [modules, setModules] = useState([
        {
            id: '1.0',
            title: "Introduction to Modern Architecture",
            content: [
                { type: 'video', text: "The History of Skyscraper Design (12:45)" },
                { type: 'text', text: "Module Summary & Reading List" }
            ]
        },
        {
            id: '2.0',
            title: "Structural Foundations and Materials",
            content: [
                { type: 'text', text: "Understanding Concrete & Steel" }
            ]
        }
    ]);

    // Sensors for Drag and Drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setModules((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDeleteModule = (id) => {
        setModules(modules.filter(m => m.id !== id));
    };

    const handleAddModule = () => {
        const newId = (modules.length + 1).toFixed(1);
        setModules([...modules, {
            id: newId,
            title: "New Untitled Module",
            content: []
        }]);
    };

    const handleSaveCourse = () => {
        const courseData = {
            title: courseTitle,
            description: courseDescription,
            modules: modules
        };
        console.log("Saving Course Data:", courseData);
        alert("Course Structure Saved! (Check Console for Data)");
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <Header />
            <div className="max-w-7xl mx-auto px-6">

                {/* Header & Controls */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Course Title</label>
                        <input
                            type="text"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            className="text-3xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-blue-600 outline-none w-full transition-all"
                        />
                        <input
                            type="text"
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            className="text-gray-500 mt-2 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-600 outline-none w-full"
                        />
                    </div>
                    <button
                        onClick={handleSaveCourse}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 flex items-center"
                    >
                        Save Course
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl flex h-[700px] border border-gray-100 overflow-hidden">
                    {/* Sidebar Tools */}
                    <aside className="w-[260px] bg-white border-r border-gray-100 p-6 hidden md:block overflow-y-auto">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Components</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-move hover:bg-white hover:shadow-sm transition-all group">
                                <span className="mr-3">📄</span>
                                <span className="text-sm font-medium">Text Lesson</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-move hover:bg-white hover:shadow-sm transition-all group">
                                <span className="mr-3">📽️</span>
                                <span className="text-sm font-medium">Video Player</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-move hover:bg-white hover:shadow-sm transition-all group">
                                <span className="mr-3">❓</span>
                                <span className="text-sm font-medium">Interactive Quiz</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-move hover:bg-white hover:shadow-sm transition-all group">
                                <span className="mr-3">📁</span>
                                <span className="text-sm font-medium">Downloadable File</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center cursor-pointer hover:bg-white hover:shadow-sm transition-all text-blue-600">
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
                    <section className="flex-1 p-8 bg-gray-50/50 flex flex-col">
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={modules.map(m => m.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {modules.map((module) => (
                                        <SortableModule
                                            key={module.id}
                                            id={module.id}
                                            module={module}
                                            onDelete={handleDeleteModule}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>

                            {/* Add Module Button */}
                            <button
                                onClick={handleAddModule}
                                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add New Module
                            </button>

                            {/* AI Insertion Point */}
                            <div className="mt-6 py-8 text-center border-2 border-dashed border-blue-100 rounded-3xl bg-blue-50/30 cursor-pointer hover:bg-blue-50 transition-colors">
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
