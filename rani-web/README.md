# RANI AI — phone web app

Standalone phone web app for RANI AI. No build step —
serve the folder statically and open `index.html`.

## Run locally

```bash
cd rani-web
python3 -m http.server 8080
# open http://localhost:8080
```

(Any static server works. `file://` is not recommended — the service worker
and `getDisplayMedia` need http(s).)

## Configure (your own keys only)

1. Copy `js/config.example.js` → `js/config.js`
2. Fill in your Gemini API key, Supabase URL + anon key, and Firebase web config.
3. `js/config.js` is git-ignored. Never commit it. No real key is in this repo.

Without a key the app runs in **demo mode** and says so honestly.

## What is inside

| File | Purpose |
| --- | --- |
| `index.html` | App shell: orb, chat, vision, website builder, settings + auth sheets |
| `app.js` | All logic — Gemini REST chat/vision/builder, speech, vision capture, settings |
| `styles.css` | Purple-neon phone UI |
| `manifest.json` + `sw.js` | Installable PWA (offline app shell) |
| `icons/icon.svg` | App icon |
| `js/config.example.js` | Placeholder config — copy to `js/config.js` |
| `admin.html` | Login-gated admin panel shell (users/stats placeholders) |

## RANI parity

- Voice: **Aoede (female, default)** / **Charon (male)** — exactly RANI's voices.
- Persona: RANI friendly / Normal professional — RANI's two personas, renamed.
- Language: Auto + English / Urdu / Hindi / Pashto / Arabic.
- Live model: Gemini 3.1 Flash Live (RANI default), 3.8 Live, 2.5 Native Audio.
- Vision: camera (`getUserMedia`) + screen (`getDisplayMedia`).
- Website builder: prompt → Gemini generates a single-file site → live preview + download (WebForge-style).

## Notes

- Full setup (auth, Android APK): `../docs/AUTH-SETUP.md` and `../docs/ANDROID.md`.
- Android wrapper: `../android/` — loads this web app in a WebView.
