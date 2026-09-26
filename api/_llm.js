// Shared helper: calls Grok (xAI) or any OpenAI-compatible chat API.
// Set XAI_API_KEY in Vercel. Optional: LLM_MODEL, LLM_BASE_URL.
export const KEY = process.env.XAI_API_KEY || process.env.LLM_API_KEY || "";
export const BASE = (process.env.LLM_BASE_URL || "https://api.x.ai/v1").replace(/\/$/, "");
export const MODEL = process.env.LLM_MODEL || "grok-4-fast-non-reasoning";

export async function chat(messages, { json = false, maxTokens = 300, timeoutMs = 9000 } = {}) {
  if (!KEY) throw new Error("no_key");
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(BASE + "/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + KEY },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: maxTokens,
        ...(json ? { response_format: { type: "json_object" } } : {})
      })
    });
    if (!r.ok) throw new Error("llm_http_" + r.status + " " + (await r.text()).slice(0, 200));
    const d = await r.json();
    return (d.choices?.[0]?.message?.content || "").trim();
  } finally {
    clearTimeout(t);
  }
}

export async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return {}; } }
  return {};
}
