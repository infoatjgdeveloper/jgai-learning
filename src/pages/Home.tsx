import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, Sparkles, LayoutDashboard, ArrowRight, GraduationCap, Building2, Coins, BookOpenCheck, Award, PlugZap, Check, X, Star, ChevronDown, Play, FileCheck2, Landmark } from 'lucide-react';
import { motion } from 'motion/react';
import { CATALOG, CATEGORIES } from '../data/catalog';
import { CourseCard } from './Catalog';

const STEPS = [
  { n: '01', icon: <PlugZap size={20} />, title: 'Enroll like a real student', text: 'Tell JGAI what you want to study, your weekly schedule, your pace and how you learn. Our AI registrar builds a personalized, credit-hour based program.' },
  { n: '02', icon: <School size={20} />, title: 'Bring your real school', text: 'Connect Canvas and your actual university courses, assignments and grades appear beside your JGAI programs — with an AI study assistant on every assignment.' },
  { n: '03', icon: <BookOpenCheck size={20} />, title: 'Attend, submit, get graded', text: 'Weekly written lectures, curated videos and materials, homework and quizzes — delivered on the days you chose, at university rigor.' },
  { n: '04', icon: <Award size={20} />, title: 'Graduate with proof', text: 'Finish your credit hours, pass the exams and receive a verifiable JGAI certificate with a full transcript behind it.' }
];

const COMPARE = [
  ['Video course marketplace', true, true, false, false],
  ['University-style credit hours & tuition', true, false, false, true],
  ['Personalized AI-built curriculum', true, false, false, false],
  ['Syncs your real university (Canvas)', true, false, false, true],
  ['AI tutor on every assignment', true, false, false, false],
  ['Assignments, quizzes & grading', true, false, true, true],
  ['Certificates & transcripts', true, true, true, true],
  ['White-label for institutions', true, false, false, true]
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'CS undergrad, junior year', text: 'My Canvas assignments and my JGAI ML program live on one dashboard. The AI help on assignments is like having a TA at 2am.', color: '#2b6cff' },
  { name: 'Marcus D.', role: 'Career switcher → Product', text: 'The enrollment interview actually asked how many hours I had and which days. The plan it built fit my life — I finished 12 credit hours in a semester.', color: '#ff7a1a' },
  { name: 'Dr. Elena R.', role: 'Dean, partner institution', text: 'We licensed JGAI as our digital campus. Our branding, our tuition rates, our policies — their AI faculty and infrastructure.', color: '#10b981' }
];

const FAQS = [
  ['What exactly are credit hours?', 'The same unit real universities use (the Carnegie unit): 1 credit hour ≈ 15 hours of instruction. A typical course is 3 credit hours; an MBA-style track is ~36. Your tuition is charged per credit hour — 25 JGAI credits each.'],
  ['Is this accredited? What is the certificate worth?', 'JGAI certificates are professional certificates issued by JGAI with verifiable IDs and full transcripts, similar to leading professional certificate programs. JGAI is not a government-accredited degree-granting institution — we are transparent about that.'],
  ['How does the Canvas sync work?', 'You generate a personal access token in your school Canvas account (Account → Settings → New access token) and connect it. Your courses, assignments and due dates sync in. The token stays in your browser — we never store it.'],
  ['Can the AI just do my homework?', "No. In Classroom mode the AI explains, plans and teaches — it is designed to respect your school's academic integrity policies. In JGAI University programs, the AI is your professor and does grade your work."],
  ['What if my subject is not in the catalog?', 'Type anything into enrollment — from "Quantum Computing" to "Sourdough Baking Business". The AI registrar designs a rigorous program for it and prices it in credit hours.'],
  ['How do universities license JGAI?', 'Institutions get a white-label instance: their branding, their credit pricing, their academic rules, plus admin and registrar consoles. Contact us from the Pricing page.']
];

export function Home() {
  const [topic, setTopic] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();
  const buildPath = () => navigate(`/university${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`);
  const featured = [CATALOG[7], CATALOG[0], CATALOG[5], CATALOG[8]];

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
          <div className="tag"><Sparkles size={13} /> Marketplace + degrees + your school — one AI campus</div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05]">
            The university that <span className="glow-text">builds itself around you</span>.
          </h1>
          <p className="text-lg text-fog leading-relaxed">
            JGAI Learning merges the course marketplace, the online degree and your real school's LMS
            into one platform. AI faculty teach, grade and certify — on your schedule, priced per credit
            hour like a real university.
          </p>
          <div className="flex items-center gap-2 panel p-1.5 pl-5">
            <input value={topic} onChange={(e) => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && buildPath()} placeholder="What do you want to master?" className="flex-grow bg-transparent outline-none text-[15px]" />
            <button onClick={buildPath} className="olive-button whitespace-nowrap flex items-center gap-2 text-sm">Start enrollment <ArrowRight size={15} /></button>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-fog">
            <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-500" fill="currentColor" /> 4.8 avg course rating</span>
            <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-jgai" /> 200k+ enrollments</span>
            <span className="flex items-center gap-1.5"><Building2 size={14} className="text-pop-green" /> Campus licensing</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="hidden lg:block relative">
          <div className="panel p-5 space-y-4 grid-bg">
            <div className="flex items-center justify-between">
              <p className="font-bold text-sm">Today · Wednesday</p>
              <span className="tag !text-[10px]"><Coins size={11} /> 300 cr</span>
            </div>
            {[
              { t: 'ML Lecture · Week 4: Decision Trees', s: 'JGAI University · 9:00 AM', c: '#2b6cff', icon: <Play size={14} /> },
              { t: 'CS201 Problem Set 3 due', s: 'Your school via Canvas · 11:59 PM', c: '#ff7a1a', icon: <FileCheck2 size={14} /> },
              { t: 'Spanish conversation practice', s: 'JGAI University · 6:00 PM', c: '#10b981', icon: <Sparkles size={14} /> },
              { t: 'Marketing quiz · attempt 1 of 2', s: 'JGAI University · graded by AI', c: '#8b5cf6', icon: <GraduationCap size={14} /> }
            ].map((x) => (
              <div key={x.t} className="flex items-center gap-3 bg-white rounded-xl border border-edge p-3.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: x.c }}>{x.icon}</div>
                <div className="min-w-0">
                  <p className="font-semibold text-[13.5px] truncate">{x.t}</p>
                  <p className="text-[12px] text-fog truncate">{x.s}</p>
                </div>
              </div>
            ))}
            <div className="h-2 bg-panel-2 rounded-full overflow-hidden">
              <div className="h-full w-[68%] rounded-full" style={{ background: 'linear-gradient(90deg,#2b6cff,#8b5cf6)' }} />
            </div>
            <p className="text-[11.5px] text-fog">Semester progress · 68% · 22 of 32 credit hours</p>
          </div>
        </motion.div>
      </section>

      {/* CATEGORIES */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Browse by school</h2>
          <Link to="/catalog" className="text-jgai font-semibold text-sm flex items-center gap-1">Full catalog <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <Link key={c.name} to="/catalog" className="panel p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: c.color }} />
              <div>
                <p className="font-semibold text-[13.5px]">{c.name}</p>
                <p className="text-[11.5px] text-fog">{CATALOG.filter((x) => x.category === c.name).length} programs</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Trending this semester</h2>
            <p className="text-fog text-sm mt-1">Most-enrolled programs across JGAI University.</p>
          </div>
          <Link to="/catalog" className="ghost-button text-sm hidden md:block">View all courses</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((c) => <CourseCard key={c.id} c={c} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <div className="tag mx-auto">How it works</div>
          <h2 className="text-4xl font-bold">From enrollment to graduation</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="card space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ['#2b6cff', '#8b5cf6', '#ff7a1a', '#10b981'][i] }} />
              <div className="flex items-center justify-between pt-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: ['#2b6cff', '#8b5cf6', '#ff7a1a', '#10b981'][i] }}>{s.icon}</div>
                <span className="text-3xl font-bold display" style={{ color: '#e3eaf3' }}>{s.n}</span>
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="text-fog text-[13.5px] leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <div className="tag mx-auto">Why JGAI</div>
          <h2 className="text-4xl font-bold">Four platforms. <span className="glow-text">One campus.</span></h2>
          <p className="text-fog max-w-xl mx-auto text-sm">Everything a course marketplace, an online-degree platform and a campus LMS do — unified and AI-native.</p>
        </div>
        <div className="panel overflow-x-auto">
          <table className="w-full text-[13.5px] min-w-[640px]">
            <thead>
              <tr className="border-b border-edge">
                <th className="text-left px-5 py-4 font-semibold text-fog text-[12px] uppercase tracking-wider">Capability</th>
                <th className="px-4 py-4"><span className="tag !text-[10px]">JGAI</span></th>
                <th className="px-4 py-4 font-semibold text-fog">Course marketplaces</th>
                <th className="px-4 py-4 font-semibold text-fog">MOOC platforms</th>
                <th className="px-4 py-4 font-semibold text-fog">Campus LMS</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([label, ...cols]) => (
                <tr key={label as string} className="trow">
                  <td className="px-5 py-3.5 font-medium">{label as string}</td>
                  {(cols as boolean[]).map((v, i) => (
                    <td key={i} className="px-4 py-3.5 text-center">
                      {v ? <Check size={17} className={`mx-auto ${i === 0 ? 'text-jgai' : 'text-pop-green'}`} strokeWidth={3} /> : <X size={16} className="mx-auto text-edge-2" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Students & institutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card space-y-4">
              <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={15} className="text-amber-400" fill="currentColor" />)}</div>
              <p className="text-[14px] leading-relaxed text-snow">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: t.color }}>{t.name[0]}</div>
                <div>
                  <p className="font-semibold text-[13.5px]">{t.name}</p>
                  <p className="text-[12px] text-fog">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOR UNIVERSITIES */}
      <section className="panel p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center grid-bg">
        <div className="space-y-5">
          <div className="tag"><Landmark size={13} /> For institutions</div>
          <h2 className="text-4xl font-bold leading-tight">Your university, powered by JGAI.</h2>
          <p className="text-fog leading-relaxed">
            License JGAI as your digital campus: your branding, your tuition per credit hour, your academic
            policies — with AI faculty, registrar tooling and analytics underneath. Replaces or augments
            Canvas and Blackboard.
          </p>
          <div className="flex gap-3">
            <Link to="/pricing" className="olive-button text-sm">Licensing & tuition</Link>
            <a href="mailto:infoatjgdeveloper@gmail.com?subject=JGAI%20Campus%20License" className="ghost-button text-sm">Book a demo</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['White-label campus', 'Your name, colors, domain', '#2b6cff'], ['Registrar console', 'Programs, tuition, transcripts', '#8b5cf6'], ['Instructor tools', 'AI-assisted grading & content', '#ff7a1a'], ['Analytics', 'Enrollment, outcomes, revenue', '#10b981']].map(([t, d, c]) => (
            <div key={t} className="bg-white rounded-xl border border-edge p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg" style={{ background: c }} />
              <p className="font-bold text-[14px]">{t}</p>
              <p className="text-fog text-[12.5px] leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto space-y-6 w-full">
        <h2 className="text-3xl font-bold text-center">Questions, answered</h2>
        <div className="space-y-3">
          {FAQS.map(([q, a], i) => (
            <div key={q} className="panel overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-[14.5px]">
                {q}
                <ChevronDown size={17} className={`text-fog transition-transform shrink-0 ml-3 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="px-6 pb-5 text-fog text-[13.5px] leading-relaxed">{a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-5 rounded-3xl p-12 md:p-16 text-white" style={{ background: 'linear-gradient(120deg,#2b6cff 0%,#7c3aed 60%,#ec4899 100%)' }}>
        <h2 className="text-4xl md:text-5xl font-bold">Your first course is on us.</h2>
        <p className="opacity-90 max-w-lg mx-auto">300 welcome credits — 12 credit hours of university-grade learning. Enroll in 2 minutes.</p>
        <div className="flex justify-center gap-3">
          <Link to="/university" className="bg-white text-jgai-deep font-bold rounded-xl px-7 py-3.5 hover:scale-[1.02] transition-transform">Start enrollment</Link>
          <Link to="/catalog" className="border border-white/40 rounded-xl px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors">Browse catalog</Link>
        </div>
      </section>
    </div>
  );
}
