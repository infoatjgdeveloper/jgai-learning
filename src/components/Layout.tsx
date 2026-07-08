import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LayoutDashboard, LogOut, User, School, Sparkles, ShieldCheck, Building2, CreditCard } from 'lucide-react';

const SUPER_ADMINS = ['infoatjgdeveloper@gmail.com'];

export function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSuperAdmin = profile && SUPER_ADMINS.includes(profile.email);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLink = (to: string, icon: React.ReactNode, label: string) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors text-[13px] ${
          active ? 'bg-jgai/15 text-jgai-bright border border-jgai/30' : 'text-fog hover:text-snow border border-transparent'
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-void/80 backdrop-blur-xl border-b border-edge py-3 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm display"
              style={{ background: 'linear-gradient(135deg,#6d5ef5,#4ed8e8)' }}>
              JG
            </div>
            <span className="text-lg font-semibold tracking-tight display">
              JGAI <span className="glow-text">Learning</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 font-medium">
            {!profile && navLink('/pricing', <CreditCard size={15} />, 'Pricing')}
            {navLink('/university', <Sparkles size={15} />, 'JGAI University')}
            {profile && (
              <>
                {navLink('/classroom', <School size={15} />, 'Classroom')}
                {navLink('/dashboard', <LayoutDashboard size={15} />, 'Dashboard')}
                {profile.role !== 'student' && navLink('/university-admin', <Building2 size={15} />, 'Institution')}
                {isSuperAdmin && navLink('/admin', <ShieldCheck size={15} />, 'JGAI Admin')}
                {navLink('/profile', <User size={15} />, 'Profile')}
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {profile ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-[13px] text-fog hover:text-snow transition-colors">
                <LogOut size={15} /> Sign out
              </button>
            ) : (
              <Link to="/login" className="olive-button text-sm !px-5 !py-2">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10">{children}</main>

      <footer className="border-t border-edge py-10 px-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-fog">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: 'linear-gradient(135deg,#6d5ef5,#4ed8e8)' }}>JG</div>
            <span><span className="text-snow font-semibold">JGAI Learning</span> — a JGAI product</span>
          </div>
          <div className="flex gap-6">
            <Link to="/pricing" className="hover:text-snow transition-colors">Pricing</Link>
            <Link to="/university" className="hover:text-snow transition-colors">Programs</Link>
            <span>&copy; {new Date().getFullYear()} JGAI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
