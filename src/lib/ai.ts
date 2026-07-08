export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askClaude(opts: {
  system?: string;
  messages: AIMessage[];
  maxTokens?: number;
}): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      system: opts.system,
      messages: opts.messages,
      max_tokens: opts.maxTokens
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `AI request failed (${res.status})`);
  }

  const data = await res.json();
  return data.text as string;
}

export async function askClaudeJSON<T>(opts: {
  system?: string;
  prompt: string;
  maxTokens?: number;
}): Promise<T> {
  const text = await askClaude({
    system: (opts.system ?? '') + '\nRespond with ONLY valid JSON. No markdown fences, no commentary.',
    messages: [{ role: 'user', content: opts.prompt }],
    maxTokens: opts.maxTokens ?? 3000
  });
  const cleaned = text.replace(/^```(json)?/m, '').replace(/```\s*$/m, '').trim();
  return JSON.parse(cleaned) as T;
}
