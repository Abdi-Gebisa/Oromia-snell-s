# OromiaSTEM — Reference-Matched Front-End Update

This update rebuilds the homepage to closely follow the supplied OromiaSTEM reference image. It retains the existing four subject laboratories and experiment source files.

## Homepage elements retained from the reference
- Full-width dark navy navigation with OromiaSTEM atom/book mark, Home, About, Physics, Chemistry, Mathematics, Biology, Contact, and theme control.
- Welcome hero with the Explore / Experiment / Learn / Innovate motto, platform description, Start Exploring and Learn More actions, scientific illustration, and Ethiopia message.
- Four subject laboratory cards: Physics, Chemistry, Mathematics, and Biology.
- Five-feature strip: Interactive Simulations, Live Graphs & Measurements, Offline Support, For Ethiopian Students, and Free Access.
- Three lower information panels: About OromiaSTEM, Why OromiaSTEM?, and Get Started Today!
- Footer with OromiaSTEM branding, developer credit, and only the requested contact methods: email and LinkedIn.

## Functionality
- Homepage is the initial view; the application no longer automatically opens Physics on startup.
- All four subject cards and navigation buttons use the existing delegated navigation handler to open their respective labs.
- Theme button toggles dark/light themes and remembers the choice.
- Mobile navigation is retained and the homepage sections reflow for Android screens.
- Service-worker cache version is updated to avoid serving stale HTML/CSS/JS after deployment.

## Publish
Extract this ZIP and replace the matching files in the existing GitHub Pages repository, preserving the folder structure. Commit the changes and allow GitHub Pages to deploy. Then reopen the site in Chrome while online so the new service worker can update.

The supplied reference is a visual guide; this implementation recreates the layout with HTML, CSS and vector artwork rather than using the screenshot as a flat, non-interactive background. No live GitHub repository has been changed by preparing this package.


## Chemistry and Biology laboratory expansion (v8)
- Chemistry now includes 11 experiments, adding animated Collision Theory / Reaction Kinetics and Dynamic Chemical Equilibrium. Atom electrons, gas particles, galvanic-cell electron flow, and electrolysis gas bubbles animate with simulation time.
- Biology now includes 11 experiments, including an expanded chloroplast photosynthesis model and a new detailed cellular respiration pathway.
- Photosynthesis illustrates photon capture, thylakoid light reactions, water splitting, oxygen release, CO2 fixation in the Calvin cycle, and limiting factors (light, CO2, temperature and chlorophyll).
- Cellular respiration traces glycolysis in the cytosol, pyruvate oxidation/Krebs cycle in the mitochondrial matrix, electron transport, oxygen as final electron acceptor, water formation and ATP output.
- Chemistry and Biology now animate inside their own experiment drawings; the previous generic overlay that covered their diagrams has been removed.
- Live graph metrics are defined for photosynthesis rate, respiration ATP estimate, reaction progress and equilibrium composition.
- Models are explicitly labelled as simplified educational representations, not full biochemical or experimentally calibrated simulations.


## Contact details and universal equation balancer (v9)
- Footer contact methods are limited to email (`abdigebisa035@gmail.com`) and LinkedIn. The LinkedIn button opens Abdi Gebisa Nagasa’s profile: https://www.linkedin.com/in/abdi-gebisa-nagasa-70653b388/.
- The Chemistry laboratory's balancing experiment is now a student-input universal balancer: learners type their own reactants and products, then select **Balance equation**.
- Supports ordinary neutral molecular equations with element symbols, numeric subscripts, parentheses/brackets, and hydrate dot notation. It calculates whole-number coefficients and displays atom counts on both sides for every element.
- Tested with water formation, iron oxide, aluminium + hydrochloric acid, calcium phosphate, ethane combustion, sodium carbonate + acid, and potassium chlorate decomposition.
- Ionic half-reaction balancing in acidic/basic solution and charged-complex notation are not included in this version; these require a separate charge/electron balancing workflow.
- Service-worker cache is advanced to v9 so deployed devices can fetch the updated chemistry code.
