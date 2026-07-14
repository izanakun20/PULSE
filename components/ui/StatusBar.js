/**
 * PULSE — UI Component: StatusBar Ticker
 */

'use client';

import { usePulse } from '@/lib/store';
import { formatTime, STADIUM_CAPACITY } from '@/lib/constants';

export default function StatusBar() {
  const { state } = usePulse();
  const { simulationState, events, stadiumState } = state;
  const { phaseLabel, phaseIcon, elapsedSeconds } = simulationState;

  // Calculate live statistics
  const activeAlerts = state.fanAlerts.length;
  
  // Calculate total scans per minute
  let totalScans = 0;
  let activeGatesCount = 0;
  if (stadiumState.gates) {
    Object.values(stadiumState.gates).forEach(g => {
      totalScans += g.scansPerMinute || 0;
      if (g.scansPerMinute > 0) activeGatesCount++;
    });
  }

  // Calculate total stadium occupancy
  let totalFans = 0;
  let zonesCount = 0;
  Object.keys(stadiumState).forEach(key => {
    if (stadiumState[key] && stadiumState[key].fanCount !== undefined) {
      totalFans += stadiumState[key].fanCount;
      zonesCount++;
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
        <span className="data-label">CLOCK</span>
        <span className="match-clock">{formatTime(elapsedSeconds)}</span>
      </div>

      <div className="status-indicator">
        <span className="data-label">LIVE OCCUPANCY</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span className="data-value">{occupancyPercent}%</span>
          <span className="data-unit">({totalFans.toLocaleString()})</span>
        </div>
      </div>

      <div className="status-indicator">
        <span className="data-label">GATE SCAN RATE</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span className="data-value">{totalScans}</span>
          <span className="data-unit">SCAN/MIN</span>
        </div>
      </div>

      <div className="status-indicator">
        <span className="data-label">COMMS BROADCASTS</span>
        <span className="data-value">{activeAlerts}</span>
      </div>
    </div>
  );
}
