/**
 * StadiumOPS — Command Center Layout Wrapper
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePulse } from '@/lib/store';
import { formatTime } from '@/lib/constants';
import StatusBar from '@/components/ui/StatusBar';

export default function CommandLayout({ children }) {
  const pathname = usePathname();
  const { state } = usePulse();
  const { simulationState } = state;
  const { phase, elapsedSeconds } = simulationState;

  // Derive dynamic score based on simulation phase
  let scoreText = '0 - 0';
  let matchPhaseText = 'PRE-MATCH';
  let phaseColor = 'var(--text-muted)';
  
  if (phase === 'first_half') {
    scoreText = '1 - 0';
    matchPhaseText = '1ST HALF';
    phaseColor = 'var(--success)';
  } else if (phase === 'halftime') {
    scoreText = '1 - 1';
    matchPhaseText = 'HALFTIME';
    phaseColor = 'var(--warning)';
  } else if (phase === 'second_half') {
    scoreText = '2 - 1';
    matchPhaseText = '2ND HALF';
    phaseColor = 'var(--success)';
  } else if (phase === 'full_time' || phase === 'egress') {
    scoreText = '2 - 1';
    matchPhaseText = 'FULL TIME';
    phaseColor = 'var(--critical)';
  }

  return (
    <div className="command-layout animate-in">
      <header className="command-header">
        {/* Left Side: StadiumOPS Brand Logo */}
        <div className="command-header-brand">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="var(--ai-blue)" strokeWidth="4" />
            <ellipse cx="50" cy="46" rx="26" ry="16" stroke="var(--text-primary)" strokeWidth="3" />
            <path d="M25 70h12l3-7 4 14 3-10 2 3h31" stroke="var(--ai-blue)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <span className="command-header-title">Stadium<span style={{ color: 'var(--ai-blue)' }}>OPS</span></span>
            <span className="command-header-badge">Operations</span>
          </div>
        </div>

        {/* Center: Top Navigation Links */}
        <nav className="command-nav">
          <Link href="/command" className={`command-nav-link ${pathname === '/command' ? 'active' : ''}`}>
            Operations Center
          </Link>
          <Link href="/volunteer" className={`command-nav-link ${pathname === '/volunteer' ? 'active' : ''}`}>
            Volunteer Portal
          </Link>
          <Link href="/fan" className={`command-nav-link ${pathname === '/fan' ? 'active' : ''}`}>
            Fan Portal
          </Link>
        </nav>

        {/* Right Side: Match telemetry status */}
        <div className="command-match">
          <span className="command-match-teams">🇧🇷 BRA vs FRA 🇫🇷</span>
          <span className="command-match-score">{scoreText}</span>
          <span className="command-match-phase" style={{ color: phaseColor }}>
            {matchPhaseText} ({formatTime(elapsedSeconds)})
          </span>
        </div>
      </header>

      {/* Ticker bar for quick metrics */}
      <StatusBar />

      {/* Main Content Area */}
      <main className="command-body">
        {children}
      </main>
    </div>
  );
}
