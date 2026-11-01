# Oromia STEM Suite — Offline Edition

Oromia STEM Suite is a free, browser-based STEM learning app for Grade 9 through university learners. This edition includes offline app support and can be installed on Android from Chrome.

## First-time setup (required)
1. Publish all extracted files to the GitHub Pages repository, preserving the folder structure.
2. Open the website once while connected to the internet.
3. Wait a few seconds for the offline files to be cached, then refresh the page once.
4. In Chrome on Android, open the browser menu (⋮) and choose **Install app** or **Add to Home screen** if offered.
5. Open Oromia STEM Suite from the new home-screen icon. After the first successful online load and cache, the app shell and included simulations can open without internet.

## Important offline notes
- Offline access cannot be installed from a ZIP opened directly in the phone's file manager. The app must first be served from HTTPS (GitHub Pages provides HTTPS) so the browser can register its service worker.
- Connect to the internet for the first visit after installing/updating this offline edition. Keep the page open briefly, then refresh once before testing airplane mode.
- If a previous version was already cached, the browser may need one online reload to receive this service worker and cache the updated files.
- No remote fonts or third-party JavaScript libraries are required. The app uses local HTML, CSS, JavaScript modules, and local icons.
- Offline mode provides the included simulations; external websites, remote links, and any future online-only features will still need internet.

## Project structure

```text
index.html
manifest.webmanifest
sw.js
icons/
  icon-192.png
  icon-512.png
css/
  style.css
js/
  app.js
  labs/
    shared.js
    physics.js
    chemistry.js
    mathematics.js
    biology.js
```

## Update on GitHub Pages
Upload and commit the extracted contents to the repository root (not the ZIP file itself). Preserve all paths and lowercase file names. In GitHub Pages settings, keep the existing `main` branch and root folder publishing configuration.

Developed by Abdi Gebisa.
