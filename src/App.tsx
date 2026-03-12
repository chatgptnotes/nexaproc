import React, { useState, FC, CSSProperties } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, Bell,
  Building2, Car, CheckCircle, Cpu, Factory, FlaskConical,
  Gauge, Layers, Lock, Phone, Plug, Server,
  Shirt, Siren, Smartphone, TrendingDown, User, Wheat,
} from 'lucide-react';

const VERSION = '1.3'; const BUILD_DATE = 'March 2026';

const C = {
  bg: '#030e04', amber: '#fbbf24', orange: '#f97316',
  green: '#4ade80', forest: '#16a34a', gold: '#fde68a',
  white: 'rgba(255,255,255,0.92)', muted: 'rgba(255,255,255,0.65)',
  dim: 'rgba(255,255,255,0.35)',
  card: 'rgba(8,22,10,0.78)', cardBorder: 'rgba(74,222,128,0.18)',
  section1: 'rgba(3,14,4,0.72)', section2: 'rgba(4,17,5,0.82)',
};

// ─────────────────────────────────────────────────────────────────────────────
// ARTISTIC BACKGROUND — Gemini-designed Phoenix Rising from Industrial Roots
// ─────────────────────────────────────────────────────────────────────────────
const ArtisticBackground: FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:0, backgroundColor:C.bg }}
  >
    <defs>
      <radialGradient id="bgBase" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#041a06"/>
        <stop offset="100%" stopColor="#030e04"/>
      </radialGradient>
      <radialGradient id="glowAmber" cx="50%" cy="45%" r="40%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.18"/>
        <stop offset="50%" stopColor="#f97316" stopOpacity="0.08"/>
        <stop offset="100%" stopColor="#030e04" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="glowGreen" cx="50%" cy="88%" r="35%">
        <stop offset="0%" stopColor="#16a34a" stopOpacity="0.22"/>
        <stop offset="60%" stopColor="#4ade80" stopOpacity="0.07"/>
        <stop offset="100%" stopColor="#030e04" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="flameCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9"/>
        <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.65"/>
        <stop offset="70%" stopColor="#f97316" stopOpacity="0.3"/>
        <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="wingL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.22"/>
        <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.14"/>
        <stop offset="100%" stopColor="#f97316" stopOpacity="0.06"/>
      </linearGradient>
      <linearGradient id="wingR" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.22"/>
        <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.14"/>
        <stop offset="100%" stopColor="#f97316" stopOpacity="0.06"/>
      </linearGradient>
      <linearGradient id="trunkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#16a34a" stopOpacity="0.5"/>
        <stop offset="60%" stopColor="#4ade80" stopOpacity="0.28"/>
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2"/>
      </linearGradient>
      <filter id="glow4" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softBlur">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
      {/* Hex tile pattern */}
      <pattern id="hexTile" width="34" height="29.4" patternUnits="userSpaceOnUse">
        <path d="M17 0 L34 8.5 L34 25.5 L17 34 L0 25.5 L0 8.5 Z" fill="none" stroke="#4ade80" strokeWidth="0.5"/>
      </pattern>
    </defs>

    {/* Base */}
    <rect width="1920" height="1080" fill="url(#bgBase)"/>

    {/* Hex texture */}
    <rect width="1920" height="1080" fill="url(#hexTile)" opacity="0.038"/>

    {/* Glow pools */}
    <ellipse cx="960" cy="490" rx="700" ry="420" fill="url(#glowAmber)"/>
    <ellipse cx="960" cy="960" rx="620" ry="280" fill="url(#glowGreen)"/>

    {/* ── Root system ── */}
    <g opacity="0.85">
      {/* Tap root */}
      <path d="M960,1080 C960,1020 958,980 960,920 C962,860 960,820 960,760" stroke="url(#trunkGrad)" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* Branch left 1 */}
      <path d="M960,970 C920,960 870,970 820,990 C780,1005 730,1020 680,1040" stroke="#16a34a" strokeWidth="2.5" fill="none" opacity="0.5"/>
      {/* Branch left 2 */}
      <path d="M958,1000 C910,995 860,1005 810,1025 C770,1040 720,1055 660,1070" stroke="#16a34a" strokeWidth="1.8" fill="none" opacity="0.35"/>
      {/* Branch left wide */}
      <path d="M956,1030 C890,1025 820,1035 750,1050 C690,1062 620,1072 540,1080" stroke="#4ade80" strokeWidth="1.2" fill="none" opacity="0.25"/>
      {/* Branch right 1 */}
      <path d="M960,970 C1000,960 1050,970 1100,990 C1140,1005 1190,1020 1240,1040" stroke="#16a34a" strokeWidth="2.5" fill="none" opacity="0.5"/>
      {/* Branch right 2 */}
      <path d="M962,1000 C1010,995 1060,1005 1110,1025 C1150,1040 1200,1055 1260,1070" stroke="#16a34a" strokeWidth="1.8" fill="none" opacity="0.35"/>
      {/* Branch right wide */}
      <path d="M964,1030 C1030,1025 1100,1035 1170,1050 C1230,1062 1300,1072 1380,1080" stroke="#4ade80" strokeWidth="1.2" fill="none" opacity="0.25"/>
    </g>

    {/* ── Trunk ── */}
    <g>
      <path d="M960,760 C958,710 956,660 958,610 C960,560 960,510 960,470" stroke="url(#trunkGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Mid branches */}
      <path d="M958,680 C930,668 898,652 866,634 C840,618 810,598 778,578" stroke="#4ade80" strokeWidth="1.6" fill="none" opacity="0.22"/>
      <path d="M962,650 C994,636 1028,618 1062,598 C1090,580 1122,560 1154,540" stroke="#4ade80" strokeWidth="1.6" fill="none" opacity="0.22"/>
    </g>

    {/* ── Phoenix — centered at (960, 470) ── */}
    <g transform="translate(960,470)">
      {/* LEFT WING — dramatic spread */}
      <path d="M0,0 C-80,-50 -200,-90 -320,-110 C-440,-130 -580,-115 -700,-90 C-820,-65 -900,-20 -940,30 C-870,-30 -790,-70 -680,-88 C-570,-105 -440,-115 -310,-95 C-200,-78 -90,-38 0,0 Z" fill="url(#wingL)" filter="url(#glow4)"/>
      <path d="M0,10 C-70,0 -180,-25 -290,-40 C-400,-55 -530,-50 -650,-30 C-750,-14 -840,18 -900,55 C-820,20 -730,-10 -630,-22 C-520,-34 -400,-34 -290,-18 C-180,-4 -80,22 0,40 Z" fill="rgba(74,222,128,0.08)"/>
      {/* Left wing feather tips */}
      <path d="M-320,-110 C-360,-130 -400,-148 -440,-162" stroke="#4ade80" strokeWidth="1.4" fill="none" opacity="0.2"/>
      <path d="M-440,-125 C-490,-148 -540,-165 -590,-178" stroke="#4ade80" strokeWidth="1" fill="none" opacity="0.15"/>
      <path d="M-560,-100 C-620,-124 -680,-142 -740,-155" stroke="#4ade80" strokeWidth="0.8" fill="none" opacity="0.12"/>

      {/* RIGHT WING */}
      <path d="M0,0 C80,-50 200,-90 320,-110 C440,-130 580,-115 700,-90 C820,-65 900,-20 940,30 C870,-30 790,-70 680,-88 C570,-105 440,-115 310,-95 C200,-78 90,-38 0,0 Z" fill="url(#wingR)" filter="url(#glow4)"/>
      <path d="M0,10 C70,0 180,-25 290,-40 C400,-55 530,-50 650,-30 C750,-14 840,18 900,55 C820,20 730,-10 630,-22 C520,-34 400,-34 290,-18 C180,-4 80,22 0,40 Z" fill="rgba(74,222,128,0.08)"/>
      {/* Right feather tips */}
      <path d="M320,-110 C360,-130 400,-148 440,-162" stroke="#4ade80" strokeWidth="1.4" fill="none" opacity="0.2"/>
      <path d="M440,-125 C490,-148 540,-165 590,-178" stroke="#4ade80" strokeWidth="1" fill="none" opacity="0.15"/>
      <path d="M560,-100 C620,-124 680,-142 740,-155" stroke="#4ade80" strokeWidth="0.8" fill="none" opacity="0.12"/>

      {/* Flame core */}
      <ellipse cx="0" cy="-10" rx="72" ry="88" fill="url(#flameCore)" opacity="0.7" filter="url(#softBlur)"/>
      <ellipse cx="0" cy="0" rx="28" ry="36" fill="#fbbf24" opacity="0.45"/>
      <ellipse cx="0" cy="0" rx="14" ry="18" fill="#fde68a" opacity="0.6"/>

      {/* Rune ring — outer */}
      <circle cx="0" cy="0" r="108" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 14" opacity="0.28"/>
      {/* Rune ticks every 15° */}
      {[...Array(24)].map((_,i) => {
        const a = (i*15)*Math.PI/180;
        const r1 = i%6===0 ? 96 : i%3===0 ? 99 : 101;
        return <line key={i}
          x1={r1*Math.cos(a)} y1={r1*Math.sin(a)}
          x2={108*Math.cos(a)} y2={108*Math.sin(a)}
          stroke="#fbbf24" strokeWidth={i%6===0?1.4:0.7} opacity={i%6===0?0.4:0.22}/>
      })}
      {/* Inner ring */}
      <circle cx="0" cy="0" r="84" fill="none" stroke="rgba(74,222,128,0.15)" strokeWidth="0.8"/>

      {/* Circuit traces */}
      <path d="M-70,80 L-70,140 L-130,140 L-130,180" stroke="#4ade80" strokeWidth="0.9" fill="none" opacity="0.28"/>
      <path d="M70,80 L70,140 L130,140 L130,180" stroke="#fbbf24" strokeWidth="0.9" fill="none" opacity="0.22"/>
      <circle cx="-130" cy="180" r="3.5" fill="#4ade80" opacity="0.3"/>
      <circle cx="130" cy="180" r="3.5" fill="#fbbf24" opacity="0.28"/>
      {/* Energy flow lines */}
      <path d="M-60,-90 C-130,-160 -200,-220 -290,-260" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.12" strokeDasharray="5 9"/>
      <path d="M60,-90 C130,-160 200,-220 290,-260" stroke="#4ade80" strokeWidth="1" fill="none" opacity="0.12" strokeDasharray="5 9"/>
    </g>

    {/* ── GEAR — right side ── */}
    <g transform="translate(1480,320)" opacity="0.13">
      <circle cx="0" cy="0" r="46" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
      <circle cx="0" cy="0" r="20" fill="none" stroke="#fbbf24" strokeWidth="1.2"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>(
        <line key={i}
          x1={(46)*Math.cos(a*Math.PI/180)} y1={(46)*Math.sin(a*Math.PI/180)}
          x2={(58)*Math.cos(a*Math.PI/180)} y2={(58)*Math.sin(a*Math.PI/180)}
          stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
      ))}
    </g>

    {/* ── STORAGE TANK — left side ── */}
    <g transform="translate(380,340)" opacity="0.13">
      <rect x="-32" y="-60" width="64" height="90" rx="5" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
      <ellipse cx="0" cy="-60" rx="32" ry="11" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
      <ellipse cx="0" cy="30" rx="32" ry="11" fill="rgba(74,222,128,0.06)"/>
      <line x1="0" y1="30" x2="0" y2="55" stroke="#4ade80" strokeWidth="1.5"/>
      <line x1="-14" y1="55" x2="14" y2="55" stroke="#4ade80" strokeWidth="1.5"/>
      {/* Liquid level */}
      <rect x="-30" y="-10" width="60" height="38" rx="0" fill="rgba(74,222,128,0.08)"/>
    </g>

    {/* ── Border ornaments ── */}
    <rect x="20" y="20" width="1880" height="1040" rx="3" fill="none" stroke="rgba(74,222,128,0.055)" strokeWidth="1"/>
    {[[20,20],[1900,20],[20,1060],[1900,1060]].map(([cx,cy],i)=>(
      <g key={i} transform={`translate(${cx},${cy}) rotate(${[0,90,270,180][i]})`}>
        <path d="M0,0 L40,0 M0,0 L0,40" stroke="rgba(74,222,128,0.22)" strokeWidth="1.5" fill="none"/>
        <circle cx="0" cy="0" r="3" fill="rgba(74,222,128,0.28)"/>
      </g>
    ))}

    {/* ── Horizontal circuit lines ── */}
    {[[0,230,'#4ade80',300],[0,480,'#4ade80',280],[0,700,'#4ade80',260],[1920,230,'#fbbf24',300],[1920,480,'#fbbf24',280],[1920,700,'#fbbf24',260]].map(([x,y,color,len],i)=>{
      const isRight = (x as number)===1920;
      const x1 = isRight ? (x as number) - (len as number) : 0;
      const x2 = isRight ? x as number : len as number;
      return <line key={i} x1={x1} y1={y as number} x2={x2} y2={y as number}
        stroke={color as string} strokeWidth="0.8" opacity="0.18"/>
    })}

    {/* ── Scan lines ── */}
    {[...Array(20)].map((_,i)=>(
      <line key={i} x1="0" y1={i*56} x2="1920" y2={i*56} stroke="#4ade80" strokeWidth="0.5" opacity="0.012"/>
    ))}
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const Section: FC<{ children: React.ReactNode; bg?: string; id?: string; style?: CSSProperties }> = ({ children, bg, id, style }) => (
  <section id={id} style={{ position:'relative', zIndex:1, background: bg ?? C.section1, ...style }}>
    {children}
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
const NavBar: FC = () => {
  const links = ['Platform','Industries','Integrations','Contact'];
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
      background:'rgba(3,14,4,0.88)', backdropFilter:'blur(20px)',
      borderBottom:`1px solid rgba(74,222,128,0.16)` }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', height:66,
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="#" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:36, height:36, borderRadius:10,
            background:`linear-gradient(135deg,${C.amber},${C.orange})`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 0 20px rgba(251,191,36,0.45)` }}>
            <Factory size={18} color="white"/>
          </div>
          <span style={{ fontWeight:900, fontSize:20,
            background:`linear-gradient(90deg,${C.gold},${C.amber})`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>NexaProc</span>
          <span style={{ fontSize:11, color:C.green, fontWeight:700, letterSpacing:2, marginLeft:2 }}>by GALVON</span>
        </a>
        <div style={{ display:'flex', gap:28, alignItems:'center' }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ textDecoration:'none', color:C.muted, fontSize:14, transition:'color .2s' }}
              onMouseOver={e=>e.currentTarget.style.color=C.amber}
              onMouseOut={e=>e.currentTarget.style.color=C.muted}>{l}</a>
          ))}
          <a href="#contact"
            style={{ background:`linear-gradient(135deg,${C.amber},${C.orange})`,
              color:'white', padding:'9px 22px', borderRadius:8, fontWeight:700,
              fontSize:14, textDecoration:'none',
              boxShadow:`0 0 20px rgba(251,191,36,0.35)` }}>
            Book Demo
          </a>
        </div>
      </div>
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
const HeroSection: FC = () => (
  <Section bg="transparent" style={{ minHeight:'100vh', display:'flex', alignItems:'center', paddingTop:80 }}>
    <div style={{ maxWidth:1280, margin:'0 auto', padding:'60px 24px', width:'100%',
      display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:8,
        background:'rgba(251,191,36,0.1)', border:`1px solid rgba(251,191,36,0.35)`,
        borderRadius:100, padding:'6px 18px', fontSize:13, color:C.amber, fontWeight:600, marginBottom:32,
        boxShadow:`0 0 24px rgba(251,191,36,0.12)` }}>
        <Factory size={13}/> Factory &amp; Process Automation SCADA
      </div>
      <h1 style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:900, lineHeight:1.06,
        marginBottom:24, letterSpacing:'-2px',
        background:`linear-gradient(135deg,${C.gold} 0%,${C.amber} 35%,${C.orange} 70%,#ea580c 100%)`,
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        filter:`drop-shadow(0 0 30px rgba(251,191,36,0.4))` }}>
        Industrial Intelligence.<br/>Nature Precision.
      </h1>
      <p style={{ fontSize:'clamp(16px,2vw,19px)', color:C.muted, maxWidth:620,
        lineHeight:1.78, marginBottom:40 }}>
        Unify your entire plant under one intelligent SCADA platform — real-time visibility, predictive intelligence, and precise control forged with the power of nature.
      </p>
      <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', marginBottom:60 }}>
        <a href="#contact"
          style={{ display:'flex', alignItems:'center', gap:8,
            background:`linear-gradient(135deg,${C.amber},${C.orange})`,
            color:'white', padding:'15px 32px', borderRadius:10, fontWeight:800,
            fontSize:16, textDecoration:'none',
            boxShadow:`0 8px 32px rgba(251,191,36,0.45)` }}>
          Book Live Demo <ArrowRight size={18}/>
        </a>
        <a href="#platform"
          style={{ display:'flex', alignItems:'center', gap:8,
            border:`1.5px solid rgba(74,222,128,0.4)`,
            color:C.green, padding:'15px 28px', borderRadius:10, fontWeight:700,
            fontSize:16, textDecoration:'none', background:'rgba(74,222,128,0.06)' }}>
          Explore Platform
        </a>
      </div>
      {/* Trust badges */}
      <div style={{ display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center' }}>
        {[
          { icon:<Server size={15} color={C.green}/>, text:'50+ Plants Deployed' },
          { icon:<Gauge size={15} color={C.amber}/>, text:'94% Avg OEE Achieved' },
          { icon:<Lock size={15} color={C.green}/>, text:'ISA-88 & FDA Compliant' },
          { icon:<Cpu size={15} color={C.amber}/>, text:'99.9% Uptime SLA' },
        ].map(b => (
          <div key={b.text} style={{ display:'flex', alignItems:'center', gap:8,
            background:'rgba(74,222,128,0.07)', border:`1px solid rgba(74,222,128,0.14)`,
            borderRadius:100, padding:'8px 16px', fontSize:13, color:C.muted }}>
            {b.icon} {b.text}
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEMS
// ─────────────────────────────────────────────────────────────────────────────
const ProblemsSection: FC = () => (
  <Section id="problems" bg={C.section2} style={{ padding:'88px 24px' }}>
    <div style={{ maxWidth:1280, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:60 }}>
        <h2 style={{ fontSize:'clamp(26px,3.5vw,44px)', fontWeight:900, color:C.white, marginBottom:14 }}>
          The Hidden Costs Killing Your Plant
        </h2>
        <p style={{ color:C.muted, fontSize:16, maxWidth:560, margin:'0 auto' }}>
          Every minute of unplanned downtime, every missed alert, every compliance gap — they compound into millions in losses.
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:28 }}>
        {[
          { icon:<TrendingDown size={40} color={C.orange}/>, stat:'₹40L+/hr', label:'Lost in unplanned downtime', sub:'A single process failure costs more than a month of SCADA licensing' },
          { icon:<AlertTriangle size={40} color={C.amber}/>, stat:'12%', label:'Average quality rejection rate', sub:'Manual inspection and delayed alerts lead to entire batch write-offs' },
          { icon:<Siren size={40} color={C.green}/>, stat:'₹2Cr+', label:'Average compliance fine per incident', sub:'Regulatory violations from missing audit trails destroy brand reputation' },
        ].map(p => (
          <div key={p.stat} style={{ background:C.card, border:`1px solid ${C.cardBorder}`,
            borderRadius:16, padding:'40px 32px', textAlign:'center',
            transition:'transform .3s, box-shadow .3s' }}
            onMouseOver={e=>{ e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow=`0 16px 48px rgba(251,191,36,0.12)`; }}
            onMouseOut={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
            <div style={{ marginBottom:16 }}>{p.icon}</div>
            <div style={{ fontSize:56, fontWeight:900, color:C.amber, lineHeight:1, marginBottom:10,
              filter:`drop-shadow(0 0 16px rgba(251,191,36,0.4))` }}>{p.stat}</div>
            <p style={{ fontSize:17, fontWeight:700, color:C.white, marginBottom:10 }}>{p.label}</p>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.65 }}>{p.sub}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────────────────────────────────────
const FeaturesSection: FC = () => (
  <Section id="platform" style={{ padding:'88px 24px' }}>
    <div style={{ maxWidth:1280, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:64 }}>
        <span style={{ fontSize:12, fontWeight:700, letterSpacing:3, color:C.amber,
          textTransform:'uppercase', display:'block', marginBottom:12 }}>Platform Capabilities</span>
        <h2 style={{ fontSize:'clamp(26px,3.5vw,44px)', fontWeight:900, color:C.white, marginBottom:14 }}>
          Everything Your Plant Needs
        </h2>
        <p style={{ color:C.muted, fontSize:16, maxWidth:520, margin:'0 auto' }}>
          Six core modules, one unified platform, zero blind spots.
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:26 }}>
        {[
          { icon:<Activity size={28} color={C.amber}/>, title:'Real-Time Monitoring', desc:'Live dashboards with sub-second data refresh across every sensor, valve, and actuator in your plant.' },
          { icon:<Bell size={28} color={C.amber}/>, title:'Intelligent Alerts', desc:'AI-powered anomaly detection sends alerts before failures occur — not after. Context-aware, zero noise.' },
          { icon:<Gauge size={28} color={C.amber}/>, title:'OEE Tracker', desc:'Track Availability, Performance, and Quality in real time. Drill down to root causes in seconds.' },
          { icon:<Layers size={28} color={C.amber}/>, title:'Batch Control', desc:'Full ISA-88 compliant batch management — recipe editor, phase control, electronic batch records.' },
          { icon:<Plug size={28} color={C.amber}/>, title:'150+ Integrations', desc:'Connect to PLCs, DCS, ERP, MES, and cloud platforms. OPC-UA, Modbus, MQTT out of the box.' },
          { icon:<Smartphone size={28} color={C.amber}/>, title:'Mobile SCADA', desc:'Full plant visibility on your phone. Approve alarms, run reports, and command equipment from anywhere.' },
        ].map(f => (
          <div key={f.title} style={{ background:C.card, border:`1px solid ${C.cardBorder}`,
            borderRadius:16, padding:'32px 28px',
            transition:'border-color .3s, transform .3s, box-shadow .3s' }}
            onMouseOver={e=>{ e.currentTarget.style.borderColor=`rgba(251,191,36,0.4)`; e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 12px 40px rgba(251,191,36,0.1)`; }}
            onMouseOut={e=>{ e.currentTarget.style.borderColor=C.cardBorder; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
            <div style={{ width:54, height:54, borderRadius:14,
              background:'rgba(251,191,36,0.1)', border:`1px solid rgba(251,191,36,0.22)`,
              display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize:18, fontWeight:800, color:C.white, marginBottom:10 }}>{f.title}</h3>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.72 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRIES
// ─────────────────────────────────────────────────────────────────────────────
const IndustriesSection: FC = () => (
  <Section id="industries" bg={C.section2} style={{ padding:'80px 24px' }}>
    <div style={{ maxWidth:1280, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:56 }}>
        <h2 style={{ fontSize:'clamp(24px,3vw,40px)', fontWeight:900, color:C.white, marginBottom:12 }}>
          Built for Every Process Industry
        </h2>
        <p style={{ color:C.muted, fontSize:15, maxWidth:480, margin:'0 auto' }}>
          Configured and certified for the world's most demanding manufacturing environments.
        </p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:22 }}>
        {[
          { icon:<FlaskConical size={36} color={C.green}/>, title:'Pharma & Biotech', desc:'FDA 21 CFR Part 11, batch records, sterile manufacturing' },
          { icon:<Wheat size={36} color={C.green}/>, title:'Food & Beverage', desc:'FSMA compliance, CIP/SIP, temperature control, traceability' },
          { icon:<Shirt size={36} color={C.green}/>, title:'Textile', desc:'Dyeing, weaving, finishing — full production line visibility' },
          { icon:<Car size={36} color={C.green}/>, title:'Automotive', desc:'Assembly lines, quality gates, press shop, paint shop monitoring' },
        ].map(ind => (
          <div key={ind.title} style={{ background:'rgba(22,163,74,0.07)',
            border:`1px solid rgba(74,222,128,0.18)`, borderRadius:16, padding:'36px 24px',
            textAlign:'center', transition:'background .3s, transform .3s' }}
            onMouseOver={e=>{ e.currentTarget.style.background='rgba(22,163,74,0.14)'; e.currentTarget.style.transform='translateY(-5px)'; }}
            onMouseOut={e=>{ e.currentTarget.style.background='rgba(22,163,74,0.07)'; e.currentTarget.style.transform='translateY(0)'; }}>
            <div style={{ width:66, height:66, borderRadius:18, background:'rgba(74,222,128,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
              {ind.icon}
            </div>
            <h3 style={{ fontSize:16, fontWeight:800, color:C.white, marginBottom:8 }}>{ind.title}</h3>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{ind.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

// ─────────────────────────────────────────────────────────────────────────────
// DEMO FORM
// ─────────────────────────────────────────────────────────────────────────────
const DemoFormSection: FC = () => {
  const [form, setForm] = useState({ name:'', company:'', phone:'' });
  const [sent, setSent] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f=>({...f,[k]:e.target.value}));
  const inputStyle: CSSProperties = {
    width:'100%', padding:'13px 16px', borderRadius:10, fontSize:15,
    background:'rgba(8,28,10,0.8)', border:`1px solid rgba(74,222,128,0.22)`,
    color:C.white, outline:'none', boxSizing:'border-box',
  };
  return (
    <Section id="contact" bg={C.section1} style={{ padding:'100px 24px' }}>
      <div style={{ maxWidth:560, margin:'0 auto', textAlign:'center' }}>
        <span style={{ fontSize:12, fontWeight:700, letterSpacing:3, color:C.green,
          textTransform:'uppercase', display:'block', marginBottom:12 }}>Get Started</span>
        <h2 style={{ fontSize:'clamp(24px,3.5vw,42px)', fontWeight:900, color:C.white, marginBottom:14 }}>
          Book Your Live Demo
        </h2>
        <p style={{ color:C.muted, fontSize:16, lineHeight:1.7, marginBottom:44 }}>
          See NexaProc running on a live plant simulation. Our engineers will show you exactly how it fits your process in 30 minutes.
        </p>
        {sent ? (
          <div style={{ background:'rgba(22,163,74,0.12)', border:`1px solid rgba(74,222,128,0.3)`,
            borderRadius:16, padding:'40px', color:C.green, fontSize:18, fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
            <CheckCircle size={28}/> Request received — we'll call you within 4 hours.
          </div>
        ) : (
          <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`,
            borderRadius:20, padding:'40px', textAlign:'left', display:'flex', flexDirection:'column', gap:18 }}>
            {[
              { icon:<User size={16} color={C.muted}/>, key:'name', label:'Your Name', ph:'Dr. Rajesh Kumar' },
              { icon:<Building2 size={16} color={C.muted}/>, key:'company', label:'Plant / Company', ph:'Cipla Pharmaceuticals' },
              { icon:<Phone size={16} color={C.muted}/>, key:'phone', label:'WhatsApp Number', ph:'+91 98765 43210' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:12, color:C.muted, fontWeight:600, display:'flex', alignItems:'center', gap:6, marginBottom:7 }}>
                  {f.icon} {f.label}
                </label>
                <input value={(form as any)[f.key]} onChange={set(f.key)}
                  placeholder={f.ph} style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='rgba(251,191,36,0.5)'}
                  onBlur={e=>e.target.style.borderColor='rgba(74,222,128,0.22)'}/>
              </div>
            ))}
            <button onClick={()=>setSent(true)}
              style={{ marginTop:8, width:'100%', padding:'15px', borderRadius:12,
                background:`linear-gradient(135deg,${C.amber},${C.orange})`,
                color:'white', fontWeight:800, fontSize:16, border:'none', cursor:'pointer',
                boxShadow:`0 8px 28px rgba(251,191,36,0.4)`,
                display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              Request Demo <ArrowRight size={18}/>
            </button>
            <p style={{ fontSize:12, color:C.dim, textAlign:'center', marginTop:4 }}>
              No spam. A NexaProc engineer will call you within 4 business hours.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
const Footer: FC = () => (
  <footer style={{ position:'relative', zIndex:1,
    background:'rgba(2,10,3,0.94)', borderTop:`1px solid rgba(74,222,128,0.1)`,
    padding:'36px 24px', textAlign:'center' }}>
    <div style={{ maxWidth:1280, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:16 }}>
        <div style={{ width:30, height:30, borderRadius:8,
          background:`linear-gradient(135deg,${C.amber},${C.orange})`,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Factory size={15} color="white"/>
        </div>
        <span style={{ fontWeight:900, fontSize:18,
          background:`linear-gradient(90deg,${C.gold},${C.amber})`,
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>NexaProc</span>
        <span style={{ fontSize:10, color:C.green, fontWeight:700, letterSpacing:2 }}>by GALVON</span>
      </div>
      <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
        {['Privacy','Terms','Documentation','API Docs','Support'].map(l=>(
          <a key={l} href="#" style={{ color:C.dim, fontSize:13, textDecoration:'none',
            transition:'color .2s' }}
            onMouseOver={e=>e.currentTarget.style.color=C.muted}
            onMouseOut={e=>e.currentTarget.style.color=C.dim}>{l}</a>
        ))}
      </div>
      <p style={{ fontSize:11, color:'rgba(255,255,255,0.18)', lineHeight:1.8 }}>
        drmhope.com | A Bettroi Product &nbsp;·&nbsp; v{VERSION} &nbsp;·&nbsp; {BUILD_DATE} &nbsp;·&nbsp; nexaproc
      </p>
    </div>
  </footer>
);

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg, color:C.white, minHeight:'100vh' }}>
      <ArtisticBackground/>
      <NavBar/>
      <HeroSection/>
      <ProblemsSection/>
      <FeaturesSection/>
      <IndustriesSection/>
      <DemoFormSection/>
      <Footer/>
    </div>
  );
}
