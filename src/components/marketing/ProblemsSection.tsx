import { FC } from 'react';
import { AlertTriangle, Siren, TrendingDown } from 'lucide-react';
import { C } from '@/config/constants';

const img = (name: string) => `/${name}`;

export const ProblemsSection: FC = () => (
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
