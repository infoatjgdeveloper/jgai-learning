import React, { useState } from 'react';
import { ShieldCheck, Building2, Users, Coins, TrendingUp, Plus, Search, MoreHorizontal, CircleDot } from 'lucide-react';

interface Tenant {
  id: string; name: string; plan: 'Trial' | 'Licensed' | 'Enterprise';
  students: number; creditsSold: number; mrr: number; status: 'active' | 'onboarding' | 'churn-risk';
}

const SEED: Tenant[] = [
  { id: 'u1', name: 'Demo State University', plan: 'Licensed', students: 4200, creditsSold: 182000, mrr: 6400, status: 'active' },
  { id: 'u2', name: 'Northfield Business School', plan: 'Enterprise', students: 1850, creditsSold: 96000, mrr: 9200, status: 'active' },
  { id: 'u3', name: 'Coastal Community College', plan: 'Trial', students: 310, creditsSold: 4100, mrr: 0, status: 'onboarding' },
];

const STATUS_STYLE: Record<Tenant['status'], string> = {
  active: 'text-emerald-700 bg-emerald-50 border-emerald-300',
  onboarding: 'text-sky-700 bg-sky-50 border-sky-300',
  'churn-risk': 'text-amber-700 bg-amber-50 border-amber-300'
};

export function Admin() {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try { return JSON.parse(localStorage.getItem('jgai_tenants') || '') || SEED; } catch { return SEED; }
  });
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const save = (t: Tenant[]) => { setTenants(t); localStorage.setItem('jgai_tenants', JSON.stringify(t)); };
  const addTenant = () => {
    if (!newName.trim()) return;
    save([...tenants, { id: `u${Date.now()}`, name: newName.trim(), plan: 'Trial', students: 0, creditsSold: 0, mrr: 0, status: 'onboarding' }]);
    setNewName(''); setAdding(false);
  };

  const filtered = tenants.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));
  const totals = tenants.reduce((a, t) => ({ students: a.students + t.students, credits: a.credits + t.creditsSold, mrr: a.mrr + t.mrr }), { students: 0, credits: 0, mrr: 0 });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="tag mb-3"><ShieldCheck size={13} /> JGAI Admin</div>
          <h1 className="text-4xl font-bold">Platform control</h1>
          <p className="text-fog mt-1 text-sm">Manage institutions, licensing and the credit economy.</p>
        </div>
        <button onClick={() => setAdding(true)} className="olive-button text-sm flex items-center gap-2"><Plus size={15} /> Add institution</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Institutions', value: tenants.length, icon: <Building2 size={17} /> },
          { label: 'Total students', value: totals.students.toLocaleString(), icon: <Users size={17} /> },
          { label: 'Credits sold', value: totals.credits.toLocaleString(), icon: <Coins size={17} /> },
          { label: 'MRR', value: `$${totals.mrr.toLocaleString()}`, icon: <TrendingUp size={17} /> }
        ].map((s) => (
          <div key={s.label} className="panel p-5 space-y-2">
            <div className="flex items-center justify-between text-fog"><span className="text-[12px] uppercase tracking-widest">{s.label}</span><span className="text-jgai">{s.icon}</span></div>
            <p className="text-2xl font-bold display">{s.value}</p>
          </div>
        ))}
      </div>

      {adding && (
        <div className="panel p-5 flex flex-wrap gap-3 items-center">
          <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTenant()} placeholder="Institution name" className="input-dark flex-grow max-w-sm" />
          <button onClick={addTenant} className="olive-button text-sm">Create tenant</button>
          <button onClick={() => setAdding(false)} className="ghost-button text-sm">Cancel</button>
        </div>
      )}

      <div className="panel overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-edge">
          <Search size={15} className="text-fog" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search institutions…" className="bg-transparent outline-none text-sm flex-grow placeholder:text-[#5d5d78]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-fog text-left text-[11px] uppercase tracking-widest border-b border-edge">
                <th className="px-5 py-3 font-medium">Institution</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Students</th>
                <th className="px-5 py-3 font-medium">Credits sold</th>
                <th className="px-5 py-3 font-medium">MRR</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="trow hover:bg-jgai-sky/40 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{t.name}</td>
                  <td className="px-5 py-3.5 text-fog">{t.plan}</td>
                  <td className="px-5 py-3.5 text-fog">{t.students.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-fog">{t.creditsSold.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-fog">${t.mrr.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${STATUS_STYLE[t.status]}`}>
                      <CircleDot size={10} /> {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-fog"><MoreHorizontal size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[12px] text-fog">Demo data shown for institutions you haven't onboarded yet. New tenants you add are saved locally until connected to billing.</p>
    </div>
  );
}
