/**
 * PULSE — StadiumOPS Command Center layout wrapper
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
  let phaseColor = 'var(--floodlight-dim)';
  
  if (phase === 'first_half') {
    scoreText = '1 - 0';
    matchPhaseText = '1ST HALF';
    phaseColor = 'var(--pitch-green)';
  } else if (phase === 'halftime') {
    scoreText = '1 - 1';
    matchPhaseText = 'HALFTIME';
    phaseColor = 'var(--matchday-amber)';
  } else if (phase === 'second_half') {
    scoreText = '2 - 1';
    matchPhaseText = '2ND HALF';
    phaseColor = 'var(--pitch-green)';
  } else if (phase === 'full_time' || phase === 'egress') {
    scoreText = '2 - 1';
    matchPhaseText = 'FULL TIME';
    phaseColor = 'var(--alert-red)';
  }

  return (
    <div className="command-layout animate-in">
      {/* Premium Full Width Live Scoreboard Header */}
      <header className="scoreboard-header">
        {/* Left Side: StadiumOPS Brand Logo */}
        <div className="scoreboard-brand">
          <svg className="scoreboard-brand-logo" width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="var(--pitch-green)" strokeWidth="3.5" />
            <ellipse cx="50" cy="46" rx="26" ry="16" stroke="var(--floodlight-bright)" strokeWidth="2.5" />
            <rect x="44" y="41" width="12" height="10" stroke="var(--floodlight-bright)" strokeWidth="1" fill="rgba(60, 172, 59, 0.2)" />
            <path d="M25 70h12l3-7 4 14 3-10 2 3h31" stroke="var(--alert-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <span className="scoreboard-brand-title">Stadium<span style={{ color: 'var(--pitch-green)' }}>OPS</span></span>
            <span className="scoreboard-brand-sub">Command Center</span>
          </div>
        </div>

        {/* Center: Live Scoreboard Widget */}
        <div className="scoreboard-match">
          <div className="scoreboard-team">
            <span className="scoreboard-team-flag">🇧🇷</span>
            <span>BRAZIL</span>
          </div>

          <div className="scoreboard-score-container">
            <span className="scoreboard-score">{scoreText.split(' - ')[0]}</span>
            <span className="scoreboard-score-divider">:</span>
            <span className="scoreboard-score">{scoreText.split(' - ')[1]}</span>
          </div>

          <div className="scoreboard-team">
            <span>FRANCE</span>
            <span className="scoreboard-team-flag">🇫🇷</span>
          </div>

          <span style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '0 5px' }} />

          <div className="scoreboard-time-container">
            <span className="scoreboard-timer">{formatTime(elapsedSeconds)}</span>
            <span className="scoreboard-period" style={{ color: phaseColor }}>{matchPhaseText}</span>
          </div>
        </div>

        {/* Right Side: Next Match & Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="scoreboard-info">
            <span className="scoreboard-info-label">NEXT MATCH</span>
            <span className="scoreboard-info-value">ARG ⚔️ GER &bull; 20:00</span>
          </div>
          <span style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--floodlight-bright)' }}>AISHA</div>
              <div style={{ fontSize: '8px', color: 'var(--pitch-green)', fontWeight: 'bold', letterSpacing: '0.5px' }}>COMMANDER</div>
            </div>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--stadium-blue) 0%, var(--pitch-green) 100%)',
              border: '1.5px solid var(--floodlight-bright)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#ffffff'
            }}>
              AC
            </div>
          </div>
        </div>
      </header>

      {/* Ticker bar for quick metrics */}
      <StatusBar />

      <div className="command-container">
        {/* Left Side: FIFA Operations Room Navigation Sidebar */}
        <aside className="command-sidebar">
          <div className="command-sidebar-menu">
            <Link href="/command" className={`command-sidebar-item ${pathname === '/command' ? 'active' : ''}`}>
              <span>📊</span> Dashboard
            </Link>
            <div className="command-sidebar-item">
              <span>🗺️</span> Stadium Map
            </div>
            <div className="command-sidebar-item">
              <span>📈</span> Crowd Analytics
            </div>
            <div className="command-sidebar-item">
              <span>🚨</span> Alerts & Incidents
            </div>
            <div className="command-sidebar-item">
              <span>📋</span> Resource Dispatch
            </div>
            <Link href="/volunteer" className={`command-sidebar-item ${pathname === '/volunteer' ? 'active' : ''}`}>
              <span>👥</span> Volunteer Hub
            </Link>
            <Link href="/fan" className={`command-sidebar-item ${pathname === '/fan' ? 'active' : ''}`}>
              <span>📱</span> Fan Companion
            </Link>
            <div className="command-sidebar-item">
              <span>☀️</span> Weather Central
            </div>
            <div className="command-sidebar-item">
              <span>📄</span> Match Reports
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.05)', 
            padding: '12px', 
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '9px', color: 'var(--floodlight-dim)', letterSpacing: '1px', textTransform: 'uppercase' }}>System Status</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px', fontSize: '11px', color: 'var(--pitch-green)', fontWeight: 'bold' }}>
              <span className="pulse-dot status-active"></span> ALL SYSTEMS NOMINAL
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="command-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
