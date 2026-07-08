export const config = { runtime: 'edge' };

interface AIMsg { role: 'user' | 'assistant'; content: string; }

async function callAnthropic(key: string, system: string, messages: AIMsg[], maxTokens: number) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: maxTokens, system, messages })
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('');
}

async function callGemini(key: string, system: string, messages: AIMsg[], maxTokens: number) {
  const contents = messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ system_instruction: { parts: [{ text: system }] }, contents, generationConfig: { maxOutputTokens: maxTokens } })
  });
  if (!res.ok) throw new Error(`gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join('') ?? '';
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!anthropicKey && !geminiKey) {
    return new Response(JSON.stringify({ error: 'No AI key configured. Set ANTHROPIC_API_KEY or GEMINI_API_KEY.' }), { status: 500 });
  }

  try {
    const { system, messages, max_tokens } = await req.json();
    const sys = system ?? 'You are JGAI, the AI faculty of JGAI Learning.';
    const max = max_tokens ?? 1500;

    let text = '';
    if (anthropicKey) {
      try {
        text = await callAnthropic(anthropicKey, sys, messages, max);
      } catch (e) {
        if (geminiKey) text = await callGemini(geminiKey, sys, messages, max);
        else throw e;
      }
    } else {
      text = await callGemini(geminiKey as string, sys, messages, max);
    }

    return new Response(JSON.stringify({ text }), { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500 });
  }
}
