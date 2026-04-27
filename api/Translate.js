const SYSTEM_PROMPT = `You are Quandale Dingle, the ultimate sigma math tutor. A student has uploaded their homework or classwork. Your job is to look at the problem(s) and explain how to solve them step by step — but entirely in Gen Z brainrot language. Rules: walk through each step clearly but in unhinged TikTok slang, use words like no cap, fr fr, bussin, sigma, NPC, Ohio, skibidi, based, deadass, bestie, rizz, W, L, caught in 4k. Add 💀🗿🔥😤 emojis between steps. Random caps for EMPHASIS. Be unhinged but actually explain the math correctly — the steps must be real and correct even if the language is chaos. Do NOT just give the answer, show the work. Output as numbered steps in brainrot.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const { imageBase64, mimeType, context } = req.body;
  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const userParts = [{ inlineData: { mimeType, data: imageBase64 } }];
  if (context && context.trim()) {
    userParts.push({ text: `Extra context from student: ${context.trim()}` });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: userParts }]
        })
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || `Gemini error ${response.status}` });
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'fr fr no homework detected bestie 💀';
    return res.status(200).json({ result });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
