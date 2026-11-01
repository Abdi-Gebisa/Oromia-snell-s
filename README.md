# Oromia STEM Suite

A free, responsive, browser-based STEM virtual laboratory for Grade 9 through university learners.

## Included in this starter release

- Physics: Newton's Second Law, Projectile Motion, Conservation of Momentum, Snell's Law, Circular Motion.
- Chemistry: Atomic Structure, pH Explorer, Ideal Gas Law, Balancing Chemical Equations.
- Mathematics: Quadratic Function Plotter, Unit Circle, Statistics Explorer, Vector Addition.
- Biology: Cell Explorer, Photosynthesis Model, Simple Inheritance, Energy Transfer.

Each experiment includes an objective, scientific explanation, interactive controls, calculated readouts, a challenge and a key relationship.

## Run locally

1. Extract the ZIP file.
2. Open the folder in Visual Studio Code.
3. Use the **Live Server** extension, or run a local web server from the folder:
   - Python: `python -m http.server 8000`
4. Open `http://localhost:8000` in your browser.

The project uses JavaScript ES modules, so opening `index.html` directly with `file://` may be blocked by some browsers. Use a local server.

## Publish with GitHub Pages

1. Create a new public GitHub repository, for example `oromia-stem-suite`.
2. Upload the contents of this folder (not the ZIP file itself).
3. In the repository, open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for the deployment and open the Pages URL shown by GitHub.

## Project structure

```text
oromia_stem_suite/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── app.js
    └── labs/
        ├── shared.js
        ├── physics.js
        ├── chemistry.js
        ├── mathematics.js
        └── biology.js
```

## Important scientific notes

These are teaching models, not replacements for supervised laboratory work. Some models intentionally use simplifying assumptions:
- Projectile motion ignores air resistance and assumes equal launch/landing height.
- The collision model is one-dimensional and neglects external forces.
- The ideal gas model assumes ideal-gas behavior.
- The photosynthesis and ecology models are illustrative, not calibrated biological predictions.
- The cell drawings are schematic and not to scale.

## Next development steps

A future release can add simulation animation/play-pause, experiment worksheets, data export, accessibility improvements, offline PWA support, more advanced calculus and chemistry modules, and optional 3D models.


## Theme and project credit
The site includes a light/dark mode switch. The selected theme is saved in the browser on that device.

Developer: Abdi Gebisa.
