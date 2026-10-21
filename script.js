/**
 * Oromia Virtual Optics Bench | Labsii Ifaa Interaaktiivii
 * Developed by: Abdi Gebisa Nagasa (AUSSS)
 * Designed for: Oromia Education Bureau Innovation Festival
 * Pure Vanilla JavaScript (Client-Side, No External Dependencies)
 */

// ==========================================================
// 1. BILINGUAL DICTIONARY (Afaan Oromoo & English)
// ==========================================================
let currentLang = 'om'; // Defaults to Afaan Oromoo

const i18n = {
  om: {
    langBtnText: "English Version",
    badgeApparatus: "Bakka Bu'aa Meeshaa Laabooratoorii",
    heroTitle: "Simuleetara Saayinsii Ifaa fi Xiinxala Leensii",
    heroDesc: "Barnoota Fiiziksii Kutaa 10 fi 11 (Unit: Geometrical Optics) manneen barnootaa Oromiyaa keessatti qabatamaan shaakaluuf kan qophaa'e.",
    tabRefraction: "⚡ 1. Seera Isneel & Jal'ina Ifaa (Snell's Law & TIR)",
    tabLens: "🔍 2. Teessoo Leensii Qalloo (Thin Lens Bench)",
    ctrlRefractionTitle: "To'annoo Leezarii fi Qorannoo",
    lblMedium1: "Giddu-galeessa 1ffaa (Medium 1):",
    lblMedium2: "Giddu-galeessa 2ffaa (Medium 2):",
    lblIncidentAngle: "Kofa Furguggiisaa (θ₁):",
    telemetryTitle: "Herrega Saayinsawaa (Live Telemetry)",
    lblCriticalAngle: "Kofa Murteessaa (θ_c):",
    lblRefractedAngle: "Kofa Jal'inaa (θ₂):",
    lblStatus: "Haala Ifaa (Phenomenon):",
    tirTitle: "Reflekshinii Guutuu (TIR)!",
    tirDesc: "Ifni hundi gara giddu-galeessa duraatti deebi'e. Tekinooloojiin Faayibarii Optikii (Internet) kanumaan hojjeta!",
    legIncident: "Xiyya Ifa Dhufaa (θ₁)",
    legRefracted: "Xiyya Ifa Jal'atee (θ₂)",
    legReflected: "Xiyya Calaqqee",
    ctrlLensTitle: "Teessoo Leensii & Wantoota",
    lblLensType: "Gosa Leensii (Lens Type):",
    btnConvex: "Bukullee (Convex)",
    btnConcave: "Qoollee (Concave)",
    lblFocalLength: "Fageenya Fookasii (|f|):",
    lblObjectDistance: "Fageenya Wantaa (d_o):",
    lblObjectHeight: "Olka'iinsa Wantaa (h_o):",
    lensMathTitle: "Herrega Herreegama Leensii (1/f = 1/d_o + 1/d_i)",
    lblImgDistance: "Fageenya Fakkii (d_i):",
    lblImgHeight: "Olka'iinsa Fakkii (h_i):",
    lblMagnification: "Gudddina Fakkii (M):",
    lblImgNature: "Amala Fakkii (Nature):",
    legRay1: "Xiyya 1ffaa: Wajjiin Qajeela (Parallel -> F)",
    legRay2: "Xiyya 2ffaa: Wiirtuu Leensiitiin (Center)",
    legRay3: "Xiyya 3ffaa: Fookasii Dabarsee"
  },
  en: {
    langBtnText: "Afaan Oromoo",
    badgeApparatus: "Virtual Laboratory Apparatus Replacement",
    heroTitle: "Virtual Optics & Thin Lens Ray-Tracing Lab",
    heroDesc: "A complete interactive geometric optics environment aligned with the Ethiopian Grade 10 & 11 Physics syllabus.",
    tabRefraction: "⚡ 1. Snell's Law, Refraction & TIR",
    tabLens: "🔍 2. Thin Lens Optical Bench",
    ctrlRefractionTitle: "Laser Emitter & Medium Controls",
    lblMedium1: "Upper Medium (Medium 1):",
    lblMedium2: "Lower Medium (Medium 2):",
    lblIncidentAngle: "Incident Angle (θ₁):",
    telemetryTitle: "Scientific Computation & Telemetry",
    lblCriticalAngle: "Critical Angle (θ_c):",
    lblRefractedAngle: "Refracted Angle (θ₂):",
    lblStatus: "Optical Status:",
    tirTitle: "Total Internal Reflection (TIR)!",
    tirDesc: "All light is 100% reflected internally. This fundamental principle powers modern high-speed optical fiber communications!",
    legIncident: "Incident Ray (θ₁)",
    legRefracted: "Refracted Ray (θ₂)",
    legReflected: "Reflected Ray",
    ctrlLensTitle: "Optical Bench Controls",
    lblLensType: "Lens Geometry:",
    btnConvex: "Convex (Converging)",
    btnConcave: "Concave (Diverging)",
    lblFocalLength: "Focal Length (|f|):",
    lblObjectDistance: "Object Distance (d_o):",
    lblObjectHeight: "Object Height (h_o):",
    lensMathTitle: "Thin Lens Equation (1/f = 1/d_o + 1/d_i)",
    lblImgDistance: "Image Distance (d_i):",
    lblImgHeight: "Image Height (h_i):",
    lblMagnification: "Magnification (M):",
    lblImgNature: "Image Characteristics:",
    legRay1: "Ray 1: Parallel -> Refracts to/from F",
    legRay2: "Ray 2: Through optical center (undeviated)",
    legRay3: "Ray 3: Directed through focal point"
  }
};

// ==========================================================
// 2. UI CONTROL LOGIC
// ==========================================================
function toggleLanguage() {
  currentLang = (currentLang === 'om') ? 'en' : 'om';
  document.getElementById('langText').innerText = i18n[currentLang].langBtnText;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentLang][key]) {
      el.innerText = i18n[currentLang][key];
    }
  });

  updateRefraction();
  updateLens();
}

function switchModule(modId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.lab-module').forEach(mod => mod.classList.remove('active'));

  if (modId === 'refraction') {
    document.getElementById('tabRefraction').classList.add('active');
    document.getElementById('module-refraction').classList.add('active');
    updateRefraction();
  } else {
    document.getElementById('tabLens').classList.add('active');
    document.getElementById('module-lens').classList.add('active');
    updateLens();
  }
}

// ==========================================================
// 3. SNELL'S LAW & REFRACTION ENGINE (CANVAS)
// ==========================================================
const refCanvas = document.getElementById('refractionCanvas');
const refCtx = refCanvas.getContext('2d');

function updateRefraction() {
  const n1 = parseFloat(document.getElementById('selMedium1').value);
  const n2 = parseFloat(document.getElementById('selMedium2').value);
  const theta1Deg = parseFloat(document.getElementById('sliderTheta1').value);
  
  document.getElementById('valTheta1').innerText = `${theta1Deg.toFixed(1)}°`;

  const theta1Rad = (theta1Deg * Math.PI) / 180;
  
  // Critical Angle: sin(θc) = n2 / n1
  let criticalAngleDeg = null;
  if (n1 > n2) {
    criticalAngleDeg = (Math.asin(n2 / n1) * 180) / Math.PI;
    document.getElementById('outCriticalAngle').innerText = `${criticalAngleDeg.toFixed(1)}°`;
  } else {
    document.getElementById('outCriticalAngle').innerText = (currentLang === 'om') ? "Hin jiru" : "None";
  }

  // Snell's Law
  const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);
  const isTIR = sinTheta2 > 1.0;

  const tirAlert = document.getElementById('tirAlert');
  const outTheta2 = document.getElementById('outTheta2');
  const outStatus = document.getElementById('outRefractStatus');

  let theta2Rad = 0;
  if (isTIR) {
    tirAlert.classList.remove('hidden');
    outTheta2.innerText = "TIR";
    outStatus.innerText = (currentLang === 'om') ? "Reflekshinii Guutuu" : "Total Internal Reflection";
  } else {
    tirAlert.classList.add('hidden');
    theta2Rad = Math.asin(sinTheta2);
    outTheta2.innerText = `${(theta2Rad * 180 / Math.PI).toFixed(1)}°`;
    outStatus.innerText = (currentLang === 'om') ? "Jal'ina Ifaa" : "Normal Refraction";
  }

  drawRefraction(n1, n2, theta1Rad, theta2Rad, isTIR);
}

function drawRefraction(n1, n2, t1, t2, isTIR) {
  const w = refCanvas.width, h = refCanvas.height;
  const cx = w / 2, cy = h / 2;
  refCtx.clearRect(0, 0, w, h);

  // Backgrounds
  refCtx.fillStyle = '#0a101f'; refCtx.fillRect(0, 0, w, cy);
  refCtx.fillStyle = '#06172e'; refCtx.fillRect(0, cy, w, h);

  // Interface
  refCtx.strokeStyle = '#38bdf8'; refCtx.lineWidth = 2;
  refCtx.beginPath(); refCtx.moveTo(0, cy); refCtx.lineTo(w, cy); refCtx.stroke();

  const L = 180;
  // Incident Ray
  refCtx.strokeStyle = '#00f2fe'; refCtx.lineWidth = 3;
  refCtx.beginPath();
  refCtx.moveTo(cx - L * Math.sin(t1), cy - L * Math.cos(t1));
  refCtx.lineTo(cx, cy);
  refCtx.stroke();

  // Reflected Ray
  refCtx.strokeStyle = isTIR ? '#f43f5e' : '#eab308';
  refCtx.lineWidth = isTIR ? 4 : 1.5;
  refCtx.beginPath();
  refCtx.moveTo(cx, cy);
  refCtx.lineTo(cx + L * Math.sin(t1), cy - L * Math.cos(t1));
  refCtx.stroke();

  // Refracted Ray
  if (!isTIR) {
    refCtx.strokeStyle = '#10b981'; refCtx.lineWidth = 3;
    refCtx.beginPath();
    refCtx.moveTo(cx, cy);
    refCtx.lineTo(cx + L * Math.sin(t2), cy + L * Math.cos(t2));
    refCtx.stroke();
  }
}

// ==========================================================
// 4. LENS BENCH ENGINE (CANVAS)
// ==========================================================
const lensCanvas = document.getElementById('lensCanvas');
const lensCtx = lensCanvas.getContext('2d');
let lensType = 'convex';

function setLensType(type) {
  lensType = type;
  document.getElementById('btnConvex').classList.toggle('active', type === 'convex');
  document.getElementById('btnConcave').classList.toggle('active', type === 'concave');
  updateLens();
}

function updateLens() {
  const fAbs = parseFloat(document.getElementById('sliderFocal').value);
  const doDist = parseFloat(document.getElementById('sliderObjDist').value);
  const ho = parseFloat(document.getElementById('sliderObjHeight').value);

  document.getElementById('valFocal').innerText = fAbs + "mm";
  document.getElementById('valObjDist').innerText = doDist + "mm";
  document.getElementById('valObjHeight').innerText = ho + "mm";

  const f = (lensType === 'convex') ? fAbs : -fAbs;
  let di = (f * doDist) / (doDist - f);
  let M = -di / doDist;
  let hi = M * ho;

  document.getElementById('outImgDist').innerText = isFinite(di) ? di.toFixed(1) + " mm" : "∞";
  document.getElementById('outMag').innerText = isFinite(M) ? M.toFixed(2) + "x" : "∞";
  document.getElementById('outImgNature').innerText = (di > 0) ? "Real" : "Virtual";

  drawLensBench(f, doDist, ho, di, hi);
}

function drawLensBench(f, doDist, ho, di, hi) {
  const w = lensCanvas.width, h = lensCanvas.height, cx = w/2, cy = h/2;
  lensCtx.clearRect(0, 0, w, h);
  lensCtx.strokeStyle = '#334155'; lensCtx.beginPath(); lensCtx.moveTo(0, cy); lensCtx.lineTo(w, cy); lensCtx.stroke();

  const s = 1.0;
  // Object
  lensCtx.strokeStyle = '#38bdf8'; lensCtx.lineWidth = 3;
  lensCtx.beginPath(); lensCtx.moveTo(cx - doDist*s, cy); lensCtx.lineTo(cx - doDist*s, cy - ho*s); lensCtx.stroke();

  // Lens
  lensCtx.strokeStyle = '#38bdf8'; lensCtx.lineWidth = 4;
  lensCtx.beginPath(); lensCtx.moveTo(cx, cy - 100); lensCtx.lineTo(cx, cy + 100); lensCtx.stroke();

  // Image
  if (isFinite(di)) {
    lensCtx.strokeStyle = (di > 0) ? '#10b981' : '#f472b6';
    lensCtx.beginPath(); lensCtx.moveTo(cx + di*s, cy); lensCtx.lineTo(cx + di*s, cy - hi*s); lensCtx.stroke();
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  updateRefraction();
  updateLens();
});
