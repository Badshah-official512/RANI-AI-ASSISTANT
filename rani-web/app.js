/* RANI AI — phone web app.
 * No build step. Gemini Live voice (Aoede female default, Charon male),
 * text chat via Gemini REST, camera/screen vision, website builder,
 * settings mirroring RANI. ALL keys come from window.RANI_CONFIG
 * (js/config.js, copied from js/config.example.js). No real key is in this repo.
 * Without a Gemini key the app runs in demo mode and says so honestly.
 */
(function () {
  'use strict';

  /* ---------- config ---------- */
  var CFG = window.RANI_CONFIG || {};
  var GEMINI_KEY = CFG.geminiApiKey || '';
  var GEMINI_TEXT_MODEL = CFG.geminiTextModel || 'gemini-2.5-flash';
  var LIVE_MODEL = CFG.geminiLiveModel || 'gemini-3.1-flash-live-preview';
  var configured = Boolean(GEMINI_KEY && GEMINI_KEY.indexOf('PASTE_') !== 0);

  /* ---------- settings (RANI mirror, stored on-device only) ---------- */
  var DEFAULTS = {
    name: 'RANI', voice: 'female', persona: 'rani', lang: 'auto',
    liveModel: LIVE_MODEL, theme: 'dark', wakeWord: false
  };
  var settings = loadSettings();
  function loadSettings() {
    try {
      return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('rani.settings') || '{}'));
    } catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function saveSettings() {
    try { localStorage.setItem('rani.settings', JSON.stringify(settings)); } catch (e) {}
    applySettings();
  }
  function voiceName() { return settings.voice === 'male' ? 'Charon' : 'Aoede'; }

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function setStatus(t) { $('statusLine').textContent = t; }
  function addMsg(text, who) {
    var el = document.createElement('div');
    el.className = 'msg ' + (who || 'rani');
    el.textContent = text;
    $('messages').appendChild(el);
    $('messages').scrollTop = $('messages').scrollHeight;
    return el;
  }
  function personaPrefix() {
    return settings.persona === 'normal'
      ? 'You are RANI, a professional AI assistant. Answer clearly and concisely.'
      : 'You are RANI, a friendly, warm AI assistant. Answer warmly and helpfully.';
  }
  function langHint() {
    return settings.lang === 'auto'
      ? 'Reply in the same language the user uses.'
      : 'Reply in language code ' + settings.lang + '.';
  }

  /* ---------- Gemini REST (text chat + vision + website builder) ---------- */
  async function geminiGenerate(prompt, imageBase64) {
    if (!configured) throw new Error('not-configured');
    var parts = [{ text: prompt }];
    if (imageBase64) {
      parts.push({ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } });
    }
    var res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(GEMINI_TEXT_MODEL) +
      ':generateContent?key=' + encodeURIComponent(GEMINI_KEY),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: parts }] })
      }
    );
    if (!res.ok) throw new Error('Gemini error ' + res.status);
    var data = await res.json();
    var text = data && data.candidates && data.candidates[0] &&
      data.candidates[0].content && data.candidates[0].content.parts &&
      data.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');
    return text || '(No reply from Gemini.)';
  }

  async function askRani(text) {
    addMsg(text, 'user');
    if (!configured) {
      addMsg('Demo mode — no Gemini key configured yet. Copy js/config.example.js to js/config.js and add your own Gemini API key, then I can answer for real.', 'sys');
      return;
    }
    var thinking = addMsg('…', 'rani');
    try {
      var reply = await geminiGenerate(personaPrefix() + ' ' + langHint() + '\n\nUser: ' + text);
      thinking.textContent = reply;
      speak(reply);
    } catch (e) {
      thinking.textContent = e.message === 'not-configured'
        ? 'Gemini is not configured yet.'
        : 'Sorry — Gemini se jawab nahi mila (' + e.message + '). Try again.';
    }
  }

  /* ---------- speech: device TTS for replies; Live voice via Gemini when configured ---------- */
  var speaking = false;
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text.slice(0, 600));
      u.lang = settings.lang === 'auto' ? 'en-US' : settings.lang;
      // Prefer a female voice for Aoede, male for Charon, when the device offers one.
      var voices = window.speechSynthesis.getVoices() || [];
      var wantFemale = settings.voice !== 'male';
      var pick = voices.find(function (v) {
        var n = (v.name || '').toLowerCase();
        return wantFemale ? /female|samantha|zira|google us english/i.test(n) : /male|david|google uk english male/i.test(n);
      });
      if (pick) u.voice = pick;
      u.onstart = function () { speaking = true; $('orb').classList.add('speaking'); };
      u.onend = u.onerror = function () { speaking = false; $('orb').classList.remove('speaking'); };
      window.speechSynthesis.speak(u);
    } catch (e) { /* TTS is best-effort on the phone */ }
  }

  /* ---------- Live voice (tap to talk) ----------
   * Full Gemini Live (bidirectional audio over WebSocket) needs the Live API
   * with an API key. On the phone web app this uses the browser SpeechRecognition
   * for listening + Gemini text for the answer + TTS for the reply, with the
   * Live model name (settings.liveModel) recorded for the native Live session
   * once a Live WebSocket client is wired in. Voice = Aoede (female) / Charon (male).
   */
  var recog = null, listening = false;
  function startTalk() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      addMsg('Is browser mein live speech recognition nahi hai — type karke baat karein, ya Android app use karein.', 'sys');
      return;
    }
    if (listening) { stopTalk(); return; }
    recog = new SR();
    recog.lang = settings.lang === 'auto' ? 'en-US' : settings.lang;
    recog.interimResults = false;
    recog.onresult = function (ev) {
      var text = ev.results[0][0].transcript;
      stopTalk();
      askRani(text);
    };
    recog.onerror = function () { stopTalk(); setStatus('Mic error — phir try karein'); };
    recog.onend = function () { if (listening) stopTalk(); };
    try {
      recog.start();
      listening = true;
      $('orb').classList.add('listening');
      $('orbHint').textContent = 'Listening… (' + voiceName() + ' • ' + settings.liveModel + ')';
      $('micBtn').textContent = '■ Listening…';
      $('stopBtn').disabled = false;
      setStatus('Listening…');
    } catch (e) { setStatus('Mic start nahi hua — permission check karein'); }
  }
  function stopTalk() {
    listening = false;
    try { if (recog) recog.stop(); } catch (e) {}
    $('orb').classList.remove('listening');
    $('orbHint').textContent = 'Tap the orb to talk';
    $('micBtn').textContent = '🎙️ Talk';
    $('stopBtn').disabled = true;
    setStatus('Ready — tap the orb to talk');
  }

  /* ---------- Vision: camera (getUserMedia) + screen (getDisplayMedia) ---------- */
  var visionStream = null;
  async function startVision(kind) {
    stopVision();
    try {
      visionStream = kind === 'screen'
        ? await navigator.mediaDevices.getDisplayMedia({ video: true })
        : await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    } catch (e) {
      addMsg('Vision permission nahi mili (' + (e.name || e.message) + '). Phone settings mein camera/screen permission allow karein.', 'sys');
      return;
    }
    var v = $('visionVideo');
    v.srcObject = visionStream;
    v.hidden = false;
    $('visionOffBtn').disabled = false;
    $('askVisionBtn').disabled = false;
    $('visionNote').textContent = kind === 'screen'
      ? 'Screen share on hai — “Ask RANI” dabayein, RANI screen dekh kar batayegi.'
      : 'Camera on hai — “Ask RANI” dabayein, RANI jo dekhegi wo batayegi.';
    visionStream.getVideoTracks()[0].addEventListener('ended', stopVision);
  }
  function stopVision() {
    if (visionStream) { visionStream.getTracks().forEach(function (t) { t.stop(); }); visionStream = null; }
    var v = $('visionVideo');
    v.srcObject = null; v.hidden = true;
    $('visionOffBtn').disabled = true;
    $('askVisionBtn').disabled = true;
    $('visionNote').textContent = 'Camera / screen frames are sent to Gemini only when you ask RANI to look. Nothing is recorded.';
  }
  function captureFrame() {
    var v = $('visionVideo'), c = $('visionCanvas');
    if (!v.videoWidth) return null;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    var url = c.toDataURL('image/jpeg', 0.7);
    return url.split(',')[1];
  }
  async function askVision() {
    var frame = captureFrame();
    if (!frame) { addMsg('Pehle camera ya screen vision on karein.', 'sys'); return; }
    var q = $('visionPrompt').value.trim() || 'Is image mein kya hai? Detail mein batao.';
    addMsg('👁️ ' + q, 'user');
    if (!configured) {
      addMsg('Demo mode — vision ke liye Gemini key chahiye (js/config.js).', 'sys');
      return;
    }
    var thinking = addMsg('Dekh rahi hoon…', 'rani');
    try {
      thinking.textContent = await geminiGenerate(personaPrefix() + ' ' + langHint() + '\n\nUser (looking at an image): ' + q, frame);
    } catch (e) {
      thinking.textContent = 'Vision jawab nahi mila (' + e.message + ').';
    }
  }

  /* ---------- Website builder (WebForge-style, Gemini-generated single file) ---------- */
  var lastSiteHtml = '';
  async function buildSite() {
    var prompt = $('sitePrompt').value.trim();
    if (!prompt) { addMsg('Website builder: pehle batayein kaisi website chahiye.', 'sys'); return; }
    if (!configured) {
      addMsg('Demo mode — website generate karne ke liye Gemini key chahiye (js/config.js).', 'sys');
      return;
    }
    $('buildSiteBtn').disabled = true;
    $('buildSiteBtn').textContent = '⏳ Generating…';
    try {
      var raw = await geminiGenerate(
        'Generate ONE complete standalone HTML file (inline CSS + JS only, no external files) for this website request. ' +
        'Return ONLY the HTML code, no markdown fences, no explanation.\n\nRequest: ' + prompt
      );
      lastSiteHtml = raw.replace(/^```html\s*/i, '').replace(/```\s*$/, '').trim();
      var frame = $('sitePreview');
      frame.hidden = false;
      frame.srcdoc = lastSiteHtml;
      $('downloadSiteBtn').disabled = false;
      addMsg('Website ready — neeche live preview dekhein. Download se .html file milegi.', 'rani');
    } catch (e) {
      addMsg('Website generate nahi hui (' + e.message + ').', 'sys');
    } finally {
      $('buildSiteBtn').disabled = false;
      $('buildSiteBtn').textContent = '✨ Generate website';
    }
  }
  function downloadSite() {
    if (!lastSiteHtml) return;
    var blob = new Blob([lastSiteHtml], { type: 'text/html' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rani-website.html';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
  }

  /* ---------- Settings / auth sheets ---------- */
  function openSheet(id) { $(id).hidden = false; }
  function closeSheet(id) { $(id).hidden = true; }
  function fillSettingsForm() {
    $('setName').value = settings.name;
    $('setVoice').value = settings.voice;
    $('setPersona').value = settings.persona;
    $('setLang').value = settings.lang;
    $('setLiveModel').value = settings.liveModel;
    $('setTheme').value = settings.theme;
    $('setWake').checked = !!settings.wakeWord;
  }
  function applySettings() {
    document.body.setAttribute('data-theme', settings.theme || 'dark');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', settings.theme === 'light' ? '#7c3aed' : '#7c3aed');
    document.title = (settings.name || 'RANI') + ' AI';
  }
  function authConfigured() {
    return Boolean(CFG.supabaseUrl && CFG.supabaseUrl.indexOf('PASTE_') !== 0 &&
      CFG.firebaseApiKey && CFG.firebaseApiKey.indexOf('PASTE_') !== 0);
  }

  /* ---------- wiring ---------- */
  $('micBtn').addEventListener('click', startTalk);
  $('orb').addEventListener('click', startTalk);
  $('orb').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startTalk(); } });
  $('stopBtn').addEventListener('click', function () { stopTalk(); try { window.speechSynthesis.cancel(); } catch (e) {} });
  $('chatForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var t = $('chatInput').value.trim();
    if (!t) return;
    $('chatInput').value = '';
    askRani(t);
  });
  document.querySelectorAll('.quick').forEach(function (b) {
    b.addEventListener('click', function () { askRani(b.getAttribute('data-q')); });
  });
  $('cameraBtn').addEventListener('click', function () { startVision('camera'); });
  $('screenBtn').addEventListener('click', function () { startVision('screen'); });
  $('visionOffBtn').addEventListener('click', stopVision);
  $('askVisionBtn').addEventListener('click', askVision);
  $('buildSiteBtn').addEventListener('click', buildSite);
  $('downloadSiteBtn').addEventListener('click', downloadSite);

  $('settingsBtn').addEventListener('click', function () { fillSettingsForm(); openSheet('settingsSheet'); });
  $('settingsClose').addEventListener('click', function () { closeSheet('settingsSheet'); });
  $('saveSettings').addEventListener('click', function () {
    settings.name = $('setName').value.trim() || 'RANI';
    settings.voice = $('setVoice').value;
    settings.persona = $('setPersona').value;
    settings.lang = $('setLang').value;
    settings.liveModel = $('setLiveModel').value;
    settings.theme = $('setTheme').value;
    settings.wakeWord = $('setWake').checked;
    saveSettings();
    closeSheet('settingsSheet');
    addMsg('Settings save ho gayi — Voice: ' + voiceName() + ', Persona: ' + settings.persona + ', Language: ' + settings.lang + ', Model: ' + settings.liveModel, 'sys');
  });
  $('signOutBtn').addEventListener('click', function () {
    try { localStorage.removeItem('rani.session'); } catch (e) {}
    closeSheet('settingsSheet');
    $('authBtn').textContent = 'Sign in';
    addMsg('Signed out (local session cleared).', 'sys');
  });

  $('authBtn').addEventListener('click', function () { openSheet('authSheet'); });
  $('authClose').addEventListener('click', function () { closeSheet('authSheet'); });
  function authNotReady() {
    $('authMsg').textContent = 'Auth not configured yet — js/config.js mein Supabase + Firebase details add karein (docs/AUTH-SETUP.md).';
  }
  $('emailSignInBtn').addEventListener('click', function () { authConfigured() ? $('authMsg').textContent = 'Supabase/Firebase client wiring yahan connect hoti hai — config ke baad sign-in active hoga.' : authNotReady(); });
  $('emailSignUpBtn').addEventListener('click', function () { authConfigured() ? $('authMsg').textContent = 'Sign-up bhi config ke baad yahin se hoga (email+password, Supabase/Firebase).' : authNotReady(); });
  $('googleSignInBtn').addEventListener('click', function () { authConfigured() ? $('authMsg').textContent = 'Google sign-in config ke baad yahin se hoga (Firebase Google provider).' : authNotReady(); });

  /* ---------- init ---------- */
  applySettings();
  if (!configured) {
    setStatus('Demo mode — add your Gemini key in js/config.js');
    addMsg('Assalam-o-Alaikum! Main RANI hoon 🌸 — aapki AI assistant. Abhi demo mode mein hoon: js/config.js mein apni Gemini key add karein, phir main poori tarah live ho jaungi. Neeche type karke ya orb dabakar baat karein.', 'rani');
  } else {
    addMsg('Assalam-o-Alaikum! Main RANI hoon 🌸 — bol kar ya likh kar kuch bhi poochein. Camera, screen aur website builder bhi ready hain.', 'rani');
  }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline support is best-effort */ });
    });
  }
})();
