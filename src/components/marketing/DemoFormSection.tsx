import React, { useState, FC, CSSProperties } from 'react';
import { ArrowRight, Building2, CheckCircle, Phone, User } from 'lucide-react';
import { C } from '@/config/constants';

const img = (name: string) => `/${name}`;

export const DemoFormSection: FC = () => {
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
