package com.badshah222.rani.ai

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

/**
 * RANI AI — Android WebView wrapper.
 *
 * The app itself is the phone web app in ../rani-web/ (no native rewrite of
 * RANI's Python code — Python cannot become a native Android APK directly).
 * This Activity loads that web app from a configurable URL.
 *
 * APP URL (change at release time — no recompile of the web app needed):
 *   - Default: BuildConfig.RANI_APP_URL if set, else https://rani-ai-girlfrind.pages.dev
 *   - Local test: override with a debug build that points at your dev server.
 * LOCAL-ASSET FALLBACK: if the hosted app cannot be reached, a bundled
 * offline page (assets/offline.html) is shown with a retry button. The full
 * web app is NOT bundled as local assets in this wrapper by design — it is
 * deployed as a website so it can be updated without a new APK. If you want
 * a fully offline bundle, copy rani-web/* into app/src/main/assets/ and
 * point the fallback URL at file:///android_asset/index.html instead.
 *
 * Permissions: mic + camera are requested at runtime (Android 6+) AND
 * granted inside the WebView via WebChromeClient.onPermissionRequest, so
 * Gemini voice, camera vision and screen vision work in the wrapper.
 *
 * No API keys, no keystore, no secrets in this project — signing happens in
 * CI from GitHub Secrets (see .github/workflows/android-build.yml).
 */
class MainActivity : AppCompatActivity() {

    companion object {
        // Deployed RANI web app URL: https://rani-ai-girlfrind.pages.dev
        const val APP_URL = "https://rani-ai-girlfrind.pages.dev"
        const val OFFLINE_URL = "file:///android_asset/offline.html"
    }

    private lateinit var webView: WebView

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { grants ->
        val denied = grants.filterValues { !it }.keys
        if (denied.isNotEmpty()) {
            Toast.makeText(
                this,
                "Mic/camera permission ke baghair voice aur vision nahi chalegi.",
                Toast.LENGTH_LONG
            ).show()
        }
        // Load (or reload) after the permission answer so the page sees the grant.
        if (!::webView.isInitialized || webView.url == null) loadApp()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        webView = findViewById(R.id.webview)

        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = true
            // WebRTC (mic/camera) needs this on older WebViews; harmless on new ones.
            @Suppress("DEPRECATION")
            allowUniversalAccessFromFileURLs = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            userAgentString = "$userAgentString RANI-AI-Android"
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onReceivedError(
                view: WebView, request: android.webkit.WebResourceRequest,
                error: android.webkit.WebResourceError
            ) {
                // Only fall back for the main page, not for sub-resources.
                if (request.isForMainFrame) view.loadUrl(OFFLINE_URL)
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                // Grant the mic/camera resources the page asked for, but only
                // ones the user already allowed at Android level.
                val granted = request.resources.filter {
                    (it == PermissionRequest.RESOURCE_AUDIO_CAPTURE &&
                        hasPermission(Manifest.permission.RECORD_AUDIO)) ||
                    (it == PermissionRequest.RESOURCE_VIDEO_CAPTURE &&
                        hasPermission(Manifest.permission.CAMERA))
                }.toTypedArray()
                if (granted.isNotEmpty()) request.grant(granted) else request.deny()
            }
        }

        requestRuntimePermissions()
        loadApp()
    }

    private fun hasPermission(perm: String): Boolean =
        ContextCompat.checkSelfPermission(this, perm) == PackageManager.PERMISSION_GRANTED

    private fun requestRuntimePermissions() {
        val wanted = mutableListOf(Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            wanted += Manifest.permission.POST_NOTIFICATIONS
        }
        val missing = wanted.filter { !hasPermission(it) }.toTypedArray()
        if (missing.isNotEmpty()) permissionLauncher.launch(missing)
    }

    private fun loadApp() {
        webView.loadUrl(APP_URL)
    }

    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }

    override fun onDestroy() {
        if (::webView.isInitialized) webView.destroy()
        super.onDestroy()
    }
}
