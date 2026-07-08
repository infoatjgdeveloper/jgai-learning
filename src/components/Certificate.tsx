import React from 'react';

interface CertificateProps {
  studentName: string;
  programName: string;
  creditHours: number;
  date?: string;
  verifyId?: string;
  sample?: boolean;
}

export function Certificate({ studentName, programName, creditHours, date, verifyId, sample }: CertificateProps) {
  const issued = date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const vid = verifyId || `JGAI-${new Date().getFullYear()}-XXXX-XXXX`;
  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-xl border border-edge-2 select-none">
      {sample && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-6xl md:text-8xl font-bold text-jgai/8 rotate-[-24deg] tracking-widest uppercase display" style={{ color: 'rgba(29,95,214,0.08)' }}>Sample</span>
        </div>
      )}
      <div className="border-[10px] border-double rounded-xl m-2" style={{ borderColor: '#123a8c' }}>
        <div className="px-8 md:px-14 py-10 text-center space-y-5">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold display text-lg"
              style={{ background: 'linear-gradient(135deg,#1d5fd6,#0e7490)' }}>JG</div>
            <div className="text-left">
              <p className="font-bold display text-lg leading-tight" style={{ color: '#123a8c' }}>JGAI University</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-fog">A JGAI Institution</p>
            </div>
          </div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-fog">Certificate of Completion</p>
          <p className="text-sm text-fog">This certifies that</p>
          <p className="text-3xl md:text-4xl font-bold display" style={{ color: '#0e1a2b', fontFamily: 'Space Grotesk' }}>{studentName}</p>
          <p className="text-sm text-fog max-w-md mx-auto leading-relaxed">
            has successfully completed all lectures, coursework and examinations required for the program
          </p>
          <p className="text-xl md:text-2xl font-semibold" style={{ color: '#1d5fd6' }}>{programName}</p>
          <p className="text-[13px] text-fog">{creditHours} credit hours · Verified transcript on record</p>
          <div className="flex justify-between items-end pt-6 px-2 md:px-8">
            <div className="text-left">
              <p className="font-semibold text-sm border-t border-edge-2 pt-2 px-1" style={{ fontFamily: 'cursive' }}>JGAI Registrar</p>
              <p className="text-[10px] uppercase tracking-widest text-fog mt-1">Office of the Registrar</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-[9px] font-bold uppercase tracking-tight text-center leading-tight"
              style={{ borderColor: '#b89235', color: '#b89235' }}>
              JGAI<br />Official<br />Seal
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm border-t border-edge-2 pt-2 px-1">{issued}</p>
              <p className="text-[10px] uppercase tracking-widest text-fog mt-1">Date of issue</p>
            </div>
          </div>
          <p className="text-[10px] text-fog pt-2">Verify at jgai-learning.vercel.app/verify · ID: {vid}</p>
        </div>
      </div>
    </div>
  );
}
