'use client';

import Link from 'next/link';

const CAPABILITIES = [
  { icon: '🧭', title: 'Venue Navigation', desc: 'Shortest queues, gate routing, and real-time wayfinding guides' },
  { icon: '👥', title: 'Crowd Intelligence', desc: 'Zone density prediction, flow balancing, and congestion prevention' },
  { icon: '♿', title: 'Accessibility Assistant', desc: 'Wheelchair routing support, sensory kits, and inclusive guidance' },
  { icon: '🚇', title: 'Transportation Planner', desc: 'Transit load balancing and staggered egress coordination schedules' },
  { icon: '🌍', title: 'Multilingual Guide', desc: 'Instant operations alerts translated to English, Spanish, and French' },
  { icon: '🌱', title: 'Operational Advisor', desc: 'Power grid load optimization and eco-efficiency recommendations' },
  { icon: '🚨', title: 'Emergency Response Assistant', desc: 'Medical and safety incidents rapid dispatcher and volunteer coordinator' },
  { icon: '📊', title: 'Executive Report Generator', desc: 'AI-generated matchday summaries, operational stats, and efficiency audits' },
];

const WORKFLOW_STEPS = [
  { icon: '📡', label: 'Detect' },
  { icon: '🧠', label: 'Analyze' },
  { icon: '💡', label: 'Recommend' },
  { icon: '✅', label: 'Approve' },
  { icon: '📋', label: 'Dispatch' },
  { icon: '📢', label: 'Alert' },
  { icon: '📄', label: 'Report' },
];

export default function HomePage() {
  return (
    <main className="landing">
      {/* ── Navigation ── */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--ai-blue)" strokeWidth="2" />
            <path d="M8 12h8M12 8v8" stroke="var(--ai-blue)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="landing-wordmark">StadiumOPS</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Link href="/command" className="command-nav-link">Operations Center</Link>
          <Link href="/volunteer" className="command-nav-link">Volunteer Portal</Link>
          <Link href="/fan" className="command-nav-link">Fan Portal</Link>
        </div>
      </nav>

      {/* ── Hero: Meet StadiumIQ ── */}
      <section className="landing-hero">
        <div className="landing-ai-avatar" aria-hidden="true">🧠</div>
        <h1 className="landing-greeting">
          Meet Stadium<span style={{ color: 'var(--ai-blue)' }}>IQ</span>
        </h1>
        <p className="landing-intro">
          I&apos;m StadiumIQ. I help millions of fans, volunteers and organizers during FIFA World Cup 2026.
          I analyze crowd patterns, predict bottlenecks, coordinate responses, and optimize stadium sustainability.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
          <span className="badge badge-ai">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="currentColor" /></svg>
            StadiumIQ Reasoning Engine
          </span>
          <span className="badge" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            FIFA World Cup 2026
          </span>
        </div>
      </section>

      {/* ── AI Capabilities ── */}
      <section className="landing-section animate-in">
        <h2 className="landing-section-title">AI Matchday Capabilities</h2>
        <div className="capability-grid">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="capability-card">
              <div className="capability-icon">{cap.icon}</div>
              <div className="capability-title">{cap.title}</div>
              <div className="capability-desc">{cap.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Workflow ── */}
      <section className="landing-section">
        <h2 className="landing-section-title">End-to-End AI Workflow</h2>
        <div className="workflow-section">
          <div className="workflow-steps">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`workflow-step ${i <= 2 ? 'active' : ''}`}>
                  <div className="workflow-step-icon">{step.icon}</div>
                  <span className="workflow-step-label">{step.label}</span>
                </div>
                {i < WORKFLOW_STEPS.length - 1 && (
                  <span className="workflow-arrow">→</span>
                )}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', marginTop: '16px', lineHeight: '1.5' }}>
            Congestion detected → StadiumIQ predicts risk → AI explains reasoning →
            Organizer approves → Volunteer receives task → Fan receives navigation update →
            AI generates operational summary
          </p>
        </div>
      </section>

      {/* ── Choose Your Experience ── */}
      <section className="landing-section">
        <h2 className="landing-section-title">Choose Your Experience</h2>
        <div className="role-grid">
          {/* Fan */}
          <Link href="/fan" className="role-card">
            <div className="role-card-icon" style={{ background: 'var(--success-dim)' }}>🎟️</div>
            <h3 className="role-card-title">Fan Experience</h3>
            <p className="role-card-desc">
              Navigate gates, plan transit trips, request accessibility escorts,
              and receive translated alerts from operations.
            </p>
            <span className="role-card-cta" style={{ color: 'var(--success)' }}>
              Enter as Fan →
            </span>
          </Link>

          {/* Volunteer */}
          <Link href="/volunteer" className="role-card">
            <div className="role-card-icon" style={{ background: 'var(--warning-dim)' }}>👥</div>
            <h3 className="role-card-title">Volunteer Portal</h3>
            <p className="role-card-desc">
              Receive AI-dispatched assignments, navigate routes, translate announcements,
              and report ground-level observations.
            </p>
            <span className="role-card-cta" style={{ color: 'var(--warning)' }}>
              Enter as Volunteer →
            </span>
          </Link>

          {/* Operations */}
          <Link href="/command" className="role-card">
            <div className="role-card-icon" style={{ background: 'var(--ai-blue-dim)' }}>🎛️</div>
            <h3 className="role-card-title">Operations Center</h3>
            <p className="role-card-desc">
              Review AI recommendations, approve reallocations, optimize transit,
              balance energy grids, and compile executive summaries.
            </p>
            <span className="role-card-cta" style={{ color: 'var(--ai-blue)' }}>
              Enter as Organizer →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <p>StadiumOPS · GenAI Matchday Intelligence Platform · FIFA World Cup 2026 Challenge Project</p>
        <p style={{ marginTop: '4px', fontSize: '11px' }}>
          This is an independent challenge project. Not affiliated with FIFA.
        </p>
      </footer>
    </main>
  );
}
