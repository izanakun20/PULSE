/**
 * StadiumOPS — Volunteer Layout Wrapper
 */

'use client';

import Link from 'next/link';

export default function VolunteerLayout({ children }) {
  return (
    <div className="volunteer-layout">
      <header className="volunteer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M2 12H6L9 3L15 21L18 12H22" stroke="var(--volunteer-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--volunteer-text)' }}>
            StadiumOPS
          </span>
          <span className="badge" style={{ fontSize: '9px', background: 'var(--volunteer-text)', color: 'var(--volunteer-bg)', fontWeight: 'bold', padding: '1px 6px' }}>
            VOLUNTEER PORTAL
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '10px' }}>
          <Link href="/" className="command-nav-link" style={{ fontSize: '11px', color: 'var(--volunteer-text)', border: '1px solid var(--volunteer-text)', padding: '4px 8px' }}>
            Portal Home
          </Link>
          <Link href="/command" className="command-nav-link" style={{ fontSize: '11px', color: 'var(--volunteer-text)', border: '1px solid var(--volunteer-text)', padding: '4px 8px' }}>
            Operations
          </Link>
        </nav>
      </header>

      <main className="volunteer-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid var(--volunteer-text)', paddingBottom: '10px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', margin: 0, textTransform: 'uppercase' }}>
              Marcus Chen
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--volunteer-text)' }}>ASSIGNED: WEST SECTOR STEWARD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
            <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--volunteer-text)' }}>CONNECTED</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
