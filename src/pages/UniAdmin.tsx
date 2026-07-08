import React, { useState } from 'react';
import { Building2, Palette, BookOpen, Users, Coins, Save, Plus } from 'lucide-react';

interface UniConfig { name: string; color: string; welcomeCredits: number; courseCost: number; }
interface UniCourse { id: string; title: string; credits: number; students: number; }

const DEFAULT_CFG: UniConfig = { name: 'Your University', color: '#6d5ef5', welcomeCredits: 100, courseCost: 60 };
const DEFAULT_COURSES: UniCourse[] = [
  { id: 'c1', title: 'Intro to Data Structures', credits: 60, students: 128 },
  { id: 'c2', title: 'Principles of Marketing', credits: 45, students: 87 },
];

export function UniAdmin() {
  const [cfg, setCfg] = useState<UniConfig>(() => {
    try { return { ...DEFAULT_CFG, ...JSON.parse(localStorage.getItem('jgai_uni_cfg') || '{}') }; } catch { return DEFAULT_CFG; }
  });
  const [courses, setCourses] = useState<UniCourse[]>(() => {
    try { return JSON.parse(localStorage.getItem('jgai_uni_courses') || '') || DEFAULT_COURSES; } catch { return DEFAULT_COURSES; }
  });
  const [newCourse, setNewCourse] = useState('');
  const [saved, setSaved] = useState(false);

  const saveCfg = () => {
    localStorage.setItem('jgai_uni_cfg', JSON.stringify(cfg));
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  };
  const addCourse = () => {
    if (!newCourse.trim()) return;
    const next = [...courses, { id: `c${Date.now()}`, title: newCourse.trim(), credits: cfg.courseCost, students: 0 }];
    setCourses(next); localStorage.setItem('jgai_uni_courses', JSON.stringify(next)); setNewCourse('');
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="tag mb-3"><Building2 size={13} /> Institution admin</div>
        <h1 className="text-4xl font-bold">{cfg.name}</h1>
        <p className="text-fog mt-1 text-sm">Customize your JGAI instance — branding, credit pricing and courses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2"><Palette size={17} className="text-jgai" /> Branding & rules</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[12px] uppercase tracking-widest text-fog">Institution name</label>
              <input value={cfg.name} onChange={(e) => setCfg({ ...cfg, name: e.target.value })} className="input-dark mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] uppercase tracking-widest text-fog">Brand color</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input type="color" value={cfg.color} onChange={(e) => setCfg({ ...cfg, color: e.target.value })} className="w-10 h-10 rounded-lg bg-panel border border-edge-2 cursor-pointer" />
                  <span className="text-sm text-fog">{cfg.color}</span>
                </div>
              </div>
              <div>
                <label className="text-[12px] uppercase tracking-widest text-fog">Welcome credits</label>
                <input type="number" value={cfg.welcomeCredits} onChange={(e) => setCfg({ ...cfg, welcomeCredits: +e.target.value })} className="input-dark mt-1.5" />
              </div>
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-fog">Default course price (credits)</label>
              <input type="number" value={cfg.courseCost} onChange={(e) => setCfg({ ...cfg, courseCost: +e.target.value })} className="input-dark mt-1.5" />
            </div>
            <button onClick={saveCfg} className="olive-button text-sm flex items-center gap-2">
              <Save size={15} /> {saved ? 'Saved!' : 'Save settings'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="panel p-5 space-y-2">
              <div className="flex items-center justify-between text-fog"><span className="text-[12px] uppercase tracking-widest">Students</span><Users size={16} className="text-jgai" /></div>
              <p className="text-2xl font-bold display">{courses.reduce((a, c) => a + c.students, 0)}</p>
            </div>
            <div className="panel p-5 space-y-2">
              <div className="flex items-center justify-between text-fog"><span className="text-[12px] uppercase tracking-widest">Credit price</span><Coins size={16} className="text-jgai" /></div>
              <p className="text-2xl font-bold display">{cfg.courseCost}<span className="text-sm text-fog font-normal"> /course</span></p>
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="px-5 py-3.5 border-b border-edge flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2 text-[15px]"><BookOpen size={16} className="text-jgai" /> Courses</h2>
            </div>
            {courses.map((c) => (
              <div key={c.id} className="trow flex justify-between items-center px-5 py-3.5 text-[13.5px]">
                <span className="font-medium">{c.title}</span>
                <span className="text-fog">{c.credits} cr · {c.students} students</span>
              </div>
            ))}
            <div className="flex gap-2 p-4 border-t border-edge">
              <input value={newCourse} onChange={(e) => setNewCourse(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCourse()} placeholder="New course title…" className="input-dark flex-grow !py-2.5 text-sm" />
              <button onClick={addCourse} className="ghost-button text-sm flex items-center gap-1.5 !py-2.5"><Plus size={14} /> Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
