/**
 * StadiumOPS — Command Center Layout Wrapper
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePulse } from '@/lib/store';
import { formatTime, HOST_CITIES, TODAY_MATCHES } from '@/lib/constants';
import StatusBar from '@/components/ui/StatusBar';

export default function CommandLayout({ children }) {
  const pathname = usePathname();
  const { state, dispatch } = usePulse();
  const { simulationState, currentHostCity, currentVenue, currentMatchId } = state;
  const { phase, elapsedSeconds } = simulationState;

  // Find active match details
  const activeMatch = TODAY_MATCHES.find(m => m.id === currentMatchId) || TODAY_MATCHES[0];

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

  const handleMatchChange = (e) => {
    const selectedId = e.target.value;
    const match = TODAY_MATCHES.find(m => m.id === selectedId);
    if (match) {
      dispatch({
        type: 'SET_TOURNAMENT_CONTEXT',
        payload: {
          hostCity: match.city,
          venue: match.venue,
          matchId: match.id
        }
      });
    }
  };

  return (
    <div className="command-layout animate-in">
      <header className="command-header">
        {/* Left Side: StadiumOPS Brand Logo */}
        <div className="command-header-brand" style={{ gap: '8px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/fifa26_logo.png" 
            alt="FIFA 26 Logo" 
            style={{ height: '28px', width: 'auto', objectFit: 'contain' }} 
          />
          <div>
            <span className="command-header-title">Stadium<span style={{ color: 'var(--ai-blue)' }}>OPS</span></span>
            <span className="command-header-badge">Matchday Intelligence</span>
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

        {/* Right Side: Tournament Context & Live Matchday Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Match selector dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 'bold' }}>
              Live Matchday Context
            </span>
            <select
              value={currentMatchId}
              onChange={handleMatchChange}
              style={{
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '11px',
                padding: '2px 6px',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: '600'
              }}
            >
              {TODAY_MATCHES.map(m => (
                <option key={m.id} value={m.id}>
                  {m.city} — {m.home} vs {m.away}
                </option>
              ))}
            </select>
          </div>

          <span style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

          {/* Active telemetry score representation */}
          <div className="command-match" style={{ gap: '8px' }}>
            <span className="command-match-teams" style={{ fontSize: '12px' }}>
              {activeMatch.home.substring(0,3).toUpperCase()} {scoreText} {activeMatch.away.substring(0,3).toUpperCase()}
            </span>
            <span className="badge badge-status-live" style={{ fontSize: '8px', padding: '1px 5px' }}>
              {matchPhaseText}
            </span>
          </div>
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
