import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES  (Yellow / Black scheme) ──────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    :root {
      --bg:#0a0900;
      --surface:#0f0e00;
      --surface2:#161400;
      --border:rgba(255,210,0,0.07);
      --border2:rgba(255,210,0,0.14);
      --text:#f5f0d8;
      --text2:#a09870;
      --text3:#5a5030;
      --accent:#ffd000;
      --accent2:#ffaa00;
      --accent3:#ffe566;
      --accentDim:rgba(255,208,0,0.12);
      --font-display:'Syne',sans-serif;
      --font-body:'DM Sans',sans-serif;
      --font-mono:'JetBrains Mono',monospace;
    }
    html { scroll-behavior:smooth; }
    body { background:var(--bg); color:var(--text); font-family:var(--font-body); overflow-x:hidden; cursor:none; }
    ::-webkit-scrollbar { width:3px; }
    ::-webkit-scrollbar-track { background:var(--bg); }
    ::-webkit-scrollbar-thumb { background:var(--accent); border-radius:10px; }
    .syne { font-family:var(--font-display); }
    .mono { font-family:var(--font-mono); }
    @keyframes pulse-glow   { 0%,100%{opacity:0.35} 50%{opacity:1} }
    @keyframes spin-slow    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes aurora       { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    @keyframes gridMove     { from{background-position:0 0} to{background-position:40px 40px} }
    @keyframes float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes constructLine{ from{width:0} to{width:100%} }
    @keyframes scanline     { 0%{transform:translateY(-200%)} 100%{transform:translateY(600%)} }
    @keyframes trailFade    { 0%{opacity:0.5;transform:scale(1)} 100%{opacity:0;transform:scale(0.1)} }
    @keyframes speechPop    { 0%{opacity:0;transform:translateX(-50%) scale(0.6) translateY(10px)} 70%{transform:translateX(-50%) scale(1.04) translateY(-2px)} 100%{opacity:1;transform:translateX(-50%) scale(1) translateY(0)} }
    @keyframes shadowPulse  { 0%,100%{opacity:0.35;transform:translateX(-50%) scaleX(1)} 50%{opacity:0.55;transform:translateX(-50%) scaleX(1.08)} }
    @keyframes shimmerBar   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes spinOnce     { 0%{transform:scaleX(var(--fx)) rotate(0deg)} 100%{transform:scaleX(var(--fx)) rotate(360deg)} }
    @keyframes heartFloat   { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-60px) scale(1.6)} }
    @keyframes scaredShake  { 0%,100%{transform:scaleX(var(--fx)) translateX(0)} 20%{transform:scaleX(var(--fx)) translateX(-6px)} 40%{transform:scaleX(var(--fx)) translateX(6px)} 60%{transform:scaleX(var(--fx)) translateX(-4px)} 80%{transform:scaleX(var(--fx)) translateX(4px)} }
    @keyframes popBounce    { 0%{transform:scaleX(var(--fx)) scale(1)} 30%{transform:scaleX(var(--fx)) scale(1.18)} 60%{transform:scaleX(var(--fx)) scale(0.92)} 100%{transform:scaleX(var(--fx)) scale(1)} }
    @keyframes zoomOut      { 0%{transform:translateX(-50%) scale(0)} 60%{transform:translateX(-50%) scale(1.2)} 100%{transform:translateX(-50%) scale(1)} }
    @keyframes floatEmoji   { 0%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} 100%{opacity:0;transform:translateX(-50%) translateY(-70px) scale(1.4)} }
    .reveal-on-scroll { opacity:0; transform:translateY(40px); transition:opacity 0.8s ease, transform 0.8s ease; }
    .reveal-on-scroll.visible { opacity:1; transform:translateY(0); }
    input::placeholder, textarea::placeholder { color: var(--text3); }
    input, textarea { color-scheme: dark; }
  `}</style>
);

// ─── CURSOR ───────────────────────────────────────────────────────────────────
const Cursor = () => {
  const dot=useRef(null), ring=useRef(null);
  const pos=useRef({x:0,y:0}), rp=useRef({x:0,y:0});
  const [hov,setHov]=useState(false);
  useEffect(()=>{
    const mv=e=>{pos.current={x:e.clientX,y:e.clientY};if(dot.current)dot.current.style.transform=`translate(${e.clientX-4}px,${e.clientY-4}px)`;};
    window.addEventListener("mousemove",mv);
    let raf;const loop=()=>{rp.current.x+=(pos.current.x-rp.current.x)*0.12;rp.current.y+=(pos.current.y-rp.current.y)*0.12;if(ring.current)ring.current.style.transform=`translate(${rp.current.x-20}px,${rp.current.y-20}px)`;raf=requestAnimationFrame(loop);};raf=requestAnimationFrame(loop);
    const on=()=>setHov(true),off=()=>setHov(false);
    document.querySelectorAll("a,button,[data-hover]").forEach(el=>{el.addEventListener("mouseenter",on);el.addEventListener("mouseleave",off);});
    return()=>{window.removeEventListener("mousemove",mv);cancelAnimationFrame(raf);};
  },[]);
  return(<>
    <div ref={dot} style={{position:"fixed",top:0,left:0,width:8,height:8,borderRadius:"50%",background:"var(--accent)",zIndex:9999,pointerEvents:"none",willChange:"transform"}}/>
    <div ref={ring} style={{position:"fixed",top:0,left:0,width:hov?56:40,height:hov?56:40,marginLeft:hov?-8:0,marginTop:hov?-8:0,borderRadius:"50%",border:`1.5px solid ${hov?"var(--accent)":"rgba(255,208,0,0.38)"}`,zIndex:9998,pointerEvents:"none",willChange:"transform",transition:"width .2s,height .2s,border-color .2s,margin .2s"}}/>
  </>);
};

// ─── PARTICLE FIELD ───────────────────────────────────────────────────────────
const ParticleField=({mouseX,mouseY})=>{
  const cvs=useRef(null),pts=useRef([]),raf=useRef(null);
  useEffect(()=>{
    const c=cvs.current,ctx=c.getContext("2d");
    const rz=()=>{c.width=window.innerWidth;c.height=window.innerHeight;};
    rz();window.addEventListener("resize",rz);
    for(let i=0;i<100;i++)pts.current.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.4+.3,op:Math.random()*.35+.08,hue:[45,38,52][Math.floor(Math.random()*3)]});
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      const mx=mouseX.current,my=mouseY.current;
      pts.current.forEach(p=>{
        const dx=mx-p.x,dy=my-p.y,d=Math.sqrt(dx*dx+dy*dy)||1;
        if(d<160){p.vx+=dx/d*.018;p.vy+=dy/d*.018;}
        p.vx*=.99;p.vy*=.99;p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=c.width;if(p.x>c.width)p.x=0;if(p.y<0)p.y=c.height;if(p.y>c.height)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`hsla(${p.hue},90%,65%,${p.op})`;ctx.fill();
      });
      pts.current.forEach((p,i)=>pts.current.slice(i+1).forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<90){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(255,208,0,${.06*(1-d/90)})`;ctx.lineWidth=.5;ctx.stroke();}}));
      raf.current=requestAnimationFrame(draw);
    };draw();
    return()=>{window.removeEventListener("resize",rz);cancelAnimationFrame(raf.current);};
  },[]);
  return <canvas ref={cvs} style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}/>;
};

// ─── ANIMATED ROBOT (yellow-themed, walk cycle driven by walkPhase) ───────────
const AnimatedRobot=({eyeX,eyeY,headTilt,blink,mouth,walkPhase,speed,jumping,waving,excited,glow,size=110})=>{
  const g=Math.max(0.3,Math.min(1.4,glow));
  const sw=Math.min(speed*28,26),lsw=Math.min(speed*22,20),bob=Math.min(speed*3.5,3.2);
  const leftArmRot=waving?Math.sin(Date.now()*0.01)*35-20:excited?Math.sin(Date.now()*0.016)*40:-Math.sin(walkPhase)*sw;
  const rightArmRot=excited?Math.sin(walkPhase)*40:Math.sin(walkPhase)*sw;
  const leftLegRot=jumping?-12:Math.sin(walkPhase)*lsw;
  const rightLegRot=jumping?12:-Math.sin(walkPhase)*lsw;
  const bodyBob=jumping?-18:-Math.abs(Math.sin(walkPhase))*bob;
  const headRot=headTilt*0.4;
  const mp={idle:"M 32 62 Q 40 67 48 62",surprised:"M 34 60 Q 40 70 46 60",happy:"M 29 58 Q 40 73 51 58",excited:"M 27 57 Q 40 76 53 57"}[mouth]||"M 32 62 Q 40 67 48 62";
  return(
    <svg viewBox="0 0 160 272" width={size} height={size*(272/160)} style={{overflow:"visible",filter:`drop-shadow(0 0 ${14*g}px rgba(255,208,0,${.5*g})) drop-shadow(0 0 4px rgba(255,170,0,${.22*g}))`}}>
      <defs>
        <radialGradient id="rb" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#1e1a00"/><stop offset="100%" stopColor="#0d0b00"/></radialGradient>
        <radialGradient id="rh" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#1a1600"/><stop offset="100%" stopColor="#0c0a00"/></radialGradient>
        <radialGradient id="re" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffd000"/><stop offset="100%" stopColor="#cc9900" stopOpacity=".6"/></radialGradient>
        <filter id="gf"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="ra" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#ffd000"/><stop offset="100%" stopColor="#8a6a00"/></linearGradient>
        <linearGradient id="rc" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="rgba(255,208,0,.22)"/><stop offset="100%" stopColor="rgba(255,208,0,.03)"/></linearGradient>
        <clipPath id="hc"><rect x="42" y="22" width="76" height="68" rx="14"/></clipPath>
      </defs>
      <g transform={`translate(0,${bodyBob})`}>
        {/* LEFT ARM */}
        <g transform={`translate(15,128) rotate(${leftArmRot}) translate(-15,-128)`} style={{transformOrigin:"15px 122px"}}>
          <rect x="4" y="122" width="22" height="58" rx="11" fill="url(#rb)" stroke="rgba(255,208,0,.18)" strokeWidth="1"/>
          <rect x="8" y="142" width="14" height="26" rx="7" fill="rgba(255,208,0,.07)"/>
          <ellipse cx="15" cy="186" rx="11" ry="8" fill="url(#rb)" stroke="rgba(255,208,0,.18)" strokeWidth="1"/>
          <line x1="9" y1="184" x2="9" y2="188" stroke="rgba(255,208,0,.22)" strokeWidth="1"/>
          <line x1="15" y1="183" x2="15" y2="188" stroke="rgba(255,208,0,.22)" strokeWidth="1"/>
          <line x1="21" y1="184" x2="21" y2="188" stroke="rgba(255,208,0,.22)" strokeWidth="1"/>
        </g>
        {/* RIGHT ARM */}
        <g transform={`translate(145,128) rotate(${rightArmRot}) translate(-145,-128)`} style={{transformOrigin:"145px 122px"}}>
          <rect x="134" y="122" width="22" height="58" rx="11" fill="url(#rb)" stroke="rgba(255,208,0,.18)" strokeWidth="1"/>
          <rect x="138" y="142" width="14" height="26" rx="7" fill="rgba(255,208,0,.07)"/>
          <ellipse cx="145" cy="186" rx="11" ry="8" fill="url(#rb)" stroke="rgba(255,208,0,.18)" strokeWidth="1"/>
          <line x1="139" y1="184" x2="139" y2="188" stroke="rgba(255,208,0,.22)" strokeWidth="1"/>
          <line x1="145" y1="183" x2="145" y2="188" stroke="rgba(255,208,0,.22)" strokeWidth="1"/>
          <line x1="151" y1="184" x2="151" y2="188" stroke="rgba(255,208,0,.22)" strokeWidth="1"/>
        </g>
        {/* SHOULDERS */}
        <ellipse cx="20" cy="120" rx="15" ry="11" fill="url(#rb)" stroke="rgba(255,208,0,.22)" strokeWidth="1"/>
        <ellipse cx="140" cy="120" rx="15" ry="11" fill="url(#rb)" stroke="rgba(255,208,0,.22)" strokeWidth="1"/>
        <circle cx="20" cy="120" r="4.5" fill="rgba(255,208,0,.18)" stroke="rgba(255,208,0,.5)" strokeWidth="1"/>
        <circle cx="140" cy="120" r="4.5" fill="rgba(255,208,0,.18)" stroke="rgba(255,208,0,.5)" strokeWidth="1"/>
        {/* BODY */}
        <rect x="30" y="100" width="100" height="92" rx="16" fill="url(#rb)" stroke="rgba(255,208,0,.25)" strokeWidth="1.5"/>
        <rect x="40" y="110" width="80" height="60" rx="10" fill="url(#rc)" stroke="rgba(255,208,0,.1)" strokeWidth="1"/>
        <circle cx="80" cy="134" r="16" fill="#0d0b00" stroke="rgba(255,208,0,.35)" strokeWidth="1.5"/>
        <circle cx="80" cy="134" r="11" fill="none" stroke="rgba(255,208,0,.45)" strokeWidth="1" style={{animation:"spin-slow 8s linear infinite"}}/>
        <circle cx="80" cy="134" r="6" fill="rgba(255,208,0,.12)"/>
        <circle cx="80" cy="134" r="3.5" fill="#ffd000" filter="url(#gf)" style={{animation:"pulse-glow 2s ease-in-out infinite"}}/>
        <circle cx="54" cy="156" r="3" fill="#ffd000" style={{animation:"pulse-glow 2.5s infinite"}}/>
        <circle cx="63" cy="156" r="3" fill="#ffaa00" style={{animation:"pulse-glow 2.5s infinite .5s"}}/>
        <circle cx="72" cy="156" r="3" fill="#ffe566" style={{animation:"pulse-glow 2.5s infinite 1s"}}/>
        <rect x="88" y="152" width="22" height="6" rx="3" fill="rgba(255,208,0,.08)" stroke="rgba(255,208,0,.2)" strokeWidth=".5"/>
        <rect x="89" y="153" width="14" height="4" rx="2" fill="rgba(255,208,0,.4)"/>
        {/* NECK */}
        <rect x="66" y="84" width="28" height="18" rx="4" fill="#141000" stroke="rgba(255,208,0,.3)" strokeWidth="1"/>
        <line x1="72" y1="84" x2="72" y2="102" stroke="rgba(255,208,0,.2)" strokeWidth="1"/>
        <line x1="80" y1="84" x2="80" y2="102" stroke="rgba(255,208,0,.2)" strokeWidth="1"/>
        <line x1="88" y1="84" x2="88" y2="102" stroke="rgba(255,208,0,.2)" strokeWidth="1"/>
        {/* HEAD */}
        <g transform={`translate(80,52) rotate(${headRot}) translate(-80,-52)`}>
          <rect x="77" y="2" width="6" height="22" rx="3" fill="url(#ra)"/>
          <circle cx="80" cy="2" r="5" fill="#ffd000" filter="url(#gf)" style={{animation:"pulse-glow 2s ease-in-out infinite"}}/>
          <circle cx="80" cy="2" r="9" fill="none" stroke="rgba(255,208,0,.28)" strokeWidth="1" style={{animation:"pulse-glow 2s ease-in-out infinite"}}/>
          <rect x="42" y="22" width="76" height="64" rx="14" fill="url(#rh)" stroke="rgba(255,208,0,.28)" strokeWidth="1.5"/>
          <rect x="46" y="26" width="68" height="56" rx="10" fill="none" stroke="rgba(255,255,255,.03)" strokeWidth="1"/>
          <line x1="42" y1="50" x2="118" y2="50" stroke="rgba(255,208,0,.07)" strokeWidth="1"/>
          <rect x="43" y="22" width="74" height="2" rx="1" fill="rgba(255,208,0,.2)" clipPath="url(#hc)" style={{animation:"scanline 2.6s linear infinite"}}/>
          <rect x="40" y="36" width="4" height="18" rx="2" fill="rgba(255,208,0,.15)" stroke="rgba(255,208,0,.2)" strokeWidth=".5"/>
          <rect x="116" y="36" width="4" height="18" rx="2" fill="rgba(255,208,0,.15)" stroke="rgba(255,208,0,.2)" strokeWidth=".5"/>
          <ellipse cx="63" cy="44" rx="12" ry="12" fill="#080700" stroke="rgba(255,208,0,.25)" strokeWidth="1"/>
          <ellipse cx="97" cy="44" rx="12" ry="12" fill="#080700" stroke="rgba(255,208,0,.25)" strokeWidth="1"/>
          <ellipse cx="63" cy="44" rx="10" ry="10" fill="none" stroke="rgba(255,208,0,.12)" strokeWidth="1.5"/>
          <ellipse cx="97" cy="44" rx="10" ry="10" fill="none" stroke="rgba(255,208,0,.12)" strokeWidth="1.5"/>
          <g transform={`translate(${eyeX},${eyeY})`}>
            <ellipse cx="63" cy="44" rx="7" ry={blink?.7:7} fill="url(#re)" filter="url(#gf)" style={{transition:"ry .07s"}}/>
            <ellipse cx="97" cy="44" rx="7" ry={blink?.7:7} fill="url(#re)" filter="url(#gf)" style={{transition:"ry .07s"}}/>
            <circle cx="64" cy="45" r="2.5" fill="rgba(10,8,0,.7)"/>
            <circle cx="98" cy="45" r="2.5" fill="rgba(10,8,0,.7)"/>
            <circle cx="61" cy="42" r="1.5" fill="rgba(255,255,200,.75)"/>
            <circle cx="95" cy="42" r="1.5" fill="rgba(255,255,200,.75)"/>
          </g>
          <path d={mp} stroke="rgba(255,208,0,.9)" strokeWidth="2.2" fill="none" strokeLinecap="round" style={{transition:"d .28s ease",filter:"drop-shadow(0 0 3px rgba(255,208,0,.5))"}}/>
          <circle cx="50" cy="62" r="2.5" fill="#ffd000" style={{animation:"pulse-glow 3s ease-in-out infinite"}}/>
          <circle cx="110" cy="62" r="2.5" fill="#ffaa00" style={{animation:"pulse-glow 3s ease-in-out infinite 1.2s"}}/>
        </g>
        {/* WAIST */}
        <rect x="44" y="190" width="72" height="13" rx="6" fill="url(#rb)" stroke="rgba(255,208,0,.14)" strokeWidth="1"/>
        {/* LEFT LEG */}
        <g transform={`translate(61,203) rotate(${leftLegRot}) translate(-61,-203)`} style={{transformOrigin:"61px 203px"}}>
          <rect x="46" y="200" width="30" height="52" rx="10" fill="url(#rb)" stroke="rgba(255,208,0,.14)" strokeWidth="1"/>
          <circle cx="61" cy="218" r="6" fill="#0d0b00" stroke="rgba(255,208,0,.28)" strokeWidth="1"/>
          <rect x="50" y="224" width="22" height="3" rx="1.5" fill="rgba(255,208,0,.1)"/>
          <rect x="40" y="248" width="42" height="11" rx="5.5" fill="url(#rb)" stroke="rgba(255,208,0,.18)" strokeWidth="1"/>
          <rect x="42" y="250" width="12" height="7" rx="3.5" fill="rgba(255,208,0,.14)"/>
        </g>
        {/* RIGHT LEG */}
        <g transform={`translate(99,203) rotate(${rightLegRot}) translate(-99,-203)`} style={{transformOrigin:"99px 203px"}}>
          <rect x="84" y="200" width="30" height="52" rx="10" fill="url(#rb)" stroke="rgba(255,208,0,.14)" strokeWidth="1"/>
          <circle cx="99" cy="218" r="6" fill="#0d0b00" stroke="rgba(255,208,0,.28)" strokeWidth="1"/>
          <rect x="88" y="224" width="22" height="3" rx="1.5" fill="rgba(255,208,0,.1)"/>
          <rect x="78" y="248" width="42" height="11" rx="5.5" fill="url(#rb)" stroke="rgba(255,208,0,.18)" strokeWidth="1"/>
          <rect x="106" y="250" width="12" height="7" rx="3.5" fill="rgba(255,208,0,.14)"/>
        </g>
      </g>
      <ellipse cx="80" cy={268-(jumping?2:0)} rx={jumping?18:28} ry={jumping?3:5} fill="rgba(255,208,0,.15)" style={{animation:"shadowPulse 1.2s ease-in-out infinite"}}/>
    </svg>
  );
};

// ─── FREE-ROAMING ROBOT ───────────────────────────────────────────────────────
const RoamingRobot=({mouseX,mouseY})=>{
  const W=110,H=180,EDGE=14;
  const posR=useRef({x:window.innerWidth-W-40,y:160});
  const velR=useRef({x:-0.4,y:0.3});
  const tgtR=useRef({x:window.innerWidth-W-40,y:160});
  const walkP=useRef(0),rafR=useRef(null),trailId=useRef(0),trailBuf=useRef(0);
  const [pos,setPos]=useState(posR.current);
  const [flip,setFlip]=useState(false);
  const [walkPhase,setWalkPhase]=useState(0);
  const [speed,setSpeed]=useState(0);
  const [eyeX,setEyeX]=useState(0);
  const [eyeY,setEyeY]=useState(0);
  const [headTilt,setHeadTilt]=useState(0);
  const [blink,setBlink]=useState(false);
  const [mouth,setMouth]=useState("idle");
  const [waving,setWaving]=useState(false);
  const [excited,setExcited]=useState(false);
  const [jumping,setJumping]=useState(false);
  const [scared,setScared]=useState(false);
  const [spinning,setSpinning]=useState(false);
  const [glow,setGlow]=useState(0.65);
  const [speech,setSpeech]=useState(null);
  const [floaties,setFloaties]=useState([]);
  const [trail,setTrail]=useState([]);
  const spKey=useRef(0);
  const floatKey=useRef(0);
  const clickCount=useRef(0);
  const clickTimer=useRef(null);
  const lastTouchRef=useRef(0);

  const pickTarget=()=>{
    const vw=window.innerWidth,vh=window.innerHeight,BAND=140;
    const opts=[
      {x:EDGE+Math.random()*BAND,y:EDGE+Math.random()*(vh-H-EDGE*2)},
      {x:vw-W-EDGE-Math.random()*BAND,y:EDGE+Math.random()*(vh-H-EDGE*2)},
      {x:EDGE+Math.random()*(vw-W-EDGE*2),y:EDGE+Math.random()*BAND},
      {x:EDGE+Math.random()*(vw-W-EDGE*2),y:vh-H-EDGE-Math.random()*BAND},
      {x:EDGE+Math.random()*80,y:EDGE+Math.random()*80},
      {x:vw-W-EDGE-Math.random()*80,y:EDGE+Math.random()*80},
      {x:EDGE+Math.random()*80,y:vh-H-EDGE-Math.random()*80},
      {x:vw-W-EDGE-Math.random()*80,y:vh-H-EDGE-Math.random()*80},
    ];
    return opts[Math.floor(Math.random()*opts.length)];
  };

  const LINES=["Hello! 👋","Always learning...","Building cool stuff!","I see you 👀","let me = explore()","More below! ↓","Hello World! 🌍","// TODO: be awesome","React + ❤️","Curiosity > Fear","git commit -m 'growth'","Stay curious!","DSA is fun!","Systems thinking!","Compiling ideas...","Keep going! 🚀","1% better daily","Ship it! 🛸"];
  const showSpeech=txt=>{setSpeech({txt,id:spKey.current++});setTimeout(()=>setSpeech(null),2800);};

  useEffect(()=>{let t;const blinker=()=>{setBlink(true);setTimeout(()=>setBlink(false),110);t=setTimeout(blinker,1400+Math.random()*4000);};t=setTimeout(blinker,1800);return()=>clearTimeout(t);},[]);

  useEffect(()=>{
    let t;
    const ev=()=>{
      const r=Math.random();
      if(r<0.2){setWaving(true);setMouth("happy");showSpeech(LINES[Math.floor(Math.random()*LINES.length)]);setTimeout(()=>{setWaving(false);setMouth("idle");},2200);}
      else if(r<0.38){setJumping(true);setExcited(true);setMouth("excited");setTimeout(()=>{setJumping(false);setExcited(false);setMouth("idle");},800);}
      else if(r<0.55){setMouth("surprised");showSpeech(LINES[Math.floor(Math.random()*LINES.length)]);setTimeout(()=>setMouth("idle"),1600);}
      else if(r<0.70){setExcited(true);setMouth("happy");setTimeout(()=>{setExcited(false);setMouth("idle");},1200);}
      else{velR.current={x:(Math.random()-.5)*7,y:(Math.random()-.5)*6};tgtR.current=pickTarget();}
      t=setTimeout(ev,2500+Math.random()*4500);
    };
    t=setTimeout(ev,3000);return()=>clearTimeout(t);
  },[]);

  useEffect(()=>{
    const id=setInterval(()=>{
      const p=posR.current,cx=p.x+W/2,cy=p.y+H*0.26;
      const dx=mouseX.current-cx,dy=mouseY.current-cy,d=Math.sqrt(dx*dx+dy*dy)||1,MAX=4.2;
      setEyeX(Math.max(-MAX,Math.min(MAX,dx/d*Math.min(d*.04,MAX))));
      setEyeY(Math.max(-MAX,Math.min(MAX,dy/d*Math.min(d*.036,MAX))));
      setHeadTilt(Math.max(-7,Math.min(7,dx*0.01)));
    },16);
    return()=>clearInterval(id);
  },[]);

  useEffect(()=>{
    const SPEED=2.6,ACCEL=0.075,FRIC=0.958;
    tgtR.current=pickTarget();
    const loop=()=>{
      const p=posR.current,v=velR.current,t=tgtR.current;
      const vw=window.innerWidth,vh=window.innerHeight;
      const dx=t.x-p.x,dy=t.y-p.y,d=Math.sqrt(dx*dx+dy*dy)||1;
      v.x+=((dx/d)*SPEED-v.x)*ACCEL;v.y+=((dy/d)*SPEED-v.y)*ACCEL;
      v.x*=FRIC;v.y*=FRIC;p.x+=v.x;p.y+=v.y;
      const maxX=vw-W-EDGE,maxY=vh-H-EDGE;
      if(p.x<EDGE){p.x=EDGE;v.x=Math.abs(v.x)*.55;}
      if(p.x>maxX){p.x=maxX;v.x=-Math.abs(v.x)*.55;}
      if(p.y<EDGE){p.y=EDGE;v.y=Math.abs(v.y)*.55;}
      if(p.y>maxY){p.y=maxY;v.y=-Math.abs(v.y)*.55;}
      if(d<14)tgtR.current=pickTarget();
      const spd=Math.sqrt(v.x*v.x+v.y*v.y),norm=Math.min(spd/SPEED,1);
      walkP.current+=spd*0.075;
      setPos({x:p.x,y:p.y});setFlip(v.x<-0.3);setSpeed(norm);setWalkPhase(walkP.current);setGlow(0.48+norm*0.7);
      trailBuf.current++;
      if(trailBuf.current>=4){trailBuf.current=0;const tid=trailId.current++;setTrail(prev=>[...prev.slice(-12),{x:p.x+W/2,y:p.y+H*0.85,id:tid,s:spd}]);}
      rafR.current=requestAnimationFrame(loop);
    };
    rafR.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(rafR.current);
  },[]);

  useEffect(()=>{const onS=()=>{tgtR.current=pickTarget();};window.addEventListener("scroll",onS,{passive:true});return()=>window.removeEventListener("scroll",onS);},[]);

  // Spawn a floating emoji above the robot
  const spawnFloatie=(emoji)=>{
    const id=floatKey.current++;
    setFloaties(prev=>[...prev.slice(-6),{emoji,id}]);
    setTimeout(()=>setFloaties(prev=>prev.filter(f=>f.id!==id)),1200);
  };

  // Core interaction — called by both click and touch
  const handleInteract=(e)=>{
    // Prevent double-fire on mobile (touchstart + click)
    const now=Date.now();
    if(now-lastTouchRef.current<350)return;
    lastTouchRef.current=now;

    // Count rapid clicks for combo
    clickCount.current+=1;
    clearTimeout(clickTimer.current);
    clickTimer.current=setTimeout(()=>{clickCount.current=0;},600);

    const count=clickCount.current;

    if(count>=5){
      // ── COMBO: 5 rapid clicks → dizzy spin
      setSpinning(true);setMouth("surprised");
      spawnFloatie("💫");spawnFloatie("⭐");
      showSpeech("Woah woah woah!!! 😵");
      velR.current={x:(Math.random()-.5)*18,y:(Math.random()-.5)*15};
      tgtR.current=pickTarget();
      setTimeout(()=>{setSpinning(false);setMouth("idle");clickCount.current=0;},1200);
    } else if(count===4){
      // ── 4 clicks → scared, runs away fast
      setScared(true);setMouth("surprised");
      spawnFloatie("😱");
      showSpeech("Okay okay I'm going!! 😰");
      velR.current={x:(Math.random()>.5?1:-1)*16,y:(Math.random()-.5)*10};
      tgtR.current=pickTarget();
      setTimeout(()=>{setScared(false);setMouth("idle");},1500);
    } else if(count===3){
      // ── triple-click → jump + hearts
      setJumping(true);setExcited(true);setMouth("excited");
      spawnFloatie("❤️");spawnFloatie("✨");
      showSpeech("You really like me! 🥹");
      setTimeout(()=>{setJumping(false);setExcited(false);setMouth("idle");},900);
    } else if(count===2){
      // ── double-click → wave + speech
      setWaving(true);setMouth("happy");
      spawnFloatie("👋");
      showSpeech(LINES[Math.floor(Math.random()*LINES.length)]);
      velR.current={x:(Math.random()-.5)*8,y:(Math.random()-.5)*7};
      tgtR.current=pickTarget();
      setTimeout(()=>{setWaving(false);setMouth("idle");},1800);
    } else {
      // ── single click → small fling + reaction
      const reactions=[
        ()=>{setMouth("surprised");spawnFloatie("❗");showSpeech("Hey! 👀");setTimeout(()=>setMouth("idle"),1000);},
        ()=>{setJumping(true);setMouth("excited");spawnFloatie("🚀");setTimeout(()=>{setJumping(false);setMouth("idle");},700);},
        ()=>{setWaving(true);setMouth("happy");spawnFloatie("😄");showSpeech(LINES[Math.floor(Math.random()*LINES.length)]);setTimeout(()=>{setWaving(false);setMouth("idle");},1600);},
        ()=>{setExcited(true);setMouth("happy");spawnFloatie("⚡");setTimeout(()=>{setExcited(false);setMouth("idle");},900);},
        ()=>{setMouth("surprised");spawnFloatie("💡");showSpeech("Just building! 🛠️");setTimeout(()=>setMouth("idle"),1200);},
      ];
      reactions[Math.floor(Math.random()*reactions.length)]();
      velR.current={x:(Math.random()-.5)*10,y:(Math.random()-.5)*9};
      tgtR.current=pickTarget();
    }
  };

  // Mouse hover proximity — robot gets nervous when cursor is very close
  useEffect(()=>{
    const onMove=e=>{
      const p=posR.current;
      const dx=e.clientX-(p.x+W/2), dy=e.clientY-(p.y+H/2);
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<60 && !scared){
        // Flee from cursor
        velR.current.x-=dx/dist*1.2;
        velR.current.y-=dy/dist*1.2;
      }
    };
    window.addEventListener("mousemove",onMove,{passive:true});
    return()=>window.removeEventListener("mousemove",onMove);
  },[]);

  return(<>
    {trail.map(t=>(
      <div key={t.id} style={{position:"fixed",left:t.x-5,top:t.y-4,width:10+t.s,height:6+t.s*0.4,borderRadius:"50%",background:`rgba(255,208,0,${0.12+t.s*.03})`,pointerEvents:"none",zIndex:8970,animation:"trailFade 0.7s ease forwards"}}/>
    ))}
    <div
      onClick={handleInteract}
      onTouchStart={e=>{e.preventDefault();handleInteract(e);}}
      data-hover
      style={{
        position:"fixed",left:pos.x,top:pos.y,zIndex:9000,cursor:"pointer",userSelect:"none",
        willChange:"left,top",
        "--fx": flip?-1:1,
        transform: spinning
          ? `scaleX(${flip?-1:1})`
          : scared
            ? `scaleX(${flip?-1:1})`
            : `scaleX(${flip?-1:1})`,
        animation: spinning
          ? "spinOnce 0.55s ease forwards"
          : scared
            ? "scaredShake 0.45s ease"
            : jumping
              ? "popBounce 0.4s ease"
              : "none",
        transformOrigin:"center bottom",
        touchAction:"none",
      }}>
      {/* Glow halo — brighter when excited/scared */}
      <div style={{position:"absolute",inset:"-20px",background:`radial-gradient(ellipse at 50% 45%, rgba(255,208,0,${scared?0.35:glow*.16}) 0%, rgba(255,170,0,${glow*.07}) 50%, transparent 72%)`,pointerEvents:"none",transition:"background .2s"}}/>

      {/* Floating emoji burst */}
      {floaties.map(f=>(
        <div key={f.id} style={{position:"absolute",bottom:"100%",left:"50%",fontSize:20,pointerEvents:"none",zIndex:2,animation:"floatEmoji 1.1s ease forwards",transform:"translateX(-50%)"}}>{f.emoji}</div>
      ))}

      {speech&&(
        <div key={speech.id} style={{position:"absolute",bottom:"calc(100% + 28px)",left:"50%",background:"rgba(10,9,0,0.97)",border:"1px solid rgba(255,208,0,.5)",borderRadius:12,padding:"6px 14px",fontSize:12,fontFamily:"var(--font-body)",color:"var(--text)",whiteSpace:"nowrap",backdropFilter:"blur(16px)",boxShadow:"0 4px 24px rgba(255,208,0,.25)",animation:"zoomOut .3s ease forwards",zIndex:3,pointerEvents:"none",transform:flip?"translateX(-50%) scaleX(-1)":"translateX(-50%)"}}>
          {speech.txt}
          <div style={{position:"absolute",bottom:-6,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"5px solid transparent",borderRight:"5px solid transparent",borderTop:"6px solid rgba(255,208,0,.5)"}}/>
        </div>
      )}
      <AnimatedRobot eyeX={eyeX} eyeY={eyeY} headTilt={headTilt} blink={blink} mouth={scared?"surprised":mouth} walkPhase={walkPhase} speed={scared?1:speed} jumping={jumping} waving={waving} excited={excited||scared} glow={scared?1.3:glow} size={110}/>
      <div style={{textAlign:"center",marginTop:0,fontFamily:"var(--font-mono)",fontSize:8,color:"var(--accent)",opacity:0.5,letterSpacing:"0.13em",pointerEvents:"none",transform:flip?"scaleX(-1)":"none"}}>Unit-01</div>
    </div>
  </>);
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
const Nav=({scrolled})=>(
  <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid var(--border)":"none",background:scrolled?"rgba(10,9,0,.92)":"transparent",transition:"all .4s ease"}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)",animation:"pulse-glow 2s infinite"}}/>
      <span className="syne" style={{fontSize:16,fontWeight:700,letterSpacing:".05em"}}>KG</span>
      <span className="mono" style={{fontSize:10,color:"var(--text2)",letterSpacing:".1em"}}>v1.0</span>
    </div>
    <div style={{display:"flex",gap:32}}>
      {["About","Skills","Contact"].map(l=>(
        <a key={l} href={`#${l.toLowerCase()}`} data-hover style={{color:"var(--text2)",textDecoration:"none",fontSize:13,fontWeight:500,letterSpacing:".05em",transition:"color .2s"}}
          onMouseEnter={e=>e.target.style.color="var(--accent)"} onMouseLeave={e=>e.target.style.color="var(--text2)"}>{l}</a>
      ))}
    </div>
  </nav>
);

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero=({mouseX,mouseY})=>{
  const [ld,setLd]=useState(false);
  useEffect(()=>{setTimeout(()=>setLd(true),100);},[]);
  return(
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",padding:"100px 40px 60px"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,208,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,208,0,.025) 1px,transparent 1px)",backgroundSize:"40px 40px",animation:"gridMove 20s linear infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 65% 70% at 50% 45%, rgba(255,208,0,.06) 0%, rgba(255,170,0,.03) 40%, transparent 70%)",pointerEvents:"none"}}/>
      <ParticleField mouseX={mouseX} mouseY={mouseY}/>
      <div style={{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:100,border:"1px solid var(--border2)",background:"rgba(255,208,0,.05)",marginBottom:32,opacity:ld?1:0,transform:ld?"none":"translateY(20px)",transition:"all .8s ease .1s"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent3)",animation:"pulse-glow 2s infinite"}}/>
          <span className="mono" style={{fontSize:11,color:"var(--text2)",letterSpacing:".12em"}}>AVAILABLE FOR COLLABORATION</span>
        </div>
        <h1 className="syne" style={{fontSize:"clamp(44px,7.5vw,88px)",fontWeight:800,lineHeight:1.0,letterSpacing:"-.03em",marginBottom:28,opacity:ld?1:0,transform:ld?"none":"translateY(30px)",transition:"all .9s ease .2s"}}>
          BUILDING<br/>
          <span style={{background:"linear-gradient(135deg,#ffd000 0%,#ffaa00 50%,#ffe566 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>IDEAS INTO</span><br/>
          REALITY
        </h1>
        <div style={{opacity:ld?1:0,transform:ld?"none":"translateY(20px)",transition:"all .9s ease .3s"}}>
          <p style={{fontSize:18,color:"var(--text2)",lineHeight:1.7,marginBottom:8,fontWeight:300}}>Curious Builder. Aspiring Software Engineer. Problem Solver.</p>
          <p style={{fontSize:14,color:"var(--text3)",lineHeight:1.85,maxWidth:460,marginBottom:40}}>I don't just learn technology. I enjoy understanding systems, solving problems, and turning ideas into reality.</p>
        </div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap",opacity:ld?1:0,transform:ld?"none":"translateY(20px)",transition:"all .9s ease .4s"}}>
          <button data-hover onClick={()=>document.querySelector('#skills')?.scrollIntoView({behavior:'smooth'})} style={{padding:"14px 32px",borderRadius:100,background:"var(--accent)",border:"none",color:"#0a0900",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:".05em",fontFamily:"var(--font-body)",boxShadow:"0 0 36px rgba(255,208,0,.35)",transition:"transform .2s,box-shadow .2s"}}
            onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow="0 8px 40px rgba(255,208,0,.55)"}}
            onMouseLeave={e=>{e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 0 36px rgba(255,208,0,.35)"}}>Explore Portfolio</button>
          <button data-hover onClick={()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})} style={{padding:"14px 32px",borderRadius:100,background:"transparent",border:"1px solid var(--border2)",color:"var(--text)",fontSize:14,fontWeight:500,cursor:"pointer",letterSpacing:".05em",fontFamily:"var(--font-body)",transition:"all .2s"}}
            onMouseEnter={e=>{e.target.style.borderColor="var(--accent)";e.target.style.color="var(--accent)"}}
            onMouseLeave={e=>{e.target.style.borderColor="var(--border2)";e.target.style.color="var(--text)"}}>Contact Me</button>
        </div>
        <div style={{display:"flex",gap:10,marginTop:48,flexWrap:"wrap",opacity:ld?1:0,transition:"opacity 1s ease .6s"}}>
          {["Maharashtra, India","Class XII","Future Engineer","Builder"].map(t=>(
            <span key={t} className="mono" style={{fontSize:10,color:"var(--text3)",padding:"4px 12px",borderRadius:100,border:"1px solid var(--border)",letterSpacing:".1em"}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,opacity:.35}}>
        <span className="mono" style={{fontSize:9,letterSpacing:".2em",color:"var(--text3)"}}>SCROLL</span>
        <div style={{width:1,height:40,background:"linear-gradient(to bottom,var(--accent),transparent)",animation:"float 2s ease-in-out infinite"}}/>
      </div>
    </section>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const About=()=>{
  const stages=[
    {num:"01",title:"Curiosity",color:"#ffd000",year:"The Beginning",desc:"Started questioning how things work. Why does software behave this way? What makes a great product? Curiosity became the foundation."},
    {num:"02",title:"Discovery",color:"#ffaa00",year:"The Spark",desc:"Discovered the world of technology — programming languages, systems, the internet. Every new concept opened another door worth exploring."},
    {num:"03",title:"Learning to Build",color:"#ffe566",year:"The Builder",desc:"Moved from consuming to creating. Started with C++ and DSA, then frontend development. Learning through building is the fastest path."},
    {num:"04",title:"Engineering Mindset",color:"#fff0a0",year:"Now",desc:"Thinking in systems. Understanding products, user experience, and the why behind decisions. Developing taste and technical foundation simultaneously."},
  ];
  return(
    <section id="about" style={{padding:"120px 40px",maxWidth:1200,margin:"0 auto"}}>
      <div className="reveal-on-scroll">
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}><div style={{width:32,height:1,background:"var(--accent)"}}/><span className="mono" style={{fontSize:11,color:"var(--accent)",letterSpacing:".2em"}}>ORIGIN STORY</span></div>
        <h2 className="syne" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:800,marginBottom:80,letterSpacing:"-.02em"}}>The Journey<br/><span style={{color:"var(--text3)"}}>So Far</span></h2>
      </div>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:1,background:"linear-gradient(to bottom,var(--accent),var(--accent2),transparent)",opacity:.3}}/>
        {stages.map((s,i)=>(
          <div key={i} className="reveal-on-scroll" style={{display:"flex",gap:40,paddingLeft:40,paddingBottom:60,position:"relative",transitionDelay:`${i*.15}s`}}>
            <div style={{position:"absolute",left:-8,top:8,width:17,height:17,borderRadius:"50%",background:s.color,boxShadow:`0 0 18px ${s.color}`,border:"3px solid var(--bg)"}}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:12}}>
                <span className="mono" style={{fontSize:11,color:"var(--text3)",letterSpacing:".15em"}}>{s.num}</span>
                <span className="mono" style={{fontSize:10,color:s.color,padding:"3px 10px",borderRadius:100,border:`1px solid ${s.color}30`,letterSpacing:".1em"}}>{s.year}</span>
              </div>
              <h3 className="syne" style={{fontSize:28,fontWeight:700,marginBottom:12,color:s.color}}>{s.title}</h3>
              <p style={{color:"var(--text2)",lineHeight:1.8,maxWidth:480,fontSize:15}}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── BUILDING IN PUBLIC ───────────────────────────────────────────────────────
const BuildingInPublic=()=>{
  const bps=[{label:"Project Alpha",type:"Web App",progress:12},{label:"Project Beta",type:"Tool / Utility",progress:5},{label:"Project Gamma",type:"Experiment",progress:3}];
  return(
    <section style={{padding:"120px 40px",background:"var(--surface)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,208,0,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,208,0,.03) 1px,transparent 1px)",backgroundSize:"32px 32px",pointerEvents:"none"}}/>
      <div style={{maxWidth:1200,margin:"0 auto",position:"relative",zIndex:1}}>
        <div className="reveal-on-scroll" style={{textAlign:"center",marginBottom:80}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 20px",borderRadius:100,border:"1px solid rgba(255,208,0,.25)",background:"rgba(255,208,0,.04)",marginBottom:24}}>
            <span>🚧</span><span className="mono" style={{fontSize:11,color:"var(--accent)",letterSpacing:".15em"}}>TO BE UPDATED</span>
          </div>
          <h2 className="syne" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:800,marginBottom:20,letterSpacing:"-.02em"}}>Building in Public</h2>
          <p style={{color:"var(--text2)",maxWidth:540,margin:"0 auto",lineHeight:1.8,fontSize:15}}>This section intentionally remains unfinished. Currently focused on learning, experimenting, and building projects worth showcasing.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24,marginBottom:60}}>
          {bps.map((bp,i)=>(
            <div key={i} className="reveal-on-scroll" style={{transitionDelay:`${i*.1}s`,padding:32,borderRadius:16,border:"1px solid var(--border)",background:"rgba(255,208,0,.015)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:12,left:12,width:20,height:20,borderTop:"1px solid var(--accent)",borderLeft:"1px solid var(--accent)",opacity:.4}}/>
              <div style={{position:"absolute",bottom:12,right:12,width:20,height:20,borderBottom:"1px solid var(--accent)",borderRight:"1px solid var(--accent)",opacity:.4}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
                <div><div className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:".15em",marginBottom:8}}>{bp.type}</div><div className="syne" style={{fontSize:18,fontWeight:700,color:"var(--text2)"}}>{bp.label}</div></div>
                <div style={{padding:"4px 10px",borderRadius:6,background:"rgba(255,208,0,.08)",border:"1px solid rgba(255,208,0,.18)"}}><span className="mono" style={{fontSize:9,color:"var(--accent)",letterSpacing:".1em"}}>FORMING</span></div>
              </div>
              <div style={{marginBottom:20}}>
                {[0,1,2,3].map(j=>(<div key={j} style={{height:6,borderRadius:3,background:"rgba(255,208,0,.07)",marginBottom:8,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,width:`${bp.progress+j*5}%`,background:"rgba(255,208,0,.2)",borderRadius:3,animation:"constructLine 2s ease forwards",animationDelay:`${j*.2+i*.3}s`}}/></div>))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span className="mono" style={{fontSize:10,color:"var(--text3)"}}>In progress...</span>
                <span className="mono" style={{fontSize:10,color:"var(--accent)",opacity:.6}}>{bp.progress}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="reveal-on-scroll" style={{textAlign:"center",padding:40,borderRadius:16,border:"1px solid var(--border)",background:"rgba(255,208,0,.015)"}}>
          <p style={{fontSize:15,color:"var(--text2)",lineHeight:1.8,fontStyle:"italic"}}>Rather than filling this portfolio with tutorial clones, I only want to display work I'm genuinely proud of.<br/><span style={{color:"var(--accent)",fontStyle:"normal"}}>Future work will appear here.</span></p>
        </div>
      </div>
    </section>
  );
};

// ─── SKILLS CONSTELLATION ─────────────────────────────────────────────────────
const SkillsConstellation=()=>{
  const [active,setActive]=useState(null);
  const nodes=[
    {id:"cpp",label:"C++",x:50,y:18,connections:["dsa","algo"],color:"#ffd000",level:"Foundation"},
    {id:"dsa",label:"DSA",x:25,y:36,connections:["cpp","algo","js"],color:"#ffaa00",level:"Core"},
    {id:"algo",label:"Algorithms",x:72,y:36,connections:["cpp","dsa"],color:"#ffaa00",level:"Core"},
    {id:"react",label:"React",x:14,y:62,connections:["js","ts","html","css"],color:"#ffe566",level:"Frontend"},
    {id:"js",label:"JavaScript",x:38,y:58,connections:["react","ts","html"],color:"#ffd000",level:"Language"},
    {id:"ts",label:"TypeScript",x:62,y:58,connections:["js","react"],color:"#ffcc00",level:"Language"},
    {id:"html",label:"HTML",x:20,y:80,connections:["css","react","js"],color:"#ffb300",level:"Web"},
    {id:"css",label:"CSS",x:42,y:80,connections:["html","react"],color:"#ffe566",level:"Web"},
    {id:"git",label:"Git",x:80,y:70,connections:["cpp","js"],color:"#ffaa00",level:"Tool"},
    {id:"ps",label:"Problem Solving",x:60,y:88,connections:["dsa","algo"],color:"#fff0a0",level:"Mindset"},
    {id:"pt",label:"Product Thinking",x:86,y:44,connections:["ps"],color:"#ffd000",level:"Mindset"},
  ];
  const gn=id=>nodes.find(n=>n.id===id);
  const an=active?gn(active):null;
  const ci=an?new Set([active,...an.connections]):new Set();
  return(
    <section id="skills" style={{padding:"120px 40px",maxWidth:1200,margin:"0 auto"}}>
      <div className="reveal-on-scroll" style={{marginBottom:60}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}><div style={{width:32,height:1,background:"var(--accent)"}}/><span className="mono" style={{fontSize:11,color:"var(--accent)",letterSpacing:".2em"}}>KNOWLEDGE MAP</span></div>
        <h2 className="syne" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:800,letterSpacing:"-.02em"}}>Skills<br/><span style={{color:"var(--text3)"}}>Constellation</span></h2>
        <p style={{color:"var(--text2)",marginTop:16,fontSize:14}}>Hover nodes to reveal connections</p>
      </div>
      <div className="reveal-on-scroll" style={{position:"relative",height:520,background:"var(--surface)",borderRadius:24,border:"1px solid var(--border)",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,208,0,.05) 1px,transparent 1px)",backgroundSize:"32px 32px"}}/>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
          {nodes.map(n=>n.connections.map(cid=>{const t=gn(cid);if(!t||n.id>cid)return null;const ia=active&&(ci.has(n.id)&&ci.has(cid));return <line key={`${n.id}-${cid}`} x1={`${n.x}%`} y1={`${n.y}%`} x2={`${t.x}%`} y2={`${t.y}%`} stroke={ia?n.color:"rgba(255,208,0,.06)"} strokeWidth={ia?2:1} style={{transition:"all .3s ease"}}/>;}))}
        </svg>
        {nodes.map(n=>{
          const ia=active===n.id,ic=ci.has(n.id),dim=active&&!ic;
          return(<div key={n.id} data-hover onMouseEnter={()=>setActive(n.id)} onMouseLeave={()=>setActive(null)} style={{position:"absolute",left:`${n.x}%`,top:`${n.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:10,transition:"all .3s ease",opacity:dim?.2:1}}>
            <div style={{padding:ia?"12px 20px":"8px 16px",borderRadius:100,background:ia?`${n.color}18`:"rgba(255,255,255,.02)",border:`1px solid ${ia||ic?n.color:"rgba(255,208,0,.1)"}`,backdropFilter:"blur(10px)",boxShadow:ia?`0 0 24px ${n.color}40`:"none",transition:"all .3s ease",whiteSpace:"nowrap"}}>
              <span className="syne" style={{fontSize:ia?13:12,fontWeight:700,color:ia?n.color:"var(--text2)",transition:"all .3s"}}>{n.label}</span>
              {ia&&<div className="mono" style={{fontSize:9,color:n.color,opacity:.7,textAlign:"center",marginTop:2,letterSpacing:".1em"}}>{n.level}</div>}
            </div>
          </div>);
        })}
      </div>
    </section>
  );
};

// ─── ENGINEERING MINDSET ─────────────────────────────────────────────────────
const EngineeringMindset=()=>{
  const ps=[
    {num:"I",text:"Build before I feel ready.",sub:"Action creates clarity. Thinking too long is a trap.",icon:"⚡"},
    {num:"II",text:"Learn through execution.",sub:"Building teaches what reading cannot.",icon:"⚙"},
    {num:"III",text:"Solve meaningful problems.",sub:"Technology should serve people, not itself.",icon:"◎"},
    {num:"IV",text:"UX matters as much as code.",sub:"Code that doesn't serve users is incomplete code.",icon:"◈"},
    {num:"V",text:"Understand systems deeply.",sub:"Surface knowledge creates fragile solutions.",icon:"◆"},
    {num:"VI",text:"Consistency beats intensity.",sub:"1% better every day compounds into mastery.",icon:"◉"},
  ];
  return(
    <section style={{padding:"120px 40px",background:"var(--surface)"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div className="reveal-on-scroll" style={{marginBottom:60}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}><div style={{width:32,height:1,background:"var(--accent2)"}}/><span className="mono" style={{fontSize:11,color:"var(--accent2)",letterSpacing:".2em"}}>PRINCIPLES</span></div>
          <h2 className="syne" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:800,letterSpacing:"-.02em"}}>Engineering<br/><span style={{color:"var(--text3)"}}>Mindset</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {ps.map((p,i)=>(
            <div key={i} className="reveal-on-scroll" data-hover style={{transitionDelay:`${i*.1}s`,padding:32,borderRadius:16,border:"1px solid var(--border)",background:"var(--surface2)",position:"relative",overflow:"hidden",cursor:"default",transition:"border-color .3s,transform .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,208,0,.3)";e.currentTarget.style.transform="translateY(-4px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)"}}>
              <div style={{position:"absolute",top:20,right:24}}><span className="syne" style={{fontSize:32,fontWeight:800,color:"rgba(255,208,0,.06)"}}>{p.num}</span></div>
              <div style={{fontSize:24,marginBottom:16}}>{p.icon}</div>
              <p className="syne" style={{fontSize:17,fontWeight:700,marginBottom:8,lineHeight:1.4}}>{p.text}</p>
              <p style={{fontSize:13,color:"var(--text3)",lineHeight:1.6}}>{p.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── TECHNOLOGIES ─────────────────────────────────────────────────────────────
const Technologies=()=>{
  const ts=[{name:"C++",cat:"Language",glyph:"C++"},{name:"Data Structures",cat:"CS Fundamentals",glyph:"DSA"},{name:"Algorithms",cat:"CS Fundamentals",glyph:"ALG"},{name:"React",cat:"Framework",glyph:"Re"},{name:"JavaScript",cat:"Language",glyph:"JS"},{name:"TypeScript",cat:"Language",glyph:"TS"},{name:"HTML5",cat:"Markup",glyph:"<>"},{name:"CSS3",cat:"Styling",glyph:"css"},{name:"Git",cat:"Version Control",glyph:"git"},{name:"Frontend Dev",cat:"Domain",glyph:"UI"}];
  return(
    <section style={{padding:"120px 40px",maxWidth:1200,margin:"0 auto"}}>
      <div className="reveal-on-scroll" style={{marginBottom:60}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}><div style={{width:32,height:1,background:"var(--accent3)"}}/><span className="mono" style={{fontSize:11,color:"var(--accent3)",letterSpacing:".2em"}}>EXPLORED</span></div>
        <h2 className="syne" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:800,letterSpacing:"-.02em"}}>Technologies &<br/><span style={{color:"var(--text3)"}}>Concepts</span></h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
        {ts.map((t,i)=>(<div key={i} className="reveal-on-scroll" data-hover style={{transitionDelay:`${i*.05}s`,padding:24,borderRadius:14,border:"1px solid var(--border)",background:"var(--surface)",cursor:"default",transition:"border-color .3s,background .3s,transform .3s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,208,0,.3)";e.currentTarget.style.background="var(--surface2)";e.currentTarget.style.transform="translateY(-3px)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--surface)";e.currentTarget.style.transform="translateY(0)"}}>
          <div className="syne" style={{fontSize:28,fontWeight:800,color:"rgba(255,208,0,.14)",marginBottom:16,letterSpacing:"-.02em"}}>{t.glyph}</div>
          <div className="syne" style={{fontSize:15,fontWeight:700,marginBottom:4}}>{t.name}</div>
          <div className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:".1em"}}>{t.cat}</div>
        </div>))}
      </div>
    </section>
  );
};

// ─── METRICS ─────────────────────────────────────────────────────────────────
const Counter=({target,suffix=""})=>{
  const [n,setN]=useState(0);const ref=useRef(null);const done=useRef(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!done.current){done.current=true;let s=0;const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/2000,1);setN(Math.floor((1-Math.pow(1-p,3))*target));if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);}},{threshold:.5});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[target]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
};
const Metrics=()=>(
  <section style={{padding:"80px 40px",background:"var(--surface)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
    <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:40}}>
      {[{v:800,s:"+",l:"Hours Learning",sub:"Invested in growth"},{v:300,s:"+",l:"Problems Solved",sub:"DSA & algorithms"},{v:40,s:"+",l:"Concepts Explored",sub:"Across CS domains"},{v:8,s:"",l:"Technologies",sub:"Currently learning"}].map((m,i)=>(
        <div key={i} style={{textAlign:"center",padding:20}}>
          <div className="syne" style={{fontSize:"clamp(40px,5vw,60px)",fontWeight:800,background:"linear-gradient(135deg,#ffd000,#ffaa00)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",marginBottom:8}}><Counter target={m.v} suffix={m.s}/></div>
          <div className="syne" style={{fontSize:16,fontWeight:600,marginBottom:4}}>{m.l}</div>
          <div className="mono" style={{fontSize:11,color:"var(--text3)",letterSpacing:".1em"}}>{m.sub}</div>
        </div>
      ))}
    </div>
  </section>
);

// ─── PHILOSOPHY ───────────────────────────────────────────────────────────────
const Philosophy=()=>(
  <section style={{padding:"160px 40px",position:"relative",overflow:"hidden",textAlign:"center"}}>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(270deg,rgba(255,208,0,.05),rgba(255,170,0,.04),rgba(255,230,80,.03),rgba(255,208,0,.05))",backgroundSize:"400% 400%",animation:"aurora 12s ease infinite",pointerEvents:"none"}}/>
    <div style={{position:"absolute",inset:0,backdropFilter:"blur(80px)",pointerEvents:"none"}}/>
    <div style={{maxWidth:800,margin:"0 auto",position:"relative",zIndex:1}}>
      <div className="reveal-on-scroll">
        <div style={{width:48,height:1,background:"linear-gradient(to right,transparent,var(--accent))",margin:"0 auto 32px"}}/>
        <blockquote className="syne" style={{fontSize:"clamp(24px,4vw,44px)",fontWeight:700,lineHeight:1.3,letterSpacing:"-.02em",marginBottom:32}}>
          "Great software isn't just code.<br/>
          <span style={{background:"linear-gradient(135deg,#ffd000,#ffaa00)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>It's understanding people,<br/>problems, and possibilities."</span>
        </blockquote>
        <div style={{width:48,height:1,background:"linear-gradient(to left,transparent,var(--accent))",margin:"0 auto"}}/>
      </div>
    </div>
  </section>
);

// ─── CONTACT — full-width, Google Apps Script ready ──────────────────────────
// Replace SCRIPT_URL with your deployed Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

const Contact=()=>{
  const [fd,setFd]=useState({name:"",email:"",message:""});
  const [status,setStatus]=useState("idle"); // idle | sending | sent | error

  const handleSubmit=async()=>{
    if(!fd.name||!fd.email||!fd.message)return;
    setStatus("sending");
    try{
      // Google Apps Script expects form-encoded or JSON POST
      // The script must have doPost(e) and return ContentService response
      await fetch(SCRIPT_URL,{
        method:"POST",
        mode:"no-cors", // GAS requires no-cors for cross-origin POST
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:fd.name,email:fd.email,message:fd.message,timestamp:new Date().toISOString()}),
      });
      // no-cors means we can't read the response, so assume success
      setStatus("sent");
      setFd({name:"",email:"",message:""});
      setTimeout(()=>setStatus("idle"),4000);
    }catch(err){
      setStatus("error");
      setTimeout(()=>setStatus("idle"),3000);
    }
  };

  const links=[
    {label:"Email",value:"kartik@example.com",icon:"✉",href:"mailto:kartik@example.com"},
    {label:"GitHub",value:"github.com/kartik",icon:"◈",href:"https://github.com"},
    {label:"LinkedIn",value:"linkedin.com/in/kartik",icon:"◆",href:"https://linkedin.com"},
  ];

  const inputStyle={
    width:"100%",padding:"14px 18px",borderRadius:10,
    border:"1px solid var(--border2)",background:"rgba(255,208,0,.03)",
    color:"var(--text)",fontSize:14,fontFamily:"var(--font-body)",
    outline:"none",transition:"border-color .2s, background .2s",
  };

  return(
    <section id="contact" style={{padding:"120px 40px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(270deg,rgba(255,208,0,.06),rgba(255,170,0,.04),rgba(255,230,80,.03))",backgroundSize:"400% 400%",animation:"aurora 10s ease infinite",pointerEvents:"none"}}/>
      <div style={{maxWidth:860,margin:"0 auto",position:"relative",zIndex:1}}>

        {/* Header */}
        <div className="reveal-on-scroll" style={{textAlign:"center",marginBottom:72}}>
          <div style={{display:"flex",alignItems:"center",gap:16,justifyContent:"center",marginBottom:20}}>
            <div style={{width:32,height:1,background:"var(--accent)"}}/><span className="mono" style={{fontSize:11,color:"var(--accent)",letterSpacing:".2em"}}>GET IN TOUCH</span><div style={{width:32,height:1,background:"var(--accent)"}}/>
          </div>
          <h2 className="syne" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:800,letterSpacing:"-.02em",marginBottom:16}}>
            Let's Build Something<br/>
            <span style={{background:"linear-gradient(135deg,#ffd000,#ffaa00)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Meaningful.</span>
          </h2>
          <p style={{color:"var(--text2)",fontSize:15}}>Open to conversations about technology, ideas, and collaboration.</p>
        </div>

        {/* Social links row */}
        <div className="reveal-on-scroll" style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:64}}>
          {links.map((l,i)=>(
            <a key={i} href={l.href} data-hover style={{display:"flex",alignItems:"center",gap:12,padding:"14px 24px",borderRadius:12,border:"1px solid var(--border)",background:"var(--surface)",textDecoration:"none",color:"var(--text)",transition:"all .2s",flex:"1 1 200px",maxWidth:260}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,208,0,.35)";e.currentTarget.style.background="var(--surface2)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--surface)"}}>
              <span style={{fontSize:20,color:"var(--accent)",width:26,flexShrink:0}}>{l.icon}</span>
              <div>
                <div className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:".1em",marginBottom:2}}>{l.label}</div>
                <div style={{fontSize:13,color:"var(--text2)"}}>{l.value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Message form — full width, centered */}
        <div className="reveal-on-scroll" style={{transitionDelay:".15s",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,padding:"48px",maxWidth:640,margin:"0 auto"}}>
          <h3 className="syne" style={{fontSize:18,fontWeight:700,marginBottom:32,textAlign:"center",color:"var(--text)"}}>Send a Message</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <input placeholder="Your name" value={fd.name} onChange={e=>setFd(f=>({...f,name:e.target.value}))}
              style={inputStyle}
              onFocus={e=>{e.target.style.borderColor="var(--accent)";e.target.style.background="rgba(255,208,0,.05)"}}
              onBlur={e=>{e.target.style.borderColor="var(--border2)";e.target.style.background="rgba(255,208,0,.03)"}}/>
            <input placeholder="Your email" value={fd.email} onChange={e=>setFd(f=>({...f,email:e.target.value}))}
              style={inputStyle}
              onFocus={e=>{e.target.style.borderColor="var(--accent)";e.target.style.background="rgba(255,208,0,.05)"}}
              onBlur={e=>{e.target.style.borderColor="var(--border2)";e.target.style.background="rgba(255,208,0,.03)"}}/>
          </div>
          <textarea placeholder="Your message — ideas, collaborations, just saying hi..." rows={5}
            value={fd.message} onChange={e=>setFd(f=>({...f,message:e.target.value}))}
            style={{...inputStyle,resize:"none",marginBottom:24}}
            onFocus={e=>{e.target.style.borderColor="var(--accent)";e.target.style.background="rgba(255,208,0,.05)"}}
            onBlur={e=>{e.target.style.borderColor="var(--border2)";e.target.style.background="rgba(255,208,0,.03)"}}/>

          <button data-hover onClick={handleSubmit} disabled={status==="sending"}
            style={{width:"100%",padding:"16px",borderRadius:100,border:"none",
              background:status==="sent"?"rgba(255,208,0,.15)":status==="error"?"rgba(255,80,80,.15)":"var(--accent)",
              color:status==="sent"||status==="error"?"var(--text)":"#0a0900",
              fontSize:15,fontWeight:700,cursor:status==="sending"?"wait":"pointer",
              fontFamily:"var(--font-body)",letterSpacing:".05em",transition:"all .3s",
              boxShadow:status==="idle"?"0 0 32px rgba(255,208,0,.25)":"none",
              outline: status==="sent"?"1px solid rgba(255,208,0,.4)":"none",
            }}>
            {status==="idle"&&"Send Message →"}
            {status==="sending"&&"Sending..."}
            {status==="sent"&&"✓ Message Sent — Thanks!"}
            {status==="error"&&"Something went wrong. Try again."}
          </button>

          <p className="mono" style={{fontSize:10,color:"var(--text3)",textAlign:"center",marginTop:16,letterSpacing:".08em"}}>
            Powered by Google Sheets · Responses logged automatically
          </p>
        </div>

      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer=()=>(
  <footer style={{padding:"40px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",animation:"pulse-glow 2s infinite"}}/><span className="syne" style={{fontSize:14,fontWeight:700}}>Kartik Gaikwad</span></div>
    <span className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:".1em"}}>MAHARASHTRA, INDIA · BUILDING THE FUTURE</span>
    <span className="mono" style={{fontSize:10,color:"var(--text3)",letterSpacing:".1em"}}>© 2024 · ALL RIGHTS RESERVED</span>
  </footer>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const mouseX=useRef(window.innerWidth/2),mouseY=useRef(window.innerHeight/2);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const onM=e=>{mouseX.current=e.clientX;mouseY.current=e.clientY;};
    const onS=()=>setScrolled(window.scrollY>50);
    window.addEventListener("mousemove",onM);window.addEventListener("scroll",onS,{passive:true});
    return()=>{window.removeEventListener("mousemove",onM);window.removeEventListener("scroll",onS);};
  },[]);
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");}),{threshold:.1,rootMargin:"0px 0px -60px 0px"});
    const t=setTimeout(()=>{document.querySelectorAll(".reveal-on-scroll").forEach(el=>obs.observe(el));},200);
    return()=>{clearTimeout(t);obs.disconnect();};
  },[]);
  return(<>
    <GlobalStyles/>
    <Cursor/>
    <RoamingRobot mouseX={mouseX} mouseY={mouseY}/>
    <Nav scrolled={scrolled}/>
    <main>
      <Hero mouseX={mouseX} mouseY={mouseY}/>
      <About/>
      <BuildingInPublic/>
      <SkillsConstellation/>
      <EngineeringMindset/>
      <Technologies/>
      <Metrics/>
      <Philosophy/>
      <Contact/>
    </main>
    <Footer/>
  </>);
}
