import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { GraduationCap, Sparkles, BookOpen, ChevronRight, Loader2, CheckCircle2, Circle, Coins, CalendarDays, Clock, Target, ArrowLeft, ArrowRight, Eye, FileQuestion, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { askClaude, askClaudeJSON } from '../lib/ai';
import { useAuth } from '../AuthContext';
import { Certificate } from '../components/Certificate';
import { loadRecord, saveRecord, StoredProgram, QuizQuestion, programGPA, makeCertPayload } from '../lib/store';

const RATE = 25;
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FEATURED = [
  { name: 'MBA', desc: 'Strategy, finance, marketing, operations, leadership.', ch: '36 credit hours' },
  { name: 'Computer Science', desc: 'Programming, algorithms, systems and AI foundations.', ch: '32 credit hours' },
  { name: 'Data Science', desc: 'Statistics, Python, ML and applied capstones.', ch: '24 credit hours' },
  { name: 'Digital Marketing', desc: 'SEO, content, paid media, analytics, brand.', ch: '16 credit hours' }
];

interface Intake { topic: string; goal: string; hoursPerWeek: number; days: string[]; pace: string; level: string; style: string; }

export function University() {
  const [searchParams] = useSearchParams();
  const { profile, user } = useAuth();
  const uid = user?.uid ?? null;

  const [phase, setPhase] = useState<'browse' | 'intake' | 'generating' | 'program'>('browse');
  const [intake, setIntake] = useState<Intake>({ topic: searchParams.get('topic') || '', goal: '', hoursPerWeek: 8, days: ['Mon', 'Wed', 'Fri'], pace: 'Standard', level: 'Beginner', style: 'Mixed' });
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState(0);
  const [programs, setPrograms] = useState<StoredProgram[]>([]);
  const [active, setActive] = useState<StoredProgram | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [lecture, setLecture] = useState('');
  const [lectureWeek, setLectureWeek] = useState<number | null>(null);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizWeek, setQuizWeek] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<number | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showSampleCert, setShowSampleCert] = useState(false);

  useEffect(() => {
    loadRecord(uid).then((r) => { setCredits(r.credits); setPrograms(r.programs); setLoaded(true); });
  }, [uid]);

  const persist = useCallback((c: number, p: StoredProgram[]) => {
    setCredits(c); setPrograms(p);
    saveRecord(uid, { credits: c, programs: p });
  }, [uid]);

  const updateProgram = (updated: StoredProgram) => {
    const next = programs.map((p) => (p.name === updated.name ? updated : p));
    persist(credits, next);
    setActive(updated);
  };

  const startIntake = (topic: string) => { setIntake((i) => ({ ...i, topic })); setStep(0); setError(''); setPhase('intake'); };
  const toggleDay = (d: string) => setIntake((i) => ({ ...i, days: i.days.includes(d) ? i.days.filter((x) => x !== d) : [...i.days, d] }));

  const generateProgram = async () => {
    setPhase('generating'); setError('');
    try {
      const plan = await askClaudeJSON<Omit<StoredProgram, 'enrolledAt' | 'completedWeeks' | 'quizScores' | 'intake'>>({
        system: 'You are the JGAI University registrar and curriculum designer. Design rigorous, personalized, university-grade programs. Credit hours follow the Carnegie unit: 1 credit hour ≈ 15 hours of instruction.',
        prompt: `Design a personalized certificate program.
Student: subject "${intake.topic}", goal "${intake.goal || 'general mastery'}", ${intake.hoursPerWeek}h/week on ${intake.days.join(', ')}, ${intake.pace} pace, ${intake.level} level, ${intake.style} learning style.
Compute durationWeeks and creditHours from availability (total hours / 15, min 4, max 40).
Return JSON: { "name": string, "tagline": string, "durationWeeks": number, "creditHours": number, "weeks": [{ "week": number, "title": string, "topics": [3-5 strings], "assignment": string, "hours": number }] }`,
        maxTokens: 4000
      });
      const tuition = plan.creditHours * RATE;
      if (credits < tuition) {
        setError(`Tuition is ${tuition} credits (${plan.creditHours} ch × ${RATE}). Balance: ${credits}. Top up on the Pricing page.`);
        setPhase('intake'); return;
      }
      const program: StoredProgram = { ...plan, enrolledAt: new Date().toISOString(), completedWeeks: [], quizScores: {}, intake };
      persist(credits - tuition, [...programs.filter((p) => p.name !== program.name), program]);
      setActive(program); setPhase('program');
    } catch (e) {
      console.error(e);
      setError('Program generation failed. AI may not be configured yet. Try again shortly.');
      setPhase('intake');
    }
  };

  const openLecture = async (program: StoredProgram, week: StoredProgram['weeks'][0]) => {
    setLectureWeek(week.week); setQuiz(null); setQuizWeek(null); setLectureLoading(true); setLecture('');
    try {
      const text = await askClaude({
        system: `You are a JGAI University professor. Student level: ${program.intake.level}, style: ${program.intake.style}. Deliver a written lecture: intro, core concepts with examples, specific free resources to search for, practice prompts, summary. Markdown.`,
        messages: [{ role: 'user', content: `Program: ${program.name}. Week ${week.week}: ${week.title}. Topics: ${week.topics.join(', ')}. (~${week.hours} study hours.)` }],
        maxTokens: 3000
      });
      setLecture(text);
    } catch { setLecture('Lecture unavailable right now. Try again shortly.'); }
    finally { setLectureLoading(false); }
  };

  const startQuiz = async (program: StoredProgram, week: StoredProgram['weeks'][0]) => {
    setQuizWeek(week.week); setQuiz(null); setQuizAnswers({}); setQuizResult(null); setQuizLoading(true); setLecture(''); setLectureWeek(null);
    try {
      const data = await askClaudeJSON<{ questions: QuizQuestion[] }>({
        system: 'You write rigorous university quiz questions. Answer index is 0-based.',
        prompt: `Create 5 multiple-choice questions for: ${program.name}, Week ${week.week}: ${week.title}. Topics: ${week.topics.join(', ')}. Level: ${program.intake.level}.
Return JSON: { "questions": [{ "q": string, "options": [4 strings], "answer": number }] }`,
        maxTokens: 2500
      });
      setQuiz(data.questions);
    } catch { setError('Quiz generation failed. Try again.'); setQuizWeek(null); }
    finally { setQuizLoading(false); }
  };

  const submitQuiz = (program: StoredProgram) => {
    if (!quiz || quizWeek === null) return;
    const correct = quiz.filter((q, i) => quizAnswers[i] === q.answer).length;
    const score = Math.round((correct / quiz.length) * 100);
    setQuizResult(score);
    const passed = score >= 60;
    const updated: StoredProgram = {
      ...program,
      quizScores: { ...program.quizScores, [quizWeek]: Math.max(score, program.quizScores[quizWeek] ?? 0) },
      completedWeeks: passed && !program.completedWeeks.includes(quizWeek) ? [...program.completedWeeks, quizWeek] : program.completedWeeks
    };
    if (updated.completedWeeks.length === updated.weeks.length && !updated.certificateId) {
      updated.certificateId = `JGAI-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    }
    updateProgram(updated);
  };

  /* ---------- intake ---------- */
  if (phase === 'intake' || phase === 'generating') {
    const est = Math.max(4, Math.round((intake.hoursPerWeek * 12) / 15)) * RATE;
    const steps = [
      { title: 'What do you want to study?', valid: intake.topic.trim().length > 1, body: (
        <div className="space-y-4">
          <input value={intake.topic} onChange={(e) => setIntake({ ...intake, topic: e.target.value })} placeholder="e.g. MBA, Machine Learning, UX Design" className="input-dark text-lg" autoFocus />
          <textarea value={intake.goal} onChange={(e) => setIntake({ ...intake, goal: e.target.value })} placeholder="Your goal, e.g. 'switch careers into product management within a year'" className="input-dark min-h-[90px]" />
        </div>) },
      { title: 'Your weekly schedule', valid: intake.days.length > 0, body: (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-fog mb-2 flex items-center gap-1.5"><Clock size={14} /> Hours per week: <span className="font-bold text-snow">{intake.hoursPerWeek}h</span></p>
            <input type="range" min={2} max={30} value={intake.hoursPerWeek} onChange={(e) => setIntake({ ...intake, hoursPerWeek: +e.target.value })} className="w-full accent-[#2b6cff]" />
          </div>
          <div>
            <p className="text-sm text-fog mb-2 flex items-center gap-1.5"><CalendarDays size={14} /> Study days</p>
            <div className="flex flex-wrap gap-2">{DAYS.map((d) => <button key={d} onClick={() => toggleDay(d)} className={`choice ${intake.days.includes(d) ? 'active' : ''}`}>{d}</button>)}</div>
          </div>
        </div>) },
      { title: 'How do you learn best?', valid: true, body: (
        <div className="space-y-6">
          {([['Pace', 'pace', ['Relaxed', 'Standard', 'Intensive']], ['Current level', 'level', ['Beginner', 'Intermediate', 'Advanced']], ['Learning style', 'style', ['Video-first', 'Reading', 'Projects', 'Mixed']]] as const).map(([label, key, opts]) => (
            <div key={label}>
              <p className="text-sm text-fog mb-2">{label}</p>
              <div className="flex flex-wrap gap-2">{opts.map((o) => <button key={o} onClick={() => setIntake({ ...intake, [key]: o })} className={`choice ${(intake as unknown as Record<string, string>)[key] === o ? 'active' : ''}`}>{o}</button>)}</div>
            </div>
          ))}
        </div>) }
    ];
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => setPhase('browse')} className="text-sm text-fog hover:text-jgai flex items-center gap-1"><ArrowLeft size={14} /> Programs</button>
        <div className="panel p-8 md:p-10 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="tag"><Target size={12} /> Enrollment: step {step + 1} of 3</div>
              <span className="text-[12px] text-fog flex items-center gap-1"><Coins size={13} /> {credits} cr</span>
            </div>
            <div className="h-1.5 bg-panel-2 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${((step + 1) / 3) * 100}%`, background: 'linear-gradient(90deg,#2b6cff,#8b5cf6)' }} /></div>
          </div>
          {phase === 'generating' ? (
            <div className="text-center py-10 space-y-4">
              <Loader2 size={32} className="animate-spin text-jgai mx-auto" />
              <p className="font-semibold text-lg">The registrar is building your program…</p>
              <p className="text-sm text-fog">Personalized to {intake.hoursPerWeek}h/week on {intake.days.join(', ')}.</p>
            </div>
          ) : (
            <>
              <div className="space-y-5"><h1 className="text-3xl font-bold">{steps[step].title}</h1>{steps[step].body}</div>
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
              <div className="flex justify-between items-center">
                <button onClick={() => (step === 0 ? setPhase('browse') : setStep(step - 1))} className="ghost-button text-sm">Back</button>
                <div className="text-right">
                  {step === 2 && <p className="text-[12px] text-fog mb-2">Estimated tuition: ~{est} credits ({RATE} cr/credit hour)</p>}
                  <button disabled={!steps[step].valid} onClick={() => (step < 2 ? setStep(step + 1) : generateProgram())} className="olive-button text-sm flex items-center gap-2 disabled:opacity-50">
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

  /* ---------- program ---------- */
  if (phase === 'program' && active) {
    const progress = Math.round((active.completedWeeks.length / active.weeks.length) * 100);
    const complete = progress === 100;
    const { letter } = programGPA(active);
    return (
      <div className="space-y-8">
        <button onClick={() => { setActive(null); setPhase('browse'); setLecture(''); setLectureWeek(null); setQuiz(null); setQuizWeek(null); }} className="text-sm text-fog hover:text-jgai flex items-center gap-1"><ArrowLeft size={14} /> All programs</button>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="tag mb-3"><GraduationCap size={13} /> {active.creditHours} credit hours · {active.durationWeeks} weeks · grade {letter}</div>
            <h1 className="text-4xl font-bold">{active.name}</h1>
            <p className="text-fog mt-1">{active.tagline}</p>
            <p className="text-[12.5px] text-fog mt-2 flex items-center gap-1.5"><CalendarDays size={13} /> {active.intake.hoursPerWeek}h/week on {active.intake.days.join(', ')} · {active.intake.pace} pace</p>
          </div>
          <div className="text-right"><p className="text-4xl font-bold text-jgai display">{progress}%</p><p className="text-xs uppercase tracking-widest text-fog">complete</p></div>
        </div>

        {complete && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
            <Certificate studentName={profile?.displayName || 'JGAI Student'} programName={active.name} creditHours={active.creditHours} verifyId={active.certificateId} />
            <p className="text-center text-sm">
              <Link to={`/verify?d=${makeCertPayload(active, profile?.displayName || 'JGAI Student')}`} className="text-jgai font-semibold inline-flex items-center gap-1.5"><ShieldCheck size={15} /> Public verification link</Link>
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {active.weeks.map((w) => {
              const done = active.completedWeeks.includes(w.week);
              const score = active.quizScores?.[w.week];
              return (
                <div key={w.week} className={`card !p-5 ${lectureWeek === w.week || quizWeek === w.week ? '!border-jgai' : ''}`}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">{done ? <CheckCircle2 size={20} className="text-jgai" /> : <Circle size={20} className="text-edge-2" />}</span>
                    <div className="flex-grow min-w-0">
                      <p className="text-[11px] uppercase tracking-widest text-fog">Week {w.week} · ~{w.hours}h {score !== undefined && <span className="text-jgai font-bold">· quiz {score}%</span>}</p>
                      <p className={`font-semibold ${done ? 'text-fog' : ''}`}>{w.title}</p>
                      <p className="text-[12.5px] text-fog mt-1">{w.topics.join(' · ')}</p>
                      <p className="text-[12.5px] text-fog mt-1.5"><span className="font-semibold text-snow">Homework:</span> {w.assignment}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => openLecture(active, w)} className="flex items-center gap-1 text-xs font-semibold text-jgai bg-jgai-sky px-3 py-1.5 rounded-full hover:brightness-95 transition">Lecture <ChevronRight size={12} /></button>
                      <button onClick={() => startQuiz(active, w)} className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full hover:brightness-110 transition" style={{ background: done ? '#10b981' : '#8b5cf6' }}>
                        <FileQuestion size={12} /> {done ? 'Retake' : 'Quiz'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="text-[12px] text-fog">Pass each week's quiz (60%+) to earn the week. Complete all weeks to receive your certificate.</p>
          </div>

          <div className="panel !p-7 min-h-[300px] lg:sticky lg:top-24 self-start max-h-[80vh] overflow-y-auto">
            {quizWeek !== null ? (
              quizLoading ? (
                <div className="flex items-center gap-2 text-fog text-sm"><Loader2 size={16} className="animate-spin" /> Writing your quiz…</div>
              ) : quiz ? (
                <div className="space-y-5">
                  <h2 className="font-bold text-lg">Week {quizWeek} quiz</h2>
                  {quiz.map((q, i) => (
                    <div key={i} className="space-y-2">
                      <p className="font-semibold text-[14px]">{i + 1}. {q.q}</p>
                      <div className="space-y-1.5">
                        {q.options.map((o, j) => {
                          const chosen = quizAnswers[i] === j;
                          const showState = quizResult !== null;
                          const correct = j === q.answer;
                          return (
                            <button key={j} disabled={quizResult !== null} onClick={() => setQuizAnswers({ ...quizAnswers, [i]: j })}
                              className={`w-full text-left text-[13px] px-3.5 py-2.5 rounded-lg border transition ${
                                showState && correct ? 'border-green-500 bg-green-50' :
                                showState && chosen && !correct ? 'border-red-400 bg-red-50' :
                                chosen ? 'border-jgai bg-jgai-sky' : 'border-edge-2 bg-white hover:border-jgai'}`}>
                              {o}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {quizResult === null ? (
                    <button disabled={Object.keys(quizAnswers).length < quiz.length} onClick={() => submitQuiz(active)} className="olive-button text-sm w-full disabled:opacity-50">Submit quiz</button>
                  ) : (
                    <div className={`rounded-xl p-4 text-center font-bold ${quizResult >= 60 ? 'bg-green-50 text-green-700 border border-green-300' : 'bg-red-50 text-red-600 border border-red-300'}`}>
                      Score: {quizResult}%. {quizResult >= 60 ? 'Passed! Week earned.' : 'Below 60%. Review the lecture and retake.'}
                    </div>
                  )}
                </div>
              ) : null
            ) : lectureLoading ? (
              <div className="flex items-center gap-2 text-fog text-sm"><Loader2 size={16} className="animate-spin" /> Professor JGAI is preparing the lecture…</div>
            ) : lecture ? (
              <div className="markdown-body text-[15px]"><ReactMarkdown>{lecture}</ReactMarkdown></div>
            ) : (
              <div className="text-fog text-sm flex items-center gap-2"><BookOpen size={16} /> Open a lecture or take a quiz to begin.</div>
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
          Personalized intake, credit-hour tuition ({RATE} credits per credit hour), weekly lectures,
          graded quizzes and a verifiable certificate at graduation.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => startIntake('')} className="olive-button flex items-center gap-2"><Sparkles size={16} /> Start enrollment</button>
          <button onClick={() => setShowSampleCert(!showSampleCert)} className="ghost-button flex items-center gap-2 text-sm"><Eye size={15} /> {showSampleCert ? 'Hide' : 'View'} sample certificate</button>
          <span className="tag"><Coins size={12} /> {loaded ? `${credits} credits` : '…'}</span>
        </div>
      </div>

      {showSampleCert && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <Certificate sample studentName="Your Name Here" programName="Master of Business Administration (MBA) Program" creditHours={36} />
        </motion.div>
      )}

      {programs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your programs</h2>
            <Link to="/transcript" className="text-jgai text-sm font-semibold flex items-center gap-1">Transcript <ChevronRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((p) => {
              const progress = Math.round((p.completedWeeks.length / p.weeks.length) * 100);
              return (
                <button key={p.name} onClick={() => { setActive(p); setPhase('program'); }} className="card text-left space-y-3">
                  <div className="flex justify-between items-start"><h3 className="text-lg font-semibold">{p.name}</h3><span className="text-sm font-bold text-jgai">{progress}%</span></div>
                  <p className="text-sm text-fog">{p.creditHours} credit hours · {p.durationWeeks} weeks · grade {programGPA(p).letter}</p>
                  <div className="h-1.5 bg-panel-2 rounded-full overflow-hidden"><div className="h-full bg-jgai rounded-full" style={{ width: `${progress}%` }} /></div>
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
