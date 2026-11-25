# RANI AI v8.0 — AI Voice Assistant + RANI Coder

```
  ⬡ RANI AI  |  AI Voice Assistant  +  RANI Coder AI Website Builder
  Voice se bolo → RANI sunti hai → Website ban jaati hai → Live deploy!
```

> **Reference only — not the target platform.** RANI AI ships as the
> Android phone app in `../rani-web/` + `../android/` (see the root README
> and `../docs/ANDROID.md`). This folder is the original desktop source,
> kept for reference. There is no Windows build target in this project.

## What this folder is

- `aria.py` — main RANI window (PyQt5)
- `rani_coder_integration.py` — RANI Coder Python bridge
- `rani_coder/` — Node.js AI coding engine
  - `src/agent.ts` — core AI agent
  - `src/run.ts` — headless runner
  - `src/providers/gemini.ts` — Gemini provider
  - `dist/` — compiled JS (after build)
- `website_builder/` — WebForge (Python builder)
- `Projects/` — generated websites save hote hain
- `setup_rani_coder.py` — one-click setup for the Node part

## How it works (desktop reference)

```
User Voice Command
      ↓
RANI Voice Recognition (Gemini WebSocket)
      ↓
_is_website_command() check
      ↓
RaniCoderOverlay.show_panel(task)  ← RANI UI pe panel aata hai
      ↓
node dist/run.js --progress-file tmp.jsonl
      ↓
AI agent → tools → files create hote hain
      ↓ (live streaming via JSON progress file)
Qt signals → live UI update
      ↓
Done → RANI bolti hai congratulations!
```

## Configuration (reference)

`.env` file (local only, never commit):
```
GEMINI_API_KEY=your_key
GITHUB_TOKEN=PASTE_YOUR_GITHUB_TOKEN_HERE    (for WebForge deploy)
VERCEL_TOKEN=PASTE_YOUR_VERCEL_TOKEN_HERE    (for WebForge deploy)
```

## Troubleshooting

- **"RANI Coder build nahi mili"**: `cd rani_coder && npm install && npm run build`
- **"Node.js nahi mila"**: https://nodejs.org install karo
- **"API key error"**: `.env` mein `GEMINI_API_KEY` add karo

---
RANI AI v8.0 | RANI Coder powered by HunterCode engine (MIT License)
