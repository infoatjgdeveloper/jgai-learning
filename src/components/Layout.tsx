import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LayoutDashboard, LogOut, User, School, Sparkles } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLink = (to: string, icon: React.ReactNode, label: string) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          active ? 'bg-jgai-soft text-jgai-deep' : 'text-gray-500 hover:text-jgai'
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-paper/90 backdrop-blur border-b border-[#edece7] py-3 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-jgai-deep rounded-xl flex items-center justify-center text-white font-bold text-sm sans">
              JG
            </div>
            <span className="text-xl font-semibold tracking-tight serif">
              JGAI <span className="italic text-jgai">Learning</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium sans">
            {navLink('/university', <Sparkles size={16} />, 'JGAI University')}
            {profile && (
              <>
                {navLink('/classroom', <School size={16} />, 'Classroom')}
                {navLink('/dashboard', <LayoutDashboard size={16} />, 'Dashboard')}
                {navLink('/profile', <User size={16} />, 'Profile')}
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {profile ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-jgai transition-colors sans"
              >
                <LogOut size={16} />
                Sign out
              </button>
            ) : (
              <Link to="/login" className="olive-button text-sm px-6 py-2.5">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10">{children}</main>

      <footer className="border-t border-[#edece7] py-8 px-6 text-center text-sm text-gray-400 sans">
        <p>
          JGAI Learning — an AI university platform by{' '}
          <a href="https://jgdeveloper.com" className="text-jgai hover:underline">
            JG Developer
          </a>{' '}
          &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
