# Oromia STEM Suite

A free, browser-based interactive STEM learning starter for Grade 9 through university learners.

## Included experiments

### Physics
1. Newton's Second Law — explore how net force and mass affect acceleration.
2. Projectile Motion — vary launch speed and angle; compare idealized range and flight.
3. Conservation of Momentum — explore a one-dimensional collision model.
4. Snell's Law — investigate refraction at a boundary between two media.
5. Circular Motion — relate speed and radius to centripetal acceleration and force.

### Chemistry
1. Atomic Structure Explorer — change proton, neutron and electron counts.
2. pH Explorer — explore pH and the corresponding hydrogen-ion concentration.
3. Ideal Gas Law — investigate pressure, volume and temperature relationships.
4. Balancing Chemical Equations — explore coefficients in a simplified hydrogen/oxygen/water example.

### Mathematics
1. Quadratic Function Plotter — change a, b and c and inspect the parabola.
2. Trigonometry Unit Circle — connect angles to sine, cosine and tangent.
3. Statistics and Data Explorer — change five data values and compare mean, median and range.
4. Vector Addition — explore components and the resultant of two vectors.

### Biology
1. Cell Explorer — compare simplified plant and animal cell structures.
2. Photosynthesis Model — investigate how light, carbon dioxide and temperature affect a simplified rate model.
3. Simple Inheritance — explore a basic Mendelian cross.
4. Energy Transfer — explore energy transfer through trophic levels.

## Project structure

```text
oromia-stem-suite/
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

## Publish the complete project on GitHub Pages

1. Download and extract this ZIP.
2. Open your GitHub repository.
3. Upload/replace the **contents** of the extracted folder. Do not upload only the ZIP file.
4. Preserve the folder names and exact lowercase file names shown above.
5. In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/(root)`.
6. Wait for the Pages deployment workflow to finish successfully.
7. Open the published website and do a hard refresh or test in a private/incognito tab.

## Important: replace all files together

The HTML, CSS and JavaScript files are designed to work together. Replacing only `index.html` will not install all features. Replace the full set of files, including all five files in `js/labs/`.

## Run locally

Because this project uses JavaScript ES modules, serve it through a local web server rather than opening `index.html` with a `file://` URL.

For example, from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Features

- Responsive layout for phones, tablets and computers.
- Physics, Chemistry, Mathematics and Biology experiment sections.
- Adjustable experiment controls, visual models and calculated readouts.
- Reset controls for experiments.
- Light/dark theme switcher; the selected theme is saved in the browser when storage is available.
- Developer credit: Abdi Gebisa.
- No subscription or paywall.

## Scientific scope and limitations

These are educational models, not substitutes for laboratory measurements. Some simulations deliberately use ideal assumptions (for example, neglecting air resistance in projectile motion or using ideal-gas behavior). Each model should be extended and reviewed against the relevant grade-level curriculum before formal classroom assessment or high-stakes use.
