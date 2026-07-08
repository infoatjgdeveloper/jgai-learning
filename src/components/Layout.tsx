import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LayoutDashboard, LogOut, User, School, GraduationCap, ShieldCheck, Building2, ScrollText, BookOpen, Landmark, Coins, Menu, X } from 'lucide-react';

const SUPER_ADMINS = ['infoatjgdeveloper@gmail.com'];
const TERM = 'Fall 2026';

function Crest({ size = 38 }: { size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold display shrink-0"
      style={{ width: size, height: size, background: 'linear-gradient(135deg,#123a8c,#2b6cff)', border: '2px solid #b89235', fontSize: size * 0.34 }}>
      JG
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isSuperAdmin = profile && SUPER_ADMINS.includes(profile.email);

  const handleLogout = async () => { await logout(); navigate('/'); };

  /* ---------- SIGNED-IN: STUDENT PORTAL (sidebar) ---------- */
  if (profile) {
    const links = [
      { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
      { to: '/university', icon: <GraduationCap size={17} />, label: 'Registration' },
      { to: '/catalog', icon: <BookOpen size={17} />, label: 'Course catalog' },
      { to: '/classroom', icon: <School size={17} />, label: 'My classroom' },
      { to: '/transcript', icon: <ScrollText size={17} />, label: 'Transcript' },
      { to: '/pricing', icon: <Coins size={17} />, label: 'Bursar / tuition' },
      ...(profile.role !== 'student' ? [{ to: '/university-admin', icon: <Building2 size={17} />, label: 'Institution' }] : []),
      ...(isSuperAdmin ? [{ to: '/admin', icon: <ShieldCheck size={17} />, label: 'JGAI Admin' }] : []),
      { to: '/profile', icon: <User size={17} />, label: 'Profile' }
    ];
    return (
      <div className="min-h-screen flex">
        <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-edge flex-col z-50 transition-transform ${mobileOpen ? 'flex translate-x-0' : 'hidden lg:flex'}`}>
          <Link to="/" className="flex items-center gap-3 px-5 py-5 border-b border-edge">
            <Crest />
            <div>
              <p className="font-bold display leading-tight" style={{ color: '#123a8c' }}>JGAI University</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-fog">Student portal</p>
            </div>
          </Link>
          <nav className="flex-grow px-3 py-4 space-y-1 overflow-y-auto">
            {links.map((l) => {
              const active = location.pathname.startsWith(l.to);
              return (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                    active ? 'bg-jgai-sky text-jgai-bright border-l-[3px] border-jgai' : 'text-fog hover:bg-panel-2 hover:text-snow'}`}>
                  {l.icon}{l.label}
                </Link>
              );
            })}
          </nav>
          <div className="px-5 py-4 border-t border-edge space-y-2">
            <p className="text-[12px] font-semibold truncate">{profile.displayName}</p>
            <p className="text-[11px] text-fog truncate">{profile.email}</p>
            <button onClick={handleLogout} className="flex items-center gap-2 text-[12.5px] text-fog hover:text-red-600 transition-colors"><LogOut size={14} /> Sign out</button>
          </div>
        </aside>
        {mobileOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

        <div className="flex-grow min-w-0 flex flex-col">
          <header className="bg-white border-b border-edge px-5 py-3 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-fog" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
              <p className="text-[13px] text-fog"><span className="font-semibold text-snow">{TERM}</span> · Registration open</p>
            </div>
            <span className="tag !text-[10px]"><Landmark size={11} /> Student ID: {profile.uid.slice(0, 8).toUpperCase()}</span>
          </header>
          <main className="flex-grow max-w-6xl w-full mx-auto px-5 md:px-8 py-8">{children}</main>
          <footer className="border-t border-edge py-5 px-8 text-[12px] text-fog flex flex-wrap gap-x-6 gap-y-1 justify-between">
            <span>JGAI University · Office of the Registrar</span>
            <span>&copy; {new Date().getFullYear()} JGAI</span>
          </footer>
        </div>
      </div>
    );
  }

  /* ---------- PUBLIC: COLLEGIATE SITE ---------- */
  const pub = [
    { to: '/catalog', label: 'Academics' },
    { to: '/university', label: 'Admissions' },
    { to: '/pricing', label: 'Tuition & aid' },
    { to: '/verify', label: 'Verify a credential' }
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <div className="text-white text-[12px] px-6 py-1.5" style={{ background: '#123a8c' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="hidden sm:block">The AI University · {TERM} registration is open</span>
          <div className="flex gap-4">
            <Link to="/pricing" className="hover:underline">For institutions</Link>
            <Link to="/login" className="hover:underline font-semibold">Student sign in</Link>
          </div>
        </div>
      </div>
      <header className="bg-white border-b-4 py-4 px-6 sticky top-0 z-50" style={{ borderColor: '#b89235' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <Crest size={44} />
            <div>
              <p className="text-xl font-bold display leading-tight" style={{ color: '#123a8c' }}>JGAI University</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-fog">Founded on intelligence</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-semibold">
            {pub.map((l) => (
              <Link key={l.to} to={l.to} className={`pb-1 border-b-2 transition-colors ${location.pathname.startsWith(l.to) ? 'border-jgai text-jgai-bright' : 'border-transparent text-snow hover:text-jgai'}`}>{l.label}</Link>
            ))}
          </nav>
          <Link to="/university" className="olive-button text-sm !px-6 !py-2.5 !rounded-lg">Apply now</Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10">{children}</main>

      <footer className="text-white mt-10" style={{ background: '#0e1a2b' }}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-3"><Crest /><p className="font-bold display text-lg">JGAI University</p></div>
            <p className="text-white/60 leading-relaxed max-w-xs">The AI University — personalized, credit-hour education taught, graded and certified by AI faculty. A JGAI institution.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-widest text-[11px] text-white/50">Academics</p>
            <Link to="/catalog" className="block text-white/80 hover:text-white">Course catalog</Link>
            <Link to="/university" className="block text-white/80 hover:text-white">Admissions</Link>
            <Link to="/pricing" className="block text-white/80 hover:text-white">Tuition & aid</Link>
          </div>
          <div className="space-y-2">
            <p className="font-bold uppercase tracking-widest text-[11px] text-white/50">Offices</p>
            <Link to="/transcript" className="block text-white/80 hover:text-white">Registrar</Link>
            <Link to="/verify" className="block text-white/80 hover:text-white">Credential verification</Link>
            <a href="mailto:infoatjgdeveloper@gmail.com" className="block text-white/80 hover:text-white">Institution licensing</a>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-center text-[12px] text-white/50">&copy; {new Date().getFullYear()} JGAI · JGAI University is a JGAI platform</div>
      </footer>
    </div>
  );
}
