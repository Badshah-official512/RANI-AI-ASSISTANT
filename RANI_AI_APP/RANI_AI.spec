# RANI AI v8.0 — RANI Coder Integrated
# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_submodules
from PyInstaller.utils.hooks import collect_all

datas = [('aria.py', '.'), ('aria_ui.py', '.'), ('rani_ui.py', '.'), ('rani_pages.py', '.'), ('rani_actions.py', '.'), ('rani_quick_features.py', '.'), ('rani_edge_glow.py', '.'), ('rani_float_orb.py', '.'), ('rani_guardian.py', '.'), ('rani_autostart.py', '.'), ('rani_prefs.py', '.'), ('rani_slot.py', '.'), ('rani_lang.py', '.'), ('rani_splash.py', '.'), ('rani_apps.py', '.'), ('rani_spotify.py', '.'), ('rani_studio.py', '.'), ('aria_modules', 'aria_modules'), ('rani', 'rani'), ('website_builder', 'website_builder'), ('rani_coder_integration.py', '.'), ('rani_coder', 'rani_coder'), ('Aria_office_manage.py', '.'), ('Main_normal.py', '.'), ('main_hotkey.py', '.'), ('aria_daemon.py', '.'), ('aria_startup.py', '.'), ('prompt.py', '.'), ('normal_prompt.py', '.'), ('camera_vision_module.py', '.'), ('screen_share_module.py', '.'), ('whatsapp_file_sender.py', '.'), ('aria_icon.ico', '.'), ('aria_modules/haarcascade_frontalface_default.xml', 'aria_modules')]
binaries = []  # NOTE: builder-machine paths were removed — set your own if you build a desktop EXE (reference only; Android is the target)
hiddenimports = ['PyQt5.QtWidgets', 'PyQt5.QtCore', 'PyQt5.QtGui', 'PyQt5.sip', 'PyQt5.QtMultimedia', 'websockets', 'websockets.legacy', 'websockets.legacy.client', 'websockets.legacy.server', 'websockets.connection', 'websockets.exceptions', 'websockets.frames', 'websockets.http11', 'websockets.streams', 'websockets.uri', 'requests', 'requests.adapters', 'requests.auth', 'requests.cookies', 'requests.exceptions', 'requests.models', 'requests.sessions', 'urllib3', 'urllib3.util', 'urllib3.util.retry', 'urllib3.util.ssl_', 'certifi', 'aiohttp', 'urllib.request', 'urllib.parse', 'sounddevice', '_sounddevice_data', 'pyaudio', 'wave', 'asyncio', 'asyncio.events', 'asyncio.futures', 'asyncio.tasks', 'asyncio.streams', 'asyncio.queues', 'asyncio.locks', 'asyncio.protocols', 'asyncio.transports', 'asyncio.selector_events', 'asyncio.windows_events', 'asyncio.windows_utils', 'pyrebase', 'pyrebase.pyrebase', 'python_jwt', 'jwcrypto', 'jwcrypto.jwt', 'cryptography', 'cryptography.hazmat', 'cryptography.hazmat.primitives', 'cryptography.hazmat.primitives.asymmetric', 'cryptography.hazmat.backends', 'cryptography.hazmat.backends.openssl', 'cv2', 'numpy', 'numpy.core', 'numpy.core._multiarray_umath', 'PIL', 'PIL.Image', 'PIL.ImageDraw', 'PIL.ImageEnhance', 'PIL.ImageFilter', 'pyttsx3', 'pyttsx3.drivers', 'pyttsx3.drivers.sapi5', 'win32com.client', 'win32com.server', 'win32api', 'win32con', 'win32gui', 'win32process', 'pythoncom', 'winreg', 'comtypes', 'comtypes.client', 'winsound', 'google.genai', 'google.genai.types', 'google.generativeai', 'psutil', 'pyperclip', 'pyautogui', 'pygetwindow', 'yt_dlp', 'qrcode', 'qrcode.image', 'qrcode.image.pil', 'pywhatkit', 'duckduckgo_search', 'speedtest', 'phonenumbers', 'pypdf', 'mss', 'mss.windows', 'pynput', 'pynput.keyboard', 'pynput.mouse', 'openpyxl', 'docx', 'pptx', 'win32clipboard', 'ctypes', 'sqlite3', 'json', 'uuid', 're', 'dotenv', 'threading', 'subprocess', 'glob', 'shutil', 'wave', 'tempfile', 'secrets', 'pathlib', 'datetime', 'collections', 'hashlib', 'socket', 'jaraco', 'jaraco.packaging', 'jaraco.text', 'colorama', 'ssl', 'certifi', 'aria_modules.license_client', 'aria_modules.aria_activation', 'aria_modules.firebase_connection', 'aria_modules.tools', 'aria_modules.cloud_database', 'aria_modules.face_auth', 'aria_modules.minibar_aria', 'aria_modules.aria_advanced_tools', 'aria_modules.aria_advanced_features', 'aria_modules.aria_login', 'aria_modules.game_install', 'rani.cli', 'rani.config', 'rani_coder_integration', 'prompt', 'normal_prompt', 'whatsapp_file_sender', 'Aria_office_manage', 'camera_vision_module', 'screen_share_module']
hiddenimports += collect_submodules('websockets')
hiddenimports += collect_submodules('requests')
hiddenimports += collect_submodules('pywinauto')
hiddenimports += ['comtypes', 'comtypes.client', 'rapidfuzz', 'rapidfuzz.fuzz']
hiddenimports += collect_submodules('urllib3')
hiddenimports += collect_submodules('google.genai')
hiddenimports += collect_submodules('PIL')
hiddenimports += collect_submodules('cv2')
hiddenimports += collect_submodules('mss')
hiddenimports += collect_submodules('win32com')
hiddenimports += collect_submodules('pyautogui')
hiddenimports += collect_submodules('aria_modules')
hiddenimports += collect_submodules('rani')
hiddenimports += collect_submodules('website_builder')
hiddenimports += collect_submodules('numpy')
hiddenimports += collect_submodules('asyncio')
tmp_ret = collect_all('sounddevice')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('_sounddevice_data')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('certifi')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('pyrebase')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('python_jwt')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('jwcrypto')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('cryptography')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('duckduckgo_search')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('yt_dlp')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('pywhatkit')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('pyttsx3')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('jaraco')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('aria_modules')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]
tmp_ret = collect_all('website_builder')
datas += tmp_ret[0]; binaries += tmp_ret[1]; hiddenimports += tmp_ret[2]


a = Analysis(
    ['Main_normal.py'],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=['admin_and_build_tools/_aria_rthook.py'],
    excludes=['torchaudio', 'tensorflow', 'keras', 'sklearn', 'scipy', 'pandas', 'matplotlib', 'IPython', 'notebook', 'jupyter', 'acrcloud', 'pynvml', 'PySide6', 'tkinter', 'test', 'unittest', '_pytest', 'onnxruntime', 'onnx', 'firebase_admin', 'google.cloud.firestore'],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='RANI_AI',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['aria_icon.ico'],
)
