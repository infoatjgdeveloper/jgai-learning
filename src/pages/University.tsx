import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GraduationCap, Sparkles, BookOpen, ChevronRight, Loader2, CheckCircle2, Circle, Coins, CalendarDays, Clock, Target, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { askClaude, askClaudeJSON } from '../lib/ai';
import { useAuth } from '../AuthContext';
import { Certificate } from '../components/Certificate';

interface ProgramWeek { week: number; title: string; topics: string[]; assignment: string; hours: number; }
interface ProgramPlan { name: string; tagline: string; durationWeeks: number; creditHours: number; weeks: ProgramWeek[]; }
interface Intake {
  topic: string; goal: string; hoursPerWeek: number; days: string[];
  pace: string; level: string; style: string;
}
interface EnrolledProgram extends ProgramPlan { enrolledAt: string; completedWeeks: number[]; intake: Intake; }

const TUITION_PER_CREDIT_HOUR = 25; // JGAI credits per academic credit hour (Carnegie: 1 credit hour ≈ 15 instruction hours)

const FEATURED = [
  { name: 'MBA', desc: 'Strategy, finance, marketing, operations, leadership — full business curriculum.', ch: '36 credit hours' },
  { name: 'Computer Science', desc: 'Programming, algorithms, systems, databases and AI foundations.', ch: '32 credit hours' },
  { name: 'Data Science', desc: 'Statistics, Python, ML and applied capstone projects.', ch: '24 credit hours' },
  { name: 'Digital Marketing', desc: 'SEO, content, paid media, analytics, brand strategy.', ch: '16 credit hours' }
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getCredits(): number {
  const v = localStorage.getItem('jgai_credits');
  if (v === null) { localStorage.setItem('jgai_credits', '300'); return 300; }
  return parseInt(v, 10) || 0;
}
function loadEnrolled(): EnrolledProgram[] {
  try { return JSON.parse(localStorage.getItem('jgai_programs') || '[]'); } catch { return []; }
}
function saveEnrolled(p: EnrolledProgram[]) { localStorage.setItem('jgai_programs', JSON.stringify(p)); }

export function University() {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const [phase, setPhase] = useState<'browse' | 'intake' | 'generating' | 'program'>('browse');
  const [intake, setIntake] = useState<Intake>({
    topic: searchParams.get('topic') || '', goal: '', hoursPerWeek: 8,
    days: ['Mon', 'Wed', 'Fri'], pace: 'Standard', level: 'Beginner', style: 'Mixed'
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [enrolled, setEnrolled] = useState<EnrolledProgram[]>(loadEnrolled);
  const [active, setActive] = useState<EnrolledProgram | null>(null);
  const [credits, setCredits] = useState(getCredits);
  const [lecture, setLecture] = useState('');
  const [lectureWeek, setLectureWeek] = useState<number | null>(null);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [showSampleCert, setShowSampleCert] = useState(false);

  const startIntake = (topic: string) => {
    setIntake((i) => ({ ...i, topic }));
    setStep(0);
    setError('');
    setPhase('intake');
  };

  const toggleDay = (d: string) =>
    setIntake((i) => ({ ...i, days: i.days.includes(d) ? i.days.filter((x) => x !== d) : [...i.days, d] }));

  const generateProgram = async () => {
    setPhase('generating');
    setError('');
    try {
      const plan = await askClaudeJSON<ProgramPlan>({
        system: 'You are the JGAI University registrar and curriculum designer. Design rigorous, personalized, university-grade programs. Credit hours follow the Carnegie unit: 1 credit hour ≈ 15 hours of instruction.',
        prompt: `Design a personalized certificate program.
Student profile:
- Subject: "${intake.topic}"
- Goal: "${intake.goal || 'general mastery'}"
- Available: ${intake.hoursPerWeek} hours/week on ${intake.days.join(', ')}
- Pace: ${intake.pace}. Current level: ${intake.level}. Preferred learning style: ${intake.style}.
Compute durationWeeks and creditHours realistically from their availability (total hours / 15 ≈ creditHours, round sensibly, min 4, max 40).
Return JSON: { "name": string, "tagline": string, "durationWeeks": number, "creditHours": number, "weeks": [{ "week": number, "title": string, "topics": [3-5 strings], "assignment": string, "hours": number }] }`,
        maxTokens: 4000
      });
      const tuition = plan.creditHours * TUITION_PER_CREDIT_HOUR;
      if (credits < tuition) {
        setError(`Tuition for this program is ${tuition} credits (${plan.creditHours} credit hours × ${TUITION_PER_CREDIT_HOUR}). Your balance: ${credits}. Add credits on the Pricing page.`);
        setPhase('intake');
        return;
      }
      const bal = credits - tuition;
      localStorage.setItem('jgai_credits', String(bal));
      setCredits(bal);
      const program: EnrolledProgram = { ...plan, enrolledAt: new Date().toISOString(), completedWeeks: [], intake };
      const next = [...enrolled.filter((p) => p.name !== program.name), program];
      setEnrolled(next);
      saveEnrolled(next);
      setActive(program);
      setPhase('program');
    } catch (e) {
      console.error(e);
      setError('Program generation failed. Check that the AI key is configured, then try again.');
      setPhase('intake');
    }
  };

  const openLecture = async (program: EnrolledProgram, week: ProgramWeek) => {
    setLectureWeek(week.week);
    setLectureLoading(true);
    setLecture('');
    try {
      const text = await askClaude({
        system: `You are a JGAI University professor. The student's level is ${program.intake.level}, style preference ${program.intake.style}. Deliver a written lecture: intro, core concepts with examples, specific free resources to search (name creators/courses), practice prompts, summary. Use markdown.`,
        messages: [{ role: 'user', content: `Program: ${program.name}. Week ${week.week}: ${week.title}. Topics: ${week.topics.join(', ')}. Deliver this week's lecture (~${week.hours} study hours).` }],
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
    const updated = { ...program, completedWeeks: done ? program.completedWeeks.filter((w) => w !== week) : [...program.completedWeeks, week] };
    const next = enrolled.map((p) => (p.name === program.name ? updated : p));
    setEnrolled(next);
    saveEnrolled(next);
    setActive(updated);
  };

  /* ---------- intake wizard ---------- */
  if (phase === 'intake' || phase === 'generating') {
    const tuitionEstimate = Math.round((intake.hoursPerWeek * 12) / 15) * TUITION_PER_CREDIT_HOUR;
    const steps = [
      {
        title: 'What do you want to study?',
        body: (
          <div className="space-y-4">
            <input value={intake.topic} onChange={(e) => setIntake({ ...intake, topic: e.target.value })} placeholder="e.g. MBA, Machine Learning, UX Design" className="input-dark text-lg" autoFocus />
            <textarea value={intake.goal} onChange={(e) => setIntake({ ...intake, goal: e.target.value })} placeholder="Your goal — e.g. 'switch careers into product management within a year'" className="input-dark min-h-[90px]" />
          </div>
        ),
        valid: intake.topic.trim().length > 1
      },
      {
        title: 'Your weekly schedule',
        body: (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-fog mb-2 flex items-center gap-1.5"><Clock size={14} /> Hours per week: <span className="font-bold text-snow">{intake.hoursPerWeek}h</span></p>
              <input type="range" min={2} max={30} value={intake.hoursPerWeek} onChange={(e) => setIntake({ ...intake, hoursPerWeek: +e.target.value })} className="w-full accent-[#1d5fd6]" />
            </div>
            <div>
              <p className="text-sm text-fog mb-2 flex items-center gap-1.5"><CalendarDays size={14} /> Study days</p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button key={d} onClick={() => toggleDay(d)} className={`choice ${intake.days.includes(d) ? 'active' : ''}`}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        ),
        valid: intake.days.length > 0
      },
      {
        title: 'How do you learn best?',
        body: (
          <div className="space-y-6">
            {[
              ['Pace', 'pace', ['Relaxed', 'Standard', 'Intensive']],
              ['Current level', 'level', ['Beginner', 'Intermediate', 'Advanced']],
              ['Learning style', 'style', ['Video-first', 'Reading', 'Projects', 'Mixed']]
            ].map(([label, key, opts]) => (
              <div key={label as string}>
                <p className="text-sm text-fog mb-2">{label as string}</p>
                <div className="flex flex-wrap gap-2">
                  {(opts as string[]).map((o) => (
                    <button key={o} onClick={() => setIntake({ ...intake, [key as string]: o })} className={`choice ${(intake as unknown as Record<string, string>)[key as string] === o ? 'active' : ''}`}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ),
        valid: true
      }
    ];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => setPhase('browse')} className="text-sm text-fog hover:text-jgai flex items-center gap-1"><ArrowLeft size={14} /> Programs</button>
        <div className="panel p-8 md:p-10 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="tag"><Target size={12} /> Enrollment — step {step + 1} of 3</div>
              <span className="text-[12px] text-fog flex items-center gap-1"><Coins size={13} /> Balance: {credits} cr</span>
            </div>
            <div className="h-1.5 bg-panel-2 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${((step + 1) / 3) * 100}%`, background: 'linear-gradient(90deg,#1d5fd6,#0e7490)' }} />
            </div>
          </div>

          {phase === 'generating' ? (
            <div className="text-center py-10 space-y-4">
              <Loader2 size={32} className="animate-spin text-jgai mx-auto" />
              <p className="font-semibold text-lg">The registrar is building your program…</p>
              <p className="text-sm text-fog">Curriculum, weekly schedule and credit hours — personalized to {intake.hoursPerWeek}h/week on {intake.days.join(', ')}.</p>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                <h1 className="text-3xl font-bold">{steps[step].title}</h1>
                {steps[step].body}
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
              <div className="flex justify-between items-center">
                <button onClick={() => (step === 0 ? setPhase('browse') : setStep(step - 1))} className="ghost-button text-sm">Back</button>
                <div className="text-right">
                  {step === 2 && <p className="text-[12px] text-fog mb-2">Estimated tuition: ~{tuitionEstimate} credits ({TUITION_PER_CREDIT_HOUR} cr / credit hour)</p>}
                  <button
                    disabled={!steps[step].valid}
                    onClick={() => (step < 2 ? setStep(step + 1) : generateProgram())}
                    className="olive-button text-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {step < 2 ? 'Continue' : 'Enroll & build my program'} <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ---------- active program ---------- */
  if (phase === 'program' && active) {
    const progress = Math.round((active.completedWeeks.length / active.weeks.length) * 100);
    const complete = progress === 100;
    return (
      <div className="space-y-8">
        <button onClick={() => { setActive(null); setPhase('browse'); setLecture(''); setLectureWeek(null); }} className="text-sm text-fog hover:text-jgai flex items-center gap-1"><ArrowLeft size={14} /> All programs</button>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="tag mb-3"><GraduationCap size={13} /> {active.creditHours} credit hours · {active.durationWeeks} weeks</div>
            <h1 className="text-4xl font-bold">{active.name}</h1>
            <p className="text-fog mt-1">{active.tagline}</p>
            <p className="text-[12.5px] text-fog mt-2 flex items-center gap-1.5">
              <CalendarDays size={13} /> {active.intake.hoursPerWeek}h/week on {active.intake.days.join(', ')} · {active.intake.pace} pace
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-jgai display">{progress}%</p>
            <p className="text-xs uppercase tracking-widest text-fog">complete</p>
          </div>
        </div>

        {complete && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <Certificate
              studentName={profile?.displayName || 'JGAI Student'}
              programName={active.name}
              creditHours={active.creditHours}
              verifyId={`JGAI-${new Date().getFullYear()}-${active.name.replace(/[^A-Z]/gi, '').slice(0, 4).toUpperCase()}-${String(active.creditHours).padStart(4, '0')}`}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {active.weeks.map((w) => {
              const done = active.completedWeeks.includes(w.week);
              return (
                <div key={w.week} className={`card !p-5 ${lectureWeek === w.week ? '!border-jgai' : ''}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleWeek(active, w.week)} className="mt-0.5 shrink-0" aria-label="Mark complete">
                      {done ? <CheckCircle2 size={20} className="text-jgai" /> : <Circle size={20} className="text-edge-2" />}
                    </button>
                    <div className="flex-grow min-w-0">
                      <p className="text-[11px] uppercase tracking-widest text-fog">Week {w.week} · ~{w.hours}h</p>
                      <p className={`font-semibold ${done ? 'line-through text-fog' : ''}`}>{w.title}</p>
                      <p className="text-[12.5px] text-fog mt-1">{w.topics.join(' · ')}</p>
                      <p className="text-[12.5px] text-fog mt-1.5"><span className="font-semibold text-snow">Homework:</span> {w.assignment}</p>
                    </div>
                    <button onClick={() => openLecture(active, w)} className="flex items-center gap-1 text-xs font-semibold text-jgai bg-jgai-sky px-3 py-1.5 rounded-full hover:brightness-95 transition shrink-0">
                      Lecture <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="panel !p-7 min-h-[300px] lg:sticky lg:top-24 self-start max-h-[80vh] overflow-y-auto">
            {lectureLoading ? (
              <div className="flex items-center gap-2 text-fog text-sm"><Loader2 size={16} className="animate-spin" /> Professor JGAI is preparing the lecture…</div>
            ) : lecture ? (
              <div className="markdown-body text-[15px]"><ReactMarkdown>{lecture}</ReactMarkdown></div>
            ) : (
              <div className="text-fog text-sm flex items-center gap-2"><BookOpen size={16} /> Open a week's lecture to begin.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- browse ---------- */
  return (
    <div className="space-y-14">
      <div className="text-center space-y-6 pt-6">
        <div className="tag mx-auto"><GraduationCap size={13} /> JGAI University</div>
        <h1 className="text-5xl md:text-6xl font-bold">Enroll like a <span className="glow-text">real university</span>.</h1>
        <p className="text-fog max-w-2xl mx-auto leading-relaxed">
          Tell us what you want to study, your schedule and how you learn. JGAI builds a personalized,
          credit-hour based program — weekly lectures, homework and exams — and charges tuition per credit
          hour, exactly like a university. {TUITION_PER_CREDIT_HOUR} credits per credit hour.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => startIntake('')} className="olive-button flex items-center gap-2"><Sparkles size={16} /> Start enrollment</button>
          <button onClick={() => setShowSampleCert(!showSampleCert)} className="ghost-button flex items-center gap-2 text-sm"><Eye size={15} /> {showSampleCert ? 'Hide' : 'View'} sample certificate</button>
          <span className="tag"><Coins size={12} /> Balance: {credits} credits</span>
        </div>
      </div>

      {showSampleCert && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <Certificate sample studentName="Your Name Here" programName="Master of Business Administration (MBA) Program" creditHours={36} />
        </motion.div>
      )}

      {enrolled.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Your programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolled.map((p) => {
              const progress = Math.round((p.completedWeeks.length / p.weeks.length) * 100);
              return (
                <button key={p.name} onClick={() => { setActive(p); setPhase('program'); }} className="card text-left space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <span className="text-sm font-bold text-jgai">{progress}%</span>
                  </div>
                  <p className="text-sm text-fog">{p.creditHours} credit hours · {p.durationWeeks} weeks</p>
                  <div className="h-1.5 bg-panel-2 rounded-full overflow-hidden">
                    <div className="h-full bg-jgai rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Featured programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED.map((f) => (
            <button key={f.name} onClick={() => startIntake(f.name)} className="card text-left space-y-3">
              <div className="w-10 h-10 bg-jgai-sky rounded-xl flex items-center justify-center text-jgai"><GraduationCap size={20} /></div>
              <h3 className="text-lg font-semibold">{f.name}</h3>
              <p className="text-xs text-fog leading-relaxed">{f.desc}</p>
              <p className="text-xs font-semibold text-jgai flex items-center gap-1">{f.ch} · Enroll <ChevronRight size={12} /></p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
