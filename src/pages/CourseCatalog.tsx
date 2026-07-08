import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, addDoc, or, and } from 'firebase/firestore';
import { db, handleFirestoreError } from '../firebase';
import { Course, OperationType, CourseLevel } from '../types';
import { useAuth } from '../AuthContext';
import { Search, Filter, BookOpen, User, ArrowRight, Layers, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get('type') as 'institutional' | 'personal' | null;
  const levelFilter = searchParams.get('level') as CourseLevel | null;
  const subjectFilter = searchParams.get('subject');
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Query for courses that are published
    // If user is logged in AND has universityId, show personal OR same university
    // If logged in but NO universityId, show personal
    // If NOT logged in, show ONLY personal
    let q;
    if (profile) {
      if (profile.universityId) {
        q = query(
          collection(db, 'courses'), 
          and(
            where('isPublished', '==', true),
            or(
              where('type', '==', 'personal'),
              where('universityId', '==', profile.universityId)
            )
          )
        );
      } else {
        q = query(
          collection(db, 'courses'),
          and(
            where('isPublished', '==', true),
            where('type', '==', 'personal')
          )
        );
      }
    } else {
      q = query(
        collection(db, 'courses'),
        and(
          where('isPublished', '==', true),
          where('type', '==', 'personal')
        )
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'courses');
    });

    return () => unsubscribe();
  }, [profile]);

  const handleEnroll = async (courseId: string) => {
    if (!profile) {
      navigate('/login');
      return;
    }

    try {
      await addDoc(collection(db, 'enrollments'), {
        studentId: profile.uid,
        courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0
      });
      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'enrollments');
    }
  };

  const subjects = Array.from(new Set(courses.map(c => c.subject).filter(Boolean)));

  const filteredCourses = courses.filter(c => {
    const title = c.title || '';
    const courseCode = c.courseCode || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (c.subject && c.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !typeFilter || c.type === typeFilter;
    const matchesLevel = !levelFilter || c.level === levelFilter;
    const matchesSubject = !subjectFilter || c.subject === subjectFilter;
    
    // Institutional courses only visible to members of the same university
    const isVisibleInstitutional = c.type === 'institutional' && profile?.universityId === c.universityId;
    const isVisiblePersonal = c.type === 'personal';
    
    return matchesSearch && matchesType && matchesLevel && matchesSubject && (isVisibleInstitutional || isVisiblePersonal);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-olive-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-5xl font-bold italic">Explore Knowledge</h1>
        <p className="text-gray-500">Discover courses from India's top educators and start your learning journey today.</p>
        
        <div className="flex flex-col gap-6 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses, subjects, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-full shadow-sm focus:ring-2 focus:ring-olive-accent transition-all outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-full">
              {[
                { id: null, label: 'All Types' },
                { id: 'institutional', label: 'University' },
                { id: 'personal', label: 'Personal' }
              ].map(tab => (
                <button
                  key={tab.id || 'all-types'}
                  onClick={() => {
                    if (tab.id) searchParams.set('type', tab.id);
                    else searchParams.delete('type');
                    setSearchParams(searchParams);
                  }}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    typeFilter === tab.id
                      ? 'bg-white text-olive-accent shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 p-1 bg-gray-100 rounded-full">
              {[
                { id: null, label: 'All Levels' },
                { id: 'Beginner', label: 'Beginner' },
                { id: 'Intermediate', label: 'Intermediate' },
                { id: 'Advanced', label: 'Advanced' }
              ].map(tab => (
                <button
                  key={tab.id || 'all-levels'}
                  onClick={() => {
                    if (tab.id) searchParams.set('level', tab.id);
                    else searchParams.delete('level');
                    setSearchParams(searchParams);
                  }}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    levelFilter === tab.id
                      ? 'bg-white text-olive-accent shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {subjects.length > 0 && (
              <select
                value={subjectFilter || ''}
                onChange={(e) => {
                  if (e.target.value) searchParams.set('subject', e.target.value);
                  else searchParams.delete('subject');
                  setSearchParams(searchParams);
                }}
                className="px-4 py-2 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600 outline-none focus:ring-2 focus:ring-olive-accent transition-all"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <BookOpen size={40} />
            </div>
            <h3 className="text-2xl font-bold italic">No courses found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">We couldn't find any courses matching your criteria. Try adjusting your search or filters.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                searchParams.delete('type');
                searchParams.delete('level');
                searchParams.delete('subject');
                setSearchParams(searchParams);
              }}
              className="text-olive-accent font-bold uppercase tracking-widest text-xs hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isInstitutional = course.type === 'institutional';
            const themeColor = isInstitutional ? 'olive-accent' : 'indigo-500';
            return (
              <motion.div
                key={course.id}
                whileHover={{ y: -8 }}
                className="card group overflow-hidden p-0 flex flex-col"
              >
                <div className="relative h-48">
                  <img 
                    src={course.thumbnail || `https://picsum.photos/seed/${course.id}/800/600`} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-bold uppercase tracking-widest text-white bg-${themeColor} px-3 py-1.5 rounded-full shadow-lg`}>
                      {course.courseCode}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                      <Tag size={12} /> {course.subject}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                      <Layers size={12} /> {course.level}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold italic leading-tight group-hover:text-${themeColor} transition-colors`}>
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 bg-warm-off-white rounded-full flex items-center justify-center text-${themeColor}`}>
                        <User size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {course.term}
                      </span>
                    </div>
                    {!isInstitutional && (
                      <span className="text-sm font-bold text-indigo-600">
                        {course.price === 0 ? 'FREE' : `₹${course.price}`}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className={`p-4 bg-${themeColor} text-white text-center text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                >
                  Enroll Now <ArrowRight size={18} />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
