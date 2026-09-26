// Lets Grok voice one negotiation turn. The PRICE is decided by the deterministic
// engine in the browser (so agents can never overspend a mandate); Grok only
// writes what the agent says, and must repeat the price exactly.
import { chat, readBody } from "./_llm.js";

const PERSONAS = {
  sup: "You are the sales agent for a vintage clothing wholesaler that sells 40–100 piece bales. You are firm, a little proud of your stock, and want to protect margin.",
  syn: "You are a buying agent representing a syndicate of small independent vintage resellers who are pooling money to buy one wholesale bale together. You are polite, sharp, and use the group's leverage: volume, fast payment, full-bale collection, repeat orders."
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { role = "sup", price = "", draft = "", context = "", history = [] } = await readBody(req);
  try {
    const text = await chat([
      { role: "system", content: (PERSONAS[role] || PERSONAS.sup) +
        " Reply with ONE or TWO short sentences only (max 40 words), British English, no emojis, no quotation marks. You MUST state the price exactly as given, e.g. " + price + ". Never mention any other price figure." },
      { role: "user", content:
`Deal context: ${String(context).slice(0, 600)}
Conversation so far:
${history.slice(-6).map(h => "- " + h).join("\n") || "(opening)"}
Your move: say ${price}. The point you want to make: ${String(draft).slice(0, 300)}` }
    ], { maxTokens: 120, timeoutMs: 7000 });
    const clean = text.replace(/^["'\s]+|["'\s]+$/g, "");
    const figures = clean.match(/£\s?[\d,]+/g) || [];
    const ok = clean.includes(price) && figures.every(f => f.replace(/\s/g, "") === price);
    res.status(200).json(ok ? { ok: true, text: clean } : { ok: false, error: "price_mismatch" });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
