import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, ScrollText, Landmark, CalendarDays, Megaphone, School, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CATALOG, CATEGORIES } from '../data/catalog';
import { CourseCard } from './Catalog';

const CALENDAR = [
  ['Aug 24', 'Fall term begins · first lectures released'],
  ['Sep 7', 'Last day to register without late fee'],
  ['Oct 12–16', 'Midterm examination window'],
  ['Nov 25–27', 'Reading days — no new coursework'],
  ['Dec 14–18', 'Final examinations'],
  ['Dec 21', 'Grades posted · certificates issued']
];

const NEWS = [
  { tag: 'Admissions', title: 'Fall 2026 registration is open — every program, every schedule', date: 'This week' },
  { tag: 'Academics', title: 'New: AI faculty now deliver personalized quizzes with instant grading', date: 'This month' },
  { tag: 'Institutions', title: 'JGAI campus licensing brings the AI University to partner colleges', date: 'This month' }
];

const ADMISSION_STEPS = [
  ['Apply', 'Tell the registrar what you want to study, your goal, schedule and learning style. Takes 2 minutes.'],
  ['Register', 'The AI registrar designs your personalized program and charges tuition per credit hour — 25 credits each.'],
  ['Attend', 'Weekly lectures on your chosen days, homework, and graded quizzes from your AI professors.'],
  ['Graduate', 'Earn every week, pass your exams, and receive a verifiable JGAI certificate and transcript.']
];

export function Home() {
  const featured = [CATALOG[7], CATALOG[0], CATALOG[5], CATALOG[8]];
  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl text-white" style={{ background: 'linear-gradient(120deg,#0e1a2b 0%,#123a8c 55%,#1d5fd6 100%)' }}>
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative px-8 md:px-14 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Office of Admissions · Fall 2026</p>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.05]">A real university.<br /><span style={{ color: '#b89235' }}>Taught entirely by AI.</span></h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-xl">
              Credit hours, tuition, registration, lectures, examinations, transcripts and certificates —
              the full university system, personalized to your schedule by AI faculty. Plus real Canvas sync
              with your current school.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/university" className="bg-white font-bold rounded-lg px-7 py-3.5 hover:scale-[1.02] transition-transform" style={{ color: '#123a8c' }}>Apply for admission</Link>
              <Link to="/catalog" className="border border-white/40 rounded-lg px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors">View course catalog</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 hidden lg:block">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 space-y-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">At a glance</p>
              {[['8', 'Schools & departments'], ['25 cr', 'Tuition per credit hour'], ['300 cr', 'Admission grant for new students'], ['24/7', 'AI faculty & tutoring']].map(([v, l]) => (
                <div key={l} className="flex items-baseline justify-between border-b border-white/10 pb-3 last:border-0">
                  <span className="text-2xl font-bold display" style={{ color: '#b89235' }}>{v}</span>
                  <span className="text-white/75 text-[13px]">{l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8">
        {[
          { to: '/university', icon: <GraduationCap size={20} />, t: 'Admissions', d: 'Apply & register', c: '#2b6cff' },
          { to: '/catalog', icon: <BookOpen size={20} />, t: 'Academics', d: '8 schools, any subject', c: '#8b5cf6' },
          { to: '/pricing', icon: <Landmark size={20} />, t: 'Tuition & aid', d: 'Per credit hour', c: '#ff7a1a' },
          { to: '/verify', icon: <ShieldCheck size={20} />, t: 'Registrar', d: 'Verify a credential', c: '#10b981' }
        ].map((q) => (
          <Link key={q.t} to={q.to} className="card !p-5 flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: q.c }}>{q.icon}</div>
            <div>
              <p className="font-bold text-[14.5px] group-hover:text-jgai transition-colors">{q.t}</p>
              <p className="text-[12px] text-fog">{q.d}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* SCHOOLS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b-2 pb-3" style={{ borderColor: '#b89235' }}>
          <h2 className="text-3xl font-bold flex items-center gap-2.5"><School size={26} className="text-jgai" /> Schools & departments</h2>
          <Link to="/catalog" className="text-jgai font-semibold text-sm flex items-center gap-1">All programs <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <Link key={c.name} to="/catalog" className="panel p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: c.color }} />
              <div>
                <p className="font-semibold text-[13.5px]">School of {c.name}</p>
                <p className="text-[11.5px] text-fog">{CATALOG.filter((x) => x.category === c.name).length} programs</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ADMISSIONS PROCESS */}
      <section className="space-y-6">
        <div className="border-b-2 pb-3" style={{ borderColor: '#b89235' }}>
          <h2 className="text-3xl font-bold flex items-center gap-2.5"><GraduationCap size={26} className="text-jgai" /> The path to your degree</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {ADMISSION_STEPS.map(([t, d], i) => (
            <div key={t} className="card space-y-3 relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white display" style={{ background: '#123a8c' }}>{i + 1}</div>
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="text-fog text-[13.5px] leading-relaxed">{d}</p>
              {i < 3 && <ChevronRight size={18} className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-edge-2" />}
            </div>
          ))}
        </div>
        <div className="text-center"><Link to="/university" className="olive-button inline-flex items-center gap-2">Begin your application <ArrowRight size={16} /></Link></div>
      </section>

      {/* FEATURED */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b-2 pb-3" style={{ borderColor: '#b89235' }}>
          <h2 className="text-3xl font-bold flex items-center gap-2.5"><Sparkles size={26} className="text-jgai" /> Popular this term</h2>
          <Link to="/catalog" className="text-jgai font-semibold text-sm flex items-center gap-1">Catalog <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((c) => <CourseCard key={c.id} c={c} />)}
        </div>
      </section>

      {/* CALENDAR + NEWS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="border-b-2 pb-3" style={{ borderColor: '#b89235' }}>
            <h2 className="text-2xl font-bold flex items-center gap-2"><CalendarDays size={22} className="text-jgai" /> Academic calendar · Fall 2026</h2>
          </div>
          <div className="panel overflow-hidden">
            {CALENDAR.map(([d, e]) => (
              <div key={d} className="trow flex gap-4 px-5 py-3.5 text-[13.5px]">
                <span className="font-bold text-jgai w-20 shrink-0">{d}</span>
                <span className="text-fog">{e}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-fog">Self-paced students follow their personal program calendar set at registration.</p>
        </div>
        <div className="space-y-5">
          <div className="border-b-2 pb-3" style={{ borderColor: '#b89235' }}>
            <h2 className="text-2xl font-bold flex items-center gap-2"><Megaphone size={22} className="text-jgai" /> University news</h2>
          </div>
          <div className="space-y-3">
            {NEWS.map((n) => (
              <div key={n.title} className="card !p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px]"><span className="tag !text-[10px] !py-0.5">{n.tag}</span><span className="text-fog">{n.date}</span></div>
                <p className="font-semibold text-[14.5px] leading-snug">{n.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTITUTIONS */}
      <section className="panel p-10 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center grid-bg">
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-fog">Office of Institutional Partnerships</p>
          <h2 className="text-3xl font-bold">Bring JGAI to your campus.</h2>
          <p className="text-fog leading-relaxed text-[15px]">
            Partner colleges license the JGAI system as their own digital campus — their branding, their
            tuition rates, their academic policies, with AI faculty and registrar infrastructure underneath.
          </p>
          <div className="flex gap-3">
            <a href="mailto:infoatjgdeveloper@gmail.com?subject=JGAI%20Campus%20License" className="olive-button text-sm">Request a consultation</a>
            <Link to="/pricing" className="ghost-button text-sm">Licensing overview</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['White-label campus', '#2b6cff'], ['Registrar console', '#8b5cf6'], ['AI faculty & grading', '#ff7a1a'], ['Outcome analytics', '#10b981']].map(([t, c]) => (
            <div key={t} className="bg-white rounded-xl border border-edge p-5 flex items-center gap-3">
              <div className="w-3 h-9 rounded-full shrink-0" style={{ background: c }} />
              <p className="font-semibold text-[13.5px]">{t}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
