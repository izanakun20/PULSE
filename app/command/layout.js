/**
 * PULSE — Command Center layout wrapper
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StatusBar from '@/components/ui/StatusBar';

export default function CommandLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="command-layout animate-in">
      <header className="command-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="pulse-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 6px var(--green-accent))' }}>
              <path d="M2 12H6L9 3L15 21L18 12H22" stroke="var(--green-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--floodlight-bright)' }}>
              PULSE
            </span>
          </div>
          <span style={{ height: '18px', width: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', color: 'var(--floodlight-dim)', letterSpacing: '0.05em' }}>
            COMMAND CENTER
          </span>
        </div>

        <StatusBar />

        <nav className="command-nav">
          <Link href="/command" className={pathname === '/command' ? 'active' : ''}>
            Command Center
          </Link>
          <Link href="/volunteer" className={pathname === '/volunteer' ? 'active' : ''}>
            Volunteer App
          </Link>
          <Link href="/fan" className={pathname === '/fan' ? 'active' : ''}>
            Fan App
          </Link>
        </nav>
      </header>

      <main className="command-main">
        {children}
      </main>
    </div>
  );
}
