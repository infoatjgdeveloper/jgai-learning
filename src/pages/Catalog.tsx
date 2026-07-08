import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Users, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { CATALOG, CATEGORIES, CatalogCourse } from '../data/catalog';

export function CourseCard({ c }: { c: CatalogCourse }) {
  const navigate = useNavigate();
  const cat = CATEGORIES.find((x) => x.name === c.category);
  return (
    <button
      onClick={() => navigate(`/university?topic=${encodeURIComponent(c.title)}`)}
      className="card !p-0 overflow-hidden text-left flex flex-col group"
    >
      <div className="h-32 relative flex items-end p-4" style={{ background: c.gradient }}>
        <span className="text-white/95 font-bold text-lg display leading-tight drop-shadow">{c.title}</span>
        <span className="absolute top-3 right-3 bg-white/90 text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ color: cat?.color }}>{c.category}</span>
      </div>
      <div className="p-4 space-y-3 flex-grow flex flex-col">
        <p className="text-[13px] text-fog leading-relaxed flex-grow">{c.blurb}</p>
        <p className="text-[12px] text-fog">{c.professor}</p>
        <div className="flex items-center gap-3 text-[12px] font-medium">
          <span className="flex items-center gap-1 text-amber-500"><Star size={13} fill="currentColor" /> {c.rating}</span>
          <span className="flex items-center gap-1 text-fog"><Users size={13} /> {c.students.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-fog"><Clock size={13} /> {c.creditHours} ch</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-edge">
          <span className="text-[13px] font-bold text-jgai">{c.creditHours * 25} credits tuition</span>
          <span className="text-[12px] font-semibold text-jgai flex items-center gap-0.5 group-hover:gap-1.5 transition-all">Enroll <ChevronRight size={13} /></span>
        </div>
      </div>
    </button>
  );
}

export function Catalog() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = CATALOG.filter(
    (c) =>
      (!cat || c.category === cat) &&
      (c.title.toLowerCase().includes(query.toLowerCase()) || c.blurb.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 pt-4">
        <div className="tag mx-auto"><BookOpen size={13} /> Course catalog</div>
        <h1 className="text-5xl font-bold">Explore the <span className="glow-text">catalog</span>.</h1>
        <p className="text-fog max-w-xl mx-auto">
          Every course is taught by AI faculty, measured in real credit hours, and personalized to your
          schedule at enrollment. Don't see yours? <button onClick={() => navigate('/university')} className="text-jgai font-semibold hover:underline">Create any program</button>.
        </p>
        <div className="max-w-xl mx-auto flex items-center gap-2 panel p-1.5 pl-4">
          <Search size={17} className="text-fog" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses, skills, subjects…" className="flex-grow bg-transparent outline-none text-[15px]" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => setCat(null)} className={`choice ${!cat ? 'active' : ''}`}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.name} onClick={() => setCat(cat === c.name ? null : c.name)} className={`choice ${cat === c.name ? 'active' : ''}`} style={cat === c.name ? { borderColor: c.color, color: c.color, background: `${c.color}14` } : {}}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((c) => <CourseCard key={c.id} c={c} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-fog">No catalog match for "{query}", but JGAI can teach it anyway.</p>
          <button onClick={() => navigate(`/university?topic=${encodeURIComponent(query)}`)} className="olive-button text-sm">Create "{query}" program</button>
        </div>
      )}
    </div>
  );
}
