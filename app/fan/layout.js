/**
 * PULSE — Fan View Layout Wrapper (Matchday Programme Aesthetic)
 */

'use client';

import Link from 'next/link';

export default function FanLayout({ children }) {
  return (
    <div className="fan-layout animate-in">
      <header className="fan-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2 12H6L9 3L15 21L18 12H22" stroke="var(--floodlight-bright)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--floodlight-bright)' }}>
            PULSE Command
          </span>
          <span style={{ fontSize: '10px', background: 'var(--amber)', color: '#000', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold', marginLeft: '5px' }}>
            FAN PORTAL
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '15px' }}>
          <Link href="/command" style={{ fontSize: '12px', color: 'var(--floodlight-dim)', textDecoration: 'underline' }}>
            To Command
          </Link>
          <Link href="/volunteer" style={{ fontSize: '12px', color: 'var(--floodlight-dim)', textDecoration: 'underline' }}>
            To Volunteer
          </Link>
        </nav>
      </header>

      <main className="fan-main" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
        {children}
      </main>
    </div>
  );
}
