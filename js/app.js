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
  themeButton.setAttribute("aria-pressed",String(dark));
  try{localStorage.setItem("oromia-stem-theme-v2",theme);}catch(e){}
}
let savedTheme="dark";
try{savedTheme=localStorage.getItem("oromia-stem-theme-v2")||"dark";}catch(e){}
setTheme(savedTheme);

function showPage(page){
  home.classList.toggle("hidden",page!=="home"); lab.classList.toggle("hidden",page!=="lab"); about.classList.toggle("hidden",page!=="about");
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.subject===page));
  $("mainNav").classList.remove("open");
  $("menuButton").setAttribute("aria-expanded","false");
}
function goSubject(subject){
  try {
    if(subject==="home"||subject==="about"){showPage(subject);window.scrollTo({top:0,behavior:"smooth"});return;}
    const s=subjects[subject];
    if(!s || !Array.isArray(s.labs) || s.labs.length===0) throw new Error(`The ${subject} laboratory is not available.`);
    currentSubject=subject; showPage("lab");
    $("subjectTitle").textContent=s.title;$("subjectIntro").textContent=s.intro;$("subjectEyebrow").textContent=s.eyebrow;
    const list=$("experimentList"); list.replaceChildren();
    s.labs.forEach((item,i)=>{
      const b=document.createElement("button"); b.type="button";
      b.className="experiment-button"+(i===0?" active":"");
      b.dataset.experimentIndex=String(i); b.textContent=item.title || `Experiment ${i+1}`;
      list.appendChild(b);
    });
    selectLab(0);
    window.scrollTo({top:0,behavior:"smooth"});
  } catch(error) {
    console.error("Subject navigation failed:",error);
    const fallback=$("simulationFallback");
    if(fallback){fallback.classList.remove("hidden");fallback.textContent=`Could not open this laboratory: ${error.message}. Please refresh the page.`;}
    showPage("lab");
  }
}
function selectLab(index){
  const s=subjects[currentSubject];currentLab=s.labs[index];
  document.querySelectorAll(".experiment-button").forEach((b,i)=>b.classList.toggle("active",i===index));
  $("experimentTitle").textContent=currentLab.title;$("experimentTag").textContent=(currentLab.category||"SCIENCE").toUpperCase();
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
    input.setAttribute("aria-label",c.label);
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
  if(title==="Conservation of Momentum"){
    const [m1,u1,m2,u2,e]=v,hitTime=u1>u2?(620-220-78)/(20*(u1-u2)):Infinity;
    if(t<hitTime)return u1;
    return ((m1-e*m2)*u1+(1+e)*m2*u2)/(m1+m2);
  }
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
  if(title==="Newton's Second Law"){
    const [force,mass]=v,acc=force/mass,velocity=acc*t,position=.5*acc*t*t;
    const left=95,right=785,trackY=315,cartW=72,cartX=Math.min(right-cartW, left+Math.min(position,25)/25*(right-left-cartW));
    const arrow=(x1,y1,x2,y2,color,width=4)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-y1,x2-x1),h=10;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-h*Math.cos(a-.48),y2-h*Math.sin(a-.48));ctx.moveTo(x2,y2);ctx.lineTo(x2-h*Math.cos(a+.48),y2-h*Math.sin(a+.48));ctx.stroke();};
    ctx.fillStyle="#f8fbfc";ctx.fillRect(65,95,770,300);
    label("HORIZONTAL CART • FRICTION NEGLECTED",88,125);
    // Track and distance scale
    ctx.strokeStyle="#718b99";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(90,trackY+18);ctx.lineTo(810,trackY+18);ctx.stroke();
    ctx.strokeStyle="#c2d0d7";ctx.lineWidth=1;for(let i=0;i<=10;i++){let x=95+i*69;ctx.beginPath();ctx.moveTo(x,trackY+18);ctx.lineTo(x,trackY+27);ctx.stroke();}
    // Cart body and rolling wheels
    ctx.fillStyle="#2b829e";ctx.fillRect(cartX,trackY-35,cartW,42);ctx.fillStyle="#d8edf2";ctx.fillRect(cartX+10,trackY-28,cartW-20,12);
    const wheelAngle=position/.12;for(const wx of [cartX+17,cartX+cartW-17]){ctx.beginPath();ctx.arc(wx,trackY+10,10,0,Math.PI*2);ctx.fillStyle="#263f50";ctx.fill();ctx.strokeStyle="#f2f7f8";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(wx-7*Math.cos(wheelAngle),trackY+10-7*Math.sin(wheelAngle));ctx.lineTo(wx+7*Math.cos(wheelAngle),trackY+10+7*Math.sin(wheelAngle));ctx.stroke();}
    // Applied force and acceleration vectors; velocity grows with elapsed time.
    if(force>0){arrow(cartX+cartW,trackY-20,cartX+cartW+Math.min(135,25+force*1.05),trackY-20,"#e58b32",5);label(`F = ${force.toFixed(1)} N`,cartX+cartW+8,trackY-43);}
    if(velocity>0.01){arrow(cartX+cartW/2,trackY-62,cartX+cartW/2+Math.min(125,velocity*8),trackY-62,"#1685a2",4);label(`v = ${velocity.toFixed(2)} m/s`,cartX+cartW/2,trackY-78);}
    arrow(cartX+cartW/2,trackY-105,cartX+cartW/2+Math.min(95,acc*4),trackY-105,"#168f78",4);label(`a = ${acc.toFixed(2)} m/s²`,cartX+cartW/2,trackY-119);
    // Live experiment measurements
    ctx.fillStyle="#eaf3f5";ctx.fillRect(88,150,720,65);
    ctx.fillStyle="#173b50";ctx.font="bold 14px sans-serif";
    ctx.fillText(`Mass: ${mass.toFixed(1)} kg`,105,176);ctx.fillText(`Net force: ${force.toFixed(1)} N`,270,176);ctx.fillText(`Acceleration: ${acc.toFixed(2)} m/s²`,470,176);
    ctx.font="13px sans-serif";ctx.fillText(`Time: ${t.toFixed(2)} s`,105,198);ctx.fillText(`Velocity: ${velocity.toFixed(2)} m/s`,270,198);ctx.fillText(`Displacement: ${position.toFixed(2)} m`,470,198);
    if(position>=25)label("Display limit reached — calculated values continue updating",190,375);
  }

  else if(title==="Circular Motion"){
    const [mass,speed,radius]=v;
    const omega=speed/radius, angle=omega*t;
    const cx=440,cy=245,orbit=112;
    const px=cx+orbit*Math.cos(angle),py=cy+orbit*Math.sin(angle);
    const ac=speed*speed/radius,fc=mass*ac,period=2*Math.PI/omega;
    const arrow=(x1,y1,x2,y2,color,width=4)=>{
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
      const a=Math.atan2(y2-y1,x2-x1),h=11;
      ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-h*Math.cos(a-.48),y2-h*Math.sin(a-.48));ctx.moveTo(x2,y2);ctx.lineTo(x2-h*Math.cos(a+.48),y2-h*Math.sin(a+.48));ctx.stroke();
    };
    ctx.fillStyle="#f8fbfc";ctx.fillRect(65,75,770,325);
    label("UNIFORM CIRCULAR MOTION",90,105);
    // Orbit, centre and radius vector
    ctx.beginPath();ctx.arc(cx,cy,orbit,0,Math.PI*2);ctx.strokeStyle="#a8bdc6";ctx.lineWidth=3;ctx.setLineDash([7,6]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fillStyle="#173b50";ctx.fill();
    ctx.fillStyle="#536d7a";ctx.font="13px sans-serif";ctx.fillText("centre",cx-23,cy+24);
    arrow(cx,cy,px,py,"#8d9eaa",2);
    ctx.fillText(`r = ${radius.toFixed(1)} m`,(cx+px)/2+8,(cy+py)/2-8);
    // Moving body and direction vectors
    dot(px,py,16,"#0d9d91");
    const tx=-Math.sin(angle),ty=Math.cos(angle);
    arrow(px,py,px+tx*65,py+ty*65,"#1685a2",4);
    arrow(px,py,px+(cx-px)*.58,py+(cy-py)*.58,"#df8732",4);
    ctx.fillStyle="#126f89";ctx.font="bold 13px sans-serif";ctx.fillText("v (tangent)",px+tx*68+5,py+ty*68);
    ctx.fillStyle="#b56a20";ctx.fillText("aᶜ (inward)",px+(cx-px)*.6+5,py+(cy-py)*.6-8);
    // Live measurements panel
    ctx.fillStyle="#eaf3f5";ctx.fillRect(610,125,195,220);
    ctx.fillStyle="#173b50";ctx.font="bold 13px sans-serif";
    ctx.fillText(`Mass: ${mass.toFixed(1)} kg`,625,153);
    ctx.fillText(`Speed: ${speed.toFixed(1)} m/s`,625,179);
    ctx.fillText(`Radius: ${radius.toFixed(1)} m`,625,205);
    ctx.fillText(`aᶜ: ${ac.toFixed(2)} m/s²`,625,239);
    ctx.fillText(`Fᶜ: ${fc.toFixed(2)} N`,625,265);
    ctx.fillText(`ω: ${omega.toFixed(2)} rad/s`,625,291);
    ctx.fillText(`Period: ${period.toFixed(2)} s`,625,317);
    ctx.font="12px sans-serif";ctx.fillStyle="#536d7a";
    ctx.fillText(`Angle: ${(angle*180/Math.PI%360).toFixed(1)}°`,90,375);
    ctx.fillText("Blue: velocity • Orange: centripetal acceleration",270,375);
  }
  else if(title==="Free Fall and Gravitational Acceleration"){let [h,g]=v,flight=Math.sqrt(2*h/g),tt=Math.min(t,flight),distance=.5*g*tt*tt,speed=g*tt,top=105,ground=350,travel=ground-top,y=top+Math.min(1,distance/h)*travel;ctx.fillStyle="#f8fbfc";ctx.fillRect(85,65,730,325);ctx.strokeStyle="#879eaa";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(145,ground);ctx.lineTo(760,ground);ctx.stroke();ctx.strokeStyle="#c4d2d8";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(260,top);ctx.lineTo(260,ground);ctx.stroke();for(let i=0;i<=5;i++){let yy=top+i*travel/5;ctx.beginPath();ctx.moveTo(250,yy);ctx.lineTo(270,yy);ctx.stroke();ctx.fillStyle="#526b79";ctx.font="12px sans-serif";ctx.fillText(`${(h*i/5).toFixed(0)} m`,205,yy+4);}dot(260,y,15,"#e58d36");ctx.strokeStyle="#1685a2";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(300,y-5);ctx.lineTo(300,y+Math.min(100,20+speed*3));ctx.lineTo(292,y+Math.min(100,20+speed*3)-12);ctx.moveTo(300,y+Math.min(100,20+speed*3));ctx.lineTo(308,y+Math.min(100,20+speed*3)-12);ctx.stroke();label(`t = ${tt.toFixed(2)} s`,355,130);label(`v = ${speed.toFixed(2)} m/s downward`,355,165);label(`s = ${distance.toFixed(2)} m`,355,200);label(`g = ${g.toFixed(2)} m/s²`,355,235);label(tt>=flight?"IMPACT":"FALLING",355,275);}
  else if(title==="Friction on an Inclined Plane"){let [deg,mu,m]=v,ang=deg*Math.PI/180,g=9.81,drive=g*Math.sin(ang),normal=g*Math.cos(ang),acc=Math.max(0,drive-mu*normal),distance=.5*acc*t*t,speed=acc*t,ax=170,ay=340,bx=760,by=340-590*Math.tan(ang)*.45,len=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/len,uy=(by-ay)/len,travel=Math.min(420,distance*16),x=ax+ux*(45+travel),y=ay+uy*(45+travel);ctx.fillStyle="#f8fbfc";ctx.fillRect(75,70,750,325);ctx.strokeStyle="#8aa1ad";ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();ctx.fillStyle="#e7eff2";ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(bx,ay);ctx.closePath();ctx.fill();ctx.save();ctx.translate(x,y-12);ctx.rotate(-ang);ctx.fillStyle="#e59a48";ctx.fillRect(-23,-22,46,44);ctx.restore();const vec=(x1,y1,x2,y2,col)=>{ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};vec(x,y,x+ux*70,y+uy*70,"#d9812e");vec(x,y,x-ux*55,y-uy*55,"#1685a2");label(`a = ${acc.toFixed(2)} m/s²`,110,115);label(`v = ${speed.toFixed(2)} m/s`,110,145);label(`distance = ${distance.toFixed(2)} m`,110,175);label(acc>0?"BLOCK SLIDING":"STATIC FRICTION HOLDS THE BLOCK",420,115);}
  else if(title==="Simple Pendulum"){let [L,g,a]=v,omega=Math.sqrt(g/L),theta0=a*Math.PI/180,theta=theta0*Math.cos(omega*t),px=450+Math.sin(theta)*Math.min(185,L*110),py=95+Math.cos(theta)*Math.min(185,L*110),T=2*Math.PI/omega;ctx.fillStyle="#f8fbfc";ctx.fillRect(240,55,420,340);ctx.strokeStyle="#a9bdc6";ctx.lineWidth=2;ctx.beginPath();ctx.arc(450,95,Math.min(185,L*110),Math.PI/2-theta0,Math.PI/2+theta0);ctx.stroke();ctx.fillStyle="#173b50";ctx.fillRect(425,75,50,12);ctx.strokeStyle="#173b50";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(450,88);ctx.lineTo(px,py);ctx.stroke();dot(px,py,18,"#e59a48");label(`θ = ${(theta*180/Math.PI).toFixed(1)}°`,80,115);label(`Period = ${T.toFixed(2)} s`,80,150);label(`Angular speed = ${(-theta0*omega*Math.sin(omega*t)).toFixed(2)} rad/s`,80,185);label(`Length = ${L.toFixed(2)} m`,80,220);}
  else if(title==="Hooke's Law and Spring Oscillations"){let [k,m,F]=v,omega=Math.sqrt(k/m),xeq=F/k,amp=Math.min(.12,xeq*.65+.025),x=xeq+amp*Math.cos(omega*t),wall=450,scale=360,blockY=285,blockX=wall+x*scale;ctx.fillStyle="#f8fbfc";ctx.fillRect(160,55,600,340);ctx.fillStyle="#718b99";ctx.fillRect(wall-8,85,16,240);ctx.strokeStyle="#0d9d91";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(wall,blockY);for(let i=1;i<=18;i++){let xx=wall+(blockX-wall)*i/19,yy=blockY+(i%2? -15:15);ctx.lineTo(xx,yy);}ctx.lineTo(blockX,blockY);ctx.stroke();ctx.fillStyle="#e59a48";ctx.fillRect(blockX-28,blockY-25,56,50);ctx.strokeStyle="#173b50";ctx.lineWidth=2;ctx.strokeRect(blockX-28,blockY-25,56,50);label(`Extension at load: ${(xeq*100).toFixed(1)} cm`,80,115);label(`Instantaneous displacement: ${(x*100).toFixed(1)} cm`,80,150);label(`Restoring force: ${(k*(x-xeq)).toFixed(2)} N`,80,185);label(`Period: ${(2*Math.PI/omega).toFixed(2)} s`,80,220);}
  else if(title==="Wave Properties and Superposition"){let [f,l,A,ph]=v,phase=2*Math.PI*f*t,phase2=phase+ph*Math.PI/180;ctx.fillStyle="#f8fbfc";ctx.fillRect(55,65,790,315);ctx.strokeStyle="#b9c9d0";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(75,215);ctx.lineTo(825,215);ctx.stroke();for(let n=0;n<3;n++){ctx.beginPath();for(let i=0;i<=240;i++){let x=75+i/240*750,xx=i/240*6*l,y=215-A*48*Math.sin(2*Math.PI*xx/l+ (n===1?phase2:phase));if(n===2)y=215-A*48*(Math.sin(2*Math.PI*xx/l+phase)+Math.sin(2*Math.PI*xx/l+phase2));if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle=n===0?"#168f9b":n===1?"#e39a48":"#7654a6";ctx.lineWidth=n===2?4:2;ctx.stroke();}label(`Wave speed = ${(f*l).toFixed(2)} m/s`,90,105);label(`Period = ${(1/f).toFixed(2)} s`,90,135);label("Green-blue: wave 1  •  Orange: wave 2  •  Purple: resultant",90,355);}
  else if(title==="Doppler Effect"){let [f,vs,c]=v,sourceX=175+Math.min(390,vs*t*1.1),observerX=755,emissionAge=Math.max(0,t),fo=f*c/(c-vs);ctx.fillStyle="#f8fbfc";ctx.fillRect(75,75,750,310);ctx.strokeStyle="#a9bdc6";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(110,255);ctx.lineTo(790,255);ctx.stroke();for(let i=0;i<7;i++){let age=(i+1)*.16,rad=Math.max(8,(emissionAge-age)*c*.24);let ex=sourceX-vs*age*1.1;if(ex>100&&ex<790){ctx.beginPath();ctx.arc(ex,230,Math.min(rad,260),-Math.PI/2,Math.PI/2);ctx.strokeStyle="#9ab8c2";ctx.lineWidth=2;ctx.stroke();}}dot(sourceX,230,17,"#e59a48");dot(observerX,230,13,"#168f9b");label("MOVING SOURCE",sourceX-55,195);label("OBSERVER",observerX-45,195);label(`Observed frequency (approaching): ${fo.toFixed(1)} Hz`,105,115);label(`Source speed: ${vs.toFixed(1)} m/s`,105,145);label(`Wavefronts bunch up in front of the source`,105,350);}
  else if(title==="Ohm's Law and Resistor Circuits"){let [V,R,n]=v,Rt=R*n,I=V/Rt,P=V*I;ctx.fillStyle="#f8fbfc";ctx.fillRect(75,75,750,315);ctx.strokeStyle="#173b50";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(160,180);ctx.lineTo(740,180);ctx.lineTo(740,315);ctx.lineTo(160,315);ctx.lineTo(160,180);ctx.stroke();ctx.fillStyle="#e7eff2";ctx.fillRect(125,220,70,55);ctx.fillStyle="#173b50";ctx.font="bold 14px sans-serif";ctx.fillText(`${V} V`,143,252);for(let i=0;i<n;i++){let x=270+i*390/n;ctx.strokeStyle="#e39a48";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-23,180);ctx.lineTo(x-13,165);ctx.lineTo(x-3,195);ctx.lineTo(x+7,165);ctx.lineTo(x+17,195);ctx.lineTo(x+27,180);ctx.stroke();}for(let i=0;i<10;i++){let q=(t*90+i*58)%520,x=205+q,y=180;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle="#0d9d91";ctx.fill();}label(`Ammeter: ${I.toFixed(3)} A`,240,125);label(`Total resistance: ${Rt.toFixed(1)} Ω`,500,125);label(`Power: ${P.toFixed(2)} W`,500,350);label("Conventional current →",230,220);}
  else if(title==="Capacitor Charging and Discharging"){let [Vs,R,C]=v,tau=R*C*1e-6,charge=1-Math.exp(-t/Math.max(tau,.001)),Vc=Vs*charge;ctx.fillStyle="#f8fbfc";ctx.fillRect(80,65,740,325);ctx.strokeStyle="#173b50";ctx.lineWidth=4;ctx.strokeRect(390,155,100,145);ctx.fillStyle="#dce8ec";ctx.fillRect(401,166,78,123);ctx.fillStyle="#0d9d91";ctx.fillRect(401,289-123*charge,78,123*charge);ctx.strokeStyle="#173b50";ctx.beginPath();ctx.moveTo(390,180);ctx.lineTo(250,180);ctx.lineTo(250,320);ctx.lineTo(390,320);ctx.moveTo(490,180);ctx.lineTo(635,180);ctx.lineTo(635,320);ctx.lineTo(490,320);ctx.stroke();label(`Capacitor voltage: ${Vc.toFixed(2)} V`,105,115);label(`Charge level: ${(charge*100).toFixed(1)}%`,105,150);label(`Time constant τ = ${tau.toFixed(3)} s`,540,115);label(`Current: ${(Vs/R*Math.exp(-t/Math.max(tau,.001))*1000).toFixed(2)} mA`,540,150);label(t<tau?"CHARGING • FAST TRANSIENT":"CHARGING • APPROACHING FULL",250,365);}
  else if(title==="Electromagnetic Induction"){let [N,df,dt]=v,period=Math.max(dt,.08),phase=2*Math.PI*t/period,flux=df*Math.cos(phase),emf=N*df*(2*Math.PI/period)*Math.sin(phase),magX=360+Math.sin(phase)*110;ctx.fillStyle="#f8fbfc";ctx.fillRect(90,65,720,325);for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(455+i*17,230,50,95,0,0,Math.PI*2);ctx.strokeStyle="#c98a45";ctx.lineWidth=3;ctx.stroke();}ctx.fillStyle="#d95e58";ctx.fillRect(magX-35,205,35,50);ctx.fillStyle="#4778b5";ctx.fillRect(magX,205,35,50);ctx.fillStyle="#fff";ctx.font="bold 13px sans-serif";ctx.fillText("N",magX-24,236);ctx.fillText("S",magX+12,236);label(`Magnetic flux: ${flux.toFixed(4)} Wb`,105,115);label(`Induced emf: ${emf.toFixed(2)} V`,105,150);label(`Turns: ${N}`,105,185);label("Magnet moves through coil → changing flux",105,350);}
  else if(title==="Snell's Law: Refraction"){
    const angle=v[0]*Math.PI/180,n1=v[1],n2=v[2],sinR=n1*Math.sin(angle)/n2,tir=sinR>1+1e-10;
    const r=tir?null:Math.asin(Math.min(1,sinR)),cx=450,cy=210,L=180;
    const start={x:cx-L*Math.sin(angle),y:cy-L*Math.cos(angle)};
    const end=tir?{x:cx+L*Math.sin(angle),y:cy-L*Math.cos(angle)}:{x:cx+L*Math.sin(r),y:cy+L*Math.cos(r)};
    // A repeating light pulse travels to the boundary, then follows the physical outgoing ray.
    const phase=(t%2.8)/2.8,hitAt=.48;let x,y;
    if(phase<hitAt){const q=phase/hitAt;x=start.x+(cx-start.x)*q;y=start.y+(cy-start.y)*q;}
    else{const q=(phase-hitAt)/(1-hitAt);x=cx+(end.x-cx)*q;y=cy+(end.y-cy)*q;}
    ctx.save();ctx.shadowColor="#f4a52f";ctx.shadowBlur=16;ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fillStyle="#ffb33f";ctx.fill();ctx.restore();
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle="#fff7d6";ctx.fill();
    ctx.fillStyle="#173b50";ctx.font="bold 13px sans-serif";ctx.fillText(tir?"Light reflects back into medium 1":"Light crosses the boundary",540,105);
  }
  else if(title==="Work, Energy and Power"){let [F,d,totalTime,u,m]=v,acc=F/m,travel=Math.min(d,.5*acc*t*t+u*t),speed=Math.sqrt(Math.max(0,u*u+2*acc*travel)),work=F*travel,power=F*speed;ctx.fillStyle="#f8fbfc";ctx.fillRect(75,75,750,315);ctx.strokeStyle="#8aa1ad";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(110,325);ctx.lineTo(790,325);ctx.stroke();let x=125+Math.min(600,travel/Math.max(d,1)*600);ctx.fillStyle="#348aa4";ctx.fillRect(x-35,265,70,60);for(let wx of [x-20,x+20]){ctx.beginPath();ctx.arc(wx,329,9,0,Math.PI*2);ctx.fillStyle="#243f50";ctx.fill();}ctx.strokeStyle="#e58d36";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+35,285);ctx.lineTo(x+Math.min(140,55+F),285);ctx.stroke();label(`Work done: ${work.toFixed(1)} J`,115,125);label(`Kinetic energy: ${(0.5*m*speed*speed).toFixed(1)} J`,115,160);label(`Speed: ${speed.toFixed(2)} m/s`,115,195);label(`Instantaneous power: ${power.toFixed(1)} W`,115,230);label(`Displacement: ${travel.toFixed(2)} / ${d.toFixed(1)} m`,490,125);if(travel>=d)label("TARGET DISPLACEMENT REACHED",490,160);}
}
function drawGraph(){
  const w=graph.width,h=graph.height;gctx.clearRect(0,0,w,h);
  gctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--panel").trim()||"#fff";gctx.fillRect(0,0,w,h);
  gctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue("--border").trim()||"#d8e2e8";gctx.lineWidth=1;
  for(let i=0;i<5;i++){let y=25+i*(h-55)/4;gctx.beginPath();gctx.moveTo(65,y);gctx.lineTo(w-25,y);gctx.stroke();}
  gctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--muted").trim()||"#607080";
  gctx.font="16px sans-serif";gctx.fillText("Measured value",8,18);gctx.fillText("Time (s)",w-90,h-8);
  if(samples.length<1){gctx.fillText("Run the experiment to collect data",w/2-120,h/2);return;}
  const vals=samples.map(s=>s.value),rawMax=Math.max(0,...vals),rawMin=Math.min(0,...vals),margin=(rawMax-rawMin)*.08||1,max=rawMax+margin,min=rawMin-margin,span=max-min;
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
  if(currentLab?.title==="Free Fall and Gravitational Acceleration"){
    const height=currentLab.controls[0].value,gravity=currentLab.controls[1].value,fallTime=Math.sqrt(2*height/gravity);
    if(elapsed>=fallTime){elapsed=fallTime;running=false;$("runStatus").textContent="IMPACT";}
  }
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
// One capture-phase event router handles all navigation cards and nav buttons.
// This avoids missed taps caused by nested spans or mobile browser event bubbling.
function routeNavigation(event) {
  const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
  const target = origin?.closest("[data-subject], [data-go]");
  if (!target) return;
  const subject = target.dataset.subject || target.dataset.go;
  if (!subject) return;
  event.preventDefault();
  event.stopPropagation();
  goSubject(subject);
}
// A single delegated click handler supports touch taps, mouse clicks, and
// clicks on nested icon/text spans without requiring per-card listeners.
document.addEventListener("click", routeNavigation, true);
$("experimentList").addEventListener("click",event=>{
  const button=event.target.closest("[data-experiment-index]");
  if(button && $("experimentList").contains(button)) selectLab(Number(button.dataset.experimentIndex));
});
$("menuButton").addEventListener("click",()=>{const open=$("mainNav").classList.toggle("open");$("menuButton").setAttribute("aria-expanded",String(open));});
themeButton.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
$("resetButton").addEventListener("click",reset);
$("startButton").addEventListener("click",startRun);
$("pauseButton").addEventListener("click",stopRun);
$("stepButton").addEventListener("click",stepRun);
// Make startup failures visible instead of leaving an apparently dead interface.
window.addEventListener("error",(event)=>{
  const fallback=$("simulationFallback");
  if(fallback){fallback.classList.remove("hidden");fallback.textContent="A script error stopped part of the laboratory. Reload the page or update the app files.";}
  console.error("OromiaSTEM interface error:",event.message);
});
showPage("home");
