import { useState, useEffect } from 'react'
import { Factory, Activity, Bell, FlaskConical, Zap, BarChart3, Cpu, Wifi, ArrowRight, CheckCircle, ChevronDown, Pill, Wheat, Shirt, Car, Mountain, Menu, X, Settings, TrendingUp, Shield, Layers } from 'lucide-react'

const VERSION = '1.0'
const BUILD_DATE = 'March 2026'
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

async function fetchGeminiText(prompt: string, fallback: string): Promise<string> {
  if (!GEMINI_KEY) return fallback
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) })
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallback
  } catch { return fallback }
}

// ── NEXAPROC LOGO — Nature Phoenix colour theme ──────────────────────────────
function NexaProcLogo({ size = 'full' }: { size?: 'full' | 'compact' }) {
  if (size === 'compact') {
    return (
      <svg viewBox="0 0 44 44" width="36" height="36" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="npIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#ea580c"/>
          </linearGradient>
          <filter id="npGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {/* gear teeth */}
        {[0,45,90,135,180,225,270,315].map((deg,i)=>{
          const r=Math.PI*deg/180; const x=22+18*Math.cos(r); const y=22+18*Math.sin(r)
          return <line key={i} x1={22+13*Math.cos(r)} y1={22+13*Math.sin(r)} x2={x} y2={y} stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" opacity="0.7"/>
        })}
        <circle cx="22" cy="22" r="13" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.5"/>
        <circle cx="22" cy="22" r="9" fill="#071408"/>
        <text x="22" y="22" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="9" fill="url(#npIcon)" textAnchor="middle" dominantBaseline="middle" filter="url(#npGlow)">NP</text>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 600 220" width="100%" style={{ maxWidth: 560, display: 'block' }}>
      <defs>
        <linearGradient id="npGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#ea580c"/>
        </linearGradient>
        <linearGradient id="npLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fbbf24"/>
        </linearGradient>
        <filter id="npGlowF"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="npSoft"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Gear outer ring */}
      <circle cx="75" cy="75" r="68" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.15"/>
      <circle cx="75" cy="75" r="55" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1.5" opacity="0.3"/>

      {/* Gear teeth – 8 directions */}
      {[0,45,90,135,180,225,270,315].map((deg,i)=>{
        const r=Math.PI*deg/180
        const x1=75+42*Math.cos(r), y1=75+42*Math.sin(r)
        const x2=75+58*Math.cos(r), y2=75+58*Math.sin(r)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" opacity="0.5"/>
      })}

      {/* Gear inner circle */}
      <circle cx="75" cy="75" r="38" fill="#05100a" stroke="#f59e0b" strokeWidth="2"/>

      {/* Nature leaf accents around gear */}
      <path d="M40 40 Q30 25 45 28 Q42 38 40 40 Z" fill="#16a34a" opacity="0.5"/>
      <path d="M110 40 Q120 25 105 28 Q108 38 110 40 Z" fill="#16a34a" opacity="0.5"/>
      <path d="M28 80 Q12 72 18 85 Q24 86 28 80 Z" fill="#22c55e" opacity="0.4"/>
      <path d="M122 80 Q138 72 132 85 Q126 86 122 80 Z" fill="#22c55e" opacity="0.4"/>

      {/* NP Monogram */}
      <text x="75" y="79" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="30" fill="url(#npGrad)" textAnchor="middle" dominantBaseline="middle" filter="url(#npGlowF)">NP</text>

      {/* Process flow dotted arcs */}
      <path d="M30 30 Q75 5 120 30" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.3"/>
      <path d="M120 120 Q75 145 30 120" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.3"/>

      {/* Wordmark NexaProc */}
      <text x="162" y="88" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="60" dominantBaseline="middle">
        <tspan fill="white">Nexa</tspan><tspan fill="url(#npGrad)">Proc</tspan>
      </text>

      {/* Tagline */}
      <text x="165" y="130" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="14" letterSpacing="4" fill="#f59e0b" dominantBaseline="middle">FACTORY AUTOMATION SCADA</text>

      {/* Accent line */}
      <rect x="165" y="145" width="345" height="1.5" rx="1" fill="url(#npLine)" opacity="0.55"/>

      {/* by GALVON badge */}
      <rect x="165" y="160" width="92" height="22" rx="11" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1"/>
      <text x="211" y="171" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="#fbbf24" textAnchor="middle" dominantBaseline="middle" letterSpacing="2">by GALVON</text>

      {/* green leaf dot accents */}
      <circle cx="270" cy="171" r="3" fill="#16a34a" opacity="0.5"/>
      <circle cx="280" cy="171" r="2" fill="#22c55e" opacity="0.4"/>
    </svg>
  )
}

function NaturePhoenix() {
  return (
    <svg viewBox="-150 -110 300 300" width="100%" height="100%" style={{ overflow: 'visible', maxWidth: 520 }}>
      <defs>
        <radialGradient id="natureAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ea580c" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <filter id="fireGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softFire" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="wLGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="wRGrad" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#ea580c" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="bodyFire" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="tailFire" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="60%" stopColor="#ea580c" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Warm sun aura */}
      <ellipse cx="0" cy="20" rx="130" ry="100" fill="url(#natureAura)" />
      <ellipse cx="0" cy="-15" rx="55" ry="45" fill="url(#sunGlow)" opacity="0.4" />

      {/* Leaf-shaped decorations */}
      <path d="M-120,40 Q-100,10 -80,30 Q-100,50 -120,40 Z" fill="#16a34a" opacity="0.4" filter="url(#softFire)" />
      <path d="M120,40 Q100,10 80,30 Q100,50 120,40 Z" fill="#16a34a" opacity="0.4" filter="url(#softFire)" />
      <path d="M-130,-10 Q-115,-30 -95,-10 Q-115,5 -130,-10 Z" fill="#22c55e" opacity="0.3" />
      <path d="M130,-10 Q115,-30 95,-10 Q115,5 130,-10 Z" fill="#22c55e" opacity="0.3" />

      {/* Tail feathers — fire trailing down */}
      <path d="M-10,45 Q-35,100 -22,155 Q-12,168 0,158 Q12,168 22,155 Q35,100 10,45 Z" fill="url(#tailFire)" filter="url(#softFire)" />
      <path d="M-18,52 Q-55,110 -42,162 Q-30,172 -18,155 Q-10,130 -5,100 L-12,50 Z" fill="#ea580c" opacity="0.45" filter="url(#softFire)" />
      <path d="M18,52 Q55,110 42,162 Q30,172 18,155 Q10,130 5,100 L12,50 Z" fill="#ea580c" opacity="0.45" filter="url(#softFire)" />
      {/* tail streaks */}
      {[-5, 0, 5].map(x => (
        <line key={x} x1={x} y1="55" x2={x * 2} y2="150" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
      ))}

      {/* Left wings — organic flame + leaf shapes */}
      {/* Upper left wing */}
      <path d="M-20,-25 Q-60,-50 -105,-90 Q-85,-50 -48,-18 Q-30,-8 -18,-2 Z" fill="url(#wLGrad)" filter="url(#fireGlow)" opacity="0.95" />
      {/* Mid left wing */}
      <path d="M-22,-8 Q-80,-12 -128,-2 Q-95,8 -35,5 Z" fill="#f59e0b" opacity="0.65" filter="url(#softFire)" />
      {/* Lower left wing */}
      <path d="M-20,15 Q-70,25 -115,55 Q-82,22 -38,10 Z" fill="#ea580c" opacity="0.55" filter="url(#softFire)" />
      {/* leaf vein on wing */}
      <path d="M-22,-15 Q-65,-35 -100,-60" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
      <path d="M-22,-15 Q-55,-10 -90,0" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.4" />
      <path d="M-22,-15 Q-55,10 -85,30" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.3" />

      {/* Right wings */}
      <path d="M20,-25 Q60,-50 105,-90 Q85,-50 48,-18 Q30,-8 18,-2 Z" fill="url(#wRGrad)" filter="url(#fireGlow)" opacity="0.95" />
      <path d="M22,-8 Q80,-12 128,-2 Q95,8 35,5 Z" fill="#f59e0b" opacity="0.65" filter="url(#softFire)" />
      <path d="M20,15 Q70,25 115,55 Q82,22 38,10 Z" fill="#ea580c" opacity="0.55" filter="url(#softFire)" />
      <path d="M22,-15 Q65,-35 100,-60" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" />
      <path d="M22,-15 Q55,-10 90,0" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.4" />
      <path d="M22,-15 Q55,10 85,30" fill="none" stroke="#fde68a" strokeWidth="1" opacity="0.3" />

      {/* Body */}
      <ellipse cx="0" cy="15" rx="16" ry="38" fill="url(#bodyFire)" filter="url(#fireGlow)" />

      {/* Head */}
      <circle cx="0" cy="-30" r="17" fill="#f59e0b" filter="url(#fireGlow)" />
      <circle cx="0" cy="-30" r="11" fill="#fbbf24" />

      {/* Crest — flame feathers */}
      <path d="M-5,-45 Q-14,-68 -8,-92 Q-2,-80 0,-60 Z" fill="#ea580c" filter="url(#fireGlow)" />
      <path d="M0,-47 Q0,-75 0,-98 Q3,-82 2,-62 Z" fill="#fbbf24" filter="url(#fireGlow)" />
      <path d="M5,-45 Q14,-68 8,-92 Q2,-80 0,-60 Z" fill="#f59e0b" filter="url(#fireGlow)" />
      {/* leaf crest */}
      <path d="M-8,-50 Q-18,-58 -12,-65 Q-5,-60 -8,-50 Z" fill="#22c55e" opacity="0.7" />
      <path d="M8,-50 Q18,-58 12,-65 Q5,-60 8,-50 Z" fill="#22c55e" opacity="0.7" />

      {/* Eye */}
      <circle cx="5" cy="-31" r="5.5" fill="#fde68a" />
      <circle cx="6" cy="-31" r="3" fill="#92400e" />
      <circle cx="7" cy="-32" r="1.2" fill="white" />

      {/* Beak */}
      <path d="M10,-26 L20,-22 L11,-18 Z" fill="#d97706" />

      {/* Ember particles */}
      {[[-108,32], [108,32], [-88,-70], [88,-70], [-60,-80], [60,-80], [-40,68], [40,68], [-120,8], [120,8], [-75,45], [75,45]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3.5 : i % 2 === 0 ? 2.5 : 1.8} fill={i % 3 === 0 ? '#fbbf24' : i % 2 === 0 ? '#ea580c' : '#22c55e'} filter="url(#softFire)" opacity={0.6 + (i % 4) * 0.1} />
      ))}

      {/* Organic tendrils */}
      <path d="M-40,8 Q-65,0 -90,-18" fill="none" stroke="#16a34a" strokeWidth="1.5" opacity="0.4" strokeDasharray="4,3" />
      <path d="M40,8 Q65,0 90,-18" fill="none" stroke="#16a34a" strokeWidth="1.5" opacity="0.4" strokeDasharray="4,3" />
    </svg>
  )
}

function WaveDivider({ flip = false, from = '#05100a', to = '#0a1a0d' }: { flip?: boolean; from?: string; to?: string }) {
  return (
    <div style={{ background: to, lineHeight: 0 }} className={flip ? 'rotate-180' : ''}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="100%" height="80">
        <path d="M0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,0 L0,0 Z" fill={from} />
      </svg>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroSub, setHeroSub] = useState('Unleash the power of nature-forged intelligence in every process line.')

  useEffect(() => {
    fetchGeminiText('Write a powerful 12-word tagline for NexaProc, a factory process automation SCADA. Nature and fire theme, no quotes.', 'Unleash the power of nature-forged intelligence in every process line.').then(setHeroSub)
  }, [])

  const features = [
    { icon: Activity, title: 'Live Process Monitoring', desc: 'Real-time telemetry from PLCs, RTUs, sensors, and field devices across all production lines.' },
    { icon: Bell, title: 'Intelligent Alarms', desc: 'Smart alarm management with escalation, deduplication, and acknowledgment workflows.' },
    { icon: Settings, title: 'Batch Control', desc: 'ISA-88 compliant recipe management with full audit trails and electronic batch records.' },
    { icon: Zap, title: 'Energy Analytics', desc: 'Per-unit energy consumption, demand forecasting, and waste identification by production line.' },
    { icon: Cpu, title: 'Predictive Maintenance', desc: 'AI-powered equipment health scoring that flags failures days before they happen.' },
    { icon: Shield, title: 'Secure by Design', desc: 'IEC 62443 compliant. Role-based access control. Air-gap and cloud deployment options.' },
  ]

  const process = [
    { n: '01', icon: Wifi, title: 'Connect Everything', desc: 'OPC-UA, Modbus, MQTT — plug into any PLC, DCS, or sensor without ripping out your existing infrastructure.' },
    { n: '02', icon: Activity, title: 'Visualize Live', desc: 'Auto-built SCADA dashboards with P&ID overlays, trend charts, and process flow animations.' },
    { n: '03', icon: TrendingUp, title: 'Predict and Alert', desc: 'AI engine learns your process patterns and flags anomalies and failures before they cascade.' },
    { n: '04', icon: BarChart3, title: 'Optimize Output', desc: 'Close the loop with automated responses, OEE tracking, and executive-level reporting.' },
  ]

  const industries = [
    { icon: Pill, label: 'Pharmaceutical' },
    { icon: Wheat, label: 'Food and Beverage' },
    { icon: FlaskConical, label: 'Chemical' },
    { icon: Shirt, label: 'Textiles' },
    { icon: Car, label: 'Auto Manufacturing' },
    { icon: Mountain, label: 'Cement' },
    { icon: Layers, label: 'Plastics' },
    { icon: Factory, label: 'General Mfg.' },
  ]

  const stats = [
    { val: '50+', label: 'Plants Deployed' },
    { val: '10K+', label: 'Tags Supported' },
    { val: '<100ms', label: 'Latency' },
    { val: '99.9%', label: 'Uptime' },
  ]

  const integrations = ['Siemens S7', 'Allen Bradley', 'Schneider', 'Modbus', 'OPC-UA', 'MQTT', 'REST API', 'Profibus']

  const BG = '#05100a'
  const BG2 = '#071408'
  const AMBER = '#f59e0b'
  const ORANGE = '#ea580c'
  const GREEN = '#16a34a'

  return (
    <div style={{ background: BG, color: 'white', fontFamily: "'Inter', system-ui, sans-serif" }} className="min-h-screen">

      {/* NAV */}
      <nav style={{ background: 'rgba(5,16,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(245,158,11,0.15)' }} className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NexaProcLogo size="compact" />
            <div>
              <span style={{ fontWeight: 900, fontSize: 20 }}>NexaProc</span>
              <span style={{ marginLeft: 8, fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2 }}>by GALVON</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8" style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
            {['Features', 'Process', 'Industries', 'Integrations'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ transition: 'color .2s' }} onMouseOver={e => (e.currentTarget.style.color = AMBER)} onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}>{l}</a>
            ))}
            <a href="#contact" style={{ background: `linear-gradient(135deg, ${AMBER}, ${ORANGE})`, padding: '9px 22px', borderRadius: 10, fontWeight: 700, color: 'white', boxShadow: `0 0 20px rgba(245,158,11,0.35)`, textDecoration: 'none' }}>Book Demo</a>
          </div>
          <button className="md:hidden" style={{ color: 'white' }} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        {menuOpen && (
          <div style={{ borderTop: '1px solid rgba(245,158,11,0.15)', background: 'rgba(5,16,10,0.97)', padding: '16px 24px' }} className="md:hidden flex flex-col gap-4">
            {['Features', 'Process', 'Industries', 'Integrations', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 80 }}>
        {/* Background — nature forest glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(245,158,11,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(22,163,74,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(22,163,74,0.06), transparent)', pointerEvents: 'none' }} />

        {/* Hex grid pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        {/* Floating ember particles */}
        {[...Array(25)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${(i * 41 + 11) % 100}%`, top: `${(i * 57 + 9) % 100}%`, width: i % 4 === 0 ? 4 : i % 3 === 0 ? 2.5 : 1.5, height: i % 4 === 0 ? 4 : i % 3 === 0 ? 2.5 : 1.5, borderRadius: '50%', background: i % 3 === 0 ? AMBER : i % 2 === 0 ? ORANGE : GREEN, opacity: 0.25 + (i % 5) * 0.08, pointerEvents: 'none' }} />
        ))}

        <div className="max-w-7xl mx-auto px-6 w-full py-16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Text left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 100, padding: '6px 18px', fontSize: 13, color: AMBER, fontWeight: 700, marginBottom: 28, letterSpacing: 1 }}>
              <Factory size={13} /> Factory Automation SCADA
            </div>
            <h1 style={{ fontSize: 'clamp(44px, 5.5vw, 72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 24 }}>
              <span style={{ background: `linear-gradient(135deg, #fbbf24, ${AMBER})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nexa</span>
              <span style={{ background: `linear-gradient(135deg, ${ORANGE}, #dc2626)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Proc</span>
              <br />
              <span style={{ fontSize: '50%', color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: 0 }}>Born from nature's power.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>{heroSub}</p>

            {/* Brand logo block */}
            <div style={{ marginBottom: 32, padding: '20px 24px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 16, display: 'inline-block' }}>
              <NexaProcLogo size="full" />
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#contact" style={{ display: 'flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg, ${AMBER}, ${ORANGE})`, padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, boxShadow: `0 0 30px rgba(245,158,11,0.4)`, color: 'white', textDecoration: 'none' }}>
                Book Live Demo <ArrowRight size={18} />
              </a>
              <a href="#features" style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(245,158,11,0.3)', padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
                Explore Features
              </a>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
              {stats.slice(0, 3).map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 28, fontWeight: 900, background: `linear-gradient(135deg, #fbbf24, ${ORANGE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phoenix right */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 480 }}>
              <NaturePhoenix />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.25)' }}>
          <ChevronDown size={28} />
        </div>
      </section>

      <WaveDivider from={BG} to={BG2} />

      {/* STATS BAR */}
      <section style={{ background: BG2, padding: '48px 24px', borderTop: '1px solid rgba(245,158,11,0.08)' }}>
        <div className="max-w-5xl mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 900, background: `linear-gradient(135deg, #fbbf24, ${ORANGE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <WaveDivider from={BG2} to={BG} flip />

      {/* FEATURES */}
      <section id="features" style={{ background: BG, padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '5px 20px', fontSize: 12, color: AMBER, fontWeight: 700, letterSpacing: 3, marginBottom: 16 }}>PLATFORM FEATURES</div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 900 }}>Engineered for process engineers</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 12, fontSize: 16 }}>Everything you need to run a smarter, leaner plant.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(245,158,11,${i % 2 === 0 ? '0.15' : '0.1'})`, borderRadius: 18, padding: 28, transition: 'all .3s', cursor: 'default' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = `rgba(245,158,11,0.45)`; e.currentTarget.style.background = 'rgba(245,158,11,0.05)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = `rgba(245,158,11,${i % 2 === 0 ? '0.15' : '0.1'})`; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: i % 2 === 0 ? 'rgba(245,158,11,0.12)' : 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <f.icon size={24} style={{ color: i % 2 === 0 ? AMBER : GREEN }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={BG} to={BG2} />

      {/* PROCESS */}
      <section id="process" style={{ background: BG2, padding: '80px 0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 100, padding: '5px 20px', fontSize: 12, color: '#4ade80', fontWeight: 700, letterSpacing: 3, marginBottom: 16 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900 }}>From installation to full control — 4 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 42, left: '12%', right: '12%', height: 2, background: `linear-gradient(90deg, ${GREEN}, ${AMBER}, ${ORANGE})`, opacity: 0.25 }} className="hidden md:block" />
            {process.map((p, i) => (
              <div key={p.n} style={{ textAlign: 'center', padding: '0 12px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 84, height: 84, borderRadius: '50%', background: `radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(22,163,74,0.08) 100%)`, border: `2px solid ${i < 2 ? AMBER : ORANGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', flexDirection: 'column', gap: 2, boxShadow: `0 0 24px rgba(245,158,11,0.2)` }}>
                  <p.icon size={22} style={{ color: i < 2 ? AMBER : ORANGE }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{p.n}</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 10, color: 'white' }}>{p.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 14, lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={BG2} to={BG} flip />

      {/* INDUSTRIES */}
      <section id="industries" style={{ background: BG, padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, marginBottom: 12 }}>Industries We Serve</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>NexaProc adapts to your industry's unique process environment.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
            {industries.map((ind, i) => (
              <div key={ind.label} style={{ border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16, padding: '24px 14px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', transition: 'all .3s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.background = 'rgba(245,158,11,0.07)'; e.currentTarget.style.transform = 'scale(1.04)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'scale(1)' }}>
                <ind.icon size={30} style={{ color: i % 2 === 0 ? AMBER : GREEN, marginBottom: 10 }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{ind.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={BG} to={BG2} />

      {/* INTEGRATIONS */}
      <section id="integrations" style={{ background: BG2, padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 100, padding: '5px 20px', fontSize: 12, color: AMBER, fontWeight: 700, letterSpacing: 3, marginBottom: 20 }}>INTEGRATIONS</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 14 }}>Works with your existing infrastructure</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 44, fontSize: 16 }}>No rip-and-replace. NexaProc connects natively to every major industrial protocol.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {integrations.map(name => (
              <div key={name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '10px 22px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 14, transition: 'all .25s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = AMBER; e.currentTarget.style.color = AMBER }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={BG2} to='#070d05' flip />

      {/* CTA */}
      <section id="contact" style={{ background: '#070d05', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, rgba(22,163,74,0.05), transparent)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <CheckCircle size={48} style={{ color: AMBER, margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            Start your <span style={{ background: `linear-gradient(135deg, #fbbf24, ${ORANGE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>digital plant</span> transformation
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, lineHeight: 1.75, marginBottom: 42 }}>See NexaProc live on a plant similar to yours. Our team sets up a demo environment in 24 hours.</p>
          <a href="mailto:hello@galvon.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: `linear-gradient(135deg, ${AMBER}, ${ORANGE})`, padding: '16px 38px', borderRadius: 14, fontWeight: 800, fontSize: 17, color: 'white', boxShadow: `0 0 40px rgba(245,158,11,0.4)`, textDecoration: 'none' }}>
            Book a Demo <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#030a02', borderTop: '1px solid rgba(245,158,11,0.1)', padding: '40px 24px' }}>
        <div className="max-w-7xl mx-auto" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <NexaProcLogo size="compact" />
            <div>
              <span style={{ fontWeight: 900, fontSize: 18 }}>NexaProc</span>
              <span style={{ marginLeft: 8, fontSize: 11, color: AMBER, fontWeight: 700 }}>by GALVON</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            {['Ampris', 'FlowNexus', 'NexaProc'].map(n => <span key={n} style={n === 'NexaProc' ? { color: AMBER } : {}}>{n}</span>)}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>drmhope.com | A Bettroi Product</div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 4 }}>v{VERSION} | {BUILD_DATE} | nexaproc</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
