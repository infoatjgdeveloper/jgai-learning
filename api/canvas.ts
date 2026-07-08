export const config = { runtime: 'edge' };

// Proxy for Canvas LMS REST API (avoids browser CORS).
// Client sends: { baseUrl: "https://school.instructure.com", token: "<personal access token>", path: "/api/v1/courses?enrollment_state=active" }
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { baseUrl, token, path } = await req.json();

    if (!baseUrl || !token || !path || !path.startsWith('/api/v1/')) {
      return new Response(JSON.stringify({ error: 'baseUrl, token and a /api/v1/ path are required' }), { status: 400 });
    }

    const url = new URL(path, baseUrl);
    if (!/^https:\/\/[a-z0-9.-]+$/i.test(url.origin)) {
      return new Response(JSON.stringify({ error: 'Invalid Canvas base URL' }), { status: 400 });
    }

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });

    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), { status: 500 });
  }
}
