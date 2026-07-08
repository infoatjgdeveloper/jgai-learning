import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../firebase';
import { useAuth } from '../AuthContext';
import { Course, Enrollment, OperationType, University } from '../types';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Calendar, Bell, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export function Dashboard() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  const institutionalCourses = enrollments
    .map(e => courses[e.courseId])
    .filter((c): c is Course => c?.type === 'institutional');

  const personalCourses = enrollments
    .map(e => courses[e.courseId])
    .filter((c): c is Course => c?.type === 'personal');

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      try {
        // Fetch University info
        if (profile.universityId) {
          const univSnap = await getDoc(doc(db, 'universities', profile.universityId));
          if (univSnap.exists()) {
            setUniversity({ id: univSnap.id, ...univSnap.data() } as University);
          }
        }

        // Fetch Enrollments
        const q = query(collection(db, 'enrollments'), where('studentId', '==', profile.uid));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const enrollmentData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));
          setEnrollments(enrollmentData);

          const courseIds = enrollmentData.map(e => e.courseId);
          if (courseIds.length > 0) {
            const courseMap: Record<string, Course> = {};
            for (const id of courseIds) {
              const courseSnap = await getDoc(doc(db, 'courses', id));
              if (courseSnap.exists()) {
                courseMap[id] = { id: courseSnap.id, ...courseSnap.data() } as Course;
              }
            }
            setCourses(courseMap);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'enrollments');
        });

        return () => unsubscribe();
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'dashboard_data');
      }
    };

    fetchData();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-olive-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-panel rounded-2xl shadow-sm flex items-center justify-center border border-edge overflow-hidden">
            {university?.logo ? (
              <img src={university.logo} alt={university.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <GraduationCap size={32} className="text-jgai-bright" />
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold italic leading-tight">{university?.name || 'University Dashboard'}</h1>
            <p className="text-fog sans font-medium tracking-wide uppercase text-xs">
              {profile?.role} Portal &bull; {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-3 bg-panel rounded-full shadow-sm border border-edge text-fog hover:text-jgai-bright transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-3 bg-panel rounded-full shadow-sm border border-edge text-fog hover:text-jgai-bright transition-colors">
            <Calendar size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Course Grid */}
        <div className="lg:col-span-2 space-y-12">
          {/* Institutional Section */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-widest text-fog">University Courses</h2>
              <Link to="/courses?type=institutional" className="text-sm font-bold text-jgai-bright hover:underline">View Catalog</Link>
            </div>
            
            {institutionalCourses.length === 0 ? (
              <div className="card text-center py-12 bg-panel/50 border-dashed border-2 border-gray-200">
                <p className="text-fog italic">No university courses enrolled.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {institutionalCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -4 }}
                    className="card p-0 overflow-hidden border border-edge flex flex-col"
                  >
                    <div className="h-3 bg-jgai" />
                    <div className="p-6 space-y-4 flex-grow">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-fog">
                        <span>{course.courseCode}</span>
                        <span>{course.term}</span>
                      </div>
                      <h3 className="text-2xl font-bold italic leading-tight">{course.title}</h3>
                      <p className="text-xs text-fog sans">{course.instructorName}</p>
                    </div>
                    <Link 
                      to={`/course/${course.id}`}
                      className="p-4 bg-panel-2 border-t border-edge text-center text-xs font-bold uppercase tracking-widest hover:bg-jgai hover:text-white transition-all"
                    >
                      Enter Course
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Section */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-widest text-fog">Personal Learning</h2>
              <Link to="/courses?type=personal" className="text-sm font-bold text-jgai-bright hover:underline">Explore Skills</Link>
            </div>
            
            {personalCourses.length === 0 ? (
              <div className="card text-center py-12 bg-panel/50 border-dashed border-2 border-gray-200">
                <p className="text-fog italic">No personal courses enrolled.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {personalCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -4 }}
                    className="card p-0 overflow-hidden border border-edge flex flex-col"
                  >
                    <div className="h-3 bg-indigo-500" />
                    <div className="p-6 space-y-4 flex-grow">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-fog">
                        <span>Self-Paced</span>
                        <span className="text-indigo-500">{course.price === 0 ? 'FREE' : `₹${course.price}`}</span>
                      </div>
                      <h3 className="text-2xl font-bold italic leading-tight">{course.title}</h3>
                      <p className="text-xs text-fog sans">{course.instructorName}</p>
                    </div>
                    <Link 
                      to={`/course/${course.id}`}
                      className="p-4 bg-panel-2 border-t border-edge text-center text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      Continue Learning
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - To Do / Activity */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-fog">To Do</h2>
          <div className="card space-y-6">
            <div className="flex gap-4 items-start pb-6 border-b border-gray-50">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Assignment 1: Foundations</p>
                <p className="text-xs text-fog mt-1">Due: Mar 28 at 11:59 PM</p>
                <p className="text-[10px] uppercase font-bold text-red-500 mt-2">100 points</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">New Announcement</p>
                <p className="text-xs text-fog mt-1">Introduction to Computer Science</p>
                <p className="text-[10px] uppercase font-bold text-blue-500 mt-2">Read Now</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold uppercase tracking-widest text-fog">Coming Up</h2>
          <div className="card p-6 bg-jgai text-white">
            <p className="text-xs uppercase tracking-widest opacity-60 mb-2">Next Class</p>
            <p className="text-lg font-bold italic">CS101: Lecture 4</p>
            <p className="text-sm mt-4 opacity-80">Monday, 10:00 AM - 11:30 AM</p>
            <p className="text-xs mt-1 opacity-60">Room 402, Science Block</p>
          </div>
        </div>
      </div>
    </div>
  );
}
