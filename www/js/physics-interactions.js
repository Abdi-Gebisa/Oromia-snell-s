const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const setValue=(controls,index,value)=>{
  const c=controls[index];
  if(!c)return;
  const step=Number(c.step)||1;
  const snapped=c.min+Math.round((clamp(value,Number(c.min),Number(c.max))-Number(c.min))/step)*step;
  c.value=Number(snapped.toFixed(6));
};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const pointToSegment=(p,a,b)=>{
  const dx=b.x-a.x,dy=b.y-a.y;
  const len=dx*dx+dy*dy||1;
  const t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/len,0,1);
  return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy));
};

export const physicsDragHints={
  "Newton's Second Law":"Drag the orange force arrow to change the applied force.",
  "Projectile Motion":"Drag from the launcher to set the launch direction and speed.",
  "Conservation of Momentum":"Drag either cart horizontally to set its initial velocity.",
  "Snell's Law: Refraction":"Drag the incident ray above the boundary to change its angle.",
  "Circular Motion":"Drag the moving object inward or outward to change the orbit radius.",
  "Free Fall and Gravitational Acceleration":"Drag the ball up or down the scale to change its drop height.",
  "Friction on an Inclined Plane":"Drag the upper end of the ramp to change its angle.",
  "Work, Energy and Power":"Drag the cart along the track to change the displacement.",
  "Simple Pendulum":"Drag the bob to change its starting angle and pendulum length.",
  "Hooke's Law and Spring Oscillations":"Drag the mass horizontally to change the applied load.",
  "Wave Properties and Superposition":"Drag a wave point vertically to change amplitude and horizontally to change phase.",
  "Doppler Effect":"Drag the sound source horizontally to change its speed toward the observer.",
  "Ohm's Law and Resistor Circuits":"Drag a resistor horizontally to change its resistance.",
  "Capacitor Charging and Discharging":"Drag the capacitor vertically to scrub the elapsed charging time.",
  "Electromagnetic Induction":"Drag the magnet vertically to change the magnetic-flux change."
};

export function beginPhysicsDrag(title,p,controls,elapsed=0){
  const v=controls.map(c=>Number(c.value));
  if(title==="Newton's Second Law"){
    const cartX=95+Math.min(.5*(v[0]/v[1])*elapsed*elapsed,25)/25*(785-72-95);
    if(p.y>270&&p.y<320&&p.x>cartX+55&&p.x<cartX+245)
      return {kind:"force",anchor:cartX+72,startX:p.x,base:v[0]};
  }
  if(title==="Projectile Motion"){
    const origin={x:78,y:350};
    if(distance(p,origin)<85&&p.y>270)return {kind:"launch",origin,start:p,baseSpeed:v[0],baseAngle:v[1]};
  }
  if(title==="Conservation of Momentum"){
    const centers=[220+20*v[1]*elapsed,620+20*v[3]*elapsed];
    for(let i=0;i<2;i++)if(Math.abs(p.x-centers[i])<52&&p.y>225&&p.y<305)
      return {kind:"cartVelocity",index:i===0?1:3,startX:p.x,base:v[i===0?1:3]};
  }
  if(title==="Snell's Law: Refraction"){
    const a=v[0]*Math.PI/180,rayStart={x:450-180*Math.sin(a),y:210-180*Math.cos(a)},center={x:450,y:210};
    if(p.y<212&&pointToSegment(p,rayStart,center)<28)return {kind:"incidentAngle",startX:p.x,base:v[0]};
  }
  if(title==="Circular Motion"){
    const omega=v[1]/v[2],angle=omega*elapsed,orbit=65+v[2]*4;
    const bob={x:450+orbit*Math.cos(angle),y:245+orbit*Math.sin(angle)};
    if(distance(p,bob)<45|| (Math.hypot(p.x-450,p.y-245)>65&&Math.hypot(p.x-450,p.y-245)<155))
      return {kind:"orbitRadius"};
  }
  if(title==="Free Fall and Gravitational Acceleration"){
    const fallTime=Math.sqrt(2*v[0]/v[1]),t=Math.min(elapsed,fallTime);
    const y=105+Math.min(1,.5*v[1]*t*t/v[0])*245;
    if(Math.abs(p.x-260)<55&&Math.abs(p.y-y)<55 || (Math.abs(p.x-260)<28&&p.y>90&&p.y<360))
      return {kind:"dropHeight",startY:p.y,base:v[0]};
  }
  if(title==="Friction on an Inclined Plane"){
    const endpoint={x:760,y:340-590*Math.tan(v[0]*Math.PI/180)*.45};
    if(distance(p,endpoint)<50 || (p.x>710&&p.y>55&&p.y<345))return {kind:"rampAngle"};
  }
  if(title==="Work, Energy and Power"){
    const acc=v[0]/v[4],travel=Math.min(v[1],.5*acc*elapsed*elapsed+v[3]*elapsed);
    const cartX=125+Math.min(600,travel/Math.max(v[1],1)*600);
    if(p.y>245&&p.y<340&&Math.abs(p.x-cartX)<85)return {kind:"displacement",startX:p.x,base:v[1]};
  }
  if(title==="Simple Pendulum"){
    const L=Math.min(185,v[0]*110),theta=v[2]*Math.PI/180*Math.cos(Math.sqrt(v[1]/v[0])*elapsed);
    const bob={x:450+Math.sin(theta)*L,y:95+Math.cos(theta)*L};
    if(distance(p,bob)<55)return {kind:"pendulum"};
  }
  if(title==="Hooke's Law and Spring Oscillations"){
    const omega=Math.sqrt(v[0]/v[1]),eq=v[2]/v[0],amp=Math.min(.12,eq*.65+.025);
    const x=450+(eq+amp*Math.cos(omega*elapsed))*360;
    if(Math.abs(p.x-x)<55&&p.y>245&&p.y<330)return {kind:"springLoad",offset:amp*Math.cos(omega*elapsed),startX:p.x,base:v[2]};
  }
  if(title==="Wave Properties and Superposition"){
    if(p.x>70&&p.x<835&&p.y>95&&p.y<335)return {kind:"wave",startX:p.x,startY:p.y,baseAmp:v[2],basePhase:v[3]};
  }
  if(title==="Doppler Effect"){
    const x=175+Math.min(390,v[1]*elapsed*1.1);
    if(distance(p,{x,y:230})<45)return {kind:"sourceSpeed",startX:p.x,base:v[1]};
  }
  if(title==="Ohm's Law and Resistor Circuits"){
    if(p.y>150&&p.y<220&&p.x>220&&p.x<760)return {kind:"resistance",startX:p.x,base:v[1]};
  }
  if(title==="Capacitor Charging and Discharging"){
    if(p.x>375&&p.x<510&&p.y>135&&p.y<320)return {kind:"capacitorTime",startY:p.y,base:v[3]};
  }
  if(title==="Electromagnetic Induction"){
    const x=360+Math.sin(2*Math.PI*elapsed/Math.max(v[2],.08))*110;
    if(distance(p,{x,y:230})<70 || (p.x>320&&p.x<550&&p.y>175&&p.y<285))return {kind:"flux",startY:p.y,base:v[1]};
  }
  return null;
}

export function movePhysicsDrag(title,state,p,controls){
  if(!state)return false;
  if(state.kind==="force")setValue(controls,0,state.base+(p.x-state.startX)/1.05);
  else if(state.kind==="launch"){
    const dx=p.x-state.start.x,dy=state.start.y-p.y;
    if(Math.hypot(dx,dy)>4){
      const angle=Math.atan2(Math.max(0,dy),Math.max(1,dx))*180/Math.PI;
      setValue(controls,1,clamp(angle,5,85));
      setValue(controls,0,Math.hypot(dx,dy)/4.5);
    }
  }
  else if(state.kind==="cartVelocity")setValue(controls,state.index,state.base+(p.x-state.startX)/5);
  else if(state.kind==="incidentAngle")setValue(controls,0,state.base+(p.x-state.startX)/4);
  else if(state.kind==="orbitRadius")setValue(controls,2,(Math.hypot(p.x-450,p.y-245)-65)/4);
  else if(state.kind==="dropHeight")setValue(controls,0,state.base-(p.y-state.startY)/2.45);
  else if(state.kind==="rampAngle")setValue(controls,0,Math.atan2(clamp(340-p.y,0,265),590*.45)*180/Math.PI);
  else if(state.kind==="displacement")setValue(controls,1,state.base+(p.x-state.startX)/12);
  else if(state.kind==="pendulum"){
    const radius=Math.hypot(p.x-450,p.y-95);
    setValue(controls,0,radius/110);
    setValue(controls,2,Math.atan2(p.x-450,p.y-95)*180/Math.PI);
  }
  else if(state.kind==="springLoad"){
    const k=Number(controls[0].value);
    setValue(controls,2,state.base+(p.x-state.startX)/360*k);
  }
  else if(state.kind==="wave"){
    setValue(controls,2,state.baseAmp+(state.startY-p.y)/48);
    setValue(controls,3,state.basePhase+(p.x-state.startX)/780*360);
  }
  else if(state.kind==="sourceSpeed")setValue(controls,1,state.base+(p.x-state.startX)/3.9);
  else if(state.kind==="resistance")setValue(controls,1,state.base+(p.x-state.startX)/5.35);
  else if(state.kind==="capacitorTime")setValue(controls,3,state.base+(state.startY-p.y)/32);
  else if(state.kind==="flux")setValue(controls,1,state.base+(state.startY-p.y)*.001);
  return true;
}
