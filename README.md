# OromiaSTEM – PhET-inspired Physics Update

This package continues the OromiaSTEM project with a focused improvement to the Physics Laboratory.

## What changed in this update

- Reworked the Projectile Motion experiment into a clearer interactive experiment view.
- Upgraded Snell's Law with a moving light pulse, correct refracted-ray geometry, and total internal reflection when the incident angle exceeds the critical angle.
- Added a measured horizontal/vertical grid, predicted trajectory, travelled trajectory, apex marker and landing-range marker.
- Added live velocity-component arrows (horizontal and vertical) and a simulation-time indicator.
- Kept the adjustable launch speed, launch angle and gravitational field controls.
- Preserved the existing subject laboratories, offline/PWA files, navigation and experiment controls.

## Run locally

Because the application uses JavaScript ES modules, run it from a local web server rather than opening `index.html` directly. GitHub Pages provides this automatically after publishing.

## Publish to GitHub Pages

1. Download and extract the ZIP.
2. Open your OromiaSTEM GitHub repository.
3. Replace the repository files with the extracted files, preserving the folders (`css`, `js`, `icons`).
4. Commit the changes and allow GitHub Pages to redeploy.

This ZIP does not publish changes to the live website automatically.

## Scientific model

Projectile motion uses the ideal model with no air resistance and equal launch/landing heights:
- `x = v₀ cos(θ) t`
- `y = v₀ sin(θ) t − ½gt²`
- `T = 2v₀ sin(θ)/g`
- `R = v₀² sin(2θ)/g`
- `H = v₀² sin²(θ)/(2g)`

### Newton's Second Law experiment update
The Newton's Second Law experiment now animates a cart on a measured track. Its live display calculates displacement (`x = ½at²`), velocity (`v = at`) and acceleration (`a = F/m`) from the selected applied force and cart mass. Force, velocity and acceleration vectors are shown separately. The model assumes the cart starts from rest on a horizontal track with negligible friction; the drawing has a visual travel limit while the calculated measurements continue to update.


### Snell's Law experiment update
The optics experiment now animates a light pulse travelling toward the boundary and then along the refracted or reflected path. The controls adjust the incident angle and both refractive indices. The readout calculates the refracted angle using Snell's law and calculates the critical angle when light travels from a higher to a lower refractive index. When the incident angle exceeds the critical angle, the display identifies total internal reflection and shows the reflected ray.

The model uses ideal geometrical optics; it does not simulate wave interference, partial reflection, or material dispersion.

### Conservation of Momentum experiment update
The collision experiment now determines whether the two carts actually meet from their initial positions and velocities, rather than assuming a fixed collision time. When cart 1 catches cart 2, the carts animate before and after impact using the selected coefficient of restitution. The readout compares total momentum and kinetic energy before and after collision and reports the predicted collision time. If the initial velocities mean the carts are moving apart, the experiment correctly reports that no collision occurs. The model is one-dimensional and assumes a frictionless track with negligible external horizontal force.

### Circular Motion experiment update
The circular-motion experiment now animates an object travelling around a circular path at constant speed. It shows the radius vector, tangential velocity, and inward centripetal-acceleration vector, with live values for centripetal acceleration, centripetal force, angular speed, period, and frequency. The model uses `a_c = v²/r`, `F_c = mv²/r`, `ω = v/r`, `T = 2π/ω`, and assumes uniform circular motion at constant speed.

## Complete Physics laboratory animation pass
This consolidated package also improves the remaining Physics experiments so the Run, Pause, Step and Reset controls produce visible experimental behaviour:

- **Free fall:** falling object, calibrated height scale, live displacement, speed and time; the run stops at impact.
- **Inclined plane and friction:** moving block, incline geometry, velocity/acceleration indicators and a simplified friction threshold model.
- **Work, energy and power:** moving cart with live work, kinetic energy, speed, displacement and instantaneous power.
- **Simple pendulum:** oscillating bob, angular displacement and period readouts.
- **Hooke's law and spring oscillations:** animated spring-mass system, equilibrium extension, instantaneous displacement and restoring force.
- **Waves and superposition:** two moving waves and their resultant displacement.
- **Doppler effect:** moving sound source, observer and animated wavefronts, with approaching-source frequency calculation.
- **Ohm's law:** animated current indicators in a DC series circuit with current, total resistance and power.
- **RC capacitor:** animated charging level with capacitor voltage, current and time constant.
- **Electromagnetic induction:** moving bar magnet, coil, changing magnetic flux and induced emf.

The live measurement graph now accommodates both positive and negative readings. These are educational idealized models; each experiment's assumptions are described in its on-screen theory and caption. Visual motion is illustrative and should not be interpreted as a precision engineering simulator.

## Validation performed for this package
- JavaScript syntax checked for `app.js` and every lab module.
- ZIP archive integrity checked after packaging.
- No live GitHub Pages deployment was performed; the repository must be updated by the project owner.


## Subject navigation and Android button fix
This update binds Home, About, all four subject navigation buttons, and the home-page subject cards directly to their click handlers. Experiment buttons remain delegated from their list so newly created buttons work. Navigation failures now display a visible error instead of silently doing nothing. The service-worker cache was upgraded to v3 and now uses network-first loading for HTML, JavaScript modules and CSS so GitHub Pages updates are not hidden behind stale cached scripts. Decorative hero artwork is explicitly prevented from intercepting taps.

After replacing the repository files, open the site in Chrome and reload it. If the installed PWA still shows an old version, close its tabs and reopen it once while online so the new service worker can activate.
