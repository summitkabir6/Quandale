// ─────────────────────────────────────────────
// API KEY PERSISTENCE (localStorage)
// ─────────────────────────────────────────────
const LS_KEY = 'quandale_gemini_key';

function loadSavedKey() {
  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    document.getElementById('apiKey').value = saved;
    setKeyBadge(true);
  }
}

function saveKey() {
  const val = document.getElementById('apiKey').value.trim();
  if (!val) { setStatus('DROP A KEY FIRST BESTIE 💀', 'error'); return; }
  localStorage.setItem(LS_KEY, val);
  setKeyBadge(true);
  const btn = document.getElementById('saveKeyBtn');
  btn.textContent = '✅ SAVED FR';
  setTimeout(() => btn.textContent = '💾 SAVE', 2000);
}

function clearKey() {
  localStorage.removeItem(LS_KEY);
  document.getElementById('apiKey').value = '';
  setKeyBadge(false);
  const btn = document.getElementById('clearKeyBtn');
  btn.textContent = '💨 GONE';
  setTimeout(() => btn.textContent = '🗑 CLEAR', 2000);
}

function setKeyBadge(saved) {
  const badge = document.getElementById('keyBadge');
  if (saved) {
    badge.textContent = '✅ SAVED';
    badge.className = 'key-badge key-badge--saved';
  } else {
    badge.textContent = 'NOT SAVED';
    badge.className = 'key-badge key-badge--none';
  }
}

// ─────────────────────────────────────────────
// MEME IMAGES
// ─────────────────────────────────────────────
const MEME_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Moai_at_Rano_raraku.jpg/320px-Moai_at_Rano_raraku.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Crying_cat_meme.jpg/320px-Crying_cat_meme.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/320px-YellowLabradorLooking_new.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Pikachu.png/240px-Pikachu.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Stonehenge.jpg/320px-Stonehenge.jpg',
];

const MEME_EMOJIS = ['🗿','💀','🔥','😤','🛐','😳','🤣','💅','🧠','🫠','😭','🥶'];

// ─────────────────────────────────────────────
// AUDIO — Web Audio API (procedural sounds)
// ─────────────────────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playRandomSound() {
  try {
    const ctx = getAudioCtx();
    const sounds = [playBruh, playAirhorn, playOof, playRiser, playWow];
    sounds[Math.floor(Math.random() * sounds.length)](ctx);
  } catch (e) {}
}

function playBruh(ctx) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(120, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.4);
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  o.start(); o.stop(ctx.currentTime + 0.5);
}

function playAirhorn(ctx) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = 'square';
  o.frequency.setValueAtTime(440, ctx.currentTime);
  o.frequency.setValueAtTime(660, ctx.currentTime + 0.05);
  o.frequency.setValueAtTime(550, ctx.currentTime + 0.1);
  g.gain.setValueAtTime(0.4, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  o.start(); o.stop(ctx.currentTime + 0.7);
}

function playOof(ctx) {
  for (let i = 0; i < 3; i++) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'triangle';
    const t = ctx.currentTime + i * 0.08;
    o.frequency.setValueAtTime(300 - i * 60, t);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.start(t); o.stop(t + 0.12);
  }
}

function playRiser(ctx) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = 'sine';
  o.frequency.setValueAtTime(200, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  o.start(); o.stop(ctx.currentTime + 0.5);
}

function playWow(ctx) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
  o.connect(filter); filter.connect(g); g.connect(ctx.destination);
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(150, ctx.currentTime);
  g.gain.setValueAtTime(0.4, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  o.start(); o.stop(ctx.currentTime + 0.6);
}

// ─────────────────────────────────────────────
// MEME FLASH
// ─────────────────────────────────────────────
const memeFlash = document.getElementById('memeFlash');
const memeImg   = document.getElementById('memeImg');
let flashTimeout = null;
let emojiEl = null;

function getEmojiEl() {
  if (!emojiEl) {
    emojiEl = document.createElement('div');
    emojiEl.className = 'emoji-meme';
    memeFlash.appendChild(emojiEl);
  }
  return emojiEl;
}

function flashImageMeme() {
  const url = MEME_IMAGES[Math.floor(Math.random() * MEME_IMAGES.length)];
  memeImg.src = url;
  memeImg.style.display = 'block';
  const e = getEmojiEl();
  e.style.display = 'none';
  showFlash(1200 + Math.random() * 600);
}

function flashEmojiMeme() {
  const emoji = MEME_EMOJIS[Math.floor(Math.random() * MEME_EMOJIS.length)];
  memeImg.style.display = 'none';
  const e = getEmojiEl();
  e.textContent = emoji;
  e.style.display = 'block';
  showFlash(1000 + Math.random() * 500);
}

function showFlash(duration) {
  memeFlash.classList.add('show');
  if (flashTimeout) clearTimeout(flashTimeout);
  flashTimeout = setTimeout(() => memeFlash.classList.remove('show'), duration);
}

function randomMemeFlash() {
  Math.random() > 0.5 ? flashImageMeme() : flashEmojiMeme();
}

// ─────────────────────────────────────────────
// GEMINI API
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Quandale Dingle, the ultimate Gen Z brainrot oracle. Your job is to translate corporate/professional text into pure unhinged Gen Z internet slang.

Rules:
- Use words like: no cap, fr fr, bussin, slay, rizz, gyatt, skibidi, sigma, NPC, Ohio, based, lowkey, highkey, it's giving, deadass, bestie, bet, main character, understood the assignment, delulu, real one, mid, W, L, caught in 4k, era, villain arc, slay, ate and left no crumbs
- Keep the meaning but make it sound like a 15 year old on TikTok who just drank 4 monsters
- Add 💀🗿🔥😤 emojis liberally
- Random caps for EMPHASIS
- Keep it SHORT - max 3-5 sentences
- Be unhinged but still convey the original meaning
- Do NOT explain yourself, just output the brainrot translation directly`;

async function translateWithGemini(text, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: `Translate this corporate text into brainrot: "${text}"` }] }]
      })
    }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'fr fr no words detected bestie 💀';
}

// ─────────────────────────────────────────────
// SPEECH RECOGNITION
// ─────────────────────────────────────────────
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording  = false;

const micBtn = document.getElementById('micBtn');

micBtn.addEventListener('click', () => {
  if (!SpeechRecognition) {
    setStatus('Mic not supported in this browser bestie 💀', 'error');
    return;
  }
  if (isRecording) { recognition?.stop(); return; }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add('recording');
    micBtn.textContent = '⏹ STOP';
    setStatus('🎤 Listening... speak your corporate slop...', 'loading');
  };
  recognition.onresult = (e) => {
    document.getElementById('inputText').value = e.results[0][0].transcript;
    setStatus('Got it! Hit translate, real one 🗿', 'success');
  };
  recognition.onerror = (e) => {
    setStatus(`Mic said no: ${e.error} 💀`, 'error');
  };
  recognition.onend = () => {
    isRecording = false;
    micBtn.classList.remove('recording');
    micBtn.textContent = '🎤 SPEAK';
  };

  recognition.start();
});

// ─────────────────────────────────────────────
// TRANSLATE
// ─────────────────────────────────────────────
document.getElementById('translateBtn').addEventListener('click', async () => {
  const text   = document.getElementById('inputText').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();

  if (!text)   { setStatus('TYPE SOMETHING FIRST BESTIE 💀', 'error'); return; }
  if (!apiKey) { setStatus('DROP THE API KEY OR IT AINT BUSSIN FR 😤', 'error'); return; }

  const btn = document.getElementById('translateBtn');
  btn.disabled = true;
  btn.textContent = '🔄 COOKING...';
  setStatus('Quandale is translating your NPC speak... 🗿', 'loading');

  try {
    const result = await translateWithGemini(text, apiKey);
    document.getElementById('outputText').textContent = result;
    document.getElementById('outputSection').classList.add('visible');
    document.getElementById('speakBtn').disabled = false;
    setStatus('TRANSLATION COMPLETE FR FR 🔥', 'success');
    playRandomSound();
    randomMemeFlash();
  } catch (err) {
    setStatus(`L TAKE: ${err.message} 💀`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '🗿 TRANSLATE THIS SLOP';
  }
});

// ─────────────────────────────────────────────
// TTS SPEAK
// ─────────────────────────────────────────────
let speaking     = false;
let memeInterval = null;

document.getElementById('speakBtn').addEventListener('click', () => {
  const text = document.getElementById('outputText').textContent;
  if (!text || speaking) return;

  if (!window.speechSynthesis) {
    setStatus('TTS not supported rn bestie 💀', 'error');
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);

  const voices   = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Google') && v.lang === 'en-US')
    || voices.find(v => v.lang === 'en-US')
    || voices[0];
  if (preferred) utter.voice = preferred;

  utter.rate   = 0.9;
  utter.pitch  = 0.8;
  utter.volume = 1;

  utter.onstart = () => {
    speaking = true;
    setStatus('🔊 QUANDALE IS SPEAKING... NO INTERRUPTIONS 🗿', 'speaking');
    document.getElementById('outputSection').classList.add('glitch-active');
    memeInterval = setInterval(() => {
      playRandomSound();
      randomMemeFlash();
    }, 2500 + Math.random() * 2000);
  };

  utter.onend = () => {
    speaking = false;
    clearInterval(memeInterval);
    document.getElementById('outputSection').classList.remove('glitch-active');
    setStatus('DONE. REAL ONE BEHAVIOR 🔥', 'success');
    playRandomSound();
    setTimeout(randomMemeFlash, 200);
  };

  utter.onerror = () => {
    speaking = false;
    clearInterval(memeInterval);
    document.getElementById('outputSection').classList.remove('glitch-active');
    setStatus('Voice said L 💀', 'error');
  };

  window.speechSynthesis.speak(utter);
});

// ─────────────────────────────────────────────
// COPY
// ─────────────────────────────────────────────
document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✅ COPIED FR';
    setTimeout(() => btn.textContent = '📋 COPY', 2000);
  });
});

// ─────────────────────────────────────────────
// STATUS HELPER
// ─────────────────────────────────────────────
function setStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = `status visible ${type}`;
}

// ─────────────────────────────────────────────
// CTRL+ENTER TO TRANSLATE
// ─────────────────────────────────────────────
document.getElementById('inputText').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    document.getElementById('translateBtn').click();
  }
});

// ─────────────────────────────────────────────
// KONAMI CODE EASTER EGG
// ─────────────────────────────────────────────
let konamiSeq = [];
const KONAMI  = [38,38,40,40,37,39,37,39,66,65];

document.addEventListener('keydown', (e) => {
  konamiSeq.push(e.keyCode);
  konamiSeq = konamiSeq.slice(-10);
  if (konamiSeq.join(',') === KONAMI.join(',')) {
    let i = 0;
    const kaboom = setInterval(() => {
      randomMemeFlash();
      playRandomSound();
      if (++i > 8) clearInterval(kaboom);
    }, 400);
  }
});

// Preload voices (Chrome async)
window.speechSynthesis.onvoiceschanged = () => {};
window.speechSynthesis.getVoices();

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
document.getElementById('saveKeyBtn').addEventListener('click', saveKey);
document.getElementById('clearKeyBtn').addEventListener('click', clearKey);

// Auto-save on input after short debounce (quality of life)
let saveDebounce = null;
document.getElementById('apiKey').addEventListener('input', () => {
  clearTimeout(saveDebounce);
  saveDebounce = setTimeout(() => {
    const val = document.getElementById('apiKey').value.trim();
    if (val.startsWith('AIza') && val.length > 20) saveKey();
  }, 800);
});

loadSavedKey();