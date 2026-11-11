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
const graph=$("liveGraph"), gctx=graph.getContext("2d");
let running=false, elapsed=0, lastFrame=0, animationFrame=0, samples=[], experimentStart=0;
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
  stopRun(); elapsed=0; samples=[]; buildControls();draw();drawGraph();
  $("investigationPrompt").textContent=currentLab.challenge;
}
function buildControls(){
  const box=$("controlsContainer");box.innerHTML="";
  currentLab.controls.forEach((c,i)=>{
    const wrap=document.createElement("div");wrap.className="control";
    const label=document.createElement("label");label.innerHTML=`<span>${c.label}</span><output id="out${i}">${c.format?c.format(c.value):c.value}</output>`;wrap.appendChild(label);
    let input;
    if(c.type==="select"){input=document.createElement("select");c.options.forEach(o=>{const op=document.createElement("option");op.value=o.value;op.textContent=o.label;input.appendChild(op);});input.value=c.value;}
    else{input=document.createElement("input");input.type=c.type||"range";if(input.type==="range"){input.min=c.min;input.max=c.max;input.step=c.step||1;}else{input.min=c.min;input.max=c.max;input.step=c.step||1;}input.value=c.value;}
    input.addEventListener("input",()=>{c.value=input.type==="range"||input.type==="number"?Number(input.value):input.value;const out=$("out"+i);out.textContent=c.format?c.format(c.value):c.value;draw();drawGraph();});
    wrap.appendChild(input);box.appendChild(wrap);
  });
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#f0f6f8";ctx.fillRect(0,0,canvas.width,canvas.height);
  if(currentLab&&currentLab.draw)currentLab.draw(ctx,canvas,currentLab.controls,elapsed);
  drawDynamicOverlay();
  if(currentLab&&currentLab.readout)$("readout").innerHTML=currentLab.readout(currentLab.controls);
  const unit=currentSubject==="physics"?({"Projectile Motion":"vertical velocity (m/s)","Newton's Second Law":"cart velocity (m/s)","Conservation of Momentum":"cart velocity (m/s)","Simple Pendulum":"angular displacement (rad)","Hooke's Law and Spring Oscillations":"spring displacement (m)","Wave Properties and Superposition":"wave displacement (m)","Free Fall and Gravitational Acceleration":"fall distance (m)"}[currentLab?.title]||"live model value"):"animated model";
  $("measurementReadout").textContent=`Simulation time: ${elapsed.toFixed(2)} s  |  ${unit}: ${metricValue().toFixed(3)}  |  ${currentLab?.controls?.length||0} adjustable variables`;
}
function metricValue(){
  const title=currentLab?.title, v=currentLab?.controls?.map(x=>Number(x.value))||[];
  const t=elapsed;
  if(title==="Projectile Motion"){const [s,a,g]=v,rad=a*Math.PI/180;return s*Math.sin(rad)-g*t;}
  if(title==="Newton's Second Law"){return (v[0]/v[1])*t;}
  if(title==="Conservation of Momentum"){return t<1? v[1]:((v[0]-v[4]*v[2])*v[1]+(1+v[4])*v[2]*v[3])/(v[0]+v[2]);}
  if(title==="Circular Motion"){return v[1]*t/Math.max(v[2],.1);}
  if(title==="Free Fall and Gravitational Acceleration"){return Math.min(v[0],.5*v[1]*t*t);}
  if(title==="Friction on an Inclined Plane"){const a=v[0]*Math.PI/180;return Math.max(0,9.81*(Math.sin(a)-v[1]*Math.cos(a)))*t;}
  if(title==="Simple Pendulum"){const [L,g,a]=v,w=Math.sqrt(g/L);return a*Math.PI/180*Math.cos(w*t);}
  if(title==="Hooke's Law and Spring Oscillations"){const [k,m,F]=v,w=Math.sqrt(k/m);return (F/k)*Math.cos(w*t);}
  if(title==="Wave Properties and Superposition"){return v[2]*Math.sin(2*Math.PI*v[0]*t);}
  if(title==="Doppler Effect"){return v[0]*v[2]/Math.max(1,v[2]-v[1]);}
  if(title==="Ohm's Law and Resistor Circuits"){return v[0]/(v[1]*v[2]);}
  if(title==="Capacitor Charging and Discharging"){const tau=v[1]*v[2]*1e-6;return v[0]*(1-Math.exp(-t/Math.max(tau,.001)));}
  if(title==="Electromagnetic Induction"){return v[0]*v[1]/v[2]*Math.sin(2*Math.PI*t/Math.max(v[2],.01));}
  return v.find(Number.isFinite)||0;
}
function drawDynamicOverlay(){
  if(!currentLab)return;
  const title=currentLab.title,v=currentLab.controls.map(x=>Number(x.value)),t=elapsed;
  if(currentSubject==="chemistry"){
    // Animated molecular/ionic motion layer; underlying lab retains its own calculations.
    ctx.save();ctx.fillStyle="rgba(255,255,255,.78)";ctx.fillRect(90,105,720,245);
    const palette=["#2686a5","#e28b3b","#1b9a82","#9567b4"];
    for(let i=0;i<18;i++){const x=125+((i*73+t*(22+(i%4)*7))%650),y=145+(i%5)*42+Math.sin(t*2+i)*9;ctx.beginPath();ctx.arc(x,y,6+(i%3),0,Math.PI*2);ctx.fillStyle=palette[i%palette.length];ctx.fill();}
    ctx.fillStyle="#173b50";ctx.font="bold 14px sans-serif";ctx.fillText("Animated particle motion • schematic view",110,128);ctx.restore();return;
  }
  if(currentSubject==="biology"){
    // Animated cell/microorganism motion layer; biological structures remain schematic.
    ctx.save();ctx.fillStyle="rgba(255,255,255,.78)";ctx.fillRect(120,95,660,270);
    for(let i=0;i<7;i++){let x=180+i*82+Math.sin(t*1.2+i)*16,y=220+Math.cos(t*1.5+i)*28;ctx.beginPath();ctx.ellipse(x,y,24,13,Math.sin(t+i)*.35,0,Math.PI*2);ctx.fillStyle=i%2?"#83c8a5":"#8bc5d9";ctx.fill();ctx.strokeStyle="#347f8d";ctx.stroke();ctx.beginPath();ctx.arc(x+Math.cos(t+i)*9,y+Math.sin(t+i)*5,4,0,Math.PI*2);ctx.fillStyle="#315d86";ctx.fill();}
    ctx.fillStyle="#173b50";ctx.font="bold 14px sans-serif";ctx.fillText("Animated microorganism motion • schematic view",140,120);ctx.restore();return;
  }
  if(currentSubject!=="physics")return;
  const dot=(x,y,r=13,color="#e58d36")=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle="#8c5725";ctx.lineWidth=2;ctx.stroke();};
  const label=(s,x,y)=>{ctx.fillStyle="#173b50";ctx.font="bold 15px sans-serif";ctx.fillText(s,x,y);};
  if(title==="Newton's Second Law"){let a=v[0]/v[1],x=90+Math.min(650,.5*a*t*t*12);ctx.fillStyle="rgba(255,255,255,.88)";ctx.fillRect(65,175,770,165);ctx.strokeStyle="#7d929e";ctx.beginPath();ctx.moveTo(70,310);ctx.lineTo(830,310);ctx.stroke();ctx.fillStyle="#267e9c";ctx.fillRect(x,260,65,45);dot(x+15,308,8,"#243e51");dot(x+52,308,8,"#243e51");label(`Cart position: ${(0.5*a*t*t).toFixed(2)} m`,80,205);}
  else if(title==="Conservation of Momentum"){let [m1,u1,m2,u2,e]=v,den=m1+m2,v1=((m1-e*m2)*u1+(1+e)*m2*u2)/den,v2=((m2-e*m1)*u2+(1+e)*m1*u1)/den;const scale=30,start1=190,start2=690,relative=u1-u2;let hit=relative>0?(start2-start1)/(relative*scale):Infinity;let collided=t>=hit&&Number.isFinite(hit);let x1=collided?start1+u1*scale*hit+v1*scale*(t-hit):start1+u1*scale*t;let x2=collided?start2+u2*scale*hit+v2*scale*(t-hit):start2+u2*scale*t;ctx.fillStyle="rgba(255,255,255,.9)";ctx.fillRect(70,165,760,185);ctx.strokeStyle="#718b99";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(85,300);ctx.lineTo(815,300);ctx.stroke();dot(Math.max(105,Math.min(795,x1)),270,Math.max(14,Math.min(27,13+m1*1.3)),"#2588a1");dot(Math.max(105,Math.min(795,x2)),270,Math.max(14,Math.min(27,13+m2*1.3)),"#e79a45");label(collided?"After collision: velocities updated":relative>0?"Carts approaching each other":"No collision: carts are not closing",90,205);label(`v₁ = ${collided?v1.toFixed(2):u1.toFixed(2)} m/s`,100,335);label(`v₂ = ${collided?v2.toFixed(2):u2.toFixed(2)} m/s`,600,335);}
  else if(title==="Circular Motion"){let a=(v[1]/v[2])*t,cx=450,cy=245,r=100;ctx.fillStyle="rgba(255,255,255,.85)";ctx.fillRect(300,100,300,300);ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle="#8ca5b2";ctx.lineWidth=3;ctx.stroke();dot(cx+r*Math.cos(a),cy+r*Math.sin(a),15,"#0d9d91");label("Uniform circular path",360,125);}
  else if(title==="Free Fall and Gravitational Acceleration"){let [h,g]=v,fall=Math.min(h,.5*g*t*t),y=90+fall/h*235;ctx.fillStyle="rgba(255,255,255,.86)";ctx.fillRect(130,55,330,310);ctx.strokeStyle="#718b99";ctx.beginPath();ctx.moveTo(220,85);ctx.lineTo(220,340);ctx.stroke();dot(220,y,14);label(`Fall distance: ${fall.toFixed(2)} m`,270,115);}
  else if(title==="Friction on an Inclined Plane"){let [deg,mu]=v,ang=deg*Math.PI/180,acc=Math.max(0,9.81*(Math.sin(ang)-mu*Math.cos(ang))),d=.5*acc*t*t;ctx.fillStyle="rgba(255,255,255,.85)";ctx.fillRect(95,185,710,185);ctx.strokeStyle="#758e9b";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(170,330);ctx.lineTo(760,330-590*Math.tan(ang)*.45);ctx.stroke();let x=190+Math.min(450,d*18),y=330-(x-170)*Math.tan(ang)*.45;ctx.save();ctx.translate(x,y-10);ctx.rotate(-ang);ctx.fillStyle="#e59a48";ctx.fillRect(-18,-18,36,36);ctx.restore();label(`Sliding distance: ${d.toFixed(2)} m`,110,215);}
  else if(title==="Simple Pendulum"){let [L,g,a]=v,w=Math.sqrt(g/L),theta=a*Math.PI/180*Math.cos(w*t),px=450+Math.sin(theta)*180,py=90+Math.cos(theta)*180;ctx.fillStyle="rgba(255,255,255,.82)";ctx.fillRect(300,55,300,270);ctx.strokeStyle="#183b56";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(450,75);ctx.lineTo(px,py);ctx.stroke();dot(px,py,18);}
  else if(title==="Hooke's Law and Spring Oscillations"){let [k,m,F]=v,x=F/k*Math.cos(Math.sqrt(k/m)*t);ctx.fillStyle="rgba(255,255,255,.86)";ctx.fillRect(320,75,260,280);ctx.strokeStyle="#183b56";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(450,85);for(let i=0;i<12;i++)ctx.lineTo(450+(i%2?22:-22),105+i*12);ctx.lineTo(450,250+x*350);ctx.stroke();ctx.fillStyle="#e59a48";ctx.fillRect(420,250+x*350,60,42);}
  else if(title==="Wave Properties and Superposition"){let [f,l,A,ph]=v,phase=2*Math.PI*f*t;ctx.fillStyle="rgba(255,255,255,.82)";ctx.fillRect(60,80,780,245);for(let n=0;n<2;n++){ctx.beginPath();for(let i=0;i<=160;i++){let x=75+i/160*750,y=205-A*55*Math.sin((i/160*750/l*2*Math.PI)+phase+n*ph*Math.PI/180);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=n?"#e39a48":"#168f9b";ctx.lineWidth=3;ctx.stroke();}}
  else if(title==="Doppler Effect"){let x=180+Math.min(430,t*v[1]*3);ctx.fillStyle="rgba(255,255,255,.82)";ctx.fillRect(100,120,700,210);for(let n=0;n<5;n++){ctx.beginPath();ctx.arc(x,230,35+n*24+(t*30%24),-1.1,1.1);ctx.strokeStyle="#8bb5c0";ctx.stroke();}dot(x,230,17);dot(740,230,10,"#168f9b");label("Moving sound source → observer",120,155);}
  else if(title==="Ohm's Law and Resistor Circuits"){let current=v[0]/(v[1]*v[2]);ctx.fillStyle="rgba(255,255,255,.86)";ctx.fillRect(110,160,680,180);ctx.strokeStyle="#183b56";ctx.lineWidth=4;ctx.strokeRect(180,200,500,100);ctx.fillStyle="#e39a48";ctx.fillRect(390,220,80,60);for(let i=0;i<Math.min(16,Math.round(current*8));i++){let x=195+(t*80+i*29)%465;dot(x,250,4,"#0d9d91");}label(`Ammeter: ${current.toFixed(3)} A`,190,190);}
  else if(title==="Capacitor Charging and Discharging"){let tau=v[1]*v[2]*1e-6,charge=1-Math.exp(-t/Math.max(tau,.001));ctx.fillStyle="rgba(255,255,255,.86)";ctx.fillRect(150,130,600,220);ctx.strokeStyle="#183b56";ctx.lineWidth=5;ctx.strokeRect(400,185,80,110);ctx.fillStyle="#0d9d91";ctx.fillRect(408,285-90*charge,64,90*charge);label(`Charge: ${(charge*100).toFixed(1)}%`,320,160);}
  else if(title==="Electromagnetic Induction"){let [N,df,dt]=v,flux=Math.cos(2*Math.PI*t/Math.max(dt,.01));ctx.fillStyle="rgba(255,255,255,.86)";ctx.fillRect(200,90,500,270);for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(410+i*22,220,55,100,0,0,Math.PI*2);ctx.strokeStyle="#d58c3b";ctx.lineWidth=3;ctx.stroke();}dot(410+Math.sin(t*5)*90,220,20,"#4b78ad");label(`Magnetic flux: ${(df*flux).toFixed(4)} Wb`,260,120);}
  else if(title==="Snell's Law: Refraction"){let a=v[0]*Math.PI/180,n1=v[1],n2=v[2],r=Math.asin(Math.min(1,n1*Math.sin(a)/n2));let p=(t%2)*.5;ctx.fillStyle="rgba(255,255,255,.72)";ctx.fillRect(80,40,740,350);let x=450-190*Math.sin(a)+p*190*Math.sin(a),y=210-190*Math.cos(a)+p*190*Math.cos(a);dot(x,y,7,"#e58d36");}
  else if(title==="Work, Energy and Power"){let x=130+Math.min(600,t*35);ctx.fillStyle="rgba(255,255,255,.8)";ctx.fillRect(90,180,720,160);ctx.fillStyle="#3e91a5";ctx.fillRect(x,255,65,55);label(`Object moving: ${(t*1).toFixed(1)} s`,110,210);}
  else if(title==="Wave Properties and Superposition"){}
}
function drawGraph(){
  const w=graph.width,h=graph.height;gctx.clearRect(0,0,w,h);
  gctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--panel").trim()||"#fff";gctx.fillRect(0,0,w,h);
  gctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue("--border").trim()||"#d8e2e8";gctx.lineWidth=1;
  for(let i=0;i<5;i++){let y=25+i*(h-55)/4;gctx.beginPath();gctx.moveTo(65,y);gctx.lineTo(w-25,y);gctx.stroke();}
  gctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--muted").trim()||"#607080";
  gctx.font="16px sans-serif";gctx.fillText("Measured value",8,18);gctx.fillText("Time (s)",w-90,h-8);
  if(samples.length<1){gctx.fillText("Run the experiment to collect data",w/2-120,h/2);return;}
  const vals=samples.map(s=>s.value),max=Math.max(1,...vals),min=Math.min(0,...vals),span=max-min||1;
  gctx.strokeStyle="#0d9d91";gctx.lineWidth=4;gctx.beginPath();
  samples.forEach((s,i)=>{let x=65+(s.time/Math.max(10,elapsed||10))*(w-100),y=h-35-((s.value-min)/span)*(h-75);if(i===0)gctx.moveTo(x,y);else gctx.lineTo(x,y);});gctx.stroke();
  const last=samples[samples.length-1];gctx.fillStyle="#e58d36";gctx.beginPath();gctx.arc(65+(last.time/Math.max(10,elapsed||10))*(w-100),h-35-((last.value-min)/span)*(h-75),7,0,Math.PI*2);gctx.fill();
}
function stopRun(){running=false;if(animationFrame)cancelAnimationFrame(animationFrame);animationFrame=0;$("runStatus").textContent="PAUSED";}
function frame(ts){
  if(!running)return;
  if(!lastFrame)lastFrame=ts;
  const dt=Math.min(.1,(ts-lastFrame)/1000);lastFrame=ts;elapsed+=dt;
  if(Math.floor(elapsed*5)!==Math.floor((elapsed-dt)*5)){samples.push({time:elapsed,value:metricValue()});if(samples.length>180)samples.shift();}
  if(currentLab?.title==="Projectile Motion"){
    const speed=currentLab.controls[0].value,angle=currentLab.controls[1].value*Math.PI/180,g=currentLab.controls[2].value;
    const flight=2*speed*Math.sin(angle)/g;
    if(elapsed>=flight){elapsed=flight;running=false;$("runStatus").textContent="LANDED";}
  }
  if(elapsed>60){running=false;$("runStatus").textContent="60 s LIMIT";}
  draw();drawGraph();
  if(running)animationFrame=requestAnimationFrame(frame);
}
function startRun(){if(running)return;if(currentLab?.title==="Projectile Motion"){const a=currentLab.controls[1].value*Math.PI/180,flight=2*currentLab.controls[0].value*Math.sin(a)/currentLab.controls[2].value;if(elapsed>=flight){elapsed=0;samples=[];}}running=true;lastFrame=0;$("runStatus").textContent="RUNNING";animationFrame=requestAnimationFrame(frame);}
function stepRun(){stopRun();elapsed+=.2;samples.push({time:elapsed,value:metricValue()});if(samples.length>180)samples.shift();draw();drawGraph();$("runStatus").textContent="STEPPED";}

function reset(){if(!currentLab)return;stopRun();elapsed=0;samples=[];currentLab.controls.forEach(c=>c.value=c.initial);buildControls();draw();drawGraph();$("runStatus").textContent="RESET";}
document.querySelectorAll("[data-subject]").forEach(b=>b.addEventListener("click",()=>goSubject(b.dataset.subject)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>goSubject(b.dataset.go)));
$("resetButton").addEventListener("click",reset);
$("startButton").addEventListener("click",startRun);
$("pauseButton").addEventListener("click",stopRun);
$("stepButton").addEventListener("click",stepRun);
$("menuButton").addEventListener("click",()=>$("mainNav").classList.toggle("open"));
showPage("home");
