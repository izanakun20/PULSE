/**
 * StadiumOPS — Volunteer Layout Wrapper
 */

'use client';

import Link from 'next/link';
import { usePulse } from '@/lib/store';

export default function VolunteerLayout({ children }) {
  const { state } = usePulse();
  const { currentVenue, currentHostCity } = state;

  return (
    <div className="volunteer-layout">
      <header className="volunteer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Official FIFA 26 Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/fifa26_logo.png" 
            alt="FIFA 26 Logo" 
            style={{ height: '24px', width: 'auto', objectFit: 'contain' }} 
          />
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
            Operations Center
          </Link>
        </nav>
      </header>

      <main className="volunteer-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid var(--volunteer-text)', paddingBottom: '10px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', margin: 0, textTransform: 'uppercase' }}>
              Marcus Chen
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--volunteer-text)' }}>
              ASSIGNED: WEST SECTOR STEWARD · {currentVenue.toUpperCase()} ({currentHostCity.toUpperCase()})
            </span>
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
