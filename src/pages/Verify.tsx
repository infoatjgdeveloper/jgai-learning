import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Certificate } from '../components/Certificate';

interface CertPayload { n: string; p: string; ch: number; d: string; id?: string; g: string; }

export function Verify() {
  const [params] = useSearchParams();
  const raw = params.get('d');
  let cert: CertPayload | null = null;
  try { if (raw) cert = JSON.parse(decodeURIComponent(escape(atob(raw)))); } catch { cert = null; }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-6">
      <div className="text-center space-y-3">
        <div className="tag mx-auto"><ShieldCheck size={13} /> Certificate verification</div>
        <h1 className="text-4xl font-bold">Verify a JGAI certificate</h1>
      </div>
      {cert ? (
        <>
          <div className="panel p-5 flex items-center gap-3 border-green-300 bg-green-50">
            <ShieldCheck size={22} className="text-green-700 shrink-0" />
            <div className="text-[14px]">
              <p className="font-bold text-green-800">Valid JGAI certificate record</p>
              <p className="text-green-700">{cert.n} · {cert.p} · {cert.ch} credit hours · grade {cert.g} · issued {cert.d}{cert.id ? ` · ${cert.id}` : ''}</p>
            </div>
          </div>
          <Certificate studentName={cert.n} programName={cert.p} creditHours={cert.ch} date={new Date(cert.d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} verifyId={cert.id} />
        </>
      ) : (
        <div className="panel p-8 text-center space-y-3">
          <ShieldAlert size={28} className="text-amber-500 mx-auto" />
          <p className="font-semibold">No certificate data in this link.</p>
          <p className="text-fog text-sm">Ask the certificate holder for their verification link, or <Link to="/university" className="text-jgai font-semibold">earn your own</Link>.</p>
        </div>
      )}
    </div>
  );
}
