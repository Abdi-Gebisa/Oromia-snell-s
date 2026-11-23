# OSTEM — Virtual Physics Laboratory v5.0

OSTEM is a mobile-first, offline-capable virtual Physics laboratory for Ethiopian secondary-school learners. It uses browser-native HTML5, CSS3, Canvas and modular vanilla JavaScript.

## Physics units
- Mechanics: Newton’s laws, projectile motion, momentum, circular motion, friction, energy, oscillations and banked roads.
- Optics and waves: reflection, Snell’s law, thin lenses, wave properties and Doppler effect.
- Electricity and magnetism: Ohm’s law, capacitors and electromagnetic induction.
- EUEE chapter practice and formula/laboratory notes.

## Student-controlled experiments
Every numeric experiment variable has both a slider and a direct number-entry field. Enter a value or move the slider; both controls stay synchronized and the model/readouts redraw immediately. Values are constrained to the scientifically supported range shown beside each variable.

## Run locally / deploy
Serve this folder from a local static web server, or publish the repository root with GitHub Pages. The service worker caches the app shell for offline use after the first successful online visit.

## Project structure
- `index.html` — app shell and navigation
- `css/style.css` — responsive dark-navy UI
- `js/app.js` — navigation, controls, simulation lifecycle, graph and export
- `js/labs/physics.js` — core Physics simulations
- `js/labs/physics-extensions.js` — optics and additional mechanics
- `js/euee-practice.js` — chapter practice
- `sw.js` — PWA offline cache
- `www/` — synchronized Capacitor web assets

## Scientific scope
Models state their assumptions (for example, ideal projectile motion neglects air resistance). This is a teaching simulator, not a replacement for calibrated laboratory instruments. Check each experiment’s theory and assumptions before using its results.

## Learning support tools (v5 tutor update)
- Physics Tutor: offline, topic-matched explanations, key equations, worked examples and study tips for mechanics, energy, momentum, circular motion, optics, waves, electricity and magnetism. This is a curated rule-based offline tutor, not a live generative-AI model. A real conversational AI requires a secure backend; never expose provider API keys in client-side JavaScript or a public GitHub repository.
- Formula calculator: projectile range (equal launch/landing height), Newton's second law, Ohm's law and kinetic energy.
- Lab Report Builder: write an objective, method, observations and conclusion, then export a text report.
- EUEE practice and interactive experiment data export remain available.

The calculator validates input and uses SI units. It is a learning aid; students should show working and check assumptions.
