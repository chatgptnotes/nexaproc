import { FeaturesSection } from '@/components/marketing';
import { C } from '@/config/constants';

export default function FeaturesPage() {
  return (
    <>
      {/* Spacer for fixed navbar */}
      <div style={{ height: 68 }} />

      <section style={{ padding: '64px 28px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontSize: 'clamp(32px,4vw,56px)', fontWeight: 900,
            background: `linear-gradient(135deg,${C.gold} 0%,${C.amber} 40%,${C.orange} 80%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 16,
          }}>
            Platform Features
          </h1>
          <p style={{ color: C.muted, fontSize: 18, maxWidth: 600, margin: '0 auto', lineHeight: 1.75 }}>
            Discover the complete set of capabilities that make NexaProc the most advanced
            industrial SCADA platform for process manufacturing.
          </p>
        </div>
      </section>

      <FeaturesSection />
    </>
  );
}
