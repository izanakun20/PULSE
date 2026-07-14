/**
 * PULSE — Command: Zone & Gate Telemetry Panel
 */

'use client';

import { usePulse } from '@/lib/store';
import { ZONES } from '@/lib/constants';
import Badge from '@/components/ui/Badge';

export default function ZoneOverview() {
  const { state } = usePulse();
  const { stadiumState } = state;

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.05em', color: 'var(--floodlight-bright)', margin: 0 }}>
          SECTOR TELEMETRY
        </h2>
      </div>

      {/* Stand Sectors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <strong style={{ fontSize: '10px', color: 'var(--floodlight-dim)', letterSpacing: '0.05em' }}>STAND SECTOR DENSITIES</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {Object.keys(ZONES).map(key => {
            const zoneInfo = ZONES[key];
            const data = stadiumState[key] || { occupancyPercent: 0, fanCount: 0, trend: 'stable', severity: 'nominal' };
            const isHighlight = data.severity === 'high' || data.severity === 'critical';

            return (
              <div 
                key={key} 
                className="panel-elevated" 
                style={{ 
                  padding: '8px 12px', 
                  borderLeft: `3px solid ${zoneInfo.color}`,
                  animation: isHighlight ? 'blink-urgent 1.5s infinite alternate' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--floodlight)' }}>{zoneInfo.label}</span>
                  <Badge variant="severity" label={data.severity} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold' }}>
                    {data.occupancyPercent}%
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--floodlight-dim)' }}>
                    ({data.fanCount.toLocaleString()})
                  </span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${data.occupancyPercent}%`, height: '100%', backgroundColor: zoneInfo.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exit Gates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <strong style={{ fontSize: '10px', color: 'var(--floodlight-dim)', letterSpacing: '0.05em' }}>GATE CONGESTION RATES</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
          {Object.keys(stadiumState.gates).map(gateId => {
            const gate = stadiumState.gates[gateId];
            const scans = gate.scansPerMinute || 0;
            const exit = gate.exitRate || 0;
            const queue = gate.queueLength || 0;
            
            let statusColor = 'var(--green-accent)';
            if (gate.severity === 'critical') statusColor = 'var(--red)';
            else if (gate.severity === 'high') statusColor = 'var(--red)';
            else if (gate.severity === 'elevated') statusColor = 'var(--amber)';

            return (
              <div 
                key={gateId} 
                className="panel-elevated"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '6px 12px',
                  fontSize: '12px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    fontFamily: 'var(--font-display)', 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    border: `1.5px solid ${statusColor}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '11px'
                  }}>
                    {gateId}
                  </div>
                  <div>
                    <span style={{ fontWeight: '500' }}>Wait time: {queue > 100 ? `${Math.round(queue/10)} min` : '< 2 min'}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', gap: '12px' }}>
                  {scans > 0 && (
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>{scans}</span>
                      <span style={{ fontSize: '9px', color: 'var(--floodlight-dim)', marginLeft: '2px' }}>IN/M</span>
                    </div>
                  )}
                  {exit > 0 && (
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--blue-accent)' }}>{exit}</span>
                      <span style={{ fontSize: '9px', color: 'var(--floodlight-dim)', marginLeft: '2px' }}>OUT/M</span>
                    </div>
                  )}
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', color: queue > 100 ? 'var(--red)' : 'var(--floodlight)' }}>{queue}</span>
                    <span style={{ fontSize: '9px', color: 'var(--floodlight-dim)', marginLeft: '2px' }}>QUEUE</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transit Hubs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <strong style={{ fontSize: '10px', color: 'var(--floodlight-dim)', letterSpacing: '0.05em' }}>TRANSIT CAPACITY</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Object.keys(stadiumState.transit).map(stopId => {
            const stop = stadiumState.transit[stopId];
            const name = stopId.replace('_', ' ').toUpperCase();
            
            let barColor = 'var(--blue-accent)';
            if (stop.severity === 'critical') barColor = 'var(--red)';
            else if (stop.severity === 'high') barColor = 'var(--amber)';

            return (
              <div key={stopId} className="panel-elevated" style={{ padding: '6px 12px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>
                    {stop.occupancyPercent}% ({stop.queued} queued)
                  </span>
                </div>
                <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5px', overflow: 'hidden' }}>
                  <div style={{ width: `${stop.occupancyPercent}%`, height: '100%', backgroundColor: barColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
