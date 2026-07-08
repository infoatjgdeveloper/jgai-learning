import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, GraduationCap, Award } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { loadRecord, StoredProgram, programGPA } from '../lib/store';

export function Transcript() {
  const { profile, user } = useAuth();
  const [programs, setPrograms] = useState<StoredProgram[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadRecord(user?.uid ?? null).then((r) => { setPrograms(r.programs); setLoaded(true); });
  }, [user]);

  const earned = programs.filter((p) => p.completedWeeks.length === p.weeks.length);
  const totalCH = earned.reduce((a, p) => a + p.creditHours, 0);
  const inProgressCH = programs.reduce((a, p) => a + p.creditHours, 0) - totalCH;
  const gpas = programs.map((p) => programGPA(p).gpa).filter((g): g is number => g !== null);
  const gpa = gpas.length ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2) : '—';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3 pt-4">
        <div className="tag mx-auto"><ScrollText size={13} /> Official transcript</div>
        <h1 className="text-4xl font-bold">{profile?.displayName || 'JGAI Student'}</h1>
        <p className="text-fog text-sm">JGAI University · Student record{user ? '' : ' (local — sign in to save permanently)'}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="panel p-5 text-center"><p className="text-3xl font-bold display text-jgai">{totalCH}</p><p className="text-[11px] uppercase tracking-widest text-fog mt-1">Credit hours earned</p></div>
        <div className="panel p-5 text-center"><p className="text-3xl font-bold display">{inProgressCH}</p><p className="text-[11px] uppercase tracking-widest text-fog mt-1">In progress</p></div>
        <div className="panel p-5 text-center"><p className="text-3xl font-bold display text-jgai">{gpa}</p><p className="text-[11px] uppercase tracking-widest text-fog mt-1">GPA</p></div>
      </div>

      <div className="panel overflow-hidden">
        <div className="px-6 py-4 border-b border-edge font-semibold flex items-center gap-2"><GraduationCap size={16} className="text-jgai" /> Academic record</div>
        {loaded && programs.length === 0 && <p className="px-6 py-8 text-fog text-sm">No enrollments yet. <Link to="/university" className="text-jgai font-semibold">Enroll in a program</Link>.</p>}
        {programs.map((p) => {
          const done = p.completedWeeks.length === p.weeks.length;
          const { letter } = programGPA(p);
          return (
            <div key={p.name} className="trow px-6 py-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-[14.5px]">{p.name}</p>
                <p className="text-[12.5px] text-fog">Enrolled {new Date(p.enrolledAt).toLocaleDateString()} · {p.creditHours} credit hours{p.certificateId ? ` · ${p.certificateId}` : ''}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-lg font-bold display text-jgai">{letter}</span>
                {done
                  ? <span className="flex items-center gap-1 text-[11px] font-bold uppercase text-green-700 bg-green-50 border border-green-300 px-2.5 py-1 rounded-full"><Award size={11} /> Completed</span>
                  : <span className="text-[11px] font-bold uppercase text-fog bg-panel-2 px-2.5 py-1 rounded-full">{Math.round((p.completedWeeks.length / p.weeks.length) * 100)}%</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[12px] text-fog text-center">Grades derive from proctored quiz performance. IP = in progress.</p>
    </div>
  );
}
