# OSTEM Android build

The `www/` directory is the Capacitor web asset directory and mirrors the root web app. The Android build uses the app name OSTEM. Numeric experiment values can be entered directly in the number fields or adjusted with sliders.

Run `npm install`, `npm run android:add` (first setup), then `npm run android:sync`. Android compilation requires the Android toolchain; the GitHub Actions workflow can build a debug APK.
