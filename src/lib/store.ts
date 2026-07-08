import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface QuizQuestion { q: string; options: string[]; answer: number; }
export interface StoredWeek { week: number; title: string; topics: string[]; assignment: string; hours: number; }
export interface StoredProgram {
  name: string; tagline: string; durationWeeks: number; creditHours: number;
  weeks: StoredWeek[]; enrolledAt: string; completedWeeks: number[];
  quizScores: Record<number, number>;
  certificateId?: string;
  intake: { topic: string; goal: string; hoursPerWeek: number; days: string[]; pace: string; level: string; style: string };
}
export interface StudentRecord { credits: number; programs: StoredProgram[]; }

const DEFAULT: StudentRecord = { credits: 300, programs: [] };
const LS_KEY = 'jgai_record';

function loadLocal(): StudentRecord {
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') }; } catch { return { ...DEFAULT }; }
}
function saveLocal(r: StudentRecord) { localStorage.setItem(LS_KEY, JSON.stringify(r)); }

export async function loadRecord(uid: string | null): Promise<StudentRecord> {
  if (!uid) return loadLocal();
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    const data = snap.exists() ? (snap.data() as { jgaiRecord?: StudentRecord }) : {};
    if (data.jgaiRecord) return { ...DEFAULT, ...data.jgaiRecord };
    const local = loadLocal();
    await setDoc(doc(db, 'users', uid), { jgaiRecord: local }, { merge: true });
    return local;
  } catch (e) {
    console.warn('Firestore load failed, using local:', e);
    return loadLocal();
  }
}

export async function saveRecord(uid: string | null, r: StudentRecord): Promise<void> {
  saveLocal(r);
  if (!uid) return;
  try {
    await setDoc(doc(db, 'users', uid), { jgaiRecord: r }, { merge: true });
  } catch (e) {
    console.warn('Firestore save failed (kept locally):', e);
  }
}

export function gradeLetter(score: number): { letter: string; points: number } {
  if (score >= 93) return { letter: 'A', points: 4.0 };
  if (score >= 90) return { letter: 'A-', points: 3.7 };
  if (score >= 87) return { letter: 'B+', points: 3.3 };
  if (score >= 83) return { letter: 'B', points: 3.0 };
  if (score >= 80) return { letter: 'B-', points: 2.7 };
  if (score >= 77) return { letter: 'C+', points: 2.3 };
  if (score >= 70) return { letter: 'C', points: 2.0 };
  if (score >= 60) return { letter: 'D', points: 1.0 };
  return { letter: 'F', points: 0 };
}

export function programGPA(p: StoredProgram): { gpa: number | null; letter: string } {
  const scores = Object.values(p.quizScores || {});
  if (!scores.length) return { gpa: null, letter: 'IP' };
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const g = gradeLetter(avg);
  return { gpa: g.points, letter: g.letter };
}

export function makeCertPayload(p: StoredProgram, studentName: string): string {
  const payload = {
    n: studentName, p: p.name, ch: p.creditHours,
    d: new Date().toISOString().slice(0, 10), id: p.certificateId,
    g: programGPA(p).letter
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}
