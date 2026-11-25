/* RANI AI — example config. PLACEHOLDERS ONLY — no real keys.
 *
 * HOW TO USE:
 *   1. Copy this file to js/config.js  (same folder)
 *   2. Replace each PASTE_... value with YOUR OWN key.
 *   3. js/config.js is git-ignored — never commit it, never share it.
 *
 * Where the keys come from:
 *   - geminiApiKey: Google AI Studio (aistudio.google.com) — your own Gemini API key.
 *   - supabaseUrl / supabaseAnonKey: your Supabase project Settings → API.
 *   - firebase*: your Firebase project Settings → General → Your apps → Web app.
 * See docs/AUTH-SETUP.md for the full Supabase + Firebase setup (same system as BADSHAH AI).
 */
window.RANI_CONFIG = {
  // Gemini — voice + text + vision + website builder
  geminiApiKey: 'PASTE_YOUR_GEMINI_API_KEY_HERE',
  geminiTextModel: 'gemini-2.5-flash',
  // RANI's Live default. Other option: 'gemini-3.8-live'
  geminiLiveModel: 'gemini-3.1-flash-live-preview',

  // Supabase (database + auth backend, same pattern as BADSHAH AI)
  supabaseUrl: 'PASTE_YOUR_SUPABASE_URL_HERE',
  supabaseAnonKey: 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE',

  // Firebase Auth (email+password + Google sign-in, same pattern as BADSHAH AI)
  firebaseApiKey: 'PASTE_YOUR_FIREBASE_API_KEY_HERE',
  firebaseAuthDomain: 'PASTE_YOUR_FIREBASE_AUTH_DOMAIN_HERE',
  firebaseProjectId: 'PASTE_YOUR_FIREBASE_PROJECT_ID_HERE',
  firebaseAppId: 'PASTE_YOUR_FIREBASE_APP_ID_HERE',

  // Web app URL the Android wrapper loads (change at release time)
  appUrl: 'https://rani-ai.pages.dev'
};
