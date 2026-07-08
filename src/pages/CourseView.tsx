import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError } from '../firebase';
import { Course, Lesson, OperationType, Announcement, Assignment } from '../types';
import { BookOpen, Play, CheckCircle, ChevronRight, ArrowLeft, Bell, FileText, BarChart, Home as HomeIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AITutor } from '../components/AITutor';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

type Tab = 'home' | 'announcements' | 'assignments' | 'grades' | 'modules';

export function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const courseUnsubscribe = onSnapshot(doc(db, 'courses', courseId), (doc) => {
      if (doc.exists()) {
        setCourse({ id: doc.id, ...doc.data() } as Course);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `courses/${courseId}`);
    });

    // Fetch Announcements
    const annQ = query(collection(db, 'courses', courseId, 'announcements'), orderBy('createdAt', 'desc'));
    const annUnsubscribe = onSnapshot(annQ, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/announcements`);
    });

    // Fetch Assignments
    const assQ = query(collection(db, 'courses', courseId, 'assignments'), orderBy('dueDate', 'asc'));
    const assUnsubscribe = onSnapshot(assQ, (snapshot) => {
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/assignments`);
    });

    // Fetch Lessons/Modules
    const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('order', 'asc'));
    const lessonsUnsubscribe = onSnapshot(lessonsQuery, (snapshot) => {
      const lessonData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(lessonData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `courses/${courseId}/lessons`);
    });

    return () => {
      courseUnsubscribe();
      annUnsubscribe();
      assUnsubscribe();
      lessonsUnsubscribe();
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-olive-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return <div>Course not found</div>;

  const isInstitutional = course.type === 'institutional';
  const themeColor = isInstitutional ? 'olive-accent' : 'indigo-500';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            <div className="card space-y-6">
              <h2 className="text-3xl font-bold italic">Course Overview</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Instructor</p>
                  <p className="font-bold">{course.instructorName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">
                    {isInstitutional ? 'Term' : 'Price'}
                  </p>
                  <p className="font-bold">
                    {isInstitutional ? course.term : (course.price === 0 ? 'FREE' : `₹${course.price}`)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-widest text-gray-400">Recent Announcements</h3>
              {announcements.slice(0, 2).map(ann => (
                <div key={ann.id} className="card p-6 flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">{ann.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{format(new Date(ann.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="space-y-6">
            {announcements.map(ann => (
              <div key={ann.id} className="card p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold italic">{ann.title}</h3>
                  <span className="text-xs text-gray-400">{format(new Date(ann.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
                <div className="prose prose-stone max-w-none text-gray-600">
                  <ReactMarkdown>{ann.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-4">
            {assignments.map(ass => (
              <div key={ass.id} className="card p-6 flex justify-between items-center group hover:border-olive-accent transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold italic">{ass.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">Due: {format(new Date(ass.dueDate), 'MMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{ass.points} pts</p>
                  <button className={`text-xs font-bold uppercase tracking-widest text-${themeColor} mt-2 group-hover:underline`}>Submit</button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'modules':
        return (
          <div className="space-y-4">
            {lessons.map(lesson => (
              <div key={lesson.id} className="card p-6 flex justify-between items-center group hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { setActiveTab('modules'); setCurrentLesson(lesson); }}>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-bold">
                    {lesson.order}
                  </div>
                  <h4 className="text-lg font-bold italic">{lesson.title}</h4>
                </div>
                <Play size={20} className={`text-gray-300 group-hover:text-${themeColor} transition-colors`} />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-gray-100">
        <div className="space-y-2">
          <Link to="/dashboard" className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-${themeColor} transition-colors mb-4`}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <h1 className="text-5xl font-bold italic leading-tight">{course.title}</h1>
          <p className="text-gray-500 sans font-medium tracking-wide uppercase text-xs">
            {course.courseCode} &bull; {course.instructorName} &bull; {course.term}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-1 flex flex-col gap-2">
          {[
            { id: 'home', label: 'Home', icon: HomeIcon },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'modules', label: 'Modules', icon: BookOpen },
            { id: 'grades', label: 'Grades', icon: BarChart },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as Tab); setCurrentLesson(null); }}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id && !currentLesson
                  ? `bg-${themeColor} text-white shadow-lg shadow-${themeColor}/20`
                  : `text-gray-400 hover:bg-white hover:text-${themeColor}`
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {currentLesson ? (
              <motion.div
                key="lesson"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentLesson(null)}
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-olive-accent flex items-center gap-2"
                  >
                    <ArrowLeft size={14} /> Back to Modules
                  </button>
                  <span className={`text-xs font-bold uppercase tracking-widest text-${themeColor} bg-${themeColor}/5 px-3 py-1 rounded-full`}>
                    Lesson {currentLesson.order}
                  </span>
                </div>
                
                {currentLesson.videoUrl && (
                  <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl">
                    <iframe
                      src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  </div>
                )}

                <div className="card space-y-8">
                  <h2 className="text-4xl font-bold italic">{currentLesson.title}</h2>
                  <div className="markdown-body prose prose-stone max-w-none">
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {renderTabContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AITutor courseTitle={course.title} lessonContent={currentLesson?.content} />
    </div>
  );
}
