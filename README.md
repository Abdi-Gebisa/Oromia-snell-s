# OromiaSTEM — Reference-Matched Front-End Update

This update rebuilds the homepage to closely follow the supplied OromiaSTEM reference image. It retains the existing four subject laboratories and experiment source files.

## Homepage elements retained from the reference
- Full-width dark navy navigation with OromiaSTEM atom/book mark, Home, About, Physics, Chemistry, Mathematics, Biology, Contact, and theme control.
- Welcome hero with the Explore / Experiment / Learn / Innovate motto, platform description, Start Exploring and Learn More actions, scientific illustration, and Ethiopia message.
- Four subject laboratory cards: Physics, Chemistry, Mathematics, and Biology.
- Five-feature strip: Interactive Simulations, Live Graphs & Measurements, Offline Support, For Ethiopian Students, and Free Access.
- Three lower information panels: About OromiaSTEM, Why OromiaSTEM?, and Get Started Today!
- Footer with OromiaSTEM branding, developer credit, and social/contact links.

## Functionality
- Homepage is the initial view; the application no longer automatically opens Physics on startup.
- All four subject cards and navigation buttons use the existing delegated navigation handler to open their respective labs.
- Theme button toggles dark/light themes and remembers the choice.
- Mobile navigation is retained and the homepage sections reflow for Android screens.
- Service-worker cache version is updated to avoid serving stale HTML/CSS/JS after deployment.

## Publish
Extract this ZIP and replace the matching files in the existing GitHub Pages repository, preserving the folder structure. Commit the changes and allow GitHub Pages to deploy. Then reopen the site in Chrome while online so the new service worker can update.

The supplied reference is a visual guide; this implementation recreates the layout with HTML, CSS and vector artwork rather than using the screenshot as a flat, non-interactive background. No live GitHub repository has been changed by preparing this package.
