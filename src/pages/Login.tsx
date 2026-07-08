import React from 'react';
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';
import { LogIn, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const { user, login, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full text-center space-y-8 py-12"
      >
        <div className="w-20 h-20 bg-olive-accent rounded-full flex items-center justify-center text-white mx-auto shadow-xl">
          <GraduationCap size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-bold italic">Welcome Back</h2>
          <p className="text-gray-500">Sign in to continue your learning journey.</p>
        </div>
        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" referrerPolicy="no-referrer" />
          Continue with Google
        </button>
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
