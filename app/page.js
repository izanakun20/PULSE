'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing">
      <div className="landing-content">
        {/* Logo & Wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          {/* Heartbeat SVG icon */}
          <div className="landing-pulse-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" opacity="0.25" />
              <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
              <path
                d="M8 24h8l3-10 5 20 4-14 3 4h9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="landing-wordmark">PULSE</h1>
        </div>

        {/* Tagline */}
        <p className="landing-tagline">
          The stadium&rsquo;s heartbeat &mdash; sensed everywhere, felt everywhere.
        </p>

        {/* View Cards */}
        <div className="landing-cards">
          {/* Command Center */}
          <Link href="/command" className="landing-card">
            <div className="landing-card-icon landing-card-icon-command">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="M6 8h.01M9 8h.01" />
              </svg>
            </div>
            <h2 className="landing-card-title">Command</h2>
            <p className="landing-card-desc">
              Broadcast control room. Multi-agent AI coordination dashboard for operations leads and incident commanders.
            </p>
            <div className="landing-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Volunteer */}
          <Link href="/volunteer" className="landing-card">
            <div className="landing-card-icon landing-card-icon-volunteer">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="landing-card-title">Volunteer</h2>
            <p className="landing-card-desc">
              High-contrast dispatch interface. Task assignments, wayfinding directions, and real-time status updates.
            </p>
            <div className="landing-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Fan */}
          <Link href="/fan" className="landing-card">
            <div className="landing-card-icon landing-card-icon-fan">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
            </div>
            <h2 className="landing-card-title">Fan</h2>
            <p className="landing-card-desc">
              Matchday companion. Gate wait times, seat wayfinding, concession menus, and live alerts — all on your phone.
            </p>
            <div className="landing-card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <p className="landing-footer">
          FIFA World Cup 2026 &bull; Stadium Operations AI
        </p>
      </div>
    </main>
  );
}
