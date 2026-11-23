import {control as c,line,text,circle} from "./shared.js";

// Additional secondary-school Physics models. All angles are entered in degrees
// and converted to radians before trigonometric calculations.
const mirror = {
  title:"Reflection from a Plane Mirror", category:"Optics", unit:"optics",
  objective:"Investigate the law of reflection by changing the incident angle.",
  theory:"Angles are measured from the normal (perpendicular) to the mirror. For specular reflection, the angle of reflection equals the angle of incidence.",
  formula:"θᵢ = θᵣ  |  i + r = 180° (with the mirror surface)",
  challenge:"Predict the reflected angle when the incident angle is 35°. Change the slider and verify your prediction.",
  controls:[c("Incident angle",35,0,85,1,"°")],
  draw(ctx,cv,v){const i=v[0].value*Math.PI/180,cx=450,cy=220,L=180;ctx.fillStyle="#f7fbfc";ctx.fillRect(55,35,790,350);line(ctx,110,cy,790,cy,"#718b99",7);line(ctx,cx,65,cx,365,"#b6c8d0",2);const ray=(a,col)=>{const x=cx+L*Math.sin(a),y=cy-L*Math.cos(a);line(ctx,cx,cy,x,y,col,4);circle(ctx,x,y,6,col);};ray(-i,"#1685a2");ray(i,"#e58d36");text(ctx,"MIRROR",cx+12,cy+24,14,"#526c79");text(ctx,`Incident angle = ${v[0].value.toFixed(1)}°`,85,75,19,"#087f75");text(ctx,`Reflected angle = ${v[0].value.toFixed(1)}°`,85,108,19,"#a7651d");text(ctx,"Normal",cx+10,82,13,"#526c79");},
  readout(v){const a=v[0].value;return `<strong>Reflection results</strong>Angle of incidence: ${a.toFixed(1)}°<br>Angle of reflection: ${a.toFixed(1)}°<br>Difference: 0.0° (ideal plane mirror)`;},
  metric(v){return v[0].value;}, metricUnit:"°"
};

const lens = {
  title:"Thin Lens: Image Formation", category:"Optics", unit:"optics",
  objective:"Explore how object distance and focal length determine image distance and magnification.",
  theory:"For a thin lens using the real-is-positive convention, 1/f = 1/u + 1/v. Magnification m = image height/object height = −v/u. A negative v indicates a virtual image for a converging lens under this convention.",
  formula:"1/f = 1/u + 1/v  |  m = −v/u", 
  challenge:"Move the object from beyond 2f to between f and 2f. Predict how the image distance and size change.",
  controls:[c("Focal length",10,4,25,.5," cm"),c("Object distance",30,5,100,1," cm"),c("Object height",4,1,10,.5," cm")],
  draw(ctx,cv,v){const [f,u,h]=v.map(x=>x.value),den=1/f-1/u,iv=Math.abs(den)<1e-9?Infinity:1/den,m=Number.isFinite(iv)?-iv/u:Infinity;ctx.fillStyle="#f7fbfc";ctx.fillRect(45,35,810,350);line(ctx,90,220,820,220,"#718b99",2);line(ctx,450,70,450,360,"#1685a2",5);text(ctx,"CONVERGING LENS",465,88,14,"#1685a2");const scale=8,ox=450-u*scale;line(ctx,ox,220,ox,220-h*scale,"#e58d36",5);line(ctx,ox-9,220-h*scale+12,ox,220-h*scale,"#e58d36",3);line(ctx,ox+9,220-h*scale+12,ox,220-h*scale,"#e58d36",3);if(Number.isFinite(iv)&&Math.abs(iv)<42){const ix=450+iv*scale,ih=h*m;line(ctx,ix,220,ix,220-ih*scale,"#0d9d91",5);text(ctx,"Image",Math.max(60,Math.min(760,ix+8)),Math.max(55,Math.min(365,220-ih*scale-10)),13,"#087f75");}line(ctx,450-f*scale,205,450-f*scale,235,"#8d6ab2",2);line(ctx,450+f*scale,205,450+f*scale,235,"#8d6ab2",2);text(ctx,`f = ${f} cm`,450-f*scale-22,255,12,"#7654a6");text(ctx,`u = ${u} cm`,Math.max(60,ox-28),195,13,"#a7651d");text(ctx,Number.isFinite(iv)?`v = ${iv.toFixed(2)} cm`:`Image at infinity`,80,70,19,"#087f75");text(ctx,Number.isFinite(m)?`Magnification = ${m.toFixed(2)}`:"Magnification undefined at focal point",80,105,17,"#526c79");},
  readout(v){const [f,u,h]=v.map(x=>x.value),den=1/f-1/u,iv=Math.abs(den)<1e-9?Infinity:1/den,m=Number.isFinite(iv)?-iv/u:Infinity;return `<strong>Thin-lens results</strong>Image distance: ${Number.isFinite(iv)?iv.toFixed(3)+" cm":"∞ (object at focal plane)"}<br>Magnification: ${Number.isFinite(m)?m.toFixed(3):"undefined"}<br>Image height: ${Number.isFinite(m)?(m*h).toFixed(3)+" cm":"undefined"}<br>${iv>0?"Real image":"Virtual image"}; ${m<0?"inverted":"upright"} under the stated sign convention.`;},
  metric(v){const [f,u]=v.map(x=>x.value);const d=1/f-1/u;return Math.abs(d)<1e-9?0:(1/d)/100;}, metricUnit:"m"
};

const bankedRoad = {
  title:"Banked Road and Circular Motion", category:"Mechanics", unit:"mechanics",
  objective:"Determine the speed at which a vehicle can travel around a frictionless banked curve without relying on lateral friction.",
  theory:"For an ideal banked curve, the horizontal component of the normal force supplies centripetal force and its vertical component balances weight. The design speed is independent of vehicle mass.",
  formula:"tan θ = v²/(rg)  |  v = √(rg tan θ)",
  challenge:"Keep the radius fixed and increase the banking angle. Predict whether the design speed rises or falls, then verify.",
  controls:[c("Banking angle",20,2,45,1,"°"),c("Curve radius",80,10,250,5," m"),c("Gravity",9.81,1,20,.01," m/s²")],
  draw(ctx,cv,v){const [deg,r,g]=v.map(x=>x.value),a=deg*Math.PI/180,speed=Math.sqrt(r*g*Math.tan(a));ctx.fillStyle="#f7fbfc";ctx.fillRect(50,35,800,350);ctx.save();ctx.translate(420,260);ctx.rotate(-a);ctx.fillStyle="#d8e5eb";ctx.fillRect(-260,-18,520,36);ctx.fillStyle="#e58d36";ctx.fillRect(-30,-64,60,44);ctx.restore();line(ctx,420,260,420,95,"#718b99",2);text(ctx,`θ = ${deg.toFixed(1)}°`,610,90,18,"#087f75");text(ctx,`Design speed = ${speed.toFixed(2)} m/s`,75,80,21,"#087f75");text(ctx,`Radius = ${r.toFixed(1)} m`,75,115,17,"#526c79");text(ctx,"Ideal frictionless banked curve",75,345,15,"#526c79");},
  readout(v){const [deg,r,g]=v.map(x=>x.value),a=deg*Math.PI/180,s=Math.sqrt(r*g*Math.tan(a));return `<strong>Banked-road results</strong>Design speed: ${s.toFixed(3)} m/s<br>Centripetal acceleration: ${(s*s/r).toFixed(3)} m/s²<br>tan θ: ${Math.tan(a).toFixed(4)}<br>Assumption: frictionless ideal bank.`;},
  metric(v){const [deg,r,g]=v.map(x=>x.value);return Math.sqrt(r*g*Math.tan(deg*Math.PI/180));}, metricUnit:"m/s"
};

export const physicsExtensionLabs=[bankedRoad,mirror,lens];
