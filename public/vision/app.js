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

// A single, interruptible transition from the hero into the vision.
(() => {
  const trigger = document.querySelector('.hero .pill[href="#vision"]');
  const destination = document.getElementById('vision');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let finishTransition = null;
  if (!trigger || !destination) return;

  function arrive() {
    destination.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
    if (location.hash !== '#vision') history.pushState(null, '', '#vision');
  }

  trigger.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (finishTransition) return;
    const targetY = () => Math.max(0, scrollY + destination.getBoundingClientRect().top - 70);
    if (reduced.matches) {
      window.scrollTo({ top: targetY(), behavior: 'instant' });
      arrive();
      return;
    }
    const layer = document.createElement('canvas');
    layer.className = 'era-burst';
    layer.setAttribute('aria-hidden', 'true');
    const paint = layer.getContext('2d');
    if (!paint) {
      destination.scrollIntoView({ behavior: 'smooth' });
      arrive();
      return;
    }
    const width = innerWidth, height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, 2);
    layer.width = width * scale; layer.height = height * scale;
    paint.scale(scale, scale);
    document.body.appendChild(layer);
    document.documentElement.classList.add('era-transitioning');
    const startY = scrollY, endY = targetY(), started = performance.now();
    const count = width < 700 ? 110 : 200;
    const particles = Array.from({ length: count }, (_, i) => ({
      angle: i * 2.399963,
      depth: .12 + Math.random() * .88,
      speed: .65 + Math.random() * .5,
      bright: i % 5 === 0
    }));
    let animation;
    const finish = () => {
      cancelAnimationFrame(animation);
      layer.remove();
      window.scrollTo({ top: targetY(), behavior: 'instant' });
      document.documentElement.classList.remove('era-transitioning');
      removeEventListener('resize', finish);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', finish);
      finishTransition = null;
      arrive();
    };
    const onVisibility = () => { if (document.hidden) finish(); };
    finishTransition = finish;
    addEventListener('resize', finish, { once: true });
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener('change', finish, { once: true });
    function tick(now) {
      const t = Math.min(1, (now - started) / 1100);
      const envelope = Math.pow(Math.sin(t * Math.PI), 1.4);
      paint.clearRect(0, 0, width, height);
      // A dark optical tunnel, with fine projected lines rather than tumbling blocks.
      paint.globalAlpha = envelope * .88;
      paint.fillStyle = '#020a07'; paint.fillRect(0, 0, width, height);
      const ox = width * .53, oy = height * .46;
      const reach = Math.hypot(width, height) * .75;
      const acceleration = t * t * 1.7;
      for (const p of particles) {
        const depth = (p.depth + acceleration * p.speed) % 1;
        const distance = .045 + depth * depth;
        const r = distance * reach;
        const length = (8 + depth * depth * 160) * envelope;
        const dx = Math.cos(p.angle), dy = Math.sin(p.angle);
        const x = ox + dx * r, y = oy + dy * r;
        const trail = paint.createLinearGradient(x - dx * length, y - dy * length, x, y);
        trail.addColorStop(0, 'rgba(35,75,60,0)');
        trail.addColorStop(1, p.bright ? '#a4cdb4' : '#377657');
        paint.globalAlpha = envelope * (.15 + depth * .65);
        paint.strokeStyle = trail;
        paint.lineWidth = p.bright ? 1 : .55;
        paint.beginPath(); paint.moveTo(x - dx * length, y - dy * length);
        paint.lineTo(x, y); paint.stroke();
      }
      // Sparse elliptical scan rings expand smoothly from the vanishing point.
      for (let i = 0; i < 3; i++) {
        const phase = (i / 3 + acceleration * .3) % 1;
        const r = (phase * phase + .03) * reach;
        paint.globalAlpha = envelope * (1 - phase) * .25;
        paint.strokeStyle = '#6d9c82'; paint.lineWidth = .7;
        paint.beginPath(); paint.ellipse(ox, oy, r, r * .62, -.18, 0, Math.PI * 2); paint.stroke();
      }
      paint.globalAlpha = 1;
      const progress = Math.max(0, Math.min(1, (t - .16) / .68));
      const ease = progress * progress * (3 - 2 * progress);
      window.scrollTo({ top: startY + (endY - startY) * ease, behavior: 'instant' });
      if (t < 1) animation = requestAnimationFrame(tick); else finish();
    }
    animation = requestAnimationFrame(tick);
  });
})();
