# Oromia STEM Suite — Expanded Experimental Edition

Free, responsive, browser-based STEM learning for Grade 9 through university learners. Developed by **Abdi Gebisa**.

## Expanded simulation library

### Physics — 15 simulations
1. Newton's Second Law
2. Projectile Motion
3. Conservation of Momentum
4. Snell's Law: Refraction
5. Circular Motion
6. Free Fall and Gravitational Acceleration
7. Friction on an Inclined Plane
8. Work, Energy and Power
9. Simple Pendulum
10. Hooke's Law and Spring Oscillations
11. Wave Properties and Superposition
12. Doppler Effect
13. Ohm's Law and Resistor Circuits
14. Capacitor Charging and Discharging
15. Electromagnetic Induction

### Chemistry — 9 simulations
1. Atomic Structure Explorer
2. pH and Acid–Base Explorer
3. Ideal Gas Law
4. Balancing Chemical Equations
5. Galvanic Cell and Cell Potential
6. Electrolysis of Water
7. Faraday's Law: Electroplating
8. Redox Reaction and Oxidation Numbers
9. Dilution and Solution Preparation

### Mathematics — 4 simulations
1. Quadratic Function Plotter
2. Trigonometry Unit Circle
3. Statistics and Data Explorer
4. Vector Addition

### Biology — 10 simulations
1. Animal and Plant Cell Explorer
2. Photosynthesis Explorer
3. Simple Inheritance Simulator
4. Food Chain and Energy Transfer
5. Microorganism Explorer: Bacteria, Archaea and Eukaryotes
6. Paramecium: Cilia, Feeding and Contractile Vacuole
7. Virus Structure and Replication Cycle
8. Fungi: Yeast, Hyphae and Mycelium
9. Amoeba: Pseudopodia and Phagocytosis
10. Bacterial Population Growth

**Total: 38 interactive simulations.**

## Project structure

```text
Oromia-STEM-Suite/
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

## Install/update on GitHub Pages

1. Download and extract the ZIP.
2. In the repository, replace the existing `index.html`, `README.md`, `css/style.css`, `js/app.js`, and all five files in `js/labs/` with the matching files from this package.
3. Preserve exact folder and lowercase file names.
4. Commit changes to the `main` branch.
5. In Settings → Pages, keep `main` and `/(root)`.
6. Wait for the Pages build to succeed, then refresh the site or test in a private tab.

Do not upload only the ZIP file. The extracted files must be in the repository root with the structure shown above.

## Run locally

Use a local web server because this project uses JavaScript ES modules:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Scientific scope and responsible use

The suite uses educational models and calculated outputs, not live laboratory measurements. Each simulation states its assumptions or limitations. Examples include ideal projectile motion without drag, small-angle pendulum behavior, ideal RC charging, standard electrode potentials, ideal Faraday-law yields, and simplified biological indices/population growth. They are intended to support learning and hypothesis testing, not replace practical laboratory work, clinical microbiology, or validated research software.

For the microbiology section, organism diagrams are schematic and are not identification tools. Viruses are acellular and require host-cell machinery to replicate. Paramecium, amoeba, bacteria, archaea and fungi are represented as distinct biological groups, not interchangeable forms.


## Real-time experiment controls (new)

The experiment view now includes:
- Run, Pause, single-step and Reset controls.
- A live simulation clock and continuously refreshed measurement panel.
- A live graph that records a selected numeric experimental variable against simulation time.
- A guided investigation sequence: objective, prediction, controlled variable changes, observation and explanation.

The graph is a generic data-collection scaffold. It plots the first numeric control as the measured parameter; individual experiment modules can be upgraded further to provide physically meaningful time-series sensors and animated particle/object states. Existing static model drawings are redrawn continuously while Run is active, but not every experiment yet has a distinct physical time-evolution model.
