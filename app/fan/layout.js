/**
 * StadiumOPS — Fan Layout Wrapper
 */

'use client';

import Link from 'next/link';

export default function FanLayout({ children }) {
  return (
    <div className="fan-layout animate-in">
      <header className="fan-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--success)" strokeWidth="2" />
            <path d="M8 12h8M12 8v8" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
            StadiumOPS
          </span>
          <span className="badge badge-status-resolved" style={{ fontSize: '9px', fontWeight: 'bold', padding: '1px 6px' }}>
            FAN ASSISTANT
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '10px' }}>
          <Link href="/" className="command-nav-link" style={{ fontSize: '11px', padding: '4px 8px' }}>
            Portal Home
          </Link>
          <Link href="/command" className="command-nav-link" style={{ fontSize: '11px', padding: '4px 8px' }}>
            Operations
          </Link>
        </nav>
      </header>

      <main className="fan-main" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
        {children}
      </main>
    </div>
  );
}
