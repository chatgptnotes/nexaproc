import { FC } from 'react';
import {
  ArrowRight, Cpu, Factory, Gauge, Lock, Server,
} from 'lucide-react';
import { C } from '@/config/constants';

const img = (name: string) => `/${name}`;

export const HeroSection: FC = () => (
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
