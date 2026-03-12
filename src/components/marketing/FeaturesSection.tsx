import { FC } from 'react';
import { Activity, Bell, Gauge, Layers, Plug, Smartphone } from 'lucide-react';
import { C } from '@/config/constants';

const img = (name: string) => `/${name}`;

export const FeaturesSection: FC = () => (
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
