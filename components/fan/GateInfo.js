/**
 * PULSE — Fan: Gate wait times with jersey-number-style badges
 */

'use client';

import { usePulse } from '@/lib/store';
import { GATES } from '@/lib/constants';

export default function GateInfo() {
  const { state } = usePulse();
  const { stadiumState } = state;

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.05em', color: 'var(--floodlight-bright)', margin: 0 }}>
          STADIUM GATES
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--floodlight-dim)' }}>Select a gate for full status</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {Object.keys(GATES).map(gateId => {
          const config = GATES[gateId];
          const liveData = stadiumState.gates[gateId] || { scansPerMinute: 0, queueLength: 0, severity: 'nominal' };
          const queue = liveData.queueLength || 0;

          // Status colors
          let statusColor = 'var(--green-accent)';
          let statusLabel = 'CLEAR';
          let glow = 'rgba(34, 197, 94, 0.2)';
          
          if (liveData.severity === 'critical') {
            statusColor = 'var(--red)';
            statusLabel = 'CLOSED';
            glow = 'rgba(239, 68, 68, 0.4)';
          } else if (liveData.severity === 'high') {
            statusColor = 'var(--red)';
            statusLabel = 'CONGESTED';
            glow = 'rgba(239, 68, 68, 0.4)';
          } else if (liveData.severity === 'elevated') {
            statusColor = 'var(--amber)';
            statusLabel = 'BUSY';
            glow = 'rgba(245, 158, 11, 0.3)';
          }

          // Calculate wait time
          const waitTime = queue > 100 ? `${Math.round(queue/10)} min` : '< 2 min';

          return (
            <div 
              key={gateId} 
              className="panel-elevated fan-gate-card"
              style={{ 
                padding: '15px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                border: '1.5px solid var(--border)',
                borderColor: queue > 100 ? statusColor : 'var(--border)',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: queue > 100 ? `0 0 10px ${glow}` : 'none'
              }}
            >
              {/* Jersey Number badge */}
              <div 
                style={{ 
                  fontFamily: 'var(--font-display)', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  border: `3px solid ${statusColor}`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '28px',
                  color: 'var(--floodlight-bright)',
                  boxShadow: `0 0 12px ${glow}`,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  marginBottom: '10px'
                }}
              >
                {gateId.replace('G', '')}
              </div>

              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.03em', color: 'var(--floodlight-bright)' }}>
                {config.label.toUpperCase()}
              </strong>
              
              <span style={{ fontSize: '10px', color: 'var(--floodlight-dim)', margin: '2px 0 6px 0' }}>
                STAND: {config.zone.toUpperCase()}
              </span>

              <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: statusColor }}>
                  {statusLabel}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--floodlight-bright)' }}>
                  Wait: {waitTime}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
