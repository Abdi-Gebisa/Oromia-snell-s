import { physicsLabs } from "./labs/physics.js";
import { chemistryLabs } from "./labs/chemistry.js";
import { mathematicsLabs } from "./labs/mathematics.js";
import { biologyLabs } from "./labs/biology.js";

const subjects = {
  physics:{title:"Physics Laboratory",intro:"Investigate mechanics, energy, oscillations, waves, sound, electricity, circuits, magnetism and electromagnetic induction.",eyebrow:"THE SCIENCE OF MATTER AND ENERGY",labs:physicsLabs},
  chemistry:{title:"Chemistry Laboratory",intro:"Explore atomic structure, reactions, solutions, gases, redox chemistry, galvanic cells, electrolysis and electroplating.",eyebrow:"THE SCIENCE OF MATTER AND CHANGE",labs:chemistryLabs},
  mathematics:{title:"Mathematics Laboratory",intro:"Explore mathematical relationships visually, test values and interpret graphs.",eyebrow:"THE LANGUAGE OF PATTERNS",labs:mathematicsLabs},
  biology:{title:"Biology Laboratory",intro:"Investigate cells, microbes, protists, viruses, fungi, genetics, ecology and the processes that sustain life.",eyebrow:"THE SCIENCE OF LIVING SYSTEMS",labs:biologyLabs}
};
let currentSubject="physics", currentLab=null;
const $=id=>document.getElementById(id);
const canvas=$("simulationCanvas"), ctx=canvas.getContext("2d");
const home=$("homeView"), lab=$("labView"), about=$("aboutView");
$("year").textContent=new Date().getFullYear();
const themeButton=$("themeButton");
function setTheme(theme){
  document.documentElement.dataset.theme=theme;
  const dark=theme==="dark";
  themeButton.innerHTML=dark?"☀️ <span>Light mode</span>":"🌙 <span>Dark mode</span>";
  themeButton.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
  try{localStorage.setItem("oromia-stem-theme",theme);}catch(e){}
}
let savedTheme="light";
try{savedTheme=localStorage.getItem("oromia-stem-theme")||"light";}catch(e){}
setTheme(savedTheme);
themeButton.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));

function showPage(page){
  home.classList.toggle("hidden",page!=="home"); lab.classList.toggle("hidden",page!=="lab"); about.classList.toggle("hidden",page!=="about");
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.subject===page));
  $("mainNav").classList.remove("open");
}
function goSubject(subject){
  if(subject==="home"||subject==="about"){showPage(subject);return;}
  if(!subjects[subject])return;
  currentSubject=subject; showPage("lab");
  const s=subjects[subject]; $("subjectTitle").textContent=s.title;$("subjectIntro").textContent=s.intro;$("subjectEyebrow").textContent=s.eyebrow;
  $("experimentList").innerHTML="";
  s.labs.forEach((item,i)=>{const b=document.createElement("button");b.className="experiment-button"+(i===0?" active":"");b.textContent=item.title;b.addEventListener("click",()=>selectLab(i));$("experimentList").appendChild(b);});
  selectLab(0);
}
function selectLab(index){
  const s=subjects[currentSubject];currentLab=s.labs[index];
  document.querySelectorAll(".experiment-button").forEach((b,i)=>b.classList.toggle("active",i===index));
  $("experimentTitle").textContent=currentLab.title;$("experimentTag").textContent=currentLab.category.toUpperCase();
  $("objectiveText").textContent=currentLab.objective;$("theoryText").textContent=currentLab.theory;$("challengeText").textContent=currentLab.challenge;$("formulaText").textContent=currentLab.formula;
  $("stageCaption").textContent=currentLab.caption||"Change the controls and observe the model.";
  buildControls();draw();
}
function buildControls(){
  const box=$("controlsContainer");box.innerHTML="";
  currentLab.controls.forEach((c,i)=>{
    const wrap=document.createElement("div");wrap.className="control";
    const label=document.createElement("label");label.innerHTML=`<span>${c.label}</span><output id="out${i}">${c.format?c.format(c.value):c.value}</output>`;wrap.appendChild(label);
    let input;
    if(c.type==="select"){input=document.createElement("select");c.options.forEach(o=>{const op=document.createElement("option");op.value=o.value;op.textContent=o.label;input.appendChild(op);});input.value=c.value;}
    else{input=document.createElement("input");input.type=c.type||"range";if(input.type==="range"){input.min=c.min;input.max=c.max;input.step=c.step||1;}else{input.min=c.min;input.max=c.max;input.step=c.step||1;}input.value=c.value;}
    input.addEventListener("input",()=>{c.value=input.type==="range"||input.type==="number"?Number(input.value):input.value;const out=$("out"+i);out.textContent=c.format?c.format(c.value):c.value;draw();});
    wrap.appendChild(input);box.appendChild(wrap);
  });
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#f0f6f8";ctx.fillRect(0,0,canvas.width,canvas.height);
  if(currentLab&&currentLab.draw)currentLab.draw(ctx,canvas,currentLab.controls);
  if(currentLab&&currentLab.readout)$("readout").innerHTML=currentLab.readout(currentLab.controls);
}
function reset(){if(!currentLab)return;currentLab.controls.forEach(c=>c.value=c.initial);buildControls();draw();}
document.querySelectorAll("[data-subject]").forEach(b=>b.addEventListener("click",()=>goSubject(b.dataset.subject)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>goSubject(b.dataset.go)));
$("resetButton").addEventListener("click",reset);
$("menuButton").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
goSubject("physics");
