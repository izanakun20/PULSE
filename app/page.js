'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Animated stadium background lights */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 10%, rgba(42, 57, 141, 0.4) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(60, 172, 59, 0.15) 0%, transparent 55%), radial-gradient(circle at 90% 90%, rgba(230, 29, 37, 0.15) 0%, transparent 55%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Grid line overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      <div className="landing-content" style={{ zIndex: 10, position: 'relative' }}>
        {/* Main Logo & Wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
          {/* Custom StadiumOPS Badge Logo */}
          <div className="landing-pulse-icon" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 12px var(--pitch-green))' }}>
            <svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="var(--pitch-green)" strokeWidth="3" opacity="0.3" />
              <circle cx="50" cy="50" r="40" stroke="var(--stadium-blue)" strokeWidth="2.5" />
              {/* Stadium outline */}
              <ellipse cx="50" cy="46" rx="28" ry="18" stroke="var(--floodlight-bright)" strokeWidth="3" />
              <ellipse cx="50" cy="46" rx="20" ry="12" stroke="var(--pitch-green)" strokeWidth="2" />
              {/* Pitch */}
              <rect x="42" y="41" width="16" height="10" fill="rgba(60, 172, 59, 0.3)" stroke="var(--floodlight-bright)" strokeWidth="1" />
              {/* Floodlight beams */}
              <line x1="16" y1="20" x2="35" y2="35" stroke="var(--matchday-amber)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <line x1="84" y1="20" x2="65" y2="35" stroke="var(--matchday-amber)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <circle cx="16" cy="20" r="3" fill="var(--floodlight-bright)" />
              <circle cx="84" cy="20" r="3" fill="var(--floodlight-bright)" />
              {/* Heartbeat pulse wave overlay */}
              <path
                d="M32 68h8l3-8 4 16 3-11 2 3h16"
                stroke="var(--alert-red)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="landing-wordmark" style={{ fontSize: '4.2rem', color: 'var(--floodlight-bright)', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            Stadium<span style={{ color: 'var(--pitch-green)' }}>OPS</span>
          </h1>
          <span style={{
            fontSize: '0.9rem',
            fontFamily: 'var(--font-display)',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            color: 'var(--floodlight-dim)',
            marginTop: '-5px'
          }}>
            COMMAND CENTER
          </span>
        </div>

        {/* Tagline */}
        <p className="landing-tagline" style={{ color: 'var(--matchday-amber)', fontSize: '1.6rem', marginTop: 'var(--space-md)' }}>
          Predict. Coordinate. Protect.
        </p>
        <p style={{ color: 'var(--floodlight-dim)', maxWidth: '650px', margin: '0 auto var(--space-xl) auto', fontSize: '15px', lineHeight: '1.6' }}>
          Next-generation operations intelligence for FIFA World Cup 2026 matchdays. Fusing real-time crowd dynamics, incident telemetry, and AI-powered dispatch support.
        </p>

        {/* Feature Grid representing premium operations room modules */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          maxWidth: '920px',
          margin: '0 auto var(--space-xl) auto',
          background: 'rgba(13, 17, 23, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '16px',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div style={{ textAlign: 'left', padding: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🏟️</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--floodlight-bright)', margin: '4px 0 2px 0', textTransform: 'uppercase' }}>Digital Twin</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--floodlight-dim)', margin: 0 }}>Real-time 3D sector mapping.</p>
          </div>
          <div style={{ textAlign: 'left', padding: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>👥</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--floodlight-bright)', margin: '4px 0 2px 0', textTransform: 'uppercase' }}>Crowd Heatmap</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--floodlight-dim)', margin: 0 }}>Congestion & density flow analysis.</p>
          </div>
          <div style={{ textAlign: 'left', padding: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🤖</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--floodlight-bright)', margin: '4px 0 2px 0', textTransform: 'uppercase' }}>AI Proposal Engine</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--floodlight-dim)', margin: 0 }}>Gemini-optimized dispatch recommendations.</p>
          </div>
          <div style={{ textAlign: 'left', padding: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>🚨</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--floodlight-bright)', margin: '4px 0 2px 0', textTransform: 'uppercase' }}>Incident Response</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--floodlight-dim)', margin: 0 }}>Real-time gate and sector telemetry.</p>
          </div>
        </div>

        {/* View Cards - Navigation paths */}
        <div className="landing-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          {/* Command Center */}
          <Link href="/command" className="landing-card" style={{ borderTop: '4px solid var(--stadium-blue)' }}>
            <div className="landing-card-icon" style={{ color: 'var(--stadium-blue)', background: 'rgba(42, 57, 141, 0.1)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <circle cx="12" cy="10" r="2" />
              </svg>
            </div>
            <h2 className="landing-card-title">COMMAND PORTAL</h2>
            <p className="landing-card-desc">
              Broadcast command dashboard. Monitor live scoreboard, seating heatmaps, dispatcher proposals, and telemetry streams.
            </p>
            <div className="landing-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Volunteer App */}
          <Link href="/volunteer" className="landing-card" style={{ borderTop: '4px solid var(--matchday-amber)' }}>
            <div className="landing-card-icon" style={{ color: 'var(--matchday-amber)', background: 'rgba(255, 193, 7, 0.1)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="landing-card-title">VOLUNTEER PORTAL</h2>
            <p className="landing-card-desc">
              High-contrast crew dashboard. Accept dispatched tasks, view assigned sector details, and signal completions.
            </p>
            <div className="landing-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Fan App */}
          <Link href="/fan" className="landing-card" style={{ borderTop: '4px solid var(--pitch-green)' }}>
            <div className="landing-card-icon" style={{ color: 'var(--pitch-green)', background: 'rgba(60, 172, 59, 0.1)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <circle cx="12" cy="11" r="3" />
              </svg>
            </div>
            <h2 className="landing-card-title">FAN COMPANION</h2>
            <p className="landing-card-desc">
              Spectator assistance view. Check wait times at Gate assignments, receive operations alerts, and submit incident logs.
            </p>
            <div className="landing-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <p className="landing-footer" style={{ color: 'var(--floodlight-dim)', fontSize: '0.75rem', marginTop: 'var(--space-2xl)' }}>
          FIFA World Cup 2026 &bull; StadiumOPS Command Platform &bull; Challenge Project
        </p>
      </div>
    </main>
  );
}
