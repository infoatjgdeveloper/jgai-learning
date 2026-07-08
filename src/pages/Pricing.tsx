import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Check, Building2, GraduationCap, Landmark, Calculator } from 'lucide-react';

const RATE = 25; // JGAI credits per academic credit hour

const PACKS = [
  { name: 'Part-time', price: '$29', credits: '400 credits', hours: '≈ 16 credit hours', tag: 'A course or two per term', features: ['1–2 courses per semester', 'AI faculty & tutoring', 'Graded homework & exams', 'Official transcript entries'], highlight: false },
  { name: 'Full-time', price: '$79', credits: '1,200 credits', hours: '≈ 48 credit hours', tag: 'Full course load', features: ['Full semester course load', 'Priority AI responses', 'Certificates included', 'Academic advisor AI', 'Degree-track planning'], highlight: true },
  { name: 'Institution', price: 'Custom', credits: 'Unlimited', hours: 'Campus license', tag: 'For universities', features: ['White-label platform', 'Set your own tuition rates', 'Admin & registrar consoles', 'Your academic policies', 'Dedicated support & SLA'], highlight: false }
];

const EXAMPLES = [
  ['Single course (3 credit hours)', `${3 * RATE} credits`],
  ['Short certificate (8 credit hours)', `${8 * RATE} credits`],
  ['Professional certificate (16 credit hours)', `${16 * RATE} credits`],
  ['MBA-track program (36 credit hours)', `${36 * RATE} credits`],
  ['Exam retake', '10 credits'],
  ['Verified transcript copy', '25 credits']
];

export function Pricing() {
  return (
    <div className="space-y-16">
      <div className="text-center space-y-4 pt-6">
        <div className="tag mx-auto"><Landmark size={13} /> Tuition, the university way</div>
        <h1 className="text-5xl font-bold">Tuition per <span className="glow-text">credit hour</span>.</h1>
        <p className="text-fog max-w-2xl mx-auto leading-relaxed">
          JGAI works like a real university. Every program is measured in academic credit hours
          (1 credit hour ≈ 15 hours of instruction, the Carnegie standard). Tuition is simple:
          <span className="font-bold text-snow"> {RATE} JGAI credits per credit hour</span> — no subscriptions, no seat time you don't use.
        </p>
      </div>

      <div className="panel max-w-2xl mx-auto p-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
        <div><p className="text-3xl font-bold display text-jgai">{RATE} cr</p><p className="text-[11px] uppercase tracking-widest text-fog">per credit hour</p></div>
        <Calculator size={20} className="text-edge-2" />
        <div><p className="text-3xl font-bold display">3 ch</p><p className="text-[11px] uppercase tracking-widest text-fog">typical course</p></div>
        <span className="text-2xl text-edge-2">=</span>
        <div><p className="text-3xl font-bold display text-jgai">{3 * RATE} cr</p><p className="text-[11px] uppercase tracking-widest text-fog">course tuition</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {PACKS.map((p) => (
          <div key={p.name} className={`card space-y-5 !p-7 relative ${p.highlight ? '!border-jgai shadow-[0_12px_40px_rgba(29,95,214,0.15)]' : ''}`}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 tag !text-[10px] !bg-jgai !text-white !border-jgai">Most popular</span>}
            <div>
              <p className="font-semibold text-fog text-[12px] uppercase tracking-widest">{p.name}</p>
              <p className="text-4xl font-bold mt-2 display">{p.price}</p>
              <p className="text-jgai text-sm font-semibold mt-1">{p.credits} · {p.hours}</p>
              <p className="text-[12px] text-fog mt-1">{p.tag}</p>
            </div>
            <ul className="space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13.5px] text-fog"><Check size={15} className="text-jgai mt-0.5 shrink-0" /> {f}</li>
              ))}
            </ul>
            {p.name === 'Institution'
              ? <a href="mailto:infoatjgdeveloper@gmail.com?subject=JGAI%20Campus%20License" className={`block text-center ${p.highlight ? 'olive-button' : 'ghost-button'} text-sm w-full`}>Contact JGAI</a>
              : <Link to="/login" className={`block text-center ${p.highlight ? 'olive-button' : 'ghost-button'} text-sm w-full`}>Add credits</Link>}
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-5">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2"><GraduationCap size={22} className="text-jgai" /> Tuition examples</h2>
        <div className="panel overflow-hidden">
          {EXAMPLES.map(([item, cost]) => (
            <div key={item} className="trow flex justify-between items-center px-6 py-4 text-[14px]">
              <span className="text-fog">{item}</span>
              <span className="font-semibold text-jgai">{cost}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[13px] text-fog flex items-center justify-center gap-1.5">
          <Building2 size={14} /> Licensed universities set their own per-credit-hour tuition on their instance.
        </p>
      </div>

      <div className="panel p-10 text-center space-y-4 max-w-3xl mx-auto grid-bg">
        <Coins size={24} className="text-jgai mx-auto" />
        <h2 className="text-2xl font-bold">New students get 300 welcome credits</h2>
        <p className="text-fog text-sm">That's 12 credit hours — a full course, on us. No card required.</p>
        <Link to="/login" className="olive-button text-sm inline-block">Start enrollment</Link>
      </div>
    </div>
  );
}
