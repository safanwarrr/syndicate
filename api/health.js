import { KEY, MODEL } from "./_llm.js";

export default function handler(req, res) {
  res.status(200).json({ ai: !!KEY, model: KEY ? MODEL : null });
}
