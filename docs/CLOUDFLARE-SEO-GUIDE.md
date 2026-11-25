# RANI AI — Cloudflare Hosting + SEO Guide (BADSHAH222)

Live site: **https://rani-ai-girlfrind.pages.dev**

## 1. Cloudflare Pages par host karna (pehli dafa)

1. Cloudflare dashboard kholo → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. GitHub account select karo → repo **`Badshah-official512/RANI-AI-ASSISTANT`** select karo.
3. **Project name: `rani-ai-girlfrind`** (yahi naam `rani-ai-girlfrind.pages.dev` banata hai).
4. **Framework preset: None**
5. **Root directory: `rani-web`** (sirf website ka folder deploy hota hai, poora repo nahi).
6. **Build command: (khali)** — koi build nahi chahiye, ye plain HTML/CSS/JS site hai.
7. **Save and Deploy** → 1–2 minute mein site live: https://rani-ai-girlfrind.pages.dev

Har dafa jab GitHub `main` par naya push aayega, Cloudflare khud naya deploy kar dega (auto-deploy).

## 2. Variables — kya lagni hain (aur kahan)

**Ahem baat:** RANI ki web app keys Cloudflare ke Environment Variables se NAHI parhti.
Ye app `rani-web/js/config.js` file se parhti hai (jo `js/config.example.js` ki copy hai).
`config.js` git-ignored hai — kabhi GitHub par commit NAHI karni, warna keys public ho jayengi.

| Variable (config.js mein) | Kahan se milegi |
|---|---|
| `geminiApiKey` | Google AI Studio (aistudio.google.com) → Create API key — apni khud ki Gemini key |
| `geminiTextModel` | pehle se set hai: `gemini-2.5-flash` |
| `geminiLiveModel` | pehle se set hai: `gemini-3.1-flash-live-preview` |
| `supabaseUrl` | Supabase project → Settings → API → Project URL |
| `supabaseAnonKey` | Supabase project → Settings → API → anon public key |
| `firebaseApiKey` | Firebase project → Settings → General → Your apps → Web app |
| `firebaseAuthDomain` | wahi Firebase web app config |
| `firebaseProjectId` | wahi Firebase web app config |
| `firebaseAppId` | wahi Firebase web app config |
| `appUrl` | pehle se set hai: `https://rani-ai-girlfrind.pages.dev` |

**Keys bharne ka tareeqa (2 options):**
- **Option A (asan):** apne computer par `rani-web/js/config.example.js` ko copy karke
  `rani-web/js/config.js` banao, values bharo, phir Cloudflare Pages par **Direct Upload**
  se `rani-web` folder dobara upload karo. (GitHub se deploy par `config.js` nahi
  jayegi kyunke wo git-ignored hai.)
- **Option B (baad mein):** pehle site demo mode mein live karo (bina keys ke app khulti
  hai, lekin sign-in aur AI kaam nahi karte), aur keys ka faisla baad mein karo.

**Abhi khula faisla:** RANI ke liye **naya alag Supabase + Firebase project** banayen ya
BADSHAH AI walay projects reuse karen? Docs recommend karte hain **naya alag project**
(taake RANI aur BADSHAH ke users/data mix na hon). Ye faisla Badshah ka hai — bina is ke
sign-in aur database live nahi honge. Tab tak site demo/offline mode mein chalegi.

## 3. SEO — kya kya laga hai

Site: `rani-ai-girlfrind.pages.dev` — sab isi link par set hai.

**Titles (3):**
1. Title tag (Google / browser tab):
   `RANI AI GF | MAKE BY BADSHAH222 (RANI AI / RANI AI GIRLFRIEND)`
2. Open Graph title (Facebook/WhatsApp share):
   `RANI AI GIRLFRIEND | BADSHAH222 IS A CREATER OF RANI (RANI AI BY BADSHAH222 / RANI AI GF)`
3. Twitter title:
   `RANI AI — VIRTUAL AI GIRLFRIEND BY BADSHAH222 | CHAT, VOICE & LOVE 24/7 (RANI AI GF)`

**Aur bhi:**
- Meta description + keywords (RANI AI, RANI AI GF, RANI AI GIRLFRIEND, RANI AI BY BADSHAH222…)
- Canonical: `https://rani-ai-girlfrind.pages.dev/`
- Open Graph + Twitter card tags (image: `/icons/icon.svg`)
- JSON-LD structured data (WebApplication, author BADSHAH222)
- `robots.txt` + `sitemap.xml` (`/sitemap.xml` — home + admin page)
- H1: `RANI AI GF`, footer + noscript mein RANI AI GF ki description
- PWA manifest ka naam bhi `RANI AI GF`

## 4. Google Search Console (GSC)

1. https://search.google.com/search-console kholo → **Add property** →
   URL prefix: `https://rani-ai-girlfrind.pages.dev/` → Continue.
2. Verification method: **HTML tag** select karo → jo code mile
   (jaise `google-site-verification` content value) usay copy karo.
3. `rani-web/index.html` ke `<head>` mein ye line hai:
   `<meta name="google-site-verification" content="PASTE_YOUR_GOOGLE_VERIFICATION_CODE_HERE">`
   — `PASTE_YOUR_GOOGLE_VERIFICATION_CODE_HERE` ki jagah asal code likho.
4. GitHub par push karo (Cloudflare khud dobara deploy kar dega).
5. Search Console mein **Verify** dabao.
6. Verify hone ke baad: **Sitemaps** → `https://rani-ai-girlfrind.pages.dev/sitemap.xml` submit karo.

**Note:** jab tak GSC se asal code nahi milta, head mein placeholder hi rehta hai —
placeholder se verification NAHI hogi, asal code zaroori hai.
