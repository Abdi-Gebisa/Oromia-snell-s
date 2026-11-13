# OromiaSTEM Android 2.0 — Offline-first build

This project packages the complete OromiaSTEM web application into an Android app using Capacitor. The Android app loads the local `www/` files bundled inside the APK; it does **not** depend on the GitHub Pages website or the website service worker to open the laboratories.

## Included

- Reference-matched OromiaSTEM homepage and mobile layout.
- Physics, Chemistry, Mathematics and Biology laboratory source files.
- Photosynthesis and cellular-respiration learning models.
- Student-entered chemical equation balancer.
- Dark/light theme and subject navigation.
- Existing local icons, CSS, JavaScript and experiment animations.
- GitHub Actions workflow that builds an installable debug APK in the cloud.

## Build from an Android phone using GitHub Actions

No PC is required for this cloud-build route.

1. Create or open a GitHub repository for OromiaSTEM (the existing `Oromia-snell-s` repository can be used if you want the Android build workflow in the same repository).
2. Upload the **contents** of this ZIP into the repository root. Make sure `.github/workflows/build-android.yml`, `package.json`, `capacitor.config.ts` and the `www/` folder are at the repository root—not inside an extra nested folder.
3. Commit the files to the `main` branch (or `master`).
4. Open the repository's **Actions** tab.
5. Select **Build OromiaSTEM Android APK** and open the latest run. The workflow also starts automatically after relevant files are pushed to `main` or `master`.
6. Wait for the workflow to finish successfully.
7. Open the completed run, scroll to **Artifacts**, and download `OromiaSTEM-Android-debug-APK`.
8. Extract the downloaded artifact ZIP. It contains `app-debug.apk`. Open it on your Android phone and allow installation from that source if Android asks.

The first cloud build creates the Android project, syncs the local website files into it, and builds the APK. The APK contains the app files, so Physics, Chemistry, Mathematics, Biology, animations, theme and the equation balancer can run without internet. Internet is only needed for external links such as LinkedIn and for downloading future app updates.

## App identity and existing installations

- App name: `OromiaSTEM`
- Android application ID: `com.abdige.oromiastem`
- Version label: `2.0.0` in this project package.

The application ID is a permanent identity once you distribute the app. This starter uses `com.abdige.oromiastem`. If an earlier OROMOSTEM APK was published with a different application ID, Android will install this as a separate app rather than update that older app. Updating an existing installation also requires signing with the same original release key. Do not upload or share a keystore or its passwords in a public repository.

## Debug APK vs public release APK

The workflow creates a **debug-signed APK** for installation and testing. It is suitable for trying the app on your phone and sharing with testers. For a public release or updates to an existing signed app, configure a private release keystore using GitHub Actions secrets and build a signed release APK. Never commit the keystore or passwords to the repository.

## Offline test

After installing the APK:
1. Open OromiaSTEM once.
2. Turn on Airplane mode.
3. Open each of the four laboratories.
4. Open several experiments, change controls, press Run/Reset, and test the equation balancer.
5. Switch dark/light mode and move between Home and subjects.

If a core experiment does not work in Airplane mode, report the experiment name and what happened so it can be fixed before a public release.

## Technical requirements

The workflow uses Node.js 22, Java 21 and Capacitor 8.6.2. Capacitor's Android platform requires Android SDK tooling; GitHub Actions supplies the build environment. See the official [Capacitor Android guide](https://capacitorjs.com/docs/android) and [environment setup](https://capacitorjs.com/docs/getting-started/environment-setup).
