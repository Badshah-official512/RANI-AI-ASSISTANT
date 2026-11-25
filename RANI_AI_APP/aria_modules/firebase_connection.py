# -*- coding: utf-8 -*-
"""
firebase_connection.py  [SECURE v3 — No Admin SDK]
===================================================
Face Auth ke liye Firebase Realtime DB / Firestore connection.
Firebase Admin SDK REMOVED — sirf pyrebase client SDK use karta hai.
Admin SDK SIRF backend server pe chalta hai.
"""
import os, sys
from pathlib import Path

# ── Public Firebase config (client-safe — no secrets) ────────────────────────
# RANI uses its own Firebase project (same system as BADSHAH AI — see
# docs/AUTH-SETUP.md). Paste YOUR project's web config here; never commit
# real keys to this public repo.
FIREBASE_CONFIG = {
    "apiKey":            "PASTE_YOUR_FIREBASE_API_KEY_HERE",
    "authDomain":        "PASTE_YOUR_FIREBASE_AUTH_DOMAIN_HERE",
    "projectId":         "PASTE_YOUR_FIREBASE_PROJECT_ID_HERE",
    "storageBucket":     "PASTE_YOUR_FIREBASE_STORAGE_BUCKET_HERE",
    "messagingSenderId": "",
    "appId":             "PASTE_YOUR_FIREBASE_APP_ID_HERE",
    "databaseURL":       "",
}

_pyrebase_db   = None
_init_tried    = False

def _get_pyrebase_db():
    global _pyrebase_db, _init_tried
    if _init_tried:
        return _pyrebase_db
    _init_tried = True
    try:
        import pyrebase
        fb = pyrebase.initialize_app(FIREBASE_CONFIG)
        _pyrebase_db = fb.database()
        print("[Firebase] Pyrebase client initialized (face auth)")
    except Exception as e:
        print(f"[Firebase] Pyrebase unavailable: {e} — face auth uses local mode")
    return _pyrebase_db

def get_firebase_db():
    """
    Face Auth ke liye DB.
    Returns pyrebase DB object ya None (graceful degradation).
    NOTE: Firebase Admin SDK use NAHI — sirf client SDK.
    """
    from aria_modules.license_client import load_license, get_device_id
    lic = load_license()
    if not lic.get("session_token"):
        return None
    return _get_pyrebase_db()

def verify_session_online() -> bool:
    """Backend heartbeat se session check karo."""
    from aria_modules.license_client import load_license, heartbeat, get_device_id
    lic = load_license()
    return heartbeat(
        session_token=lic.get("session_token",""),
        device_id=lic.get("device_id", get_device_id())
    )
