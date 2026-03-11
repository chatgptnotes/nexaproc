import { useState, useEffect } from 'react'
import {
  Factory, Activity, Bell, FlaskConical, Zap, BarChart3,
  Cpu, Wifi, ArrowRight, CheckCircle, ChevronDown,
  Pill, Wheat, Shirt, Car, Mountain,
  Menu, X, Settings
} from 'lucide-react'

const VERSION = '1.0'
const BUILD_DATE = 'March 2026'
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

async function fetchGeminiText(prompt: string, fallback: string): Promise<string> {
  if (!GEMINI_KEY) return fallback
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    )
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallback
  } catch { return fallback }
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroSub, setHeroSub] = useState('Monitor, control, and optimize every process in your plant in real time.')

  useEffect(() => {
    fetchGeminiText(
      'Write a single compelling 12-word tagline for NexaProc, a factory and process automation SCADA platform. No quotes.',
      'Monitor, control, and optimize every process in your plant in real time.'
    ).then(setHeroSub)
  }, [])

  const features = [
    { icon: Activity, title: 'Process Monitoring', desc: 'Real-time data from PLCs, RTUs, sensors, and field devices.' },
    { icon: Bell, title: 'Alarm Management', desc: 'Smart alerts with escalation workflows and acknowledgment tracking.' },
    { icon: Settings, title: 'Batch Control', desc: 'Recipe-based batch process automation with full audit trail.' },
    { icon: Zap, title: 'Energy Tracking', desc: 'Monitor energy consumption per unit produced across all lines.' },
    { icon: Cpu, title: 'Predictive Maintenance', desc: 'AI-driven equipment health scores to prevent unplanned downtime.' },
    { icon: Wifi, title: 'OPC-UA / Modbus', desc: 'Native support for all major industrial communication protocols.' },
  ]

  const steps = [
    { num: '01', title: 'Connect', desc: 'Industrial devices, PLCs, sensors, and DCS systems', icon: Wifi },
    { num: '02', title: 'Monitor', desc: 'Live SCADA dashboards with real-time process visualization', icon: Activity },
    { num: '03', title: 'Optimize', desc: 'AI insights, alarms, and automation for peak performance', icon: BarChart3 },
  ]

  const industries = [
    { icon: Pill, label: 'Pharmaceutical' },
    { icon: Wheat, label: 'Food and Beverage' },
    { icon: FlaskConical, label: 'Chemical' },
    { icon: Shirt, label: 'Textiles' },
    { icon: Car, label: 'Auto Manufacturing' },
    { icon: Mountain, label: 'Cement' },
  ]

  const integrations = ['Siemens', 'Allen Bradley', 'Modbus', 'OPC-UA', 'MQTT', 'REST API']

  const stats = [
    { value: '50+', label: 'Plant Deployments' },
    { value: '10K+', label: 'Tags Supported' },
    { value: '<100ms', label: 'Latency' },
    { value: '99.9%', label: 'Uptime' },
  ]

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-navy-950/90 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-black tracking-widest text-white">NexaProc</span>
            <span className="ml-2 text-xs text-amber-400 font-medium">by GALVON</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#industries" className="hover:text-white transition-colors">Industries</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
            <a href="#contact" className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-colors">Book Demo</a>
          </div>
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-4 text-sm text-gray-300 border-t border-white/5 pt-4">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#industries" onClick={() => setMenuOpen(false)}>Industries</a>
            <a href="#integrations" onClick={() => setMenuOpen(false)}>Integrations</a>
            <a href="#contact" className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold text-center" onClick={() => setMenuOpen(false)}>Book Demo</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center grid-bg pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-navy-950" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-sm mb-8">
            <Factory size={14} />
            Factory and Process Automation SCADA
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6">
            Nexa<span className="text-amber-400">Proc</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">{heroSub}</p>
          <p className="text-gray-500 mb-10">Part of the GALVON Industrial Intelligence Suite</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="flex items-center justify-center gap-2 bg-amber-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
              See Live Demo <ArrowRight size={18} />
            </a>
            <a href="#features" className="flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors">
              View Features
            </a>
          </div>
          <div className="mt-16 animate-bounce">
            <ChevronDown size={24} className="mx-auto text-gray-600" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5 bg-navy-900/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black text-amber-400 mb-2">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Built for Process Engineers</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Every feature designed for the realities of industrial plant operations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-navy-900/50 border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="text-amber-400" size={22} />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-navy-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400">Three steps to full plant visibility and control.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="text-center relative">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <s.icon className="text-amber-400" size={28} />
                </div>
                <div className="text-amber-400 text-sm font-mono mb-2">{s.num}</div>
                <h3 className="text-white font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2 text-gray-700">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Industries We Serve</h2>
            <p className="text-gray-400">NexaProc adapts to your industry's unique process requirements.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((ind) => (
              <div key={ind.label} className="flex flex-col items-center gap-3 bg-navy-900/50 border border-white/5 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
                <ind.icon className="text-amber-400" size={28} />
                <span className="text-gray-300 text-sm text-center font-medium">{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 px-6 bg-navy-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Connects to Everything You Have</h2>
          <p className="text-gray-400 mb-12">No rip-and-replace. NexaProc works with your existing industrial infrastructure.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((name) => (
              <div key={name} className="bg-navy-900/80 border border-white/10 rounded-xl px-6 py-3 text-gray-300 font-medium hover:border-amber-500/30 transition-colors">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-navy-900/50 border border-amber-500/20 rounded-2xl p-8 text-center">
            <div className="text-amber-400 text-4xl mb-4">"</div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              NexaProc gave us complete visibility into our production lines. Downtime dropped by 40% in the first quarter after deployment.
            </p>
            <div className="text-white font-semibold">Plant Manager, Manufacturing Unit</div>
            <div className="text-gray-500 text-sm mt-1">Nagpur, India</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-3xl p-12">
            <CheckCircle className="text-amber-400 mx-auto mb-6" size={40} />
            <h2 className="text-4xl font-bold text-white mb-4">Start your digital plant journey</h2>
            <p className="text-gray-400 mb-8">Get a live demo customized for your plant and industry. No commitment required.</p>
            <a href="mailto:hello@galvon.com" className="inline-flex items-center gap-2 bg-amber-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors">
              Book a Demo <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xl font-black tracking-widest text-white">NexaProc</span>
            <span className="ml-2 text-xs text-amber-400">by GALVON</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="https://github.com/chatgptnotes/galvon" className="hover:text-gray-300">Ampris</a>
            <a href="https://github.com/chatgptnotes/flownexus" className="hover:text-gray-300">FlowNexus</a>
            <span className="text-amber-400">NexaProc</span>
          </div>
          <div className="text-center md:text-right">
            <div className="text-gray-400 text-sm">drmhope.com | A Bettroi Product</div>
            <div className="text-gray-600 text-xs mt-1">v{VERSION} | {BUILD_DATE} | nexaproc</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
