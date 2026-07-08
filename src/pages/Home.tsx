import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, Sparkles, LayoutDashboard, ArrowRight, GraduationCap, Building2, Coins, BookOpenCheck, Award, PlugZap } from 'lucide-react';
import { motion } from 'motion/react';

const STEPS = [
  { n: '01', icon: <PlugZap size={20} />, title: 'Sign up & get credits', text: 'Create your account and load JGAI credits — the currency of the platform. Every course, program and exam has a credit price.' },
  { n: '02', icon: <School size={20} />, title: 'Connect your school (optional)', text: 'Sync your real university via Canvas. Your actual courses, assignments and grades flow into your JGAI dashboard with an AI assistant on top.' },
  { n: '03', icon: <BookOpenCheck size={20} />, title: 'Enroll in JGAI University', text: 'Pick a program — MBA, CS, Data Science, anything. AI designs a full university-grade curriculum: weekly lectures, homework, quizzes, exams.' },
  { n: '04', icon: <Award size={20} />, title: 'Learn daily, get certified', text: 'Follow the daily schedule, submit work, pass exams. Complete the program and earn a JGAI certificate backed by your verified transcript.' }
];

export function Home() {
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();
  const buildPath = () => navigate(`/university${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`);

  return (
    <div className="space-y-28">
      <section className="relative flex flex-col items-center text-center pt-14 pb-6 px-4 grid-bg rounded-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-7 max-w-4xl">
          <div className="tag"><Sparkles size={13} /> The AI university platform</div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.02]">
            One platform.<br />
            <span className="glow-text">Your school + your AI university.</span>
          </h1>
          <p className="text-lg text-fog max-w-2xl mx-auto leading-relaxed">
            JGAI Learning syncs your real university coursework and runs full AI-taught degree
            programs — lectures, homework, exams and certificates — governed by real university-style
            rules. Priced in credits. Built for students and institutions.
          </p>
          <div className="flex items-center gap-2 max-w-xl mx-auto panel p-1.5 pl-5">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buildPath()}
              placeholder="What do you want to master? e.g. MBA, Cybersecurity…"
              className="flex-grow bg-transparent outline-none text-[15px] placeholder:text-[#5d5d78]"
            />
            <button onClick={buildPath} className="olive-button whitespace-nowrap flex items-center gap-2 group text-sm">
              Build my program <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[13px] text-fog pt-2">
            <span className="flex items-center gap-1.5"><School size={14} className="text-jgai-bright" /> Real Canvas sync</span>
            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-jgai-bright" /> Claude-powered faculty</span>
            <span className="flex items-center gap-1.5"><Coins size={14} className="text-jgai-bright" /> Credit-based pricing</span>
            <span className="flex items-center gap-1.5"><Building2 size={14} className="text-jgai-bright" /> University licensing</span>
          </div>
        </motion.div>
      </section>

      <section className="space-y-10">
        <div className="text-center space-y-3">
          <div className="tag mx-auto">How it works</div>
          <h2 className="text-4xl font-bold">From sign-up to certificate</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-edge rounded-2xl overflow-hidden border border-edge">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-panel p-8 space-y-4 hover:bg-panel-2 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-jgai/15 border border-jgai/30 flex items-center justify-center text-jgai-bright">{s.icon}</div>
                <span className="text-3xl font-bold text-edge-2 display">{s.n}</span>
              </div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-fog text-[14px] leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Link to="/dashboard" className="card space-y-4 group">
          <LayoutDashboard size={22} className="text-jgai-bright" />
          <h3 className="text-lg font-semibold">Unified dashboard</h3>
          <p className="text-fog text-[14px] leading-relaxed">School coursework and JGAI programs side by side — deadlines, grades, credits and progress in one command center.</p>
          <span className="text-jgai-bright text-[13px] font-semibold flex items-center gap-1">Open <ArrowRight size={13} /></span>
        </Link>
        <Link to="/classroom" className="card space-y-4 group">
          <School size={22} className="text-cyan-glow" />
          <h3 className="text-lg font-semibold">Classroom sync</h3>
          <p className="text-fog text-[14px] leading-relaxed">Your actual university via Canvas — assignments, due dates and grades, with an integrity-safe AI assistant that helps you work faster.</p>
          <span className="text-jgai-bright text-[13px] font-semibold flex items-center gap-1">Connect <ArrowRight size={13} /></span>
        </Link>
        <Link to="/university" className="card space-y-4 group">
          <GraduationCap size={22} className="text-jgai-bright" />
          <h3 className="text-lg font-semibold">JGAI University</h3>
          <p className="text-fog text-[14px] leading-relaxed">Degree-style programs priced in credits. AI faculty, daily lectures, homework, proctored-style exams and JGAI certification.</p>
          <span className="text-jgai-bright text-[13px] font-semibold flex items-center gap-1">Browse programs <ArrowRight size={13} /></span>
        </Link>
      </section>

      <section className="panel p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <div className="tag"><Building2 size={13} /> For universities</div>
          <h2 className="text-4xl font-bold leading-tight">License JGAI for your institution.</h2>
          <p className="text-fog leading-relaxed">
            White-label the platform for your university: your branding, your courses, your rules —
            with JGAI's AI faculty, credit engine and analytics underneath. Admin panels for your
            staff, dashboards for your students.
          </p>
          <div className="flex gap-3">
            <Link to="/pricing" className="olive-button text-sm">See pricing</Link>
            <a href="mailto:infoatjgdeveloper@gmail.com?subject=JGAI%20University%20Licensing" className="ghost-button text-sm">Talk to JGAI</a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['Custom branding', 'Your name, colors and domain'], ['Admin console', 'Manage courses, staff, students'], ['Credit economy', 'Set your own course pricing'], ['AI faculty', '24/7 tutoring and grading support']].map(([t, d]) => (
            <div key={t} className="panel p-5 space-y-1.5 bg-panel-2">
              <p className="font-semibold text-[14px]">{t}</p>
              <p className="text-fog text-[12.5px] leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
