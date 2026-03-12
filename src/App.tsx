import React, { useState, FC, CSSProperties } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, Bell,
  Building2, Car, CheckCircle, Cpu, Factory, FlaskConical,
  Gauge, Layers, Lock, Phone, Plug, Server,
  Shirt, Siren, Smartphone, TrendingDown, User, Wheat,
} from 'lucide-react';

const VERSION = '1.5'; const BUILD_DATE = 'March 2026';

const C = {
  bg: '#081f10', amber: '#fbbf24', orange: '#f97316',
  green: '#4ade80', forest: '#16a34a', gold: '#fde68a',
  teal: '#0d9488', lime: '#a3e635',
  white: 'rgba(255,255,255,0.95)', muted: 'rgba(255,255,255,0.72)',
  dim: 'rgba(255,255,255,0.38)',
  card: 'rgba(8,32,14,0.75)', cardBorder: 'rgba(74,222,128,0.28)',
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const img = (name: string) => `/${name}`;

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
const NavBar: FC = () => {
  const links = ['Platform', 'Industries', 'Integrations', 'Contact'];
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(8,26,12,0.92)', backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(74,222,128,0.22)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 28px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg,${C.amber},${C.orange})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 22px rgba(251,191,36,0.5)`,
          }}>
            <Factory size={20} color="white" />
          </div>
          <span style={{
            fontWeight: 900, fontSize: 21,
            background: `linear-gradient(90deg,${C.gold},${C.amber})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>NexaProc</span>
          <span style={{ fontSize: 10, color: C.green, fontWeight: 700, letterSpacing: 2, marginLeft: 2 }}>by GALVON</span>
        </a>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ textDecoration: 'none', color: C.muted, fontSize: 14, fontWeight: 500, transition: 'color .2s' }}
              onMouseOver={e => e.currentTarget.style.color = C.amber}
              onMouseOut={e => e.currentTarget.style.color = C.muted}>
              {l}
            </a>
          ))}
          <a href="#contact" style={{
            background: `linear-gradient(135deg,${C.amber},${C.orange})`,
            color: 'white', padding: '10px 24px', borderRadius: 9, fontWeight: 800,
            fontSize: 14, textDecoration: 'none', boxShadow: `0 0 22px rgba(251,191,36,0.38)`,
          }}>
            Book Demo
          </a>
        </div>
      </div>
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HERO — full Gemini 3 Pro generated background
// ─────────────────────────────────────────────────────────────────────────────
const HeroSection: FC = () => (
  <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
    {/* Gemini 3 Pro "Roots of Power" style hero — wide panoramic */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `url(${img('hero_wide.jpg')})`,
      backgroundSize: 'cover', backgroundPosition: 'center top',
      filter: 'brightness(0.78)',
    }} />
    {/* Subtle overlay — lighter than before so image shows through */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1,
      background: 'linear-gradient(135deg, rgba(8,31,16,0.82) 0%, rgba(8,31,16,0.40) 55%, rgba(8,31,16,0.62) 100%)',
    }} />
    {/* Left text-safe vignette */}
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: '45%', zIndex: 2,
      background: 'linear-gradient(to right, rgba(8,31,16,0.90), transparent)',
    }} />

    {/* Portrait "Roots of Power" image — right side accent */}
    <div style={{
      position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)',
      width: 'clamp(220px,28vw,400px)', zIndex: 3,
      backgroundImage: `url(${img('hero_roots.jpg')})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      aspectRatio: '9/16', borderRadius: 24,
      opacity: 0.82,
      boxShadow: '0 0 80px rgba(74,222,128,0.22), 0 0 160px rgba(251,191,36,0.1)',
      border: '1px solid rgba(74,222,128,0.3)',
    }} />

    <div style={{
      position: 'relative', zIndex: 3, maxWidth: 1280, margin: '0 auto',
      padding: '120px 28px 80px', width: '100%',
    }}>
      <div style={{ maxWidth: 620 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.38)',
          borderRadius: 100, padding: '7px 18px', fontSize: 13, color: C.amber,
          fontWeight: 600, marginBottom: 30, boxShadow: '0 0 28px rgba(251,191,36,0.14)',
        }}>
          <Factory size={13} /> Industrial SCADA &amp; Process Automation
        </div>

        <h1 style={{
          fontSize: 'clamp(38px,5.5vw,70px)', fontWeight: 900, lineHeight: 1.06,
          marginBottom: 24, letterSpacing: '-2px',
          background: `linear-gradient(135deg,${C.gold} 0%,${C.amber} 40%,${C.orange} 80%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 32px rgba(251,191,36,0.38))',
        }}>
          Industrial Intelligence.<br />Nature Precision.
        </h1>

        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.78, marginBottom: 42, maxWidth: 560 }}>
          With roots that run deep in nature's resilience, NexaProc elevates industrial SCADA to an art of transformation. As embers of legacy ignite, each process is refined with the precision and rebirth of a phoenix rising.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
          <a href="#contact" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: `linear-gradient(135deg,${C.amber},${C.orange})`,
            color: 'white', padding: '16px 36px', borderRadius: 11, fontWeight: 800,
            fontSize: 16, textDecoration: 'none', boxShadow: '0 10px 36px rgba(251,191,36,0.48)',
            transition: 'transform .2s, box-shadow .2s',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(251,191,36,0.55)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(251,191,36,0.48)'; }}>
            Book Live Demo <ArrowRight size={18} />
          </a>
          <a href="#platform" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1.5px solid rgba(74,222,128,0.42)',
            color: C.green, padding: '16px 30px', borderRadius: 11, fontWeight: 700,
            fontSize: 16, textDecoration: 'none', background: 'rgba(74,222,128,0.07)',
          }}>
            Explore Platform
          </a>
        </div>

        {/* Trust row */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { icon: <Server size={14} color={C.green} />, text: '50+ Plants Deployed' },
            { icon: <Gauge size={14} color={C.amber} />, text: '94% Avg OEE Achieved' },
            { icon: <Lock size={14} color={C.green} />, text: 'ISA-88 & FDA Compliant' },
            { icon: <Cpu size={14} color={C.amber} />, text: '99.9% Uptime SLA' },
          ].map(b => (
            <div key={b.text} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(74,222,128,0.16)',
              borderRadius: 100, padding: '8px 16px', fontSize: 13, color: C.muted,
            }}>
              {b.icon} {b.text}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom fade */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, zIndex: 4,
      background: `linear-gradient(to top, ${C.bg}, transparent)`,
    }} />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// PROBLEMS — Imagen 4 generated background
// ─────────────────────────────────────────────────────────────────────────────
const ProblemsSection: FC = () => (
  <section id="problems" style={{ position: 'relative', padding: '96px 28px', overflow: 'hidden' }}>
    {/* Imagen 4 background */}
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `url(${img('divider_roots.jpg')})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      filter: 'brightness(0.55)',
    }} />
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1,
      background: 'rgba(8,26,12,0.62)',
    }} />

    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: C.orange, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>The Hidden Costs</span>
        <h2 style={{ fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 900, color: C.white, marginBottom: 16 }}>
          What's Silently Destroying Your Plant
        </h2>
        <p style={{ color: C.muted, fontSize: 16, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          Every minute of unplanned downtime, every missed alert, every compliance gap — they compound into crores of losses every year.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 28 }}>
        {[
          { icon: <TrendingDown size={44} color={C.orange} />, stat: '₹40L+/hr', label: 'Lost in unplanned downtime', sub: 'A single process failure costs more than a full year of SCADA licensing fees', border: C.orange },
          { icon: <AlertTriangle size={44} color={C.amber} />, stat: '12%', label: 'Average quality rejection rate', sub: 'Manual inspection and delayed alerts lead to entire batch write-offs', border: C.amber },
          { icon: <Siren size={44} color={C.green} />, stat: '₹2Cr+', label: 'Average compliance fine per incident', sub: 'Regulatory violations from missing audit trails destroy brand reputation', border: C.green },
        ].map(p => (
          <div key={p.stat} style={{
            background: 'rgba(4,14,6,0.86)', backdropFilter: 'blur(16px)',
            border: `1px solid ${p.border}44`,
            borderTop: `3px solid ${p.border}`,
            borderRadius: 18, padding: '44px 32px', textAlign: 'center',
            transition: 'transform .3s, box-shadow .3s',
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = `0 20px 56px ${p.border}22`; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ marginBottom: 20 }}>{p.icon}</div>
            <div style={{
              fontSize: 60, fontWeight: 900, lineHeight: 1, marginBottom: 12,
              color: p.border, filter: `drop-shadow(0 0 18px ${p.border}66)`,
            }}>{p.stat}</div>
            <p style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 12 }}>{p.label}</p>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{p.sub}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES — Gemini 3.1 Flash Image generated background
// ─────────────────────────────────────────────────────────────────────────────
const FeaturesSection: FC = () => (
  <section id="platform" style={{ position: 'relative', padding: '96px 28px', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `url(${img('hero_roots.jpg')})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      filter: 'brightness(0.38)',
    }} />
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(8,24,12,0.68)' }} />

    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: C.amber, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Platform Capabilities</span>
        <h2 style={{ fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 900, color: C.white, marginBottom: 16 }}>
          Everything Your Plant Needs
        </h2>
        <p style={{ color: C.muted, fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          Six core modules, one unified platform, zero blind spots across your entire process.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 26 }}>
        {[
          { icon: <Activity size={28} color={C.amber} />, title: 'Real-Time Monitoring', desc: 'Live dashboards with sub-second refresh across every sensor, valve, and actuator in your plant.' },
          { icon: <Bell size={28} color={C.amber} />, title: 'Intelligent Alerts', desc: 'AI-powered anomaly detection sends alerts before failures occur — context-aware, zero noise.' },
          { icon: <Gauge size={28} color={C.amber} />, title: 'OEE Tracker', desc: 'Track Availability, Performance, and Quality in real time. Drill down to root causes in seconds.' },
          { icon: <Layers size={28} color={C.amber} />, title: 'Batch Control', desc: 'Full ISA-88 compliant batch management — recipe editor, phase control, electronic batch records.' },
          { icon: <Plug size={28} color={C.amber} />, title: '150+ Integrations', desc: 'Connect to PLCs, DCS, ERP, MES, and cloud platforms. OPC-UA, Modbus, MQTT out of the box.' },
          { icon: <Smartphone size={28} color={C.amber} />, title: 'Mobile SCADA', desc: 'Full plant visibility on your phone. Approve alarms, run reports, and command equipment from anywhere.' },
        ].map(f => (
          <div key={f.title} style={{
            background: 'rgba(4,16,6,0.85)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(74,222,128,0.18)',
            borderRadius: 16, padding: '34px 28px',
            transition: 'border-color .3s, transform .3s, box-shadow .3s',
          }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = 'rgba(251,191,36,0.45)';
              e.currentTarget.style.transform = 'translateY(-7px)';
              e.currentTarget.style.boxShadow = '0 14px 44px rgba(251,191,36,0.12)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = 'rgba(74,222,128,0.18)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
            <div style={{
              width: 56, height: 56, borderRadius: 15,
              background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
            }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 10 }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRIES — Imagen 4 (standard) generated background
// ─────────────────────────────────────────────────────────────────────────────
const IndustriesSection: FC = () => (
  <section id="industries" style={{ position: 'relative', padding: '96px 28px', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      backgroundImage: `url(${img('divider_roots.jpg')})`,
      backgroundSize: 'cover', backgroundPosition: 'center bottom',
      filter: 'brightness(0.48)',
    }} />
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(8,26,12,0.58)' }} />

    <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: C.green, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Industries Served</span>
        <h2 style={{ fontSize: 'clamp(24px,3.2vw,42px)', fontWeight: 900, color: C.white, marginBottom: 14 }}>
          Built for Every Process Industry
        </h2>
        <p style={{ color: C.muted, fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
          Configured and certified for the world's most demanding manufacturing environments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
        {[
          { icon: <FlaskConical size={40} color={C.green} />, title: 'Pharma & Biotech', desc: 'FDA 21 CFR Part 11, batch records, sterile manufacturing compliance' },
          { icon: <Wheat size={40} color={C.green} />, title: 'Food & Beverage', desc: 'FSMA compliance, CIP/SIP, temperature control, full traceability' },
          { icon: <Shirt size={40} color={C.green} />, title: 'Textile', desc: 'Dyeing, weaving, finishing — full production line visibility and control' },
          { icon: <Car size={40} color={C.green} />, title: 'Automotive', desc: 'Assembly lines, quality gates, press shop and paint shop monitoring' },
        ].map(ind => (
          <div key={ind.title} style={{
            background: 'rgba(4,20,6,0.85)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 18, padding: '40px 26px', textAlign: 'center',
            transition: 'background .3s, transform .3s, box-shadow .3s',
          }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(22,163,74,0.14)';
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(74,222,128,0.14)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(4,20,6,0.85)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
            <div style={{
              width: 70, height: 70, borderRadius: 20,
              background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              {ind.icon}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: C.white, marginBottom: 10 }}>{ind.title}</h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{ind.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// CTA / DEMO FORM — Imagen 4 Ultra generated background
// ─────────────────────────────────────────────────────────────────────────────
const DemoFormSection: FC = () => {
  const [form, setForm] = useState({ name: '', company: '', phone: '' });
  const [sent, setSent] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputStyle: CSSProperties = {
    width: '100%', padding: '14px 16px', borderRadius: 10, fontSize: 15,
    background: 'rgba(4,16,6,0.88)', border: '1px solid rgba(74,222,128,0.22)',
    color: C.white, outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s',
  };

  return (
    <section id="contact" style={{ position: 'relative', padding: '100px 28px', overflow: 'hidden' }}>
      {/* "Roots of Power" style background — lighter */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url(${img('hero_wide.jpg')})`,
        backgroundSize: 'cover', backgroundPosition: 'center bottom',
        filter: 'brightness(0.55)',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(8,24,12,0.55)' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: C.green, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Get Started Today</span>
        <h2 style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 900, color: C.white, marginBottom: 16 }}>
          Book Your Live Plant Demo
        </h2>
        <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
          See NexaProc running on a live plant simulation. Our engineers will show you exactly how it fits your process in 30 minutes flat.
        </p>

        {sent ? (
          <div style={{
            background: 'rgba(22,163,74,0.14)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(74,222,128,0.35)',
            borderRadius: 18, padding: '48px',
            color: C.green, fontSize: 19, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <CheckCircle size={32} /> Request received — we'll call you within 4 hours.
          </div>
        ) : (
          <div style={{
            background: 'rgba(4,16,6,0.88)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 22, padding: '44px 40px',
            textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 20,
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            {[
              { icon: <User size={15} color={C.muted} />, key: 'name', label: 'Your Name', ph: 'Dr. Rajesh Kumar' },
              { icon: <Building2 size={15} color={C.muted} />, key: 'company', label: 'Plant / Company', ph: 'Cipla Pharmaceuticals Ltd.' },
              { icon: <Phone size={15} color={C.muted} />, key: 'phone', label: 'WhatsApp Number', ph: '+91 98765 43210' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  {f.icon} {f.label}
                </label>
                <input value={(form as any)[f.key]} onChange={set(f.key)}
                  placeholder={f.ph} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.22)'} />
              </div>
            ))}
            <button onClick={() => setSent(true)} style={{
              marginTop: 8, width: '100%', padding: '16px',
              borderRadius: 12, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg,${C.amber},${C.orange})`,
              color: 'white', fontWeight: 800, fontSize: 16,
              boxShadow: '0 8px 32px rgba(251,191,36,0.42)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'transform .2s, box-shadow .2s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(251,191,36,0.5)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(251,191,36,0.42)'; }}>
              Request Demo <ArrowRight size={18} />
            </button>
            <p style={{ fontSize: 12, color: C.dim, textAlign: 'center', marginTop: 2 }}>
              No spam. A NexaProc engineer calls you within 4 business hours.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
const Footer: FC = () => (
  <footer style={{
    background: 'rgba(6,20,10,0.98)', borderTop: '1px solid rgba(74,222,128,0.18)',
    padding: '40px 28px', textAlign: 'center',
  }}>
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `linear-gradient(135deg,${C.amber},${C.orange})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Factory size={16} color="white" />
        </div>
        <span style={{
          fontWeight: 900, fontSize: 19,
          background: `linear-gradient(90deg,${C.gold},${C.amber})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>NexaProc</span>
        <span style={{ fontSize: 10, color: C.green, fontWeight: 700, letterSpacing: 2 }}>by GALVON</span>
      </div>
      <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 22 }}>
        {['Privacy', 'Terms', 'Documentation', 'API Docs', 'Support'].map(l => (
          <a key={l} href="#" style={{ color: C.dim, fontSize: 13, textDecoration: 'none', transition: 'color .2s' }}
            onMouseOver={e => e.currentTarget.style.color = C.muted}
            onMouseOut={e => e.currentTarget.style.color = C.dim}>{l}</a>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.16)', lineHeight: 1.8 }}>
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
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.bg, color: C.white, minHeight: '100vh' }}>
      <NavBar />
      <HeroSection />
      <ProblemsSection />
      <FeaturesSection />
      <IndustriesSection />
      <DemoFormSection />
      <Footer />
    </div>
  );
}
