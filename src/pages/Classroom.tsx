import React, { useState, useEffect, useCallback } from 'react';
import { School, Link2, RefreshCw, Sparkles, CheckCircle2, AlertCircle, LogOut, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { askClaude } from '../lib/ai';

interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
}

interface CanvasAssignment {
  id: number;
  name: string;
  description: string | null;
  due_at: string | null;
  points_possible: number;
  html_url: string;
}

interface CanvasConn {
  baseUrl: string;
  token: string;
}

async function canvasFetch<T>(conn: CanvasConn, path: string): Promise<T> {
  const res = await fetch('/api/canvas', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...conn, path })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Canvas request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function Classroom() {
  const [conn, setConn] = useState<CanvasConn | null>(() => {
    const saved = localStorage.getItem('jgai_canvas');
    return saved ? JSON.parse(saved) : null;
  });
  const [baseUrl, setBaseUrl] = useState('');
  const [token, setToken] = useState('');
  const [courses, setCourses] = useState<CanvasCourse[]>([]);
  const [selected, setSelected] = useState<CanvasCourse | null>(null);
  const [assignments, setAssignments] = useState<CanvasAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiHelp, setAiHelp] = useState<Record<number, string>>({});
  const [aiLoading, setAiLoading] = useState<number | null>(null);

  const loadCourses = useCallback(async (c: CanvasConn) => {
    setLoading(true);
    setError('');
    try {
      const data = await canvasFetch<CanvasCourse[]>(c, '/api/v1/courses?enrollment_state=active&per_page=50');
      setCourses(data.filter((x) => x.name));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (conn) loadCourses(conn);
  }, [conn, loadCourses]);

  const connect = () => {
    if (!baseUrl.trim() || !token.trim()) return;
    const normalized = baseUrl.trim().replace(/\/$/, '');
    const c = { baseUrl: normalized.startsWith('http') ? normalized : `https://${normalized}`, token: token.trim() };
    localStorage.setItem('jgai_canvas', JSON.stringify(c));
    setConn(c);
  };

  const disconnect = () => {
    localStorage.removeItem('jgai_canvas');
    setConn(null);
    setCourses([]);
    setSelected(null);
    setAssignments([]);
  };

  const openCourse = async (course: CanvasCourse) => {
    if (!conn) return;
    setSelected(course);
    setAssignments([]);
    setLoading(true);
    try {
      const data = await canvasFetch<CanvasAssignment[]>(
        conn,
        `/api/v1/courses/${course.id}/assignments?per_page=50&order_by=due_at`
      );
      setAssignments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const helpWith = async (a: CanvasAssignment) => {
    setAiLoading(a.id);
    try {
      const text = await askClaude({
        system:
          'You are the JGAI study assistant inside a student classroom. Help the student understand the assignment and plan how to complete it. Give: 1) a plain-language summary of what is being asked, 2) a step-by-step plan, 3) key concepts to review. Be concise. Never do the work for them in a way that violates academic integrity — guide them.',
        messages: [
          {
            role: 'user',
            content: `Course: ${selected?.name}\nAssignment: ${a.name}\nPoints: ${a.points_possible}\nDue: ${a.due_at || 'n/a'}\nDescription (may contain HTML): ${(a.description || 'No description').slice(0, 4000)}`
          }
        ]
      });
      setAiHelp((prev) => ({ ...prev, [a.id]: text }));
    } catch {
      setAiHelp((prev) => ({ ...prev, [a.id]: 'AI is unavailable right now. Try again shortly.' }));
    } finally {
      setAiLoading(null);
    }
  };

  if (!conn) {
    return (
      <div className="max-w-xl mx-auto sans">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card space-y-6 p-8">
          <div className="w-12 h-12 bg-mint rounded-2xl flex items-center justify-center text-mint-deep">
            <School size={24} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold serif">Connect your classroom</h1>
            <p className="text-gray-500 leading-relaxed">
              Sync your real school courses from Canvas. In Canvas go to Account → Settings → New access token,
              then paste it here with your school's Canvas URL.
            </p>
          </div>
          <div className="space-y-3">
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="yourschool.instructure.com"
              className="w-full border border-[#e3e1da] rounded-2xl px-5 py-3.5 outline-none focus:border-jgai transition-colors bg-white"
            />
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              placeholder="Canvas access token"
              className="w-full border border-[#e3e1da] rounded-2xl px-5 py-3.5 outline-none focus:border-jgai transition-colors bg-white"
            />
            <button onClick={connect} className="olive-button w-full flex items-center justify-center gap-2">
              <Link2 size={16} />
              Connect Canvas
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Your token is stored only in your browser and sent directly to your school's Canvas — never saved on our servers.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sans">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="tag mb-3" style={{ background: 'var(--color-mint)', color: 'var(--color-mint-deep)' }}>
            <School size={13} /> Classroom
          </div>
          <h1 className="text-5xl font-semibold serif">Your school, synced.</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadCourses(conn)} className="ghost-button flex items-center gap-2 text-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={disconnect} className="ghost-button flex items-center gap-2 text-sm text-red-500">
            <LogOut size={14} /> Disconnect
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-2xl text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Courses</p>
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => openCourse(c)}
              className={`card w-full text-left flex items-center gap-3 !p-4 ${
                selected?.id === c.id ? '!border-jgai' : ''
              }`}
            >
              <BookOpen size={18} className="text-jgai shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{c.name}</p>
                <p className="text-xs text-gray-400">{c.course_code}</p>
              </div>
            </button>
          ))}
          {!loading && courses.length === 0 && <p className="text-sm text-gray-400">No active courses found.</p>}
        </div>

        <div className="lg:col-span-2 space-y-3">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            {selected ? `Assignments — ${selected.name}` : 'Select a course'}
          </p>
          {selected &&
            assignments.map((a) => (
              <div key={a.id} className="card space-y-3 !p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <a href={a.html_url} target="_blank" rel="noreferrer" className="font-medium hover:text-jgai transition-colors">
                      {a.name}
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      {a.points_possible} pts · {a.due_at ? `Due ${new Date(a.due_at).toLocaleDateString()}` : 'No due date'}
                    </p>
                  </div>
                  <button
                    onClick={() => helpWith(a)}
                    disabled={aiLoading === a.id}
                    className="flex items-center gap-1.5 text-xs font-semibold text-jgai bg-jgai-soft px-3.5 py-2 rounded-full hover:bg-jgai hover:text-white transition-colors disabled:opacity-50 shrink-0"
                  >
                    <Sparkles size={13} />
                    {aiLoading === a.id ? 'Thinking…' : 'AI help'}
                  </button>
                </div>
                {aiHelp[a.id] && (
                  <div className="bg-paper rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap border border-[#edece7]">
                    {aiHelp[a.id]}
                  </div>
                )}
              </div>
            ))}
          {selected && !loading && assignments.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 size={16} /> No assignments in this course.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
