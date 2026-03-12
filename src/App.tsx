import React, { useState, useEffect, FC, CSSProperties, useRef } from 'react';
import { Activity, AlertTriangle, ArrowRight, Bell, Building2, Car, CheckCircle, ChevronRight, Cpu, Factory, FlaskConical, Layers, Lock, Plug, Server, Shield, Shirt, Siren, Smartphone, TrendingDown, TrendingUp, Wheat, Wrench, Zap } from 'lucide-react';

// --- COLOR PALETTE ---
const COLORS = {
  bg: '#030e04',
  amber: '#fbbf24',
  orange: '#f97316',
  gold: '#fde68a',
  green: '#4ade80',
  forest: '#16a34a',
  lime: '#a3e635',
  white: 'rgba(255,255,255,0.92)',
  muted: 'rgba(255,255,255,0.65)',
  red: '#ef4444',
  darkRed: '#b91c1c',
};

// --- ANIMATED COUNTER HOOK ---
const useAnimatedCounter = (end: number, duration: number = 2000, isCurrency: boolean = false, suffix: string = '') => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(end * progress);
      
      if (frame === totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, totalFrames]);

  if (isCurrency) {
    return '₹' + (count / 100).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'L+';
  }
  
  return count.toString() + suffix;
};

// --- SVG & ICON COMPONENTS ---

const NexaProcLogo: FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 12L22 7" stroke={color} strokeWidth="1.5" />
    <path d="M12 12V22" stroke={color} strokeWidth="1.5" />
    <path d="M12 12L2 7" stroke={color} strokeWidth="1.5" />
    <path d="M17 4.5L7 9.5" stroke={color} strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
);

const FactoryDiagramSVG: FC = () => (
    <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g opacity="0.6">
            <path d="M10 110 L 60 80 L 150 80 L 200 110 Z" fill="rgba(22, 163, 74, 0.1)" stroke={COLORS.forest} strokeWidth="0.5" />
            <path d="M60 80 L 60 30 L 80 20 L 170 20 L 150 30 L 150 80" fill="rgba(22, 163, 74, 0.15)" stroke={COLORS.forest} strokeWidth="0.5" />
            <path d="M80 20 L 100 10 L 190 10 L 170 20 Z" fill="rgba(22, 163, 74, 0.2)" stroke={COLORS.forest} strokeWidth="0.5" />
        </g>
        <circle cx="85" cy="55" r="3" fill={COLORS.amber} filter="url(#glow)" style={{ animation: 'pulse 3s infinite ease-in-out' }} />
        <circle cx="130" cy="60" r="3" fill={COLORS.amber} filter="url(#glow)" style={{ animation: 'pulse 3s infinite 0.5s ease-in-out' }} />
        <circle cx="160" cy="45" r="3" fill={COLORS.amber} filter="url(#glow)" style={{ animation: 'pulse 3s infinite 1s ease-in-out' }} />
        <circle cx="110" cy="95" r="3" fill={COLORS.amber} filter="url(#glow)" style={{ animation: 'pulse 3s infinite 1.5s ease-in-out' }} />
    </svg>
);

const BackgroundSVG: FC = () => (
    <svg width="100%" height="100%" style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, opacity: 0.06 }}>
        <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke={COLORS.amber} strokeWidth="0.5"/>
                <circle cx="0" cy="0" r="1.5" fill={COLORS.amber} />
                <circle cx="80" cy="0" r="1.5" fill={COLORS.amber} />
                <circle cx="0" cy="80" r="1.5" fill={COLORS.amber} />
                <circle cx="80" cy="80" r="1.5" fill={COLORS.amber} />
                 <circle cx="40" cy="40" r="1" fill={COLORS.amber} opacity="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill={COLORS.bg} />
        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
);

// --- MAIN APP COMPONENT ---

const App: FC = () => {
    const [form, setForm] = useState({ name: '', plant: '', phone: '' });
    const [submitted, setSubmitted] = useState(false);
    
    // --- STYLES OBJECT ---
    const styles: { [key: string]: CSSProperties } = {
        app: {
            backgroundColor: COLORS.bg,
            color: COLORS.white,
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
            overflowX: 'hidden',
            position: 'relative',
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 20px',
            position: 'relative',
            zIndex: 2,
        },
        section: {
            marginBottom: '120px',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 40px',
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 10,
            boxSizing: 'border-box',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: COLORS.white,
        },
        logoText: {
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '1px',
        },
        nav: {
            display: 'flex',
            gap: '30px',
        },
        navLink: {
            color: COLORS.muted,
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'color 0.3s',
        },
        ctaButton: {
            backgroundColor: COLORS.amber,
            color: COLORS.bg,
            padding: '12px 24px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '14px',
            transition: 'background-color 0.3s',
            border: 'none',
            cursor: 'pointer',
        },
        sectionTitle: {
            fontSize: '42px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '10px',
            background: `linear-gradient(45deg, ${COLORS.gold}, ${COLORS.amber})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        sectionSubtitle: {
            fontSize: '18px',
            color: COLORS.muted,
            textAlign: 'center',
            marginBottom: '60px',
            maxWidth: '700px',
            margin: '0 auto 60px auto',
        },
        // Hero
        hero: {
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            textAlign: 'center',
            minHeight: '700px',
        },
        heroContent: {
            position: 'relative',
            width: '600px',
            height: '400px',
        },
        heroTitle: {
            fontSize: '56px',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '16px',
            textShadow: `0 0 15px ${COLORS.forest}`,
        },
        heroSub: {
            fontSize: '20px',
            color: COLORS.muted,
            maxWidth: '500px',
            margin: '0 auto 30px auto',
        },
        heroStat: {
            position: 'absolute',
            background: 'rgba(3, 14, 4, 0.8)',
            border: `1px solid ${COLORS.forest}`,
            backdropFilter: 'blur(5px)',
            borderRadius: '8px',
            padding: '12px 18px',
            textAlign: 'center',
            animation: 'float 6s ease-in-out infinite',
        },
        statValue: {
            fontSize: '24px',
            fontWeight: 700,
            color: COLORS.lime,
        },
        statLabel: {
            fontSize: '12px',
            color: COLORS.muted,
            textTransform: 'uppercase',
        },
        // Problem Visualizer
        problemViz: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: '2px',
            background: `linear-gradient(to right, ${COLORS.darkRed} 20%, ${COLORS.bg} 48%, ${COLORS.bg} 52%, ${COLORS.forest} 80%)`,
            borderRadius: '10px',
            padding: '2px',
        },
        problemHalf: {
            width: '50%',
            backgroundColor: COLORS.bg,
            padding: '40px',
            borderRadius: '8px 0 0 8px',
        },
        problemHalfRight: {
            borderRadius: '0 8px 8px 0',
        },
        problemTitle: {
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        problemList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        problemItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
            fontSize: '16px',
            color: COLORS.muted,
        },
        problemDivider: {
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: COLORS.bg,
            padding: '15px',
            borderRadius: '50%',
            border: `2px solid ${COLORS.amber}`,
            boxShadow: `0 0 20px ${COLORS.amber}`,
            animation: 'pulse 2s infinite',
        },
        // OEE Infographic
        oeeContainer: {
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
        },
        oeeFormula: {
            flex: 1,
        },
        oeeBar: {
            marginBottom: '20px',
        },
        oeeBarLabel: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: COLORS.muted,
            marginBottom: '8px',
        },
        oeeBarTrack: {
            height: '20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '5px',
            overflow: 'hidden',
        },
        oeeBarFill: {
            height: '100%',
            borderRadius: '5px',
            transition: 'width 2s ease-out',
        },
        oeeResult: {
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '20px',
            fontWeight: 600,
        },
        oeeChart: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        oeeChartTitle: {
            textAlign: 'center',
            color: COLORS.muted,
            fontSize: '16px',
            fontWeight: 600,
        },
        oeeBarChartContainer: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            height: '200px',
            borderLeft: `1px solid ${COLORS.muted}`,
            borderBottom: `1px solid ${COLORS.muted}`,
            padding: '10px 0 0 10px',
        },
        barChartBar: {
            width: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
        },
        barFill: {
            width: '100%',
            transition: 'height 2s ease-out',
            borderRadius: '4px 4px 0 0',
        },
        barLabel: {
            fontSize: '12px',
            color: COLORS.muted,
        },
        barValue: {
            fontSize: '14px',
            fontWeight: 700,
            color: COLORS.white,
        },
        // Process Flow
        processFlow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
        },
        processStep: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '18%',
            zIndex: 2,
        },
        processIcon: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(22, 163, 74, 0.2)',
            border: `1px solid ${COLORS.forest}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '15px',
        },
        processLabel: {
            fontSize: '16px',
            fontWeight: 600,
            color: COLORS.white,
            marginBottom: '8px',
        },
        processDesc: {
            fontSize: '13px',
            color: COLORS.muted,
        },
        processArrow: {
            position: 'absolute',
            top: '30px',
            left: '10%',
            right: '10%',
            height: '2px',
            zIndex: 1,
        },
        // Industry Matrix
        matrixGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr repeat(4, 1fr)',
            gap: '2px',
            backgroundColor: COLORS.forest,
            border: `1px solid ${COLORS.forest}`,
            borderRadius: '8px',
            overflow: 'hidden',
        },
        matrixCell: {
            backgroundColor: COLORS.bg,
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        matrixHeader: {
            backgroundColor: 'rgba(22, 163, 74, 0.2)',
            fontWeight: 700,
            fontSize: '16px',
            color: COLORS.gold,
        },
        matrixCapability: {
            justifyContent: 'flex-start',
            fontWeight: 700,
            fontSize: '16px',
            color: COLORS.gold,
        },
        matrixCheck: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
        },
        matrixStat: {
            fontSize: '12px',
            color: COLORS.muted,
        },
        // Integration Ecosystem
        ecosystem: {
            position: 'relative',
            width: '100%',
            aspectRatio: '1.5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        // ROI Calculator
        roiContainer: {
            display: 'flex',
            gap: '40px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: '40px',
            borderRadius: '10px',
            border: `1px solid ${COLORS.forest}`,
        },
        roiMetrics: {
            flex: 2,
        },
        roiVisual: {
            flex: 3,
        },
        roiMetric: {
            marginBottom: '20px',
        },
        roiLabel: {
            fontSize: '16px',
            color: COLORS.muted,
            marginBottom: '5px',
        },
        roiValue: {
            fontSize: '36px',
            fontWeight: 700,
        },
        roiBarContainer: {
            marginTop: '30px',
        },
        roiBarTrack: {
            height: '30px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '5px',
            position: 'relative',
        },
        roiBarFill: {
            position: 'absolute',
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS.forest}, ${COLORS.lime})`,
            borderRadius: '5px',
            transition: 'width 2s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '10px',
            boxSizing: 'border-box',
        },
        roiBarText: {
            color: COLORS.bg,
            fontWeight: 700,
        },
        breakEvenTimeline: {
            marginTop: '40px',
        },
        timelineTrack: {
            height: '2px',
            backgroundColor: COLORS.muted,
            position: 'relative',
        },
        timelineMarker: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: COLORS.lime,
        },
        timelineLabel: {
            position: 'absolute',
            top: '-25px',
            transform: 'translateX(-50%)',
            fontSize: '14px',
            color: COLORS.lime,
        },
        // Demo Form
        demoFormCard: {
            background: 'rgba(3, 14, 4, 0.7)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${COLORS.forest}`,
            borderRadius: '10px',
            padding: '40px',
            maxWidth: '450px',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        },
        formInput: {
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: `1px solid ${COLORS.forest}`,
            borderRadius: '5px',
            color: COLORS.white,
            fontSize: '16px',
            boxSizing: 'border-box',
        },
        formButton: {
            width: '100%',
            padding: '15px',
            backgroundColor: COLORS.amber,
            color: COLORS.bg,
            border: 'none',
            borderRadius: '5px',
            fontSize: '18px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.2s',
        },
        // Footer
        footer: {
            textAlign: 'center',
            padding: '40px 20px',
            color: COLORS.muted,
            fontSize: '14px',
            borderTop: `1px solid ${COLORS.forest}`,
        },
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(form.name && form.plant && form.phone) {
            setSubmitted(true);
        }
    };
    
    // --- KEYFRAMES FOR ANIMATIONS ---
    const keyframes = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 5px ${COLORS.amber}, 0 0 10px ${COLORS.amber}; }
            50% { box-shadow: 0 0 20px ${COLORS.amber}, 0 0 30px ${COLORS.amber}; }
            100% { box-shadow: 0 0 5px ${COLORS.amber}, 0 0 10px ${COLORS.amber}; }
        }
        @keyframes dash-flow {
            to { stroke-dashoffset: -100; }
        }
        @keyframes glow {
            from { text-shadow: 0 0 5px ${COLORS.lime}, 0 0 10px ${COLORS.lime}; }
            to { text-shadow: 0 0 20px ${COLORS.lime}, 0 0 30px ${COLORS.lime}; }
        }
    `;

    // --- SECTION COMPONENTS ---

    const Header = () => (
        <header style={styles.header}>
            <a href="#top" style={styles.logo}>
                <NexaProcLogo size={32} color={COLORS.amber} />
                <span style={styles.logoText}>NexaProc</span>
            </a>
            <nav style={styles.nav}>
                <a href="#oee" style={styles.navLink}>OEE</a>
                <a href="#features" style={styles.navLink}>Features</a>
                <a href="#integrations" style={styles.navLink}>Integrations</a>
                <a href="#roi" style={styles.navLink}>ROI</a>
            </nav>
            <a href="#demo" style={styles.ctaButton}>Request Demo</a>
        </header>
    );

    const HeroSection = () => {
        const stats = [
            { value: useAnimatedCounter(4000, 2000, true, '/hr'), label: 'Saved', top: '10%', left: '-20%' },
            { value: useAnimatedCounter(94, 2500, false, '%'), label: 'OEE', top: '15%', right: '-15%' },
            { value: '99.9%', label: 'Uptime', top: '70%', left: '-10%' },
            { value: useAnimatedCounter(50, 3000, false, '+'), label: 'Plants', top: '75%', right: '-20%' },
        ];
        return (
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '240px' }}>
                        <FactoryDiagramSVG />
                    </div>
                    {stats.map((stat, i) => (
                        <div key={i} style={{ ...styles.heroStat, top: stat.top, left: stat.left, right: stat.right, animationDelay: `${i * 0.5}s` }}>
                            <div style={styles.statValue}>{stat.value}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const ProblemVisualizerSection = () => (
        <section style={styles.section} id="problem">
            <h2 style={styles.sectionTitle}>From Chaos to Control</h2>
            <p style={styles.sectionSubtitle}>Visualize the transformation. NexaProc turns operational challenges into strategic advantages.</p>
            <div style={{ ...styles.problemViz, position: 'relative' }}>
                <div style={styles.problemHalf}>
                    <h3 style={{ ...styles.problemTitle, color: COLORS.red }}><Siren style={{ marginRight: '8px' }} /> Before NexaProc</h3>
                    <ul style={styles.problemList}>
                        <li style={styles.problemItem}><AlertTriangle size={20} color={COLORS.red} /> Costly Unplanned Downtime</li>
                        <li style={styles.problemItem}><TrendingDown size={20} color={COLORS.red} /> Manual Logs & Data Gaps</li>
                        <li style={styles.problemItem}><Bell size={20} color={COLORS.red} /> Missed Critical Alerts</li>
                        <li style={styles.problemItem}><Lock size={20} color={COLORS.red} /> Compliance & Audit Failures</li>
                    </ul>
                </div>
                <div style={{...styles.problemHalf, ...styles.problemHalfRight}}>
                    <h3 style={{ ...styles.problemTitle, color: COLORS.green }}><Shield style={{ marginRight: '8px' }} /> After NexaProc</h3>
                    <ul style={styles.problemList}>
                        <li style={styles.problemItem}><Zap size={20} color={COLORS.green} /> Proactive Downtime Prevention</li>
                        <li style={styles.problemItem}><TrendingUp size={20} color={COLORS.green} /> Automated Real-time Visibility</li>
                        <li style={styles.problemItem}><CheckCircle size={20} color={COLORS.green} /> Zero-Miss Smart Alarms</li>
                        <li style={styles.problemItem}><Layers size={20} color={COLORS.green} /> Effortless Compliance & Reporting</li>
                    </ul>
                </div>
                <div style={styles.problemDivider}>
                    <NexaProcLogo size={40} color={COLORS.amber} />
                </div>
            </div>
        </section>
    );
    
    const OEEInfographicSection = () => {
        const [oee, setOee] = useState({ old: 0, new: 0 });
        const [barsVisible, setBarsVisible] = useState(false);
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setOee({ old: 58, new: 94 });
                    setBarsVisible(true);
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, []);
        
        const availability = 96, performance = 98, quality = 99.5;
        const totalOEE = (availability/100 * performance/100 * quality/100 * 100).toFixed(1);

        return (
            <section style={styles.section} id="oee" ref={ref}>
                <h2 style={styles.sectionTitle}>Unlock Peak Performance with OEE</h2>
                <p style={styles.sectionSubtitle}>Overall Equipment Effectiveness (OEE) is the gold standard for measuring manufacturing productivity. We don't just measure it, we maximize it.</p>
                <div style={styles.oeeContainer}>
                    <div style={styles.oeeFormula}>
                        <div style={styles.oeeBar}>
                            <div style={styles.oeeBarLabel}><span>Availability</span><span>{availability}%</span></div>
                            <div style={styles.oeeBarTrack}><div style={{...styles.oeeBarFill, width: barsVisible ? `${availability}%` : '0%', backgroundColor: COLORS.green}}></div></div>
                        </div>
                        <div style={styles.oeeBar}>
                            <div style={styles.oeeBarLabel}><span>Performance</span><span>{performance}%</span></div>
                            <div style={styles.oeeBarTrack}><div style={{...styles.oeeBarFill, width: barsVisible ? `${performance}%` : '0%', backgroundColor: COLORS.amber}}></div></div>
                        </div>
                        <div style={styles.oeeBar}>
                            <div style={styles.oeeBarLabel}><span>Quality</span><span>{quality}%</span></div>
                            <div style={styles.oeeBarTrack}><div style={{...styles.oeeBarFill, width: barsVisible ? `${quality}%` : '0%', backgroundColor: COLORS.orange}}></div></div>
                        </div>
                        <div style={styles.oeeResult}>
                            OEE = {availability}% &times; {performance}% &times; {quality}% = <span style={{color: COLORS.lime, fontSize: '24px'}}>{totalOEE}%</span>
                        </div>
                    </div>
                    <div style={styles.oeeChart}>
                        <h3 style={styles.oeeChartTitle}>OEE Improvement: Sample Plant</h3>
                        <div style={styles.oeeBarChartContainer}>
                            <div style={styles.barChartBar}>
                                <div style={styles.barValue}>{oee.old}%</div>
                                <div style={{...styles.barFill, height: barsVisible ? `${oee.old}%` : '0%', backgroundColor: COLORS.red}}></div>
                                <div style={styles.barLabel}>Industry Avg.</div>
                            </div>
                             <div style={styles.barChartBar}>
                                <div style={styles.barValue}>{oee.new}%</div>
                                <div style={{...styles.barFill, height: barsVisible ? `${oee.new}%` : '0%', background: `linear-gradient(to top, ${COLORS.forest}, ${COLORS.lime})`}}></div>
                                <div style={styles.barLabel}>With NexaProc</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const ProcessFlowSection = () => {
        const steps = [
            { icon: <Plug size={28} color={COLORS.lime} />, label: "Sensor Data", desc: "Collects data from PLCs, IoT devices, and machinery." },
            { icon: <Cpu size={28} color={COLORS.lime} />, label: "Edge Processing", desc: "Pre-processes and filters data locally for speed." },
            { icon: <Server size={28} color={COLORS.lime} />, label: "Cloud SCADA", desc: "Aggregates and visualizes data in a central hub." },
            { icon: <Activity size={28} color={COLORS.lime} />, label: "AI Analytics", desc: "AI models detect anomalies and predict failures." },
            { icon: <Wrench size={28} color={COLORS.lime} />, label: "Control Action", desc: "Triggers automated responses or alerts operators." },
        ];
        return (
            <section style={styles.section} id="features">
                <h2 style={styles.sectionTitle}>The NexaProc Digital Thread</h2>
                <p style={styles.sectionSubtitle}>Follow the data from raw signal to intelligent action. Our 5-step process ensures reliability, speed, and insight.</p>
                <div style={styles.processFlow}>
                    <svg style={styles.processArrow}>
                        <path d="M0 1 H 1200" stroke={COLORS.forest} strokeWidth="1" strokeDasharray="10 5" style={{ animation: 'dash-flow 2s linear infinite' }} />
                    </svg>
                    {steps.map((step, i) => (
                        <React.Fragment key={i}>
                            <div style={styles.processStep}>
                                <div style={styles.processIcon}>{step.icon}</div>
                                <div style={styles.processLabel}>{step.label}</div>
                                <div style={styles.processDesc}>{step.desc}</div>
                            </div>
                            {i < steps.length - 1 && <ChevronRight size={32} color={COLORS.forest} style={{ zIndex: 2, flexShrink: 0 }} />}
                        </React.Fragment>
                    ))}
                </div>
            </section>
        );
    };

    const IndustryMatrixSection = () => {
        const industries = ["Pharma", "Food & Bev", "Textile", "Automotive"];
        const capabilities = ["Batch Control", "Real-time Monitoring", "Compliance (21 CFR)", "Predictive Maintenance"];
        const icons = [<FlaskConical />, <Wheat />, <Shirt />, <Car />];
        const data = [
            ["+25% yield", "100% trace", "✓", "99.8% uptime"],
            ["99.9% consistency", "✓", "-80% waste", "✓"],
            ["-15% defects", "✓", "✓", "+30% lifespan"],
            ["JIT enabled", "99.6% OEE", "ISO/TS ready", "✓"],
        ];
        return (
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Purpose-Built for Your Industry</h2>
                <p style={styles.sectionSubtitle}>NexaProc adapts to the unique challenges of your sector, delivering targeted results where they matter most.</p>
                <div style={styles.matrixGrid}>
                    <div style={{...styles.matrixCell, ...styles.matrixHeader}}></div>
                    {industries.map((ind, i) => <div key={ind} style={{...styles.matrixCell, ...styles.matrixHeader}}>{icons[i]}<span style={{marginLeft: '8px'}}>{ind}</span></div>)}
                    
                    {capabilities.map((cap, i) => (
                        <React.Fragment key={cap}>
                            <div style={{...styles.matrixCell, ...styles.matrixCapability}}>{cap}</div>
                            {data[i].map((stat, j) => (
                                <div key={j} style={styles.matrixCell}>
                                    <div style={styles.matrixCheck}>
                                        <CheckCircle size={24} color={stat === "✓" ? COLORS.green : COLORS.amber} />
                                        {stat !== "✓" && <span style={styles.matrixStat}>{stat}</span>}
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </section>
        );
    };

    const IntegrationEcosystemSection = () => {
        const spokes = [
            { name: "PLCs", icon: <Cpu size={24} color={COLORS.white}/>, angle: 0 },
            { name: "DCS", icon: <Layers size={24} color={COLORS.white}/>, angle: 45 },
            { name: "ERP", icon: <Building2 size={24} color={COLORS.white}/>, angle: 90 },
            { name: "MES", icon: <Factory size={24} color={COLORS.white}/>, angle: 135 },
            { name: "IoT Sensors", icon: <Zap size={24} color={COLORS.white}/>, angle: 180 },
            { name: "Cloud", icon: <Server size={24} color={COLORS.white}/>, angle: 225 },
            { name: "Mobile", icon: <Smartphone size={24} color={COLORS.white}/>, angle: 270 },
            { name: "MQTT", icon: <ArrowRight size={24} color={COLORS.white}/>, angle: 315 },
        ];
        const r = 150, cx = 200, cy = 150;

        return (
            <section style={styles.section} id="integrations">
                <h2 style={styles.sectionTitle}>Seamless Integration Ecosystem</h2>
                <p style={styles.sectionSubtitle}>NexaProc is built to connect. It acts as the central nervous system for your existing and future factory hardware and software.</p>
                <div style={styles.ecosystem}>
                    <svg width="100%" height="100%" viewBox="0 0 400 300">
                        <defs>
                            <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        {spokes.map((spoke, i) => {
                            const x2 = cx + r * Math.cos(spoke.angle * Math.PI / 180);
                            const y2 = cy + r * Math.sin(spoke.angle * Math.PI / 180);
                            return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke={COLORS.forest} strokeWidth="1" />;
                        })}
                        <circle cx={cx} cy={cy} r="40" fill={COLORS.bg} stroke={COLORS.amber} strokeWidth="2" filter="url(#hubGlow)" />
                        <foreignObject x={cx - 30} y={cy - 30} width="60" height="60">
                             <div style={{width: '60px', height: '60px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                                <NexaProcLogo size={30} color={COLORS.amber} />
                            </div>
                        </foreignObject>
                        {spokes.map((spoke, i) => {
                            const x = cx + r * Math.cos(spoke.angle * Math.PI / 180);
                            const y = cy + r * Math.sin(spoke.angle * Math.PI / 180);
                            return (
                                <g key={i} transform={`translate(${x - 20}, ${y - 20})`}>
                                    <circle cx="20" cy="20" r="20" fill={COLORS.bg} stroke={COLORS.forest} strokeWidth="1" />
                                    <foreignObject x="0" y="0" width="40" height="40">
                                        <div style={{width: '40px', height: '40px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                           {spoke.icon}
                                        </div>
                                    </foreignObject>
                                    <text x="20" y="50" fill={COLORS.muted} textAnchor="middle" fontSize="10">{spoke.name}</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </section>
        );
    };
    
    const ROICalculatorSection = () => {
        const [visible, setVisible] = useState(false);
        const ref = useRef<HTMLDivElement>(null);
        
        useEffect(() => {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, []);
        
        const investment = 1200000;
        const savings = 24000000;
        const roi = (savings - investment) / investment * 100;
        const breakEvenMonth = (investment / (savings / 12));
        
        return (
            <section style={styles.section} id="roi" ref={ref}>
                <h2 style={styles.sectionTitle}>Visualizing Your Return on Investment</h2>
                <p style={styles.sectionSubtitle}>The numbers speak for themselves. NexaProc isn't a cost center; it's a profit engine.</p>
                <div style={styles.roiContainer}>
                    <div style={styles.roiMetrics}>
                        <div style={styles.roiMetric}>
                            <div style={styles.roiLabel}>Yearly Investment (Est.)</div>
                            <div style={{...styles.roiValue, color: COLORS.orange}}>₹12L</div>
                        </div>
                        <div style={styles.roiMetric}>
                            <div style={styles.roiLabel}>Annual Savings (Downtime Prevention)</div>
                            <div style={{...styles.roiValue, color: COLORS.green}}>₹2.4Cr</div>
                        </div>
                        <div style={styles.roiMetric}>
                            <div style={styles.roiLabel}>Calculated ROI</div>
                            <div style={{...styles.roiValue, color: COLORS.lime, animation: visible ? 'glow 1.5s ease-in-out alternate infinite' : 'none'}}>{roi.toFixed(0)}%</div>
                        </div>
                    </div>
                    <div style={styles.roiVisual}>
                        <div style={styles.roiLabel}>ROI Visualization (Savings vs Investment)</div>
                        <div style={styles.roiBarContainer}>
                            <div style={styles.roiBarTrack}>
                                <div style={{...styles.roiBarFill, width: visible ? '100%' : '0%'}}>
                                    <span style={styles.roiBarText}>{Math.round(savings/investment)}x Return</span>
                                </div>
                                <div style={{position: 'absolute', top: 0, left: 0, height: '100%', width: visible ? `${100 / (savings/investment)}%` : '0%', background: COLORS.orange, borderRadius: '5px', transition: 'width 2s ease-out'}}></div>
                            </div>
                        </div>
                        <div style={styles.breakEvenTimeline}>
                            <div style={styles.roiLabel}>Break-Even Point</div>
                            <div style={styles.timelineTrack}>
                                {[...Array(12)].map((_, i) => <div key={i} style={{ position: 'absolute', left: `${(i+1)/12*100}%`, top: '-5px', height: '10px', width: '1px', background: COLORS.muted }} />)}
                                <div style={{...styles.timelineMarker, left: visible ? `${breakEvenMonth/12*100}%` : '0%', transition: 'left 2s ease-out'}}>
                                    <div style={{...styles.timelineLabel, left: '50%'}}>{breakEvenMonth.toFixed(1)} Months</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const DemoFormSection = () => (
        <section style={styles.section} id="demo">
            <h2 style={styles.sectionTitle}>Start Your Digital Transformation</h2>
            <p style={styles.sectionSubtitle}>Request a personalized demo and see how NexaProc can revolutionize your factory floor.</p>
            <div style={styles.demoFormCard}>
                {submitted ? (
                    <div style={{textAlign: 'center'}}>
                        <CheckCircle size={48} color={COLORS.green} style={{marginBottom: '20px'}}/>
                        <h3 style={{fontSize: '24px', color: COLORS.white}}>Thank You!</h3>
                        <p style={{color: COLORS.muted}}>Our team will contact you shortly to schedule your demo.</p>
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit}>
                        <input type="text" placeholder="Your Name" required style={styles.formInput} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        <input type="text" placeholder="Plant Name / Company" required style={styles.formInput} value={form.plant} onChange={e => setForm({...form, plant: e.target.value})} />
                        <input type="tel" placeholder="Phone Number" required style={styles.formInput} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
                        <button type="submit" style={styles.formButton}>Schedule My Free Demo</button>
                    </form>
                )}
            </div>
        </section>
    );

    const Footer = () => (
        <footer style={styles.footer}>
            <p>drmhope.com | A Bettroi Product</p>
            <p style={{fontSize: '12px', opacity: 0.6}}>v1.4, March 2026, nexaproc</p>
        </footer>
    );

    return (
        <div style={styles.app}>
            <style>{keyframes}</style>
            <BackgroundSVG />
            <Header />
            <main style={{ paddingTop: '80px' }}>
                <div style={styles.container}>
                    <HeroSection />
                    <ProblemVisualizerSection />
                    <OEEInfographicSection />
                    <ProcessFlowSection />
                    <IndustryMatrixSection />
                    <IntegrationEcosystemSection />
                    <ROICalculatorSection />
                    <DemoFormSection />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;