import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDraggable
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Plus, X } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Sidebar Item Component (Draggable)
const SidebarItem = ({ type, icon, label }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            label,
            icon,
            isSidebar: true
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-move hover:bg-white hover:shadow-sm transition-all group mb-3"
        >
            <span className="mr-3">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
};

// Sortable Module Item Component
const SortableModule = ({ id, module, onDelete, onRemoveContent, onUpdateModule, onUpdateContent }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: module.id,
        data: {
            type: 'module',
            module
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-5 bg-white rounded-2xl shadow-sm border ${isDragging ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100 hover:border-blue-500'} transition-all group mb-4`}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center flex-1">
                    <button {...attributes} {...listeners} className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                        <GripVertical size={20} />
                    </button>
                    <input
                        type="text"
                        value={module.title}
                        onChange={(e) => onUpdateModule(module.id, e.target.value)}
                        className="font-bold text-lg bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none w-full mr-4"
                        placeholder="Module Title"
                    />
                </div>
                <button onClick={() => onDelete(id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Content List */}
            <div className="space-y-2 pl-10">
                {module.content.length === 0 && (
                    <div className="p-4 border-2 border-dashed border-gray-100 rounded-lg text-center text-gray-400 text-sm">
                        Drop components here to add content
                    </div>
                )}
                {module.content.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm flex items-center justify-between group/item">
                        <div className="flex items-center flex-1">
                            <span className="mr-3">{item.icon}</span>
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => onUpdateContent(module.id, idx, e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-gray-200 focus:border-blue-500 outline-none w-full"
                                placeholder="Topic Content"
                            />
                        </div>
                        <button
                            onClick={() => onRemoveContent(module.id, idx)}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all ml-2"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CourseBuilder = () => {
    const [activeId, setActiveId] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const navigate = useNavigate();

    // Course Metadata State
    const [courseTitle, setCourseTitle] = useState("New Course Title");
    const [courseDescription, setCourseDescription] = useState("Enter course description here...");

    // Modules State
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!loggedIn) {
            navigate('/login');
        }
    }, [navigate]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        if (active.data.current?.isSidebar) {
            setActiveItem(active.data.current);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveItem(null);

        if (!over) return;

        // Handle dragging sidebar item to a module
        if (active.id.toString().startsWith('sidebar-')) {
            const moduleId = over.id;
            const moduleExists = modules.find(m => m.id === moduleId);

            if (moduleExists) {
                const itemData = active.data.current;

                setModules(prev => prev.map(m => {
                    if (m.id === moduleId) {
                        return {
                            ...m,
                            content: [...m.content, {
                                type: itemData.type,
                                text: `New ${itemData.label}`,
                                icon: itemData.icon
                            }]
                        };
                    }
                    return m;
                }));
            }
            return;
        }

        // Handle reordering modules
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

    const handleRemoveContent = (moduleId, contentIndex) => {
        setModules(prev => prev.map(m => {
            if (m.id === moduleId) {
                const newContent = [...m.content];
                newContent.splice(contentIndex, 1);
                return { ...m, content: newContent };
            }
            return m;
        }));
    };

    const handleAddModule = () => {
        const newId = `module-${Date.now()}`;
        setModules([...modules, {
            id: newId,
            title: "",
            content: []
        }]);
    };

    const handleUpdateModule = (moduleId, newTitle) => {
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title: newTitle } : m));
    };

    const handleUpdateContent = (moduleId, contentIndex, newText) => {
        setModules(prev => prev.map(m => {
            if (m.id === moduleId) {
                const newContent = [...m.content];
                newContent[contentIndex] = { ...newContent[contentIndex], text: newText };
                return { ...m, content: newContent };
            }
            return m;
        }));
    };

    const handleSaveCourse = async () => {
        try {
            const courseData = {
                title: courseTitle,
                description: courseDescription,
                modules: modules
            };

            const response = await axios.post(`${API_BASE}/api/courses/`, courseData);
            console.log("Course saved:", response.data);
            alert("Course Saved Successfully!");
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course. Please try again.");
        }
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

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="bg-white rounded-3xl shadow-2xl flex h-[700px] border border-gray-100 overflow-hidden">
                        {/* Sidebar Tools */}
                        <aside className="w-[260px] bg-white border-r border-gray-100 p-6 hidden md:block overflow-y-auto">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Components</h3>
                            <div className="space-y-3">
                                <SidebarItem type="text" label="Text Lesson" icon="📄" />
                                <SidebarItem type="video" label="Video Player" icon="📽️" />
                                <SidebarItem type="quiz" label="Interactive Quiz" icon="❓" />
                                <SidebarItem type="file" label="Downloadable File" icon="📁" />
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center cursor-pointer hover:bg-white hover:shadow-sm transition-all text-blue-600">
                                    <span className="mr-3">✨</span>
                                    <span className="text-sm font-bold tracking-tight">AI Multi-Generator</span>
                                </div>
                            </div>

                            <div className="mt-12 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <p className="text-[10px] font-bold text-indigo-600 uppercase mb-2">Pro Tip</p>
                                <p className="text-[11px] text-gray-600 leading-relaxed">Drag components directly into modules to build your course.</p>
                            </div>
                        </aside>

                        {/* Editor Canvas */}
                        <section className="flex-1 p-8 bg-gray-50/50 flex flex-col">
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
                                            onRemoveContent={handleRemoveContent}
                                            onUpdateModule={handleUpdateModule}
                                            onUpdateContent={handleUpdateContent}
                                        />
                                    ))}
                                </SortableContext>

                                {/* Add Module Button */}
                                <button
                                    onClick={handleAddModule}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={20} />
                                    Add New Module
                                </button>

                                {/* AI Insertion Point */}
                                <div
                                    onClick={() => {
                                        if (!courseTitle || courseTitle === "New Course Title") {
                                            alert("Please enter a course topic first!");
                                            return;
                                        }

                                        const templates = [
                                            { type: 'video', title: `Introduction to ${courseTitle}`, icon: '📽️' },
                                            { type: 'text', title: `${courseTitle} Fundamentals`, icon: '📄' },
                                            { type: 'quiz', title: `Mastering ${courseTitle} - Level 1`, icon: '❓' }
                                        ];

                                        const newModules = templates.map((tpl, index) => ({
                                            id: `gen-${Date.now()}-${index}`,
                                            title: tpl.title,
                                            content: [{ type: tpl.type, text: `Key concepts of ${courseTitle} explained.`, icon: tpl.icon }]
                                        }));

                                        setModules(prev => [...prev, ...newModules]);
                                    }}
                                    className="mt-6 py-8 text-center border-2 border-dashed border-blue-100 rounded-3xl bg-blue-50/30 cursor-pointer hover:bg-blue-50 transition-colors"
                                >
                                    <div className="inline-flex items-center text-blue-600 font-bold">
                                        <span className="mr-2">✨</span> Generate next 3 modules for "{courseTitle}"
                                    </div>
                                    <p className="text-xs text-blue-400 mt-2">Personalized based on your course topic</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <DragOverlay>
                        {activeId && activeId.toString().startsWith('sidebar-') ? (
                            <div className="p-3 bg-white rounded-xl border border-blue-500 shadow-xl w-[200px] flex items-center opacity-90 cursor-grabbing">
                                <span className="mr-3">{activeItem?.icon}</span>
                                <span className="text-sm font-medium">{activeItem?.label}</span>
                            </div>
                        ) : null}
                    </DragOverlay>

                </DndContext>
            </div>
            <Footer />
        </div>
    );
};

export default CourseBuilder;
