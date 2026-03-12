import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Factory } from 'lucide-react';
import { C } from '@/config/constants';

export const NavBar: FC = () => {
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
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
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
        </Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ textDecoration: 'none', color: C.muted, fontSize: 14, fontWeight: 500, transition: 'color .2s' }}
              onMouseOver={e => e.currentTarget.style.color = C.amber}
              onMouseOut={e => e.currentTarget.style.color = C.muted}>
              {l}
            </a>
          ))}
          <Link to="/login" style={{
            color: C.green, fontSize: 14, fontWeight: 600, textDecoration: 'none',
            transition: 'color .2s',
          }}
            onMouseOver={e => e.currentTarget.style.color = C.amber}
            onMouseOut={e => e.currentTarget.style.color = C.green}>
            Login
          </Link>
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
