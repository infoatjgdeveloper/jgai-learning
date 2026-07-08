# JGAI Learning

The AI University platform by **JGAI**. Sync your real school via Canvas, enroll in AI-taught degree-style programs, pay in credits, earn JGAI certificates. Includes JGAI platform admin and institution admin consoles for university licensing.

## Stack
React 19 · Vite · Tailwind v4 · Firebase (auth + data) · Claude API (AI faculty) · Vercel

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local`, set `ANTHROPIC_API_KEY`
3. `npm run dev` (AI/Canvas proxies need `vercel dev` or deployment)
