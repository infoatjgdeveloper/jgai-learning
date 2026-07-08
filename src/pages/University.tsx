import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GraduationCap, Sparkles, BookOpen, Award, ChevronRight, Loader2, CheckCircle2, Circle, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { askClaude, askClaudeJSON } from '../lib/ai';

interface ProgramWeek {
  week: number;
  title: string;
  topics: string[];
  assignment: string;
}

interface ProgramPlan {
  name: string;
  tagline: string;
  durationWeeks: number;
  weeks: ProgramWeek[];
}

interface EnrolledProgram extends ProgramPlan {
  enrolledAt: string;
  completedWeeks: number[];
}

const FEATURED = [
  { name: 'MBA', desc: 'Business strategy, finance, marketing, leadership — a full MBA-style curriculum.', emoji: 'briefcase' },
  { name: 'Computer Science', desc: 'From programming fundamentals to systems, algorithms and AI.', emoji: 'cpu' },
  { name: 'Data Science', desc: 'Statistics, Python, machine learning and real-world projects.', emoji: 'chart' },
  { name: 'Digital Marketing', desc: 'SEO, content, paid media, analytics and brand strategy.', emoji: 'megaphone' }
];

function getCredits(): number {
  const v = localStorage.getItem('jgai_credits');
  if (v === null) { localStorage.setItem('jgai_credits', '100'); return 100; }
  return parseInt(v, 10) || 0;
}

function programCost(weeks: number): number {
  return Math.min(900, Math.max(40, weeks * 25));
}

function loadEnrolled(): EnrolledProgram[] {
  try {
    return JSON.parse(localStorage.getItem('jgai_programs') || '[]');
  } catch {
    return [];
  }
}

function saveEnrolled(programs: EnrolledProgram[]) {
  localStorage.setItem('jgai_programs', JSON.stringify(programs));
}

export function University() {
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState(searchParams.get('topic') || '');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState<EnrolledProgram[]>(loadEnrolled);
  const [active, setActive] = useState<EnrolledProgram | null>(null);
  const [lecture, setLecture] = useState('');
  const [lectureWeek, setLectureWeek] = useState<number | null>(null);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [credits, setCredits] = useState(getCredits);

  useEffect(() => {
    const t = searchParams.get('topic');
    if (t) setTopic(t);
  }, [searchParams]);

  const generateProgram = async (name: string) => {
    setGenerating(true);
    setError('');
    try {
      const plan = await askClaudeJSON<ProgramPlan>({
        system:
          'You are the JGAI University curriculum designer. Design rigorous, university-grade programs from free online resources.',
        prompt: `Design a certificate program for: "${name}".
Return JSON: { "name": string, "tagline": string, "durationWeeks": number (8-16), "weeks": [{ "week": number, "title": string, "topics": [3-5 strings], "assignment": string }] }.
Make it feel like a real university course sequence with progressive difficulty.`,
        maxTokens: 4000
      });
      const cost = programCost(plan.durationWeeks);
      if (credits < cost) {
        setError(`This program costs ${cost} credits — you have ${credits}. Top up on the Pricing page.`);
        setGenerating(false);
        return;
      }
      const newBalance = credits - cost;
      localStorage.setItem('jgai_credits', String(newBalance));
      setCredits(newBalance);
      const program: EnrolledProgram = { ...plan, enrolledAt: new Date().toISOString(), completedWeeks: [] };
      const next = [...enrolled.filter((p) => p.name !== program.name), program];
      setEnrolled(next);
      saveEnrolled(next);
      setActive(program);
      setTopic('');
    } catch (e) {
      setError('Could not generate the program. Make sure the AI key is configured, then try again.');
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const openLecture = async (program: EnrolledProgram, week: ProgramWeek) => {
    setLectureWeek(week.week);
    setLectureLoading(true);
    setLecture('');
    try {
      const text = await askClaude({
        system:
          'You are a JGAI University professor delivering a written lecture. Structure: brief intro, core concepts with clear explanations and examples, recommended free videos/materials to search for (name specific creators or courses), and a short summary. Use markdown.',
        messages: [
          {
            role: 'user',
            content: `Program: ${program.name}. Week ${week.week}: ${week.title}. Topics: ${week.topics.join(', ')}. Deliver this week's lecture.`
          }
        ],
        maxTokens: 3000
      });
      setLecture(text);
    } catch {
      setLecture('Lecture unavailable right now — try again shortly.');
    } finally {
      setLectureLoading(false);
    }
  };

  const toggleWeek = (program: EnrolledProgram, week: number) => {
    const done = program.completedWeeks.includes(week);
    const updated = {
      ...program,
      completedWeeks: done ? program.completedWeeks.filter((w) => w !== week) : [...program.completedWeeks, week]
    };
    const next = enrolled.map((p) => (p.name === program.name ? updated : p));
    setEnrolled(next);
    saveEnrolled(next);
    setActive(updated);
  };

  if (active) {
    const progress = Math.round((active.completedWeeks.length / active.weeks.length) * 100);
    const complete = progress === 100;
    return (
      <div className="space-y-8 sans">
        <button onClick={() => { setActive(null); setLecture(''); setLectureWeek(null); }} className="text-sm text-fog hover:text-jgai-bright transition-colors">
          ← All programs
        </button>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="tag mb-3"><GraduationCap size={13} /> JGAI Program</div>
            <h1 className="text-5xl font-semibold display">{active.name}</h1>
            <p className="text-fog mt-2">{active.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-semibold display text-jgai">{progress}%</p>
            <p className="text-xs uppercase tracking-widest text-fog">complete</p>
          </div>
        </div>

        {complete && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="panel grid-bg text-snow rounded-[32px] p-10 text-center space-y-3">
            <Award size={40} className="mx-auto opacity-90" />
            <h2 className="text-3xl font-semibold display">JGAI Certificate earned</h2>
            <p className="opacity-70 text-sm max-w-md mx-auto">
              You completed the full {active.name} program — {active.weeks.length} weeks of university-grade curriculum, certified by JGAI Learning.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {active.weeks.map((w) => {
              const done = active.completedWeeks.includes(w.week);
              return (
                <div key={w.week} className={`card !p-5 space-y-2 ${lectureWeek === w.week ? '!border-jgai' : ''}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleWeek(active, w.week)} className="mt-0.5 text-jgai-bright shrink-0" aria-label="Mark complete">
                      {done ? <CheckCircle2 size={20} /> : <Circle size={20} className="text-edge-2" />}
                    </button>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs uppercase tracking-widest text-fog">Week {w.week}</p>
                      <p className={`font-medium ${done ? 'line-through text-fog' : ''}`}>{w.title}</p>
                      <p className="text-xs text-fog mt-1">{w.topics.join(' · ')}</p>
                      <p className="text-xs text-fog mt-1.5"><span className="font-semibold">Homework:</span> {w.assignment}</p>
                    </div>
                    <button
                      onClick={() => openLecture(active, w)}
                      className="flex items-center gap-1 text-xs font-semibold text-jgai-bright bg-jgai/15 px-3 py-1.5 rounded-full hover:bg-jgai hover:text-white transition-colors shrink-0"
                    >
                      Lecture <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card !p-7 min-h-[300px] lg:sticky lg:top-24 self-start max-h-[80vh] overflow-y-auto">
            {lectureLoading ? (
              <div className="flex items-center gap-2 text-fog text-sm">
                <Loader2 size={16} className="animate-spin" /> Professor JGAI is preparing the lecture…
              </div>
            ) : lecture ? (
              <div className="markdown-body text-[15px]"><ReactMarkdown>{lecture}</ReactMarkdown></div>
            ) : (
              <div className="text-fog text-sm flex items-center gap-2">
                <BookOpen size={16} /> Select a week's lecture to begin.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-14 sans">
      <div className="text-center space-y-6 pt-6">
        <div className="tag mx-auto"><GraduationCap size={13} /> JGAI University</div>
        <h1 className="text-6xl font-bold">Enroll in <span className="glow-text">anything</span>.</h1>
        <p className="text-fog max-w-xl mx-auto">
          Pick a program or type your own. JGAI designs the full university-grade curriculum —
          weekly lectures, homework, exams and a JGAI certificate. Priced in credits by length and depth.
        </p>
        <div className="tag mx-auto"><Coins size={13} /> Balance: {credits} credits</div>
        <div className="flex items-center gap-2 max-w-lg mx-auto panel rounded-full border-edge-2 p-1.5 pl-6 focus-within:border-jgai transition-colors">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && topic.trim() && generateProgram(topic)}
            placeholder="e.g. MBA (~400 cr), Cybersecurity, UX Design…"
            className="flex-grow bg-transparent outline-none"
          />
          <button
            onClick={() => topic.trim() && generateProgram(topic)}
            disabled={generating}
            className="olive-button whitespace-nowrap flex items-center gap-2 disabled:opacity-60"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {generating ? 'Designing…' : 'Create program'}
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {enrolled.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold display">Your programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolled.map((p) => {
              const progress = Math.round((p.completedWeeks.length / p.weeks.length) * 100);
              return (
                <button key={p.name} onClick={() => setActive(p)} className="card text-left space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold display">{p.name}</h3>
                    <span className="text-sm font-semibold text-jgai">{progress}%</span>
                  </div>
                  <p className="text-sm text-fog">{p.tagline}</p>
                  <div className="h-1.5 bg-jgai/15 rounded-full overflow-hidden">
                    <div className="h-full bg-jgai rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold display">Featured programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED.map((f) => (
            <button
              key={f.name}
              onClick={() => generateProgram(f.name)}
              disabled={generating}
              className="card text-left space-y-3 hover:-translate-y-1 disabled:opacity-60"
            >
              <div className="w-10 h-10 bg-jgai/15 rounded-xl flex items-center justify-center text-jgai">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-lg font-semibold display">{f.name}</h3>
              <p className="text-xs text-fog leading-relaxed">{f.desc}</p>
              <p className="text-xs font-semibold text-jgai-bright flex items-center gap-1">
                Enroll · from 200 credits <ChevronRight size={12} />
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
