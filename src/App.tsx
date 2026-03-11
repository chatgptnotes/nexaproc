import { useState, useEffect } from 'react'
import { Factory, Activity, Bell, FlaskConical, Zap, BarChart3, Cpu, Wifi, ArrowRight, CheckCircle, ChevronDown, Pill, Wheat, Shirt, Car, Mountain, Menu, X, Settings, TrendingUp, Shield, Layers, Phone, Download, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react'

const VERSION = '1.2'; const BUILD_DATE = 'March 2026'
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
async function fetchGeminiText(prompt: string, fallback: string): Promise<string> {
  if (!GEMINI_KEY) return fallback
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) })
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallback
  } catch { return fallback }
}

// ── NATURE PHOENIX palette ────────────────────────────────────────────────────
const N = { bg:'#05100a', bg2:'#071408', amber:'#f59e0b', orange:'#ea580c', green:'#16a34a', lime:'#22c55e', gold:'#fbbf24', white:'#ffffff', muted:'rgba(255,255,255,0.55)', dim:'rgba(255,255,255,0.3)' }

function WaveDivider({ from, to, flip=false }:{ from:string; to:string; flip?:boolean }) {
  return (
    <div style={{ background:to, lineHeight:0 }} className={flip?'rotate-180':''}>
      <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="100%" height="70">
        <path d="M0,35 Q360,70 720,35 Q1080,0 1440,35 L1440,0 L0,0 Z" fill={from}/>
      </svg>
    </div>
  )
}

function ProcessMonitorMockup() {
  const trendY = [95,90,88,92,85,87,80,83,75,78,72,76,70]
  const oee = [62,65,68,70,72,74,76,78]
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:560 }}>
      <div style={{ position:'absolute', inset:-30, borderRadius:24, background:`radial-gradient(ellipse at 50% 40%,rgba(245,158,11,0.25) 0%,transparent 70%)`, filter:'blur(30px)', pointerEvents:'none' }}/>
      <svg viewBox="0 0 540 430" style={{ width:'100%', display:'block', filter:'drop-shadow(0 20px 60px rgba(245,158,11,0.3))' }}>
        {/* Panel */}
        <rect x="0" y="0" width="540" height="430" rx="14" fill="rgba(4,9,3,0.97)" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5"/>
        {/* subtle scanlines */}
        {[...Array(20)].map((_,i)=><line key={i} x1="0" y1={i*22} x2="540" y2={i*22} stroke="rgba(245,158,11,0.025)" strokeWidth="1"/>)}
        {/* Header */}
        <rect x="0" y="0" width="540" height="40" rx="14" fill="rgba(245,158,11,0.1)"/>
        <rect x="0" y="26" width="540" height="14" fill="rgba(245,158,11,0.1)"/>
        <circle cx="18" cy="20" r="5" fill="#ef4444" opacity="0.85"/>
        <circle cx="34" cy="20" r="5" fill="#f59e0b" opacity="0.85"/>
        <circle cx="50" cy="20" r="5" fill="#22c55e" opacity="0.85"/>
        <text x="72" y="20" fontFamily="monospace" fontSize="12" fill="rgba(255,255,255,0.7)" dominantBaseline="middle">NexaProc · Process Monitor · Plant A — Line 3</text>
        <circle cx="498" cy="20" r="4" fill="#22c55e"/>
        <text x="508" y="20" fontFamily="monospace" fontSize="10" fill="#22c55e" dominantBaseline="middle">RUN</text>

        {/* Process flow */}
        <text x="14" y="55" fontFamily="monospace" fontSize="9" fill={N.dim} letterSpacing="2">PROCESS FLOW — BATCH #2847</text>
        {[
          { label:'REACTOR', val:'97.4°C', color:N.orange },
          { label:'MIXER', val:'850 RPM', color:N.amber },
          { label:'SEPARATOR', val:'2.1 bar', color:N.green },
          { label:'OUTPUT', val:'OK', color:N.lime },
        ].map((s,i)=>{
          const x = 12 + i * 129
          return (
            <g key={i}>
              <rect x={x} y="62" width="118" height="62" rx="8" fill="rgba(255,255,255,0.02)" stroke={`${s.color}55`} strokeWidth="1"/>
              <rect x={x} y="62" width="118" height="22" rx="8" fill={`${s.color}15`}/>
              <rect x={x} y="74" width="118" height="10" fill={`${s.color}15`}/>
              <text x={x+59} y="73" fontFamily="monospace" fontSize="9" fontWeight="bold" fill={s.color} textAnchor="middle" dominantBaseline="middle" letterSpacing="1">{s.label}</text>
              <text x={x+59} y="103" fontFamily="monospace" fontSize="17" fontWeight="900" fill="white" textAnchor="middle" dominantBaseline="middle">{s.val}</text>
              {i<3&&<><line x1={x+118} y1="93" x2={x+124} y2="93" stroke={s.color} strokeWidth="1.5" opacity="0.5"/><polygon points={`${x+126},89 ${x+132},93 ${x+126},97`} fill={s.color} fillOpacity="0.5"/></>}
            </g>
          )
        })}

        {/* Metrics row */}
        <text x="14" y="142" fontFamily="monospace" fontSize="9" fill={N.dim} letterSpacing="2">LIVE METRICS</text>
        {[
          { label:'Production', val:'847', unit:'units/hr', color:N.amber },
          { label:'OEE Score', val:'94.2', unit:'%', color:N.green },
          { label:'Alarms', val:'2', unit:'low priority', color:N.orange },
          { label:'Energy', val:'18.4', unit:'kWh/unit', color:N.gold },
        ].map((m,i)=>(
          <g key={i}>
            <rect x={12+i*129} y={150} width="120" height="56" rx="7" fill="rgba(255,255,255,0.02)" stroke={`${m.color}35`} strokeWidth="1"/>
            <text x={12+i*129+10} y={167} fontFamily="monospace" fontSize="9" fill={N.dim} dominantBaseline="middle">{m.label}</text>
            <text x={12+i*129+10} y={188} fontFamily="monospace" fontSize="19" fontWeight="900" fill={m.color} dominantBaseline="middle">{m.val}</text>
            <text x={12+i*129+10} y={201} fontFamily="monospace" fontSize="8" fill={N.dim} dominantBaseline="middle">{m.unit}</text>
          </g>
        ))}

        {/* Separator */}
        <line x1="12" y1="218" x2="528" y2="218" stroke={`${N.amber}18`} strokeWidth="1"/>

        {/* Trend chart */}
        <text x="14" y="232" fontFamily="monospace" fontSize="9" fill={N.dim} letterSpacing="2">PRODUCTION TREND — LAST 13 HRS</text>
        {[0,1,2,3].map(i=><line key={i} x1="14" y1={252+i*18} x2="380" y2={252+i*18} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
        <polyline points={`14,330 ${trendY.map((y,i)=>`${14+i*28},${y+252}`).join(' ')} 350,330`} fill={`${N.amber}12`} stroke="none"/>
        <polyline points={trendY.map((y,i)=>`${14+i*28},${y+252}`).join(' ')} fill="none" stroke={N.amber} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {trendY.map((y,i)=><circle key={i} cx={14+i*28} cy={y+252} r="2.5" fill={N.amber} opacity="0.8"/>)}

        {/* OEE trend bar */}
        <text x="392" y="232" fontFamily="monospace" fontSize="9" fill={N.dim} letterSpacing="2">OEE HISTORY</text>
        {oee.map((v,i)=>(
          <g key={i}>
            <rect x={392+i*18} y={330-v+30} width="13" height={v-30} rx="2" fill={N.green} opacity="0.65"/>
          </g>
        ))}
        <text x="392" y="338" fontFamily="monospace" fontSize="8" fill={N.dim}>62%</text>
        <text x="500" y="338" fontFamily="monospace" fontSize="8" fill={N.lime}>78%</text>

        {/* Footer */}
        <rect x="0" y="396" width="540" height="34" rx="0" fill={`${N.amber}08`}/>
        <rect x="0" y="410" width="540" height="20" rx="14" fill={`${N.amber}08`}/>
        <circle cx="18" cy="413" r="3" fill="#22c55e"/>
        <text x="28" y="413" fontFamily="monospace" fontSize="9" fill={N.dim} dominantBaseline="middle">Plant A · Line 3 running · Batch #2847 in progress · 94.2% OEE · 2 low alarms</text>
      </svg>
    </div>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroSub, setHeroSub] = useState('Unleash Nature\'s Intelligence in Every Process Line')
  useEffect(() => {
    fetchGeminiText('Write a powerful 7-8 word headline for NexaProc, a factory SCADA platform. Nature and fire energy theme. Bold. No quotes.', "Unleash Nature's Intelligence in Every Process Line").then(setHeroSub)
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
    { icon:Settings, title:'ISA-88 Batch Control', desc:'Recipe management, electronic batch records, and full audit trails for regulated industries.', c:N.amber },
    { icon:Zap, title:'Per-unit Energy Analytics', desc:'Real-time energy consumption per unit produced — identify waste and cut costs.', c:N.green },
    { icon:Cpu, title:'Predictive Maintenance AI', desc:'Equipment health scoring that flags failures days before they cascade into downtime.', c:N.amber },
    { icon:Shield, title:'IEC 62443 + FDA 21 CFR', desc:'Pharmaceutical and chemical-grade compliance with full cybersecurity hardening.', c:N.green },
  ]

  const processSteps = [
    { n:'01', icon:Wifi, title:'Connect Everything', desc:'OPC-UA, Modbus, MQTT — plug into any PLC, DCS, or sensor without replacing your existing infrastructure.' },
    { n:'02', icon:Activity, title:'Visualize Live', desc:'Auto-built SCADA dashboards with P&ID overlays, real-time trend charts, and alarm panels.' },
    { n:'03', icon:TrendingUp, title:'Predict and Alert', desc:'AI learns your process patterns and flags anomalies before they cascade.' },
    { n:'04', icon:BarChart3, title:'Optimize Output', desc:'Close the loop — automate responses, track OEE, and deliver executive-level reporting.' },
  ]

  const stats = [
    { val:'35%', label:'Reduction in unplanned downtime', dark:true },
    { val:'94.2%', label:'Average OEE achieved on NexaProc plants', dark:false },
    { val:'₹2.1 Cr', label:'Average annual energy savings per facility', dark:true },
    { val:'50+', label:'Plants deployed across India and globally', dark:false },
  ]

  const industries = [
    { icon:Pill, label:'Pharmaceutical' }, { icon:Wheat, label:'Food and Beverage' },
    { icon:FlaskConical, label:'Chemical' }, { icon:Shirt, label:'Textiles' },
    { icon:Car, label:'Auto Manufacturing' }, { icon:Mountain, label:'Cement' },
    { icon:Layers, label:'Plastics and Rubber' }, { icon:Factory, label:'General Manufacturing' },
  ]

  const integrations = ['Siemens S7','Allen Bradley','Schneider','OPC-UA','Modbus TCP/RTU','MQTT','Profibus','IEC 61131','REST API','SAP MES']

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:N.bg, color:N.white, minHeight:'100vh' }}>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:50, background:'rgba(5,16,10,0.9)', backdropFilter:'blur(20px)', borderBottom:`1px solid rgba(245,158,11,0.15)` }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${N.amber},${N.orange})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 20px rgba(245,158,11,0.45)` }}>
              <Factory size={18} color="white"/>
            </div>
            <div>
              <span style={{ fontWeight:900, fontSize:20 }}>NexaProc</span>
              <span style={{ marginLeft:8, fontSize:11, color:N.amber, fontWeight:700, letterSpacing:2 }}>by GALVON</span>
            </div>
          </div>
          <div className="hidden md:flex" style={{ gap:28, fontSize:14, color:N.muted, alignItems:'center' }}>
            {navLinks.map(l=><a key={l} href={`#${l.toLowerCase()}`} style={{ textDecoration:'none', color:N.muted, transition:'color .2s' }} onMouseOver={e=>(e.currentTarget.style.color=N.amber)} onMouseOut={e=>(e.currentTarget.style.color=N.muted)}>{l}</a>)}
            <a href="#contact" style={{ background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'9px 22px', borderRadius:8, fontWeight:700, textDecoration:'none', boxShadow:`0 0 20px rgba(245,158,11,0.35)` }}>Book Demo</a>
          </div>
          <button className="md:hidden" style={{ color:N.white, background:'none', border:'none', cursor:'pointer' }} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
        {menuOpen&&<div style={{ borderTop:`1px solid rgba(245,158,11,0.15)`, padding:'16px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          {navLinks.map(l=><a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setMenuOpen(false)} style={{ textDecoration:'none', color:N.muted, fontSize:15 }}>{l}</a>)}
          <a href="#contact" style={{ background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'10px 20px', borderRadius:8, fontWeight:700, textDecoration:'none', textAlign:'center' }} onClick={()=>setMenuOpen(false)}>Book Demo</a>
        </div>}
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', position:'relative', display:'flex', alignItems:'center', paddingTop:80, overflow:'hidden', background:`linear-gradient(160deg,#05100a 0%,#0a1a05 55%,#030a02 100%)` }}>
        {/* Nature Phoenix glow orbs */}
        <div style={{ position:'absolute', top:'10%', right:'3%', width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle,rgba(245,158,11,0.15) 0%,transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'10%', left:'2%', width:350, height:350, borderRadius:'50%', background:`radial-gradient(circle,rgba(22,163,74,0.12) 0%,transparent 70%)`, filter:'blur(50px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'50%', left:'50%', width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle,rgba(234,88,12,0.08) 0%,transparent 70%)`, filter:'blur(40px)', pointerEvents:'none' }}/>
        {/* Ember particles */}
        {[...Array(30)].map((_,i)=><div key={i} style={{ position:'absolute', left:`${(i*41+9)%100}%`, top:`${(i*57+7)%100}%`, width:i%5===0?3.5:i%3===0?2:1.5, height:i%5===0?3.5:i%3===0?2:1.5, borderRadius:'50%', background:i%3===0?N.amber:i%2===0?N.orange:N.green, opacity:0.2+(i%5)*0.07, pointerEvents:'none' }}/>)}
        {/* Dot grid */}
        <div style={{ position:'absolute', inset:0, opacity:0.04, backgroundImage:`radial-gradient(circle,${N.amber} 1px,transparent 1px)`, backgroundSize:'48px 48px', pointerEvents:'none' }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 24px', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,158,11,0.1)', border:`1px solid rgba(245,158,11,0.35)`, borderRadius:100, padding:'6px 16px', fontSize:13, color:N.amber, marginBottom:28, fontWeight:600 }}>
              <Factory size={13}/> Factory and Process Automation SCADA
            </div>
            <h1 style={{ fontSize:'clamp(34px,5vw,62px)', fontWeight:900, lineHeight:1.06, marginBottom:20, letterSpacing:'-1px' }}>
              <span style={{ background:`linear-gradient(135deg,${N.gold},${N.amber},${N.orange})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{heroSub}</span>
            </h1>
            <p style={{ fontSize:17, color:N.muted, lineHeight:1.75, marginBottom:14, maxWidth:480 }}>
              NexaProc monitors, controls, and optimises every process in your plant — from raw material to finished product — with the precision of nature's own intelligence.
            </p>
            {/* Trust bar */}
            <div style={{ display:'flex', gap:18, flexWrap:'wrap', marginBottom:36, fontSize:13, color:N.dim }}>
              {['50+ Plants Deployed','94.2% Avg OEE','ISA-88 Compliant','FDA 21 CFR Part 11'].map(t=>(
                <span key={t} style={{ display:'flex', alignItems:'center', gap:5 }}><CheckCircle size={12} style={{ color:N.lime }}/>{t}</span>
              ))}
            </div>
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              <a href="#contact" style={{ display:'flex', alignItems:'center', gap:8, background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'14px 28px', borderRadius:10, fontWeight:700, fontSize:15, textDecoration:'none', boxShadow:`0 6px 24px rgba(245,158,11,0.4)` }}>
                Book Live Demo <ArrowRight size={18}/>
              </a>
              <a href="#features" style={{ display:'flex', alignItems:'center', gap:8, border:`1px solid rgba(245,158,11,0.3)`, color:N.muted, padding:'14px 22px', borderRadius:10, fontWeight:600, fontSize:15, textDecoration:'none' }}>
                <Download size={16}/> Technical Specs
              </a>
            </div>
            <div style={{ marginTop:20, fontSize:13, color:N.dim }}>
              <Phone size={13} style={{ display:'inline', marginRight:6, color:N.lime }}/> WhatsApp: <a href="https://wa.me/919373111709" style={{ color:N.amber, textDecoration:'none' }}>+91 93731 11709</a>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <ProcessMonitorMockup/>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', color:N.dim }}>
          <ChevronDown size={26}/>
        </div>
      </section>

      {/* ── CLIENT BAR ── */}
      <section style={{ background:N.bg2, padding:'26px 24px', borderBottom:`1px solid rgba(245,158,11,0.08)` }}>
        <div style={{ maxWidth:1280, margin:'0 auto', textAlign:'center' }}>
          <p style={{ fontSize:11, letterSpacing:3, color:N.dim, marginBottom:16 }}>TRUSTED BY INDIA'S LEADING MANUFACTURERS</p>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'12px 36px' }}>
            {['Sun Pharma','Tata Chemicals','Hindustan Unilever','UltraTech Cement','Godrej Industries','Asian Paints'].map(n=>(
              <span key={n} style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.12)', letterSpacing:1 }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg2} to={N.bg}/>

      {/* ── PROBLEM ── */}
      <section style={{ background:N.bg, padding:'80px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ display:'inline-block', background:'rgba(245,158,11,0.1)', border:`1px solid rgba(245,158,11,0.3)`, borderRadius:100, padding:'5px 18px', fontSize:11, color:N.amber, fontWeight:700, letterSpacing:3, marginBottom:16 }}>THE PROBLEM</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, marginBottom:12 }}>Process Blindness Is Costing You Every Shift</h2>
            <p style={{ color:N.muted, maxWidth:520, margin:'0 auto', fontSize:16, lineHeight:1.7 }}>Without real-time visibility, every batch is a gamble. NexaProc was built to end that.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {problems.map(p=>(
              <div key={p.label} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid rgba(245,158,11,0.15)`, borderRadius:16, padding:'32px 28px' }}>
                <div style={{ width:52, height:52, borderRadius:14, background:'rgba(245,158,11,0.1)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                  <p.icon size={24} style={{ color:N.amber }}/>
                </div>
                <div style={{ fontSize:40, fontWeight:900, background:`linear-gradient(135deg,${N.gold},${N.orange})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:8 }}>{p.stat}</div>
                <p style={{ color:N.muted, fontSize:15, lineHeight:1.6 }}>{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg} to={N.bg2}/>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background:N.bg2, padding:'80px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ display:'inline-block', background:'rgba(22,163,74,0.1)', border:`1px solid rgba(22,163,74,0.3)`, borderRadius:100, padding:'5px 18px', fontSize:11, color:N.lime, fontWeight:700, letterSpacing:3, marginBottom:16 }}>PLATFORM FEATURES</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, marginBottom:12 }}>Engineered for Process Engineers</h2>
            <p style={{ color:N.muted, maxWidth:480, margin:'0 auto', fontSize:16 }}>Every feature built for the realities of industrial plant operations.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:18 }}>
            {features.map(f=>(
              <div key={f.title} style={{ background:'rgba(255,255,255,0.02)', border:`1px solid rgba(245,158,11,0.12)`, borderRadius:16, padding:26, transition:'all .25s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor=`${f.c}55`;e.currentTarget.style.background=`${f.c}06`;e.currentTarget.style.transform='translateY(-4px)'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(245,158,11,0.12)';e.currentTarget.style.background='rgba(255,255,255,0.02)';e.currentTarget.style.transform='translateY(0)'}}>
                <div style={{ width:48, height:48, borderRadius:12, background:`${f.c}12`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                  <f.icon size={22} style={{ color:f.c }}/>
                </div>
                <h3 style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>{f.title}</h3>
                <p style={{ color:N.muted, fontSize:14, lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg2} to={N.bg}/>

      {/* ── ROI ── */}
      <section style={{ background:N.bg, padding:'80px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-block', background:'rgba(245,158,11,0.1)', border:`1px solid rgba(245,158,11,0.3)`, borderRadius:100, padding:'5px 18px', fontSize:11, color:N.amber, fontWeight:700, letterSpacing:3, marginBottom:16 }}>PROVEN ROI</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, marginBottom:16 }}>The NexaProc Impact — By the Numbers</h2>
            <p style={{ color:N.muted, fontSize:16, lineHeight:1.75, marginBottom:28 }}>Plants running on NexaProc consistently outperform industry benchmarks on OEE, energy efficiency, and uptime.</p>
            <a href="#contact" style={{ display:'inline-flex', alignItems:'center', gap:8, background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'13px 26px', borderRadius:10, fontWeight:700, fontSize:15, textDecoration:'none' }}>
              Calculate Your ROI <ArrowRight size={17}/>
            </a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {stats.map((s)=>(
              <div key={s.label} style={{ background:s.dark?`linear-gradient(135deg,rgba(245,158,11,0.2),rgba(22,163,74,0.12))`:'rgba(255,255,255,0.03)', border:s.dark?`1px solid rgba(245,158,11,0.3)`:`1px solid rgba(255,255,255,0.06)`, borderRadius:16, padding:'28px 22px' }}>
                <div style={{ fontSize:36, fontWeight:900, background:`linear-gradient(135deg,${N.gold},${N.orange})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:8 }}>{s.val}</div>
                <p style={{ color:N.muted, fontSize:14, lineHeight:1.5 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg} to={N.bg2}/>

      {/* ── PROCESS ── */}
      <section id="process" style={{ background:N.bg2, padding:'80px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <div style={{ display:'inline-block', background:'rgba(22,163,74,0.08)', border:`1px solid rgba(22,163,74,0.3)`, borderRadius:100, padding:'5px 18px', fontSize:11, color:N.lime, fontWeight:700, letterSpacing:3, marginBottom:16 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, marginBottom:12 }}>From Installation to Full Control — 4 Steps</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:8, position:'relative' }}>
            <div style={{ position:'absolute', top:42, left:'12%', right:'12%', height:2, background:`linear-gradient(90deg,${N.green},${N.amber},${N.orange})`, opacity:0.25 }} className="hidden md:block"/>
            {processSteps.map((p,i)=>(
              <div key={p.n} style={{ textAlign:'center', padding:'0 12px', position:'relative', zIndex:1 }}>
                <div style={{ width:84, height:84, borderRadius:'50%', background:`radial-gradient(circle,rgba(245,158,11,0.12) 0%,rgba(22,163,74,0.06) 100%)`, border:`2px solid ${i<2?N.amber:N.orange}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', flexDirection:'column', gap:2, boxShadow:`0 0 24px rgba(245,158,11,0.18)` }}>
                  <p.icon size={24} style={{ color:i<2?N.amber:N.orange }}/>
                  <span style={{ fontSize:10, color:N.dim, fontWeight:700 }}>{p.n}</span>
                </div>
                <h3 style={{ fontWeight:800, fontSize:17, marginBottom:10 }}>{p.title}</h3>
                <p style={{ color:N.muted, fontSize:14, lineHeight:1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg2} to={N.bg}/>

      {/* ── INDUSTRIES ── */}
      <section id="industries" style={{ background:N.bg, padding:'80px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, marginBottom:12 }}>Industries We Serve</h2>
          <p style={{ color:N.muted, marginBottom:44, fontSize:16 }}>NexaProc adapts to your industry's unique process environment and compliance requirements.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:14 }}>
            {industries.map((ind,i)=>(
              <div key={ind.label} style={{ border:`1px solid rgba(245,158,11,0.12)`, borderRadius:14, padding:'22px 12px', transition:'all .25s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor=i%2===0?N.amber:N.lime;e.currentTarget.style.background=i%2===0?`${N.amber}07`:`${N.green}07`;e.currentTarget.style.transform='scale(1.04)'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(245,158,11,0.12)';e.currentTarget.style.background='transparent';e.currentTarget.style.transform='scale(1)'}}>
                <ind.icon size={28} style={{ color:i%2===0?N.amber:N.lime, marginBottom:10 }}/>
                <div style={{ fontSize:13, fontWeight:600, color:N.muted }}>{ind.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg} to={N.bg2}/>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" style={{ background:N.bg2, padding:'80px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, marginBottom:12 }}>Works with Your Existing Infrastructure</h2>
          <p style={{ color:N.muted, marginBottom:44, fontSize:16 }}>No rip-and-replace. NexaProc connects natively to every major PLC brand and industrial protocol.</p>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:12 }}>
            {integrations.map(n=>(
              <div key={n} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid rgba(245,158,11,0.2)`, borderRadius:10, padding:'10px 22px', color:N.muted, fontWeight:600, fontSize:14, transition:'all .2s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor=N.amber;e.currentTarget.style.color=N.amber}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(245,158,11,0.2)';e.currentTarget.style.color=N.muted}}>
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider from={N.bg2} to='#070d05'/>

      {/* ── CTA ── */}
      <section id="contact" style={{ background:'#070d05', padding:'100px 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at center,rgba(245,158,11,0.12) 0%,transparent 65%)`, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:`linear-gradient(to top,rgba(22,163,74,0.05),transparent)`, pointerEvents:'none' }}/>
        <div style={{ maxWidth:660, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          <CheckCircle size={48} style={{ color:N.amber, margin:'0 auto 24px' }}/>
          <h2 style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:900, lineHeight:1.1, marginBottom:20 }}>
            Start Your Digital Plant Transformation
          </h2>
          <p style={{ color:N.muted, fontSize:17, lineHeight:1.75, marginBottom:40 }}>Our team sets up a live demo on a plant similar to yours — within 24 hours. No commitment required.</p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="mailto:hello@galvon.com" style={{ display:'inline-flex', alignItems:'center', gap:10, background:`linear-gradient(135deg,${N.amber},${N.orange})`, color:'white', padding:'16px 36px', borderRadius:12, fontWeight:800, fontSize:17, textDecoration:'none', boxShadow:`0 8px 28px rgba(245,158,11,0.4)` }}>
              Book a Demo <ArrowRight size={20}/>
            </a>
            <a href="https://wa.me/919373111709" style={{ display:'inline-flex', alignItems:'center', gap:8, border:`1px solid rgba(245,158,11,0.35)`, color:N.muted, padding:'16px 28px', borderRadius:12, fontWeight:600, fontSize:16, textDecoration:'none' }}>
              <Phone size={18}/> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#030a02', borderTop:`1px solid rgba(245,158,11,0.1)`, padding:'40px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`linear-gradient(135deg,${N.amber},${N.orange})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Factory size={15} color="white"/>
            </div>
            <div>
              <span style={{ fontWeight:900, fontSize:18 }}>NexaProc</span>
              <span style={{ marginLeft:8, fontSize:11, color:N.amber, fontWeight:700 }}>by GALVON</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:24, fontSize:13, color:N.dim }}>
            {['Ampris','FlowNexus','NexaProc','Industries','About','Contact'].map(n=><a key={n} href={`#${n.toLowerCase()}`} style={{ textDecoration:'none', color:N.dim, transition:'color .2s' }} onMouseOver={e=>(e.currentTarget.style.color=N.amber)} onMouseOut={e=>(e.currentTarget.style.color=N.dim)}>{n}</a>)}
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:N.dim, fontSize:13 }}>drmhope.com | A Bettroi Product</div>
            <div style={{ color:'rgba(255,255,255,0.18)', fontSize:11, marginTop:4 }}>v{VERSION} | {BUILD_DATE} | nexaproc</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
