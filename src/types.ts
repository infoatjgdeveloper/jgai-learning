export type UserRole = 'student' | 'instructor' | 'admin';

export interface University {
  id: string;
  name: string;
  code: string;
  logo?: string;
  adminId: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: UserRole;
  universityId: string;
  createdAt: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  universityId: string;
  courseCode: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  term: string;
  isPublished: boolean;
  thumbnail?: string;
  type: 'institutional' | 'personal';
  price?: number;
  level: CourseLevel;
  subject: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  points: number;
  dueDate: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  grade?: number;
  feedback?: string;
  submittedAt: string;
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  videoUrl?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface AIChat {
  id: string;
  userId: string;
  courseId: string;
  messages: ChatMessage[];
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
