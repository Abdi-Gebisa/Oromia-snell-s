export function control(label,value,min,max,step=1,unit="",type="range",options=null){
  return {label,value,initial:value,min,max,step,unit,type,options,format:v=>`${Number(v).toFixed(step<1?2:0)}${unit}`};
}
export function textControl(label,value,options){return {label,value,initial:value,type:"select",options};}
export function line(ctx,x1,y1,x2,y2,color="#b7c8d1",width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
export function text(ctx,str,x,y,size=18,color="#183247",weight="600"){ctx.fillStyle=color;ctx.font=`${weight} ${size}px DM Sans, sans-serif`;ctx.fillText(str,x,y);}
export function circle(ctx,x,y,r,fill,stroke="#fff"){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=stroke;ctx.stroke();}
export function axes(ctx,x=80,y=350,w=740,h=270){line(ctx,x,y,x+w,y,"#8299a8",2);line(ctx,x,y,x,y-h,"#8299a8",2);for(let i=1;i<=5;i++){line(ctx,x+i*w/5,y-5,x+i*w/5,y+5);line(ctx,x-5,y-i*h/5,x+5,y-i*h/5);}}
