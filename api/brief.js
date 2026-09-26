// Turns a reseller's plain-English brief into a structured buying mandate.
import { chat, readBody } from "./_llm.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { text = "", cats = {} } = await readBody(req);
  const catList = Object.entries(cats).map(([k, v]) => `${k} (${v})`).join(", ");
  try {
    const out = await chat([
      { role: "system", content: "You configure a wholesale-buying agent for a small vintage clothing reseller. Reply with ONLY a JSON object." },
      { role: "user", content:
`Schema: {"name": string, "shop": string, "budget": number (GBP), "maxPieces": number, "autoApprove": number (GBP, 0 if not stated), "wants": {"<category>": {"wtp": number (max GBP per piece), "max": number (pieces)}}}
Allowed category keys: ${catList}. Map anything else to the closest key or leave it out. If a quantity is missing use maxPieces. If no name, use "New reseller".
Brief: """${String(text).slice(0, 1500)}"""` }
    ], { json: true, maxTokens: 400 });
    const m = out.match(/\{[\s\S]*\}/);
    res.status(200).json({ ok: true, mandate: JSON.parse(m ? m[0] : out) });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
