/**
 * PULSE — StadiumOPS Command Center: Seating Layout Visualizer & Sector Telemetry
 */

'use client';

import { useState } from 'react';
import { usePulse } from '@/lib/store';
import { ZONES } from '@/lib/constants';
import Badge from '@/components/ui/Badge';

export default function ZoneOverview() {
  const { state } = usePulse();
  const { stadiumState } = state;
  const [selectedZone, setSelectedZone] = useState('north'); // Mapped to Zone A

  // Mapping between StadiumOPS nodes (Zone A-F) and store ZONES
  const zoneMapping = {
    A: { storeId: 'north', label: 'ZONE A (North Stand)', coords: { top: '5px', left: 'calc(50% - 14px)' } },
    B: { storeId: 'west', label: 'ZONE B (West Stand)', coords: { top: '55px', left: '12px' } },
    C: { storeId: 'east', label: 'ZONE C (East Stand)', coords: { top: '55px', right: '12px' } },
    D: { storeId: 'south', label: 'ZONE D (South Stand)', coords: { bottom: '38px', right: '28px' } },
    E: { storeId: 'concourse_s', label: 'ZONE E (South Concourse)', coords: { bottom: '5px', left: 'calc(50% - 14px)' } },
    F: { storeId: 'concourse_n', label: 'ZONE F (North Concourse)', coords: { bottom: '38px', left: '28px' } },
  };

  const getZoneStatusColor = (severity) => {
    if (severity === 'critical' || severity === 'high') return 'var(--alert-red)';
    if (severity === 'elevated') return 'var(--matchday-amber)';
    return 'var(--pitch-green)';
  };

  const currentZoneInfo = ZONES[selectedZone] || {};
  const currentZoneData = stadiumState[selectedZone] || { occupancyPercent: 0, fanCount: 0, trend: 'stable', severity: 'nominal' };

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '0.05em', color: 'var(--floodlight-bright)', margin: 0 }}>
          STADIUM OVERVIEW
        </h2>
        <span style={{ fontSize: '10px', color: 'var(--pitch-green)', fontWeight: 'bold' }}>LIVE TELEMETRY</span>
      </div>

      {/* 1. Interactive 3D Seating Zones Layout */}
      <div className="stadium-visualizer">
        <div className="stadium-ring">
          {/* Pitch drawing */}
          <div className="stadium-pitch" />
          
          {/* Clickable Zone Nodes */}
          {Object.entries(zoneMapping).map(([key, zone]) => {
            const data = stadiumState[zone.storeId] || { severity: 'nominal' };
            const isActive = selectedZone === zone.storeId;
            const statusColor = getZoneStatusColor(data.severity);

            return (
              <button
                key={key}
                className={`stadium-zone-node ${isActive ? 'active' : ''}`}
                style={{
                  ...zone.coords,
                  borderColor: statusColor,
                  boxShadow: isActive ? `0 0 12px ${statusColor}` : 'none'
                }}
                onClick={() => setSelectedZone(zone.storeId)}
                title={zone.label}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selected Zone Detailed Panel */}
      <div className="panel-elevated" style={{ borderLeft: `4px solid ${currentZoneInfo.color || 'var(--stadium-blue)'}`, padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--floodlight-bright)' }}>
            {(currentZoneInfo.label || '').toUpperCase()}
          </strong>
          <Badge variant="severity" label={currentZoneData.severity} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '8px', color: 'var(--floodlight-dim)' }}>OCCUPANCY</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', color: 'var(--floodlight-bright)' }}>
              {currentZoneData.occupancyPercent}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: 'var(--floodlight-dim)' }}>ATTENDANCE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', color: 'var(--floodlight-bright)' }}>
              {currentZoneData.fanCount.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: 'var(--floodlight-dim)' }}>TREND</div>
            <div style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: currentZoneData.trend === 'increasing' ? 'var(--alert-red)' : 'var(--pitch-green)',
              marginTop: '3px'
            }}>
              {currentZoneData.trend === 'increasing' ? '▲ RISING' : currentZoneData.trend === 'decreasing' ? '▼ FALLING' : '■ STABLE'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Gate Congestion Rates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <strong style={{ fontSize: '10px', color: 'var(--floodlight-dim)', letterSpacing: '0.05em' }}>CROWD BY GATE</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '120px', overflowY: 'auto' }}>
          {Object.keys(stadiumState.gates).map(gateId => {
            const gate = stadiumState.gates[gateId];
            const scans = gate.scansPerMinute || 0;
            const exit = gate.exitRate || 0;
            const queue = gate.queueLength || 0;
            
            let statusColor = 'var(--pitch-green)';
            if (gate.severity === 'critical' || gate.severity === 'high') statusColor = 'var(--alert-red)';
            else if (gate.severity === 'elevated') statusColor = 'var(--matchday-amber)';

            return (
              <div 
                key={gateId} 
                className="panel-elevated"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '5px 10px',
                  fontSize: '11px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    fontFamily: 'var(--font-display)', 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    border: `1.5px solid ${statusColor}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '10px'
                  }}>
                    {gateId}
                  </div>
                  <span style={{ fontWeight: '500', color: 'var(--floodlight-dim)' }}>
                    Wait: {queue > 100 ? `${Math.round(queue/10)}m` : '<2m'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                  {scans > 0 && (
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--floodlight-bright)' }}>{scans}</span>
                      <span style={{ fontSize: '8px', color: 'var(--floodlight-dim)', marginLeft: '1px' }}>IN/M</span>
                    </div>
                  )}
                  {exit > 0 && (
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--stadium-blue)' }}>{exit}</span>
                      <span style={{ fontSize: '8px', color: 'var(--floodlight-dim)', marginLeft: '1px' }}>OUT/M</span>
                    </div>
                  )}
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', color: queue > 100 ? 'var(--alert-red)' : 'var(--floodlight-bright)' }}>{queue}</span>
                    <span style={{ fontSize: '8px', color: 'var(--floodlight-dim)', marginLeft: '1px' }}>Q</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Transit Capacity */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <strong style={{ fontSize: '10px', color: 'var(--floodlight-dim)', letterSpacing: '0.05em' }}>TRANSIT CAPACITY</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {Object.keys(stadiumState.transit).map(stopId => {
            const stop = stadiumState.transit[stopId];
            const name = stopId.replace('_', ' ').toUpperCase();
            
            let barColor = 'var(--stadium-blue)';
            if (stop.severity === 'critical') barColor = 'var(--alert-red)';
            else if (stop.severity === 'high') barColor = 'var(--matchday-amber)';

            return (
              <div key={stopId} className="panel-elevated" style={{ padding: '5px 10px', fontSize: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize', color: 'var(--floodlight-dim)' }}>{name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--floodlight-bright)' }}>
                    {stop.occupancyPercent}% ({stop.queued} q)
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
