# OromiaSTEM — Mobile Navigation & Visual Redesign

This update uses the supplied OromiaSTEM subject-navigation ZIP as its source.

## Main changes
- Redesigned the home page with a deep navy / electric-blue STEM theme inspired by the supplied reference screenshot.
- Added a richer hero area, animated-style atom artwork, four glowing subject cards, a feature strip and project information cards.
- Made dark mode the default visual theme while retaining a working light/dark toggle and saved preference.
- Reworked navigation into one capture-phase click router for all subject navigation buttons and home subject cards.
- Kept all four existing lab modules and the Physics experiment content.
- Improved the mobile navigation menu and touch target sizes.
- Added a CSS/JS cache-busting version query and upgraded service-worker cache name.

## Publish
1. Extract the ZIP.
2. Replace the contents of the GitHub Pages repository with these files, keeping the `css`, `js`, and `icons` folders.
3. Commit the changes and wait for GitHub Pages deployment.
4. Open the site in Chrome while online and reload. If an installed PWA still displays old content, close it and reopen it online.

## Validation
- All JavaScript modules passed `node --check`.
- ZIP integrity passed.
- This package has not been deployed to GitHub Pages and has not been physically tested on an Android device.
