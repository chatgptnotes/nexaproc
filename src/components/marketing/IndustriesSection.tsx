import { FC } from 'react';
import { Car, FlaskConical, Shirt, Wheat } from 'lucide-react';
import { C } from '@/config/constants';

const img = (name: string) => `/${name}`;

export const IndustriesSection: FC = () => (
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
