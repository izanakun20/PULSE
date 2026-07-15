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
          {/* Official FIFA 26 Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/fifa26_logo.png" 
            alt="FIFA 26 Logo" 
            style={{ height: '24px', width: 'auto', objectFit: 'contain' }} 
          />
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
            Operations center
          </Link>
        </nav>
      </header>

      <main className="fan-main" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
        {children}
      </main>
    </div>
  );
}
