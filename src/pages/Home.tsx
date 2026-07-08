import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { School, Sparkles, LayoutDashboard, ArrowRight, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();

  const buildPath = () => {
    navigate(`/university${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`);
  };

  return (
    <div className="space-y-28 sans">
      <section className="relative flex flex-col items-center text-center pt-16 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 max-w-4xl"
        >
          <div className="tag">
            <Sparkles size={13} />
            AI-powered university
          </div>
          <h1 className="text-6xl md:text-8xl font-semibold leading-[0.95] tracking-tight serif">
            Learn anything.
            <br />
            <span className="italic text-jgai">AI builds the path.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Tell JGAI what you want to master. It gathers the best videos and materials,
            builds one prioritized plan, and runs your learning like a real university —
            lectures, homework, quizzes, exams, and certificates.
          </p>
          <div className="flex items-center gap-2 max-w-xl mx-auto bg-white border border-[#e3e1da] rounded-full p-1.5 pl-6 shadow-sm focus-within:border-jgai transition-colors">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buildPath()}
              placeholder="What do you want to learn today?"
              className="flex-grow bg-transparent outline-none text-base"
            />
            <button onClick={buildPath} className="olive-button whitespace-nowrap flex items-center gap-2 group">
              Build my path
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard" className="card space-y-5 group hover:-translate-y-1">
          <div className="w-12 h-12 bg-jgai-soft rounded-2xl flex items-center justify-center text-jgai">
            <LayoutDashboard size={24} />
          </div>
          <h3 className="text-2xl font-semibold serif">One dashboard</h3>
          <p className="text-gray-500 leading-relaxed text-[15px]">
            Everything in one place — your real school coursework and your JGAI programs.
            Deadlines, grades, and progress across both worlds.
          </p>
        </Link>
        <Link to="/classroom" className="card space-y-5 group hover:-translate-y-1">
          <div className="w-12 h-12 bg-mint rounded-2xl flex items-center justify-center text-mint-deep">
            <School size={24} />
          </div>
          <h3 className="text-2xl font-semibold serif">Classroom sync</h3>
          <p className="text-gray-500 leading-relaxed text-[15px]">
            Connect Canvas and see your actual courses, assignments and grades — with an
            AI assistant that helps you understand and finish work faster.
          </p>
        </Link>
        <Link to="/university" className="card space-y-5 group hover:-translate-y-1">
          <div className="w-12 h-12 bg-jgai-deep rounded-2xl flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          <h3 className="text-2xl font-semibold serif">JGAI University</h3>
          <p className="text-gray-500 leading-relaxed text-[15px]">
            Full degree-style programs — MBA, CS, Data Science — free, structured like a real
            university, and certified by JGAI on completion.
          </p>
        </Link>
      </section>

      <section className="bg-jgai-deep rounded-[40px] p-12 md:p-20 text-white text-center space-y-10">
        <h2 className="text-4xl md:text-6xl font-semibold leading-tight max-w-3xl mx-auto serif">
          A university that runs on <span className="italic opacity-80">intelligence</span>, not tuition.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-4xl md:text-5xl font-semibold mb-2 serif">Free</p>
            <p className="text-xs uppercase tracking-widest opacity-60">Every program</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-semibold mb-2 serif">24/7</p>
            <p className="text-xs uppercase tracking-widest opacity-60">AI faculty</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-semibold mb-2 serif">Real</p>
            <p className="text-xs uppercase tracking-widest opacity-60">LMS sync</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-semibold mb-2 serif">Certified</p>
            <p className="text-xs uppercase tracking-widest opacity-60">By JGAI</p>
          </div>
        </div>
      </section>
    </div>
  );
}
