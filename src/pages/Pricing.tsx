import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Check, Building2, GraduationCap, Sparkles } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter', price: '$9', credits: '100 credits', tag: 'For curious learners',
    features: ['1–2 short courses', 'AI tutor access', 'Canvas classroom sync', 'Course completion badges'],
    cta: 'Get started', highlight: false
  },
  {
    name: 'Scholar', price: '$39', credits: '500 credits', tag: 'Most popular',
    features: ['Full certificate program', 'AI faculty + graded homework', 'Exams & JGAI certificates', 'Priority AI responses', 'Transcript & verification'],
    cta: 'Enroll now', highlight: true
  },
  {
    name: 'University', price: 'Custom', credits: 'Unlimited seats', tag: 'For institutions',
    features: ['White-label platform', 'Institution admin console', 'Custom course pricing', 'Your rules & protocols', 'Dedicated support & SLA'],
    cta: 'Contact JGAI', highlight: false
  }
];

const COSTS = [
  ['Short course (2–4 weeks)', '40–80 credits'],
  ['Certificate program (8–16 weeks)', '150–300 credits'],
  ['Full degree-style program (MBA, CS…)', '400–900 credits'],
  ['Single exam retake', '10 credits'],
  ['Verified transcript', '25 credits']
];

export function Pricing() {
  return (
    <div className="space-y-16">
      <div className="text-center space-y-4 pt-6">
        <div className="tag mx-auto"><Coins size={13} /> Credit-based pricing</div>
        <h1 className="text-5xl font-bold">Pay in credits.<br /><span className="glow-text">Like a real university.</span></h1>
        <p className="text-fog max-w-xl mx-auto">
          Every course and program has a credit price set by its difficulty and length — just like
          credit hours at a university. Buy credits once, spend them on what you actually learn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {PLANS.map((p) => (
          <div key={p.name} className={`card space-y-5 !p-7 relative ${p.highlight ? '!border-jgai shadow-[0_0_40px_rgba(109,94,245,0.15)]' : ''}`}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 tag !text-[10px]">Most popular</span>}
            <div>
              <p className="font-semibold text-fog text-[13px] uppercase tracking-widest">{p.name}</p>
              <p className="text-4xl font-bold mt-2 display">{p.price}</p>
              <p className="text-jgai-bright text-sm font-semibold mt-1">{p.credits}</p>
            </div>
            <ul className="space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13.5px] text-fog">
                  <Check size={15} className="text-jgai-bright mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            {p.name === 'University'
              ? <a href="mailto:infoatjgdeveloper@gmail.com?subject=JGAI%20University%20Licensing" className={`block text-center ${p.highlight ? 'olive-button' : 'ghost-button'} text-sm w-full`}>{p.cta}</a>
              : <Link to="/login" className={`block text-center ${p.highlight ? 'olive-button' : 'ghost-button'} text-sm w-full`}>{p.cta}</Link>}
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-5">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2"><GraduationCap size={22} className="text-jgai-bright" /> What credits buy</h2>
        <div className="panel overflow-hidden">
          {COSTS.map(([item, cost]) => (
            <div key={item} className="trow flex justify-between items-center px-6 py-4 text-[14px]">
              <span className="text-fog">{item}</span>
              <span className="font-semibold text-jgai-bright">{cost}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[13px] text-fog flex items-center justify-center gap-1.5">
          <Building2 size={14} /> Universities set their own credit pricing on licensed instances.
        </p>
      </div>

      <div className="panel p-10 text-center space-y-4 max-w-3xl mx-auto grid-bg">
        <Sparkles size={24} className="text-jgai-bright mx-auto" />
        <h2 className="text-2xl font-bold">New accounts get 100 welcome credits</h2>
        <p className="text-fog text-sm">Enough for your first short course. No card required to start.</p>
        <Link to="/login" className="olive-button text-sm inline-block">Create account</Link>
      </div>
    </div>
  );
}
