'use client';

import Link from 'next/link';

const LIVE_MATCHES = [
  {
    id: 'm1',
    home: 'Brazil',
    away: 'France',
    city: 'New York/New Jersey',
    venue: 'MetLife Stadium',
    score: '1 - 0',
    time: '35\'',
    status: 'live',
    phase: '1st Half'
  },
  {
    id: 'm2',
    home: 'Canada',
    away: 'Germany',
    city: 'Toronto',
    venue: 'BMO Field',
    score: '0 - 0',
    time: '17:00 EST',
    status: 'upcoming',
    phase: 'Pre-Match'
  },
  {
    id: 'm3',
    home: 'USA',
    away: 'England',
    city: 'Los Angeles',
    venue: 'SoFi Stadium',
    score: '0 - 0',
    time: '18:00 EST',
    status: 'upcoming',
    phase: 'Pre-Match'
  }
];

const TOURNAMENT_ALERTS = [
  {
    id: 'a1',
    type: 'transit',
    message: '🚇 Staggered Release Active for MetLife Stadium North gates to prevent train platform congestion.',
    urgency: 'high'
  },
  {
    id: 'a2',
    type: 'weather',
    message: '☀️ UV advisory active at SoFi Stadium. Hydration station dispatches completed by StadiumIQ.',
    urgency: 'medium'
  },
  {
    id: 'a3',
    type: 'access',
    message: '♿ Accessibility support guides deployed to East sectors at BMO Field.',
    urgency: 'low'
  }
];

const HOST_CITIES = [
  { city: 'New York/New Jersey', venue: 'MetLife Stadium', status: 'active' },
  { city: 'Los Angeles', venue: 'SoFi Stadium', status: 'active' },
  { city: 'Toronto', venue: 'BMO Field', status: 'active' },
  { city: 'Dallas', venue: 'AT&T Stadium', status: 'standby' },
  { city: 'Mexico City', venue: 'Estadio Azteca', status: 'standby' },
  { city: 'Vancouver', venue: 'BC Place', status: 'standby' }
];

const CAPABILITIES = [
  { icon: '🧭', title: 'Navigation', desc: 'Provides fans with alternate entry gates and optimized concourse wayfinding.' },
  { icon: '👥', title: 'Crowd Intelligence', desc: 'Predicts section bottlenecks and occupancy surges 15-30 minutes ahead.' },
  { icon: '♿', title: 'Accessibility', desc: 'Coordinates wheelchair guides and sensory support routing.' },
  { icon: '🚇', title: 'Transportation', desc: 'Triggers staggered egress holds to balance bus and metro loads.' },
  { icon: '🌍', title: 'Multilingual', desc: 'Broadcasts translated alerts to fans in English, Spanish, and French.' },
  { icon: '🌱', title: 'Sustainability', desc: 'Monitors waste bin capacities and coordinates power-saving grid modes.' },
  { icon: '🚨', title: 'Incident Response', desc: 'Identifies fan incident reports and dispatches nearby stewards.' },
  { icon: '📊', title: 'Executive Reports', desc: 'Generates matchday summaries, efficiency levels, and operations audits.' }
];

export default function HomePage() {
  return (
    <main className="landing" style={{ padding: '0 0 var(--space-xl) 0' }}>
      
      {/* ── HEADER NAVIGATION ── */}
      <nav className="landing-nav" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Official FIFA 26 Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/fifa26_logo.png" 
            alt="FIFA 26 Logo" 
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
          />
          <span className="landing-wordmark">StadiumOPS</span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Link href="/command" className="command-nav-link">Operations Center</Link>
          <Link href="/volunteer" className="command-nav-link">Volunteer Portal</Link>
          <Link href="/fan" className="command-nav-link">Fan Portal</Link>
        </div>
      </nav>

      {/* ── TOP HERO SECTION (COMPACT & MODERN AI FIRST) ── */}
      <header style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        padding: '30px 20px 20px 20px', 
        textAlign: 'center', 
        margin: '0 auto' 
      }}>
        {/* Large Centered Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/fifa26_logo.png" 
            alt="FIFA World Cup 2026 Logo" 
            style={{ 
              height: '96px', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.1))'
            }} 
          />
        </div>

        <span className="badge badge-ai" style={{ fontSize: '10px', padding: '2px 10px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          FIFA World Cup 2026 GenAI Platform
        </span>
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '2.8rem', 
          lineHeight: '1.1', 
          color: 'var(--text-primary)',
          margin: '0 0 10px 0'
        }}>
          Stadium<span style={{ color: 'var(--ai-blue)' }}>OPS</span>
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-secondary)', 
          maxWidth: '650px', 
          margin: '0 auto',
          lineHeight: '1.5'
        }}>
          One context-aware AI platform (StadiumIQ) assisting fans, volunteers, venue staff, 
          and organizers across all host cities during the FIFA World Cup 2026.
        </p>
      </header>

      {/* ── LIVE TOURNAMENT OVERVIEW ── */}
      <section className="landing-section animate-in" style={{ maxWidth: '1000px', margin: '0 auto 30px auto' }}>
        <h2 className="landing-section-title" style={{ margin: '0 0 15px 0', textAlign: 'left' }}>
          Live Tournament Operations
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Matches & Venues Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              Today&apos;s Match Schedules
            </span>
            
            {LIVE_MATCHES.map(match => (
              <div 
                key={match.id}
                className="panel-elevated"
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {match.home} vs {match.away}
                    </strong>
                    {match.status === 'live' ? (
                      <span className="badge badge-status-live" style={{ fontSize: '9px', padding: '1px 5px' }}>
                        LIVE {match.time}
                      </span>
                    ) : (
                      <span className="badge badge-status-pending" style={{ fontSize: '9px', padding: '1px 5px' }}>
                        {match.time}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    📍 {match.venue} ({match.city})
                  </span>
                </div>
                
                {match.status === 'live' && (
                  <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: 'var(--ai-blue)', padding: '2px 8px', background: 'var(--ai-blue-dim)', borderRadius: '4px' }}>
                    {match.score}
                  </div>
                )}
              </div>
            ))}

            {/* Host Cities quick links */}
            <div style={{ marginTop: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                Active Host Venues
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {HOST_CITIES.map(c => (
                  <span 
                    key={c.city}
                    className="badge"
                    style={{ 
                      background: c.status === 'active' ? 'var(--ai-blue-dim)' : 'var(--bg-elevated)', 
                      color: c.status === 'active' ? 'var(--ai-blue)' : 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      fontSize: '10px'
                    }}
                  >
                    ● {c.venue}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Tournament Alerts Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              StadiumIQ Global Alerts
            </span>
            
            <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', minHeight: '230px' }}>
              {TOURNAMENT_ALERTS.map(alert => {
                let borderCol = 'var(--border)';
                if (alert.urgency === 'high') borderCol = 'var(--critical)';
                else if (alert.urgency === 'medium') borderCol = 'var(--warning)';

                return (
                  <div 
                    key={alert.id}
                    className="panel-elevated"
                    style={{ 
                      borderLeft: `3px solid ${borderCol}`,
                      padding: '8px 12px',
                      fontSize: '12px',
                      lineHeight: '1.4',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {alert.message}
                  </div>
                );
              })}
              
              <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                Sync telemetry active across 16 host cities.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR EXPERIENCE ── */}
      <section className="landing-section" style={{ maxWidth: '1000px', margin: '0 auto 30px auto' }}>
        <h2 className="landing-section-title" style={{ margin: '0 0 15px 0', textAlign: 'left' }}>
          Choose Your Portal Experience
        </h2>
        
        <div className="role-grid">
          {/* Fan Portal */}
          <Link href="/fan" className="role-card">
            <div className="role-card-icon" style={{ background: 'var(--success-dim)' }}>🎟️</div>
            <h3 className="role-card-title">Fan Portal</h3>
            <p className="role-card-desc">
              Get alternate route directions, view wait times, submit incident reports, 
              and receive proactive multilingual notifications.
            </p>
            <span className="role-card-cta" style={{ color: 'var(--success)' }}>
              Enter Fan Portal →
            </span>
          </Link>

          {/* Volunteer Portal */}
          <Link href="/volunteer" className="role-card">
            <div className="role-card-icon" style={{ background: 'var(--warning-dim)' }}>👥</div>
            <h3 className="role-card-title">Volunteer Portal</h3>
            <p className="role-card-desc">
              Receive AI-dispatched tasks, navigate stadium routes, translate announcements, 
              and update status logs in real-time.
            </p>
            <span className="role-card-cta" style={{ color: 'var(--warning)' }}>
              Enter Volunteer Portal →
            </span>
          </Link>

          {/* Operations Center */}
          <Link href="/command" className="role-card">
            <div className="role-card-icon" style={{ background: 'var(--ai-blue-dim)' }}>🎛️</div>
            <h3 className="role-card-title">Operations Center</h3>
            <p className="role-card-desc">
              Review StadiumIQ recommendations, approve reallocations, optimize transit levels, 
              and compile executive summary reports.
            </p>
            <span className="role-card-cta" style={{ color: 'var(--ai-blue)' }}>
              Enter Operations Center →
            </span>
          </Link>
        </div>
      </section>

      {/* ── POWERED BY STADIUMIQ (AI CAPABILITIES) ── */}
      <section className="landing-section" style={{ maxWidth: '1000px', margin: '0 auto 20px auto' }}>
        <h2 className="landing-section-title" style={{ margin: '0 0 15px 0', textAlign: 'left' }}>
          Powered by StadiumIQ
        </h2>
        
        <div className="panel" style={{ padding: '20px' }}>
          <div className="capability-grid">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="capability-card" style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '18px' }}>{cap.icon}</span>
                  <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{cap.title}</strong>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer" style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '20px' }}>
        <p>StadiumOPS · GenAI Matchday Intelligence Platform · FIFA World Cup 2026 Challenge Project</p>
        <p style={{ marginTop: '4px', fontSize: '11px' }}>
          This is an independent challenge project. Not affiliated with FIFA.
        </p>
      </footer>
    </main>
  );
}
