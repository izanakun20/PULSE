/**
 * PULSE — Volunteer view layout wrapper (Light Mode, Utilitarian, Outdoor Optimized)
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
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            StadiumOPS
          </span>
          <span style={{ fontSize: '10px', background: 'var(--volunteer-text)', color: 'var(--volunteer-bg)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold', marginLeft: '5px' }}>
            STEWARD
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '15px' }}>
          <Link href="/command" style={{ fontSize: '12px', color: 'var(--volunteer-text)', textDecoration: 'underline', fontWeight: 'bold' }}>
            To Command
          </Link>
          <Link href="/fan" style={{ fontSize: '12px', color: 'var(--volunteer-text)', textDecoration: 'underline', fontWeight: 'bold' }}>
            To Fan App
          </Link>
        </nav>
      </header>

      <main className="volunteer-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2.5px solid var(--volunteer-text)', paddingBottom: '10px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', margin: 0, textTransform: 'uppercase' }}>
              Marcus Chen
            </h1>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>ZONE ASSIGNMENT: WEST SECTOR</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>CONNECTED</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
