import { FC } from 'react';
import { Factory } from 'lucide-react';
import { C, VERSION, BUILD_DATE } from '@/config/constants';

export const Footer: FC = () => (
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
