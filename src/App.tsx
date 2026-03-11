import { useState, useEffect } from 'react'
import { Factory, Activity, Bell, FlaskConical, Zap, BarChart3, Cpu, Wifi, ArrowRight, CheckCircle, ChevronDown, Pill, Wheat, Shirt, Car, Mountain, Menu, X, Settings, TrendingUp, Shield, Layers, Phone, Download, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react'

const VERSION = '1.3'; const BUILD_DATE = 'March 2026'
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
async function fetchGeminiText(prompt: string, fallback: string): Promise<string> {
  if (!GEMINI_KEY) return fallback
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) })
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallback
  } catch { return fallback }
}

// ── NATURE PHOENIX — VIBRANT palette ─────────────────────────────────────────
const N = {
  bg:     '#030e04',    // deep primordial forest
  bg2:    '#04110506',  // dark undergrowth — actually just a string
  bg2c:   '#041105',    // dark undergrowth
  bg3:    '#020c03',    // root darkness
  amber:  '#fbbf24',    // brilliant fire amber
  orange: '#f97316',    // blazing fire orange
  red:    '#ea580c',    // ember red-orange
  green:  '#4ade80',    // vivid nature green
  lime:   '#a3e635',    // electric lime
  forest: '#16a34a',    // deep forest green
  gold:   '#fde68a',    // bright phoenix gold
  white:  '#ffffff',
  muted:  'rgba(255,255,255,0.6)',
  dim:    'rgba(255,255,255,0.32)',
  dimmer: 'rgba(255,255,255,0.15)',
}

function WaveDivider({ from, to, flip=false }:{ from:string; to:string; flip?:boolean }) {
  return (
    <div style={{ background:to, lineHeight:0 }} className={flip?'rotate-180':''}>
      <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="100%" height="80">
        <path d="M0,40 Q180,80 360,40 Q540,0 720,40 Q900,80 1080,40 Q1260,0 1440,40 L1440,0 L0,0 Z" fill={from}/>
      </svg>
    </div>
  )
}

function ProcessMockup() {
  const trend = [95,90,88,92,84,86,78,82,74,78,70,75,68]
  const oee =   [60,64,67,70,73,76,78,80]
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:560 }}>
      {/* Nature Phoenix glow — amber + green */}
      <div style={{ position:'absolute', inset:-40, borderRadius:30, background:`radial-gradient(ellipse 65% 55% at 50% 40%, rgba(251,191,36,0.2) 0%, rgba(249,115,22,0.1) 40%, transparent 70%)`, filter:'blur(24px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:-20, left:'10%', width:'80%', height:80, background:`radial-gradient(ellipse,rgba(74,222,128,0.15) 0%,transparent 70%)`, filter:'blur(20px)', pointerEvents:'none' }}/>
      <svg viewBox="0 0 560 440" style={{ width:'100%', display:'block', filter:'drop-shadow(0 0 40px rgba(251,191,36,0.3)) drop-shadow(0 20px 50px rgba(249,115,22,0.15))' }}>
        <defs>
          <linearGradient id="natGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={N.amber}/>
            <stop offset="100%" stopColor={N.orange}/>
          </linearGradient>
          <linearGradient id="barGradN" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={N.green}/>
            <stop offset="100%" stopColor={N.forest}/>
          </linearGradient>
        </defs>
        {/* Frame */}
        <rect x="0" y="0" width="560" height="440" rx="16" fill="rgba(2,9,2,0.97)" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5"/>
        {/* Bottom green root glow */}
        <rect x="0" y="380" width="560" height="60" rx="0" fill="rgba(74,222,128,0.03)"/>
        <rect x="0" y="416" width="560" height="24" rx="16" fill="rgba(74,222,128,0.03)"/>
        {/* Scanlines */}
        {[...Array(20)].map((_,i)=><line key={i} x1="0" y1={i*22} x2="560" y2={i*22} stroke="rgba(251,191,36,0.02)" strokeWidth="1"/>)}
        {/* Header */}
        <rect x="0" y="0" width="560" height="42" rx="16" fill="rgba(251,191,36,0.1)"/>
        <rect x="0" y="28" width="560" height="14" fill="rgba(251,191,36,0.1)"/>
        <circle cx="18" cy="21" r="5" fill="#ef4444" opacity="0.8"/>
        <circle cx="34" cy="21" r="5" fill={N.amber} opacity="0.9"/>
        <circle cx="50" cy="21" r="5" fill={N.green} opacity="0.9"/>
        <text x="72" y="21" fontFamily="monospace" fontSize="12" fill="rgba(255,255,255,0.7)" dominantBaseline="middle">NexaProc  ·  Process Monitor  ·  Plant A — Line 3</text>
        <circle cx="522" cy="21" r="4" fill={N.lime}/>
        <text x="532" y="21" fontFamily="monospace" fontSize="10" fill={N.lime} dominantBaseline="middle">RUN</text>
        {/* Process flow row */}
        <text x="14" y="56" fontFamily="monospace" fontSize="9" fill={N.dim} letterSpacing="2">PROCESS FLOW — BATCH #2847</text>
        {[
          { label:'REACTOR',   val:'97.4°C', color:N.red },
          { label:'MIXER',     val:'850 RPM',color:N.amber },
          { label:'SEPARATOR', val:'2.1 bar', color:N.green },
          { label:'OUTPUT',    val:'PASS',    color:N.lime },
        ].map((s,i)=>(
          <g key={i}>
            <rect x={12+i*135} y="63" width="124" height="62" rx="9" fill="rgba(255,255,255,0.02)" stroke={`${s.color}50`} strokeWidth="1"/>
            <rect x={12+i*135} y="63" width="124" height="23" rx="9" fill={`${s.color}15`}/>
            <rect x={12+i*135} y="76" width="124" height="10" fill={`${s.color}15`}/>
            <text x={12+i*135+62} y="75" fontFamily="monospace" fontSize="9" fontWeight="bold" fill={s.color} textAnchor="middle" dominantBaseline="middle" letterSpacing="1">{s.label}</text>
            <text x={12+i*135+62} y="105" fontFamily="monospace" fontSize="18" fontWeight="900" fill="white" textAnchor="middle" dominantBaseline="middle">{s.val}</text>
            {i<3&&<><line x1={12+i*135+124} y1="94" x2={12+i*135+130} y2="94" stroke={s.color} strokeWidth="1.5" opacity="0.5"/><polygon points={`${12+i*135+132},90 ${12+i*135+138},94 ${12+i*135+132},98`} fill={s.color} fillOpacity="0.5"/></>}
          </g>
        ))}
        {/* Metrics row */}
        <text x="14" y="143" fontFamily="monospace" fontSize="9" fill={N.dim} letterSpacing="2">LIVE METRICS</text>
        {[
          { label:'Production',  val:'847',  unit:'units/hr',  color:N.amber },
          { label:'OEE Score',   val:'94.2', unit:'%',         color:N.green },
          { label:'Active Alarms',val:'2',   unit:'low priority',color:N.orange },
          { label:'Energy',      val:'18.4', unit:'kWh/unit',  color:N.gold },
        ].map((m,i)=>(
          <g key={i}>
            <rect x={12+i*135} y={151} width="126" height="56" rx="8" fill="rgba(255,255,255,0.02)" stroke={`${m.color}30`} strokeWidth="1"/>
            <text x={12+i*135+10} y={169} fontFamily="monospace" fontSize="9" fill={N.dim} dominantBaseline="middle">{m.label}</text>
            <text x={12+i*135+10} y={190} fontFamily="monospace" fontSize="20" fontWeight="900" fill={m.color} dominantBaseline="middle">{m.val}</text>
            <text x={12+i*135+10} y={203} fontFamily="monospace" fontSize="8" fill={N.dim} dominantBaseline="middle">{m.unit}</text>
          </g>
        ))}
        <line x1="12" y1="220" x2="548" y2="220" stroke={`${N.amber}14`} strokeWidth="1"/>
        {/* Trend chart */}
        <text x="14" y="234" fontFamily="monospace" fontSize="9" fill={N.dim} letterSpacing="2">PRODUCTION TREND — LAST 13 HRS</text>
        {[0,1,2,3].map(j=><line key={j} x1="14" y1={252+j*18} x2="360" y2={252+j*18} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>)}
        <polyline points={`14,335 ${trend.map((y,i)=>`${14+i*26},${y+252}`).join(' ')} 336,335`} fill={`${N.amber}10`} stroke="none"/>
        <polyline points={trend.map((y,i)=>`${14+i*26},${y+252}`).join(' ')} fill="none" stroke="url(#natGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {trend.map((y,i)=><circle key={i} cx={14+i*26} cy={y+252} r="2.5" fill={i<7?N.orange:N.amber} opacity="0.9"/>)}
        {/* OEE bars */}
        <text x="376" y="234" fontFamily="monospace" fontSize="9" fill={N.dim} letterSpacing="2">OEE TREND</text>
        {oee.map((v,i)=>(
          <g key={i}>
            <rect x={376+i*22} y={335-v+30} width="17" height={v-30} rx="3" fill={`url(#barGradN)`} opacity="0.75"/>
          </g>
        ))}
        <text x="376" y="343" fontFamily="monospace" fontSize="8" fill={N.dim}>60%</text>
        <text x="510" y="343" fontFamily="monospace" fontSize="8" fill={N.lime}>80%</text>
        {/* Footer */}
        <circle cx="18" cy="420" r="3" fill={N.lime}/>
        <text x="28" y="420" fontFamily="monospace" fontSize="9" fill={N.dim} dominantBaseline="middle">Plant A · Line 3 running · Batch #2847 · 94.2% OEE · 2 low alarms</text>
      </svg>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroTag, setHeroTag] = useState("Nature's Fire Forging Industrial Excellence")
  useEffect(() => {
    fetchGeminiText('Write a powerful 6-7 word tagline for NexaProc, a factory SCADA platform. Nature phoenix energy — fire, growth, raw power. No quotes.', "Nature's Fire Forging Industrial Excellence").then(setHeroTag)
  }, [])

  const navLinks = ['Features','Process','Industries','Integrations']

  const problems = [
    { icon:TrendingDown, stat:'₹40L+/hr', label:'Lost production from a single hour of unplanned process downtime' },
    { icon:AlertTriangle, stat:'43%', label:'Of batch failures caused by lack of real-time process visibility' },
    { icon:DollarSign, stat:'22%', label:'Energy wasted in plants running without per-unit consumption tracking' },
  ]

  const features = [
    { icon:Activity, title:'Live Process Monitoring', desc:'Sub-second telemetry from every PLC, RTU, DCS, and sensor across all production lines.', c:N.amber },
    { icon:Bell, title:'Intelligent Alarm Management', desc:'Smart escalation, deduplication, and acknowledgment workflows — no alarm floods.', c:N.green },
    { icon:Settings, title:'ISA-88 Batch Control', desc:'Recipe management, electronic batch records, and full audit trails for regulated industries.', c:N.orange },
    { icon:Zap, title:'Per-unit Energy Analytics', desc:'Real-time energy consumption per unit produced — identify waste and cut costs fast.', c:N.lime },
    { icon:Cpu, title:'Predictive Maintenance AI', desc:'Equipment health scoring flags failures days before they cascade into downtime.', c:N.amber },
    { icon:Shield, title:'IEC 62443 + FDA 21 CFR', desc:'Pharmaceutical and chemical-grade compliance with full cybersecurity hardening.', c:N.green },
  ]

  const processSteps = [
    { n:'01', icon:Wifi,      title:'Connect Everything', desc:'OPC-UA, Modbus, MQTT — plug into any PLC, DCS, or sensor without replacing your infrastructure.' },
    { n:'02', icon:Activity,  title:'Visualize Live',     desc:'Auto-built SCADA dashboards with P&ID overlays, real-time trend charts, and alarm panels.' },
    { n:'03', icon:TrendingUp, title:'Predict and Alert', desc:'AI learns your process patterns and flags anomalies before they cascade.' },
    { n:'04', icon:BarChart3, title:'Optimize Output',    desc:'Close the loop — automate responses, track OEE, and deliver executive-level reporting.' },
  ]

  const stats = [
    { val:'35%',    label:'Reduction in unplanned downtime',         hi:true },
    { val:'94.2%',  label:'Average OEE achieved on NexaProc plants', hi:false },
    { val:'₹2.1 Cr', label:'Average annual energy savings per facility', hi:true },
    { val:'50+',    label:'Plants deployed across India and globally', hi:false },
  ]

  const industries = [
    { icon:Pill,     label:'Pharmaceutical' }, { icon:Wheat,   label:'Food and Beverage' },
    { icon:FlaskConical, label:'Chemical'   }, { icon:Shirt,   label:'Textiles' },
    { icon:Car,      label:'Auto Manufacturing' }, { icon:Mountain, label:'Cement' },
    { icon:Layers,   label:'Plastics and Rubber' }, { icon:Factory, label:'Manufacturing' },
  ]

  const integrations = ['Siemens S7','Allen Bradley','Schneider','OPC-UA','Modbus TCP/RTU','MQTT','Profibus','IEC 61131','REST API','SAP MES']

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:N.bg, color:N.white, minHeight:'100vh' }}>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:50, background:'rgba(3,14,4,0.92)', backdropFilter:'blur(24px)', borderBottom:`1px solid rgba(251,191,36,0.18)` }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:`linear-gradient(135deg,${N.amber},${N.orange})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 24px rgba(251,191,36,0.5)` }}>
              <Factory size={19} color="white"/>
            </div>
            <div>
              <span style={{ fontWeight:900, fontSize:20, background:`linear-gradient(90deg,${N.gold},${N.amber})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>NexaProc</span>
              <span style={{ marginLeft:8, fontSize:11, color:N.green, fontWeight:700, letterSpacing:2 }}>by GALVON</span>
            </div>
          </div>
          <div className="hidden md:flex" style={{ gap:28, fontSize:14, color:N.muted, alignItems:'center' }}>
            {navLinks.map(l=><a key={l} href={`#${l.toLowerCase()}`} style={{ textDecoration:'none', color:N.muted, transition:'color .2s' }} onMouseOver={e=>(e.currentTarget.style.color=N.amber)} onMouseOut={e=>(e.currentTarget.style.color=N.muted)}>{l}</a>)}
            <a href="#contact" style={{ background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'9px 22px', borderRadius:8, fontWeight:700, textDecoration:'none', boxShadow:`0 0 22px rgba(251,191,36,0.4)` }}>Book Demo</a>
          </div>
          <button className="md:hidden" style={{ color:N.white, background:'none', border:'none', cursor:'pointer' }} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
        {menuOpen&&<div style={{ borderTop:`1px solid rgba(251,191,36,0.15)`, padding:'16px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          {navLinks.map(l=><a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setMenuOpen(false)} style={{ textDecoration:'none', color:N.muted, fontSize:15 }}>{l}</a>)}
          <a href="#contact" style={{ background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'10px 20px', borderRadius:8, fontWeight:700, textDecoration:'none', textAlign:'center' }} onClick={()=>setMenuOpen(false)}>Book Demo</a>
        </div>}
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', position:'relative', display:'flex', alignItems:'center', paddingTop:80, overflow:'hidden', background:`linear-gradient(170deg,#030e04 0%,#061508 55%,#020a03 100%)` }}>
        {/* Ember + nature glow orbs */}
        <div style={{ position:'absolute', top:'8%', right:'2%', width:580, height:580, borderRadius:'50%', background:`radial-gradient(circle,rgba(251,191,36,0.18) 0%,rgba(249,115,22,0.08) 50%,transparent 70%)`, filter:'blur(70px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'8%', left:'1%', width:460, height:460, borderRadius:'50%', background:`radial-gradient(circle,rgba(74,222,128,0.14) 0%,rgba(22,163,74,0.06) 50%,transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'50%', left:'45%', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,rgba(249,115,22,0.1) 0%,transparent 70%)`, filter:'blur(45px)', pointerEvents:'none' }}/>
        {/* Fire ember particles */}
        {[...Array(45)].map((_,i)=>(
          <div key={i} style={{ position:'absolute', left:`${(i*41+9)%100}%`, top:`${(i*57+7)%100}%`, width:i%6===0?4:i%3===0?2.5:1.5, height:i%6===0?4:i%3===0?2.5:1.5, borderRadius:'50%', background:i%4===0?N.lime:i%3===0?N.amber:i%2===0?N.orange:N.green, opacity:0.18+(i%5)*0.08, pointerEvents:'none', boxShadow:i%7===0?`0 0 6px ${N.amber}`:i%9===0?`0 0 5px ${N.lime}`:undefined }}/>
        ))}
        {/* Root network grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle,rgba(74,222,128,0.07) 1px,transparent 1px)`, backgroundSize:'44px 44px', pointerEvents:'none' }}/>
        {/* Warm horizon line */}
        <div style={{ position:'absolute', top:'62%', left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,rgba(251,191,36,0.1),transparent)`, pointerEvents:'none' }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 24px', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(251,191,36,0.1)', border:`1px solid rgba(251,191,36,0.38)`, borderRadius:100, padding:'6px 16px', fontSize:13, color:N.amber, marginBottom:28, fontWeight:600, boxShadow:`0 0 20px rgba(251,191,36,0.12)` }}>
              <Factory size={13}/> Factory and Process Automation SCADA
            </div>
            <h1 style={{ fontSize:'clamp(34px,5vw,66px)', fontWeight:900, lineHeight:1.05, marginBottom:22, letterSpacing:'-1.5px' }}>
              <span style={{ background:`linear-gradient(135deg,${N.gold} 0%,${N.amber} 30%,${N.orange} 65%,${N.red} 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 0 24px rgba(251,191,36,0.4))' }}>{heroTag}</span>
            </h1>
            <p style={{ fontSize:17, color:N.muted, lineHeight:1.78, marginBottom:16, maxWidth:490 }}>
              NexaProc monitors, controls, and optimises every process in your plant — from raw material to finished product — with the fierce intelligence of nature itself.
            </p>
            {/* Trust bar */}
            <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginBottom:36, fontSize:13, color:N.dim }}>
              {['50+ Plants Deployed','94.2% Avg OEE','ISA-88 Compliant','FDA 21 CFR Part 11'].map(t=>(
                <span key={t} style={{ display:'flex', alignItems:'center', gap:5 }}><CheckCircle size={12} style={{ color:N.lime }}/>{t}</span>
              ))}
            </div>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <a href="#contact" style={{ display:'flex', alignItems:'center', gap:8, background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'14px 28px', borderRadius:10, fontWeight:700, fontSize:15, textDecoration:'none', boxShadow:`0 6px 30px rgba(251,191,36,0.45)` }}>
                Book Live Demo <ArrowRight size={18}/>
              </a>
              <a href="#features" style={{ display:'flex', alignItems:'center', gap:8, border:`1px solid rgba(251,191,36,0.3)`, color:N.muted, padding:'14px 24px', borderRadius:10, fontWeight:600, fontSize:15, textDecoration:'none', background:'rgba(251,191,36,0.04)' }}>
                <Download size={16}/> Technical Specs
              </a>
            </div>
            <div style={{ marginTop:20, fontSize:13, color:N.dim }}>
              <Phone size={13} style={{ display:'inline', marginRight:6, color:N.lime }}/> WhatsApp: <a href="https://wa.me/919373111709" style={{ color:N.amber, textDecoration:'none', fontWeight:600 }}>+91 93731 11709</a>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <ProcessMockup/>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', color:N.dim }}>
          <ChevronDown size={26}/>
        </div>
      </section>

      {/* ── CLIENT BAR ── */}
      <section style={{ background:N.bg2c, padding:'26px 24px', borderBottom:`1px solid rgba(251,191,36,0.08)` }}>
        <div style={{ maxWidth:1280, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:11, letterSpacing:3, color:N.dimmer, marginBottom:16 }}>TRUSTED BY INDIA'S LEADING MANUFACTURERS</p>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'12px 40px' }}>
            {['Sun Pharma','Tata Chemicals','Hindustan Unilever','UltraTech Cement','Godrej Industries','Asian Paints'].map(n=>(
              <span key={n} style={{ fontSize:13, fontWeight:700, color:N.dimmer, letterSpacing:1 }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg2c} to={N.bg}/>

      {/* ── PROBLEM ── */}
      <section style={{ background:N.bg, padding:'88px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-block', background:'rgba(251,191,36,0.08)', border:`1px solid rgba(251,191,36,0.28)`, borderRadius:100, padding:'5px 18px', fontSize:11, color:N.amber, fontWeight:700, letterSpacing:3, marginBottom:16 }}>THE PROBLEM</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:900, marginBottom:12 }}>Process Blindness Is Costing You Every Shift</h2>
            <p style={{ color:N.muted, maxWidth:520, margin:'0 auto', fontSize:16, lineHeight:1.7 }}>Without real-time visibility, every batch is a gamble. NexaProc was built to end that.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:22 }}>
            {problems.map(p=>(
              <div key={p.label} style={{ background:'rgba(251,191,36,0.04)', border:`1px solid rgba(251,191,36,0.14)`, borderRadius:18, padding:'34px 28px', transition:'all .3s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(251,191,36,0.4)';e.currentTarget.style.background='rgba(251,191,36,0.07)';e.currentTarget.style.boxShadow=`0 0 30px rgba(251,191,36,0.1)`}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(251,191,36,0.14)';e.currentTarget.style.background='rgba(251,191,36,0.04)';e.currentTarget.style.boxShadow='none'}}>
                <div style={{ width:54, height:54, borderRadius:15, background:'rgba(251,191,36,0.1)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 0 22px rgba(251,191,36,0.2)` }}>
                  <p.icon size={25} style={{ color:N.amber }}/>
                </div>
                <div style={{ fontSize:44, fontWeight:900, background:`linear-gradient(135deg,${N.gold},${N.orange})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:10, filter:'drop-shadow(0 0 8px rgba(251,191,36,0.35))' }}>{p.stat}</div>
                <p style={{ color:N.muted, fontSize:15, lineHeight:1.65 }}>{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg} to={N.bg3}/>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background:N.bg3, padding:'88px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-block', background:'rgba(74,222,128,0.08)', border:`1px solid rgba(74,222,128,0.25)`, borderRadius:100, padding:'5px 18px', fontSize:11, color:N.green, fontWeight:700, letterSpacing:3, marginBottom:16 }}>PLATFORM FEATURES</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:900, marginBottom:12 }}>Engineered for Process Engineers</h2>
            <p style={{ color:N.muted, maxWidth:480, margin:'0 auto', fontSize:16 }}>Every feature built for the realities of industrial plant operations.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:20 }}>
            {features.map(f=>(
              <div key={f.title} style={{ background:'rgba(251,191,36,0.03)', border:`1px solid rgba(251,191,36,0.1)`, borderRadius:18, padding:28, transition:'all .28s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor=`${f.c}55`;e.currentTarget.style.background=`${f.c}07`;e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow=`0 0 30px ${f.c}14`}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(251,191,36,0.1)';e.currentTarget.style.background='rgba(251,191,36,0.03)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                <div style={{ width:50, height:50, borderRadius:14, background:`${f.c}14`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 0 18px ${f.c}22` }}>
                  <f.icon size={23} style={{ color:f.c }}/>
                </div>
                <h3 style={{ fontWeight:700, fontSize:16, marginBottom:9 }}>{f.title}</h3>
                <p style={{ color:N.muted, fontSize:14, lineHeight:1.67 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg3} to={N.bg}/>

      {/* ── ROI ── */}
      <section style={{ background:N.bg, padding:'88px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-block', background:'rgba(251,191,36,0.08)', border:`1px solid rgba(251,191,36,0.28)`, borderRadius:100, padding:'5px 18px', fontSize:11, color:N.amber, fontWeight:700, letterSpacing:3, marginBottom:16 }}>PROVEN ROI</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:900, marginBottom:18 }}>The NexaProc Impact — By the Numbers</h2>
            <p style={{ color:N.muted, fontSize:16, lineHeight:1.78, marginBottom:30 }}>Plants running on NexaProc consistently outperform industry benchmarks on OEE, energy, and uptime.</p>
            <a href="#contact" style={{ display:'inline-flex', alignItems:'center', gap:8, background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'13px 28px', borderRadius:10, fontWeight:700, fontSize:15, textDecoration:'none', boxShadow:`0 6px 24px rgba(251,191,36,0.38)` }}>
              Calculate Your ROI <ArrowRight size={17}/>
            </a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
            {stats.map(s=>(
              <div key={s.label} style={{ background:s.hi?`linear-gradient(135deg,rgba(251,191,36,0.18),rgba(74,222,128,0.1))`:'rgba(255,255,255,0.03)', border:s.hi?`1px solid rgba(251,191,36,0.35)`:`1px solid rgba(255,255,255,0.07)`, borderRadius:18, padding:'30px 24px', boxShadow:s.hi?`0 0 28px rgba(251,191,36,0.1)`:undefined }}>
                <div style={{ fontSize:38, fontWeight:900, background:`linear-gradient(135deg,${N.gold},${N.orange})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:9, filter:s.hi?'drop-shadow(0 0 8px rgba(251,191,36,0.35))':undefined }}>{s.val}</div>
                <p style={{ color:N.muted, fontSize:14, lineHeight:1.5 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg} to={N.bg3}/>

      {/* ── PROCESS ── */}
      <section id="process" style={{ background:N.bg3, padding:'88px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ display:'inline-block', background:'rgba(74,222,128,0.08)', border:`1px solid rgba(74,222,128,0.25)`, borderRadius:100, padding:'5px 18px', fontSize:11, color:N.lime, fontWeight:700, letterSpacing:3, marginBottom:16 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:900, marginBottom:12 }}>From Installation to Full Control — 4 Steps</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:10, position:'relative' }}>
            <div style={{ position:'absolute', top:42, left:'12%', right:'12%', height:2, background:`linear-gradient(90deg,${N.green},${N.amber},${N.orange},${N.red})`, opacity:0.3 }} className="hidden md:block"/>
            {processSteps.map((p,i)=>(
              <div key={p.n} style={{ textAlign:'center', padding:'0 12px', position:'relative', zIndex:1 }}>
                <div style={{ width:86, height:86, borderRadius:'50%', background:`radial-gradient(circle,rgba(251,191,36,0.14) 0%,rgba(74,222,128,0.07) 100%)`, border:`2px solid ${i<2?N.amber:N.orange}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', flexDirection:'column', gap:2, boxShadow:`0 0 28px ${i<2?`rgba(251,191,36,0.22)`:`rgba(249,115,22,0.22)`}` }}>
                  <p.icon size={24} style={{ color:i<2?N.amber:N.orange }}/>
                  <span style={{ fontSize:10, color:N.dim, fontWeight:700 }}>{p.n}</span>
                </div>
                <h3 style={{ fontWeight:800, fontSize:17, marginBottom:10 }}>{p.title}</h3>
                <p style={{ color:N.muted, fontSize:14, lineHeight:1.67 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg3} to={N.bg}/>

      {/* ── INDUSTRIES ── */}
      <section id="industries" style={{ background:N.bg, padding:'88px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:900, marginBottom:12 }}>Industries We Serve</h2>
          <p style={{ color:N.muted, marginBottom:48, fontSize:16 }}>NexaProc adapts to your industry's unique process environment and compliance requirements.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))', gap:14 }}>
            {industries.map((ind,idx)=>(
              <div key={ind.label} style={{ border:`1px solid rgba(251,191,36,0.12)`, borderRadius:15, padding:'24px 12px', transition:'all .25s', background:'rgba(251,191,36,0.02)' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor=idx%2===0?N.amber:N.lime;e.currentTarget.style.background=idx%2===0?`${N.amber}08`:`${N.green}08`;e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow=`0 0 20px rgba(251,191,36,0.1)`}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(251,191,36,0.12)';e.currentTarget.style.background='rgba(251,191,36,0.02)';e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='none'}}>
                <ind.icon size={29} style={{ color:idx%2===0?N.amber:N.lime, marginBottom:11 }}/>
                <div style={{ fontSize:13, fontWeight:600, color:N.muted }}>{ind.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg} to={N.bg3}/>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" style={{ background:N.bg3, padding:'88px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(26px,4vw,42px)', fontWeight:900, marginBottom:12 }}>Works with Your Existing Infrastructure</h2>
          <p style={{ color:N.muted, marginBottom:48, fontSize:16 }}>No rip-and-replace. NexaProc connects natively to every major PLC brand and industrial protocol.</p>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:13 }}>
            {integrations.map(n=>(
              <div key={n} style={{ background:'rgba(251,191,36,0.04)', border:`1px solid rgba(251,191,36,0.18)`, borderRadius:10, padding:'10px 22px', color:N.muted, fontWeight:600, fontSize:14, transition:'all .2s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor=N.amber;e.currentTarget.style.color=N.gold;e.currentTarget.style.background='rgba(251,191,36,0.08)';e.currentTarget.style.boxShadow=`0 0 14px rgba(251,191,36,0.12)`}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(251,191,36,0.18)';e.currentTarget.style.color=N.muted;e.currentTarget.style.background='rgba(251,191,36,0.04)';e.currentTarget.style.boxShadow='none'}}>
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg3} to='#050d03'/>

      {/* ── CTA ── */}
      <section id="contact" style={{ background:'#050d03', padding:'110px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 50%,rgba(251,191,36,0.13) 0%,rgba(74,222,128,0.06) 50%,transparent 70%)`, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,rgba(251,191,36,0.4),transparent)`, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,rgba(74,222,128,0.2),transparent)`, pointerEvents:'none' }}/>
        <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ width:66, height:66, borderRadius:'50%', background:`radial-gradient(circle,rgba(251,191,36,0.2),rgba(249,115,22,0.1))`, border:`1px solid rgba(251,191,36,0.4)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', boxShadow:`0 0 40px rgba(251,191,36,0.3)` }}>
            <CheckCircle size={31} style={{ color:N.amber }}/>
          </div>
          <h2 style={{ fontSize:'clamp(30px,5vw,54px)', fontWeight:900, lineHeight:1.1, marginBottom:22, background:`linear-gradient(135deg,${N.white},${N.gold},${N.amber})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Start Your Digital Plant Transformation
          </h2>
          <p style={{ color:N.muted, fontSize:17, lineHeight:1.78, marginBottom:42 }}>Our team sets up a live demo on a plant similar to yours — within 24 hours. No commitment required.</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="mailto:hello@galvon.com" style={{ display:'inline-flex', alignItems:'center', gap:10, background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'16px 38px', borderRadius:12, fontWeight:800, fontSize:17, textDecoration:'none', boxShadow:`0 8px 32px rgba(251,191,36,0.45)` }}>
              Book a Demo <ArrowRight size={20}/>
            </a>
            <a href="https://wa.me/919373111709" style={{ display:'inline-flex', alignItems:'center', gap:8, border:`1px solid rgba(251,191,36,0.35)`, color:N.muted, padding:'16px 28px', borderRadius:12, fontWeight:600, fontSize:16, textDecoration:'none', background:'rgba(251,191,36,0.04)' }}>
              <Phone size={18}/> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:N.bg, borderTop:`1px solid rgba(251,191,36,0.1)`, padding:'42px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:22 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,${N.amber},${N.orange})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 16px rgba(251,191,36,0.4)` }}>
              <Factory size={16} color="white"/>
            </div>
            <div>
              <span style={{ fontWeight:900, fontSize:18, background:`linear-gradient(90deg,${N.gold},${N.amber})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>NexaProc</span>
              <span style={{ marginLeft:8, fontSize:11, color:N.green, fontWeight:700 }}>by GALVON</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:26, fontSize:13, color:N.dim }}>
            {['Ampris','FlowNexus','NexaProc','Industries','About','Contact'].map(n=><a key={n} href={`#${n.toLowerCase()}`} style={{ textDecoration:'none', color:N.dim, transition:'color .2s' }} onMouseOver={e=>(e.currentTarget.style.color=N.amber)} onMouseOut={e=>(e.currentTarget.style.color=N.dim)}>{n}</a>)}
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:N.dim, fontSize:13 }}>drmhope.com | A Bettroi Product</div>
            <div style={{ color:N.dimmer, fontSize:11, marginTop:4 }}>v{VERSION} | {BUILD_DATE} | nexaproc</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
