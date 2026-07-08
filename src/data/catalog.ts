export interface CatalogCourse {
  id: string;
  title: string;
  category: string;
  blurb: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  creditHours: number;
  rating: number;
  students: number;
  gradient: string;
  professor: string;
}

export const CATEGORIES = [
  { name: 'Business', color: '#2b6cff' },
  { name: 'Computer Science', color: '#8b5cf6' },
  { name: 'Data & AI', color: '#0ea5e9' },
  { name: 'Design', color: '#ec4899' },
  { name: 'Marketing', color: '#ff7a1a' },
  { name: 'Finance', color: '#10b981' },
  { name: 'Health & Science', color: '#14b8a6' },
  { name: 'Languages', color: '#f5b40a' }
];

const g = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

export const CATALOG: CatalogCourse[] = [
  { id: 'mba', title: 'MBA Essentials Track', category: 'Business', blurb: 'Strategy, operations, leadership and finance — the core MBA curriculum, AI-taught.', level: 'Intermediate', creditHours: 36, rating: 4.9, students: 12840, gradient: g('#2b6cff', '#7c3aed'), professor: 'Prof. JGAI · School of Business' },
  { id: 'pm', title: 'Product Management Bootcamp', category: 'Business', blurb: 'Discovery, roadmaps, metrics and stakeholder leadership for aspiring PMs.', level: 'Beginner', creditHours: 12, rating: 4.8, students: 9310, gradient: g('#3b82f6', '#06b6d4'), professor: 'Prof. JGAI · School of Business' },
  { id: 'cs101', title: 'Computer Science Foundations', category: 'Computer Science', blurb: 'Programming, data structures, algorithms and how computers actually work.', level: 'Beginner', creditHours: 16, rating: 4.9, students: 21500, gradient: g('#8b5cf6', '#6366f1'), professor: 'Prof. JGAI · School of Engineering' },
  { id: 'fullstack', title: 'Full-Stack Web Development', category: 'Computer Science', blurb: 'React, Node, databases and deployment — ship real applications.', level: 'Intermediate', creditHours: 20, rating: 4.8, students: 18730, gradient: g('#6366f1', '#0ea5e9'), professor: 'Prof. JGAI · School of Engineering' },
  { id: 'cyber', title: 'Cybersecurity Fundamentals', category: 'Computer Science', blurb: 'Threats, networks, cryptography basics and defensive thinking.', level: 'Beginner', creditHours: 12, rating: 4.7, students: 7420, gradient: g('#334155', '#8b5cf6'), professor: 'Prof. JGAI · School of Engineering' },
  { id: 'ml', title: 'Machine Learning A–Z', category: 'Data & AI', blurb: 'From regression to neural networks, with hands-on Python projects.', level: 'Intermediate', creditHours: 24, rating: 4.9, students: 25120, gradient: g('#0ea5e9', '#8b5cf6'), professor: 'Prof. JGAI · School of Data' },
  { id: 'ds', title: 'Data Science with Python', category: 'Data & AI', blurb: 'Pandas, statistics, visualization and real analysis workflows.', level: 'Beginner', creditHours: 16, rating: 4.8, students: 19980, gradient: g('#06b6d4', '#10b981'), professor: 'Prof. JGAI · School of Data' },
  { id: 'genai', title: 'Generative AI for Professionals', category: 'Data & AI', blurb: 'Prompting, agents, RAG and building with LLMs at work.', level: 'Beginner', creditHours: 8, rating: 4.9, students: 31240, gradient: g('#7c3aed', '#ec4899'), professor: 'Prof. JGAI · School of Data' },
  { id: 'uiux', title: 'UI/UX Design Professional', category: 'Design', blurb: 'Research, wireframes, design systems and portfolio-ready case studies.', level: 'Beginner', creditHours: 14, rating: 4.8, students: 11020, gradient: g('#ec4899', '#f97316'), professor: 'Prof. JGAI · School of Design' },
  { id: 'motion', title: 'Motion & Brand Design', category: 'Design', blurb: 'Identity systems, typography and motion for modern brands.', level: 'Intermediate', creditHours: 10, rating: 4.7, students: 5230, gradient: g('#f43f5e', '#8b5cf6'), professor: 'Prof. JGAI · School of Design' },
  { id: 'dmkt', title: 'Digital Marketing Degree Track', category: 'Marketing', blurb: 'SEO, paid media, content, email and analytics — the full stack.', level: 'Beginner', creditHours: 16, rating: 4.8, students: 14310, gradient: g('#ff7a1a', '#f5b40a'), professor: 'Prof. JGAI · School of Marketing' },
  { id: 'growth', title: 'Growth & Analytics', category: 'Marketing', blurb: 'Funnels, experimentation, attribution and growth loops.', level: 'Advanced', creditHours: 12, rating: 4.7, students: 6180, gradient: g('#f97316', '#ec4899'), professor: 'Prof. JGAI · School of Marketing' },
  { id: 'cfa', title: 'Investing & Markets Foundations', category: 'Finance', blurb: 'Valuation, portfolio theory and market mechanics, explained clearly.', level: 'Intermediate', creditHours: 18, rating: 4.8, students: 8940, gradient: g('#10b981', '#0ea5e9'), professor: 'Prof. JGAI · School of Finance' },
  { id: 'acct', title: 'Financial Accounting', category: 'Finance', blurb: 'Statements, bookkeeping and analysis for managers and founders.', level: 'Beginner', creditHours: 12, rating: 4.6, students: 5710, gradient: g('#059669', '#84cc16'), professor: 'Prof. JGAI · School of Finance' },
  { id: 'anatomy', title: 'Human Biology Essentials', category: 'Health & Science', blurb: 'Systems of the body, from cells to physiology, pre-med friendly.', level: 'Beginner', creditHours: 14, rating: 4.7, students: 4820, gradient: g('#14b8a6', '#0ea5e9'), professor: 'Prof. JGAI · School of Science' },
  { id: 'spanish', title: 'Spanish to Conversational', category: 'Languages', blurb: 'Daily AI conversation practice to real conversational fluency.', level: 'Beginner', creditHours: 10, rating: 4.8, students: 16050, gradient: g('#f5b40a', '#ff7a1a'), professor: 'Prof. JGAI · School of Languages' }
];
