/**
 * StadiumOPS — UI Component: StatusBar Ticker
 */

'use client';

import { usePulse } from '@/lib/store';
import { formatTime, STADIUM_CAPACITY } from '@/lib/constants';

export default function StatusBar() {
  const { state } = usePulse();
  const { simulationState, stadiumState } = state;
  const { phaseLabel, phaseIcon, elapsedSeconds } = simulationState;

  // Calculate live statistics
  const activeAlerts = state.fanAlerts.length;
  
  // Calculate total scans per minute
  let totalScans = 0;
  if (stadiumState.gates) {
    Object.values(stadiumState.gates).forEach(g => {
      totalScans += g.scansPerMinute || 0;
    });
  }

  // Calculate total stadium occupancy
  let totalFans = 0;
  Object.keys(stadiumState).forEach(key => {
    if (stadiumState[key] && stadiumState[key].fanCount !== undefined) {
      totalFans += stadiumState[key].fanCount;
    }
  });

  const occupancyPercent = Math.min(100, Math.round((totalFans / STADIUM_CAPACITY) * 100)) || 0;

  return (
    <div className="status-bar">
      <div className="status-indicator">
        <span className="match-phase">
          <span className="phase-icon">{phaseIcon}</span>
          <span className="phase-label">{phaseLabel}</span>
        </span>
      </div>

      <div className="status-indicator">
        <span className="data-label">Clock</span>
        <span className="match-clock" style={{ fontSize: '14px' }}>{formatTime(elapsedSeconds)}</span>
      </div>

      <div className="status-indicator">
        <span className="data-label">Live Occupancy</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span className="data-value" style={{ color: 'var(--ai-blue)' }}>{occupancyPercent}%</span>
          <span className="data-unit">({totalFans.toLocaleString()})</span>
        </div>
      </div>

      <div className="status-indicator">
        <span className="data-label">Gate scan rate</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
          <span className="data-value">{totalScans}</span>
          <span className="data-unit">scans/min</span>
        </div>
      </div>

      <div className="status-indicator">
        <span className="data-label">Active alerts</span>
        <span className="data-value" style={{ color: activeAlerts > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
          {activeAlerts}
        </span>
      </div>
    </div>
  );
}
