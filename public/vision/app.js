(() => {
  const canvas = document.getElementById('universe');
  const ctx = canvas.getContext('2d');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let w, h, dpr, frame = 0, raf, pointer = { x: -1000, y: -1000 }, smooth = { x: 0, y: 0 }, scroll = 0;
  const stars = Array.from({length: 180}, () => ({x:Math.random(),y:Math.random(),size:Math.random()*1.3+.2,alpha:Math.random()*.5+.1}));
  function resize(){w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);if(motion.matches)draw();}
  function draw(){
    frame += motion.matches ? 0 : .004;
    ctx.clearRect(0,0,w,h);
    smooth.x += ((pointer.x < 0 ? 0 : (pointer.x/w-.5)*55)-smooth.x)*.035;
    smooth.y += ((pointer.y < 0 ? 0 : (pointer.y/h-.5)*40)-smooth.y)*.035;
    const cx=w*(w<700?.78:.75)+smooth.x, cy=h*.49+smooth.y-scroll*.025, radius=Math.min(w*.38,h*.47);
    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,radius*1.6);glow.addColorStop(0,'#234b3c50');glow.addColorStop(.45,'#234b3c35');glow.addColorStop(1,'#03070600');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    for(const s of stars){ctx.fillStyle=`rgba(182,197,189,${s.alpha})`;ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.size,0,Math.PI*2);ctx.fill();}
    const count=w<700?36:64;
    for(let ring=0;ring<count;ring++){
      const latitude=(ring/(count-1)-.5)*Math.PI;
      const rr=Math.cos(latitude)*radius, yy=Math.sin(latitude)*radius;
      ctx.beginPath();
      for(let p=0;p<=150;p++){
        const a=p/150*Math.PI*2+frame;
        const ox=Math.cos(a)*rr, z=Math.sin(a)*rr;
        let x=cx+ox*.94+yy*.24, y=cy+yy*.72-z*.40+ox*.12;
        if(!motion.matches && pointer.x>=0){const dx=x-pointer.x,dy=y-pointer.y,dist=Math.hypot(dx,dy);if(dist<170&&dist>0){const push=(1-dist/170)*18;x+=dx/dist*push;y+=dy/dist*push;}}
        if(p===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.strokeStyle=`rgba(${ring%7===0?'55,118,87':'35,75,60'},${ring%7===0?.40:.13})`;ctx.lineWidth=ring%7===0?1:.65;ctx.stroke();
    }
    for(let i=0;i<45;i++){
      const a=i*2.399+frame*.65, lat=Math.asin(i/44*2-1), rr=Math.cos(lat)*radius;
      const ox=Math.cos(a)*rr,z=Math.sin(a)*rr,yy=Math.sin(lat)*radius;
      const x=cx+ox*.94+yy*.24,y=cy+yy*.72-z*.40+ox*.12;
      const near=Math.hypot(x-pointer.x,y-pointer.y)<180;
      ctx.shadowBlur=near?18:7;ctx.shadowColor='#377657';ctx.fillStyle=near?'#b8e4c8':'#437d64';ctx.beginPath();ctx.arc(x,y,near?2.6:1.2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      ctx.shadowBlur = near ? 12 : 4;
      ctx.shadowColor = '#377657';
      ctx.fillStyle = near ? '#b8e4c8' : 'rgba(67,125,100,.85)';
      ctx.fillRect(x + 7, y - 5, near ? 5 : 3, near ? 3 : 2);
      for (let tail = 1; tail <= 3; tail++) {
        ctx.fillStyle = `rgba(55,118,87,${.3 / tail})`;
        ctx.fillRect(x + 7, y - 5 - tail * 10, 3, 2);
      }
      ctx.shadowBlur = 0;
    }
    const shade=ctx.createLinearGradient(0,0,w,0);shade.addColorStop(0,'#030706dd');shade.addColorStop(.35,'#03070660');shade.addColorStop(.7,'#03070600');ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
    if(!motion.matches&&!document.hidden)raf=requestAnimationFrame(draw);
  }
  addEventListener('resize',resize);
  addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pointer.x=e.clientX;pointer.y=e.clientY;}},{passive:true});
  document.addEventListener('pointerleave',()=>{pointer.x=-1000;pointer.y=-1000;});
  addEventListener('scroll',()=>{scroll=scrollY;},{passive:true});
  function restart(){cancelAnimationFrame(raf);draw();}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else restart();});
  motion.addEventListener('change',restart);
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  resize();if(!motion.matches)draw();
})();
