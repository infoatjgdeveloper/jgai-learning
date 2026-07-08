import { collection, serverTimestamp, getDocs, query, where, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

const SAMPLE_UNIVERSITY = {
  id: 'bharat-univ-001',
  name: "Bharat Institute of Technology",
  code: "BIT-001",
  logo: "https://picsum.photos/seed/univ/200/200",
  adminId: "system"
};

const INITIAL_COURSES = [
  {
    id: 'course-cs101',
    courseCode: "CS101",
    title: "Introduction to Computer Science",
    description: "Foundational concepts of computing, algorithms, and programming using Python.",
    instructorId: "system",
    instructorName: "Dr. A.K. Singh",
    universityId: SAMPLE_UNIVERSITY.id,
    term: "Fall 2026",
    isPublished: true,
    thumbnail: "https://picsum.photos/seed/cs101/800/600",
    type: "institutional",
    level: "Beginner",
    subject: "Computer Science"
  },
  {
    id: 'course-his202',
    courseCode: "HIS202",
    title: "Ancient Indian Civilizations",
    description: "A deep dive into the Indus Valley, Vedic period, and the rise of major empires in ancient India.",
    instructorId: "system",
    instructorName: "Prof. Meena Iyer",
    universityId: SAMPLE_UNIVERSITY.id,
    term: "Fall 2026",
    isPublished: true,
    thumbnail: "https://picsum.photos/seed/his202/800/600",
    type: "institutional",
    level: "Intermediate",
    subject: "History"
  },
  {
    id: 'course-skill001',
    courseCode: "SKILL-001",
    title: "Public Speaking & Leadership",
    description: "Master the art of communication and lead with confidence in any environment.",
    instructorId: "system",
    instructorName: "Rahul Sharma",
    universityId: "personal",
    term: "Self-Paced",
    isPublished: true,
    thumbnail: "https://picsum.photos/seed/skill1/800/600",
    type: "personal",
    level: "Beginner",
    subject: "Soft Skills",
    price: 0
  },
  {
    id: 'course-skill002',
    courseCode: "SKILL-002",
    title: "Financial Literacy for Students",
    description: "Learn how to manage your money, invest early, and build long-term wealth.",
    instructorId: "system",
    instructorName: "Anjali Gupta",
    universityId: "personal",
    term: "Self-Paced",
    isPublished: true,
    thumbnail: "https://picsum.photos/seed/skill2/800/600",
    type: "personal",
    level: "Beginner",
    subject: "Finance",
    price: 499
  }
];

export async function seedData(user: User | null) {
  // Only seed if authenticated and admin
  if (!user || user.email?.toLowerCase() !== "gajjarjay79@gmail.com") return;

  const univSnap = await getDoc(doc(db, 'universities', SAMPLE_UNIVERSITY.id));
  if (univSnap.exists()) return;

  console.log('Seeding institutional data...');
  
  // Create University
  await setDoc(doc(db, 'universities', SAMPLE_UNIVERSITY.id), SAMPLE_UNIVERSITY);

  for (const { id, ...courseData } of INITIAL_COURSES) {
    await setDoc(doc(db, 'courses', id), {
      ...courseData,
      createdAt: serverTimestamp()
    });

    // Add sample announcements
    const annId = `ann-${id}-1`;
    await setDoc(doc(db, 'courses', id, 'announcements', annId), {
      courseId: id,
      title: "Welcome to the Course!",
      content: "Welcome everyone! Please check the syllabus and introduce yourselves in the discussion forum.",
      authorId: "system",
      createdAt: new Date().toISOString()
    });

    // Add sample assignments
    const assId = `ass-${id}-1`;
    await setDoc(doc(db, 'courses', id, 'assignments', assId), {
      courseId: id,
      title: "Assignment 1: Foundations",
      description: "Submit a 500-word summary of the first week's readings.",
      points: 100,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    });
  }
  console.log('Seeding complete.');
}
