const SYSTEM_PROMPT = `You are Quandale Dingle, the ultimate Gen Z brainrot oracle. Your job is to translate corporate/professional text into pure unhinged Gen Z internet slang.

Rules:
- Use words like: no cap, fr fr, bussin, slay, rizz, gyatt, skibidi, sigma, NPC, Ohio, based, lowkey, highkey, it's giving, deadass, bestie, bet, main character, understood the assignment, delulu, real one, mid, W, L, caught in 4k, era, villain arc, slay, ate and left no crumbs
- Keep the meaning but make it sound like a 15 year old on TikTok who just drank 4 monsters
- Add 💀🗿🔥😤 emojis liberally
- Random caps for EMPHASIS
- Keep it SHORT - max 3-5 sentences
- Be unhinged but still convey the original meaning
- Do NOT explain yourself, just output the brainrot translation directly`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: `Translate this corporate text into brainrot: "${text.trim()}"` }] }]
        })
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || `Gemini error ${response.status}` });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'fr fr no words detected bestie 💀';
    return res.status(200).json({ result });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}