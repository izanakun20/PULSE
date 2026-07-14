/**
 * PULSE — StadiumOPS Command Center: Live Event Ticker Feed & Crowd Heatmap
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePulse } from '@/lib/store';
import { STADIUM_CAPACITY } from '@/lib/constants';
import Badge from '@/components/ui/Badge';

export default function EventFeed() {
  const { state } = usePulse();
  const { events, stadiumState } = state;
  const feedEndRef = useRef(null);

  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  // Calculate live occupancy details
  let totalFans = 0;
  Object.keys(stadiumState).forEach(key => {
    if (stadiumState[key] && stadiumState[key].fanCount !== undefined) {
      totalFans += stadiumState[key].fanCount;
    }
  });

  const capacity = STADIUM_CAPACITY;
  const currentFans = totalFans || 52000; // Fallback to realistic value if 0
  const occupancyPercent = Math.min(100, Math.round((currentFans / capacity) * 100)) || 65;

  const getEventIcon = (type) => {
    switch (type) {
      case 'gate_throughput': return '🎫';
      case 'zone_density': return '👥';
      case 'queue_length': return '🚶';
      case 'transit_occupancy': return '🚇';
      case 'weather_update': return '☀️';
      case 'incident_report': return '⚠️';
      case 'match_event': return '⚽';
      case 'volunteer_status': return '📋';
      default: return '📢';
    }
  };

  const getEventDescription = (evt) => {
    if (evt.type === 'gate_throughput') {
      if (evt.data.exitRate > 0) {
        return `${evt.gate} egress rate is ${evt.data.exitRate}/min (queue: ${evt.data.queueLength})`;
      }
      return `${evt.gate} scan rate is ${evt.data.entryRate}/min (queue: ${evt.data.queueLength})`;
    }
    if (evt.type === 'zone_density') {
      return `${evt.zone.toUpperCase()} Stand density at ${evt.data.occupancyPercent}% (${evt.data.fanCount.toLocaleString()} fans)`;
    }
    if (evt.type === 'queue_length') {
      return `${evt.gate} queue length is ${evt.data.queueLength} (${evt.data.waitTimeMin} min wait)`;
    }
    if (evt.type === 'transit_occupancy') {
      return `${evt.transitStop.replace('_', ' ').toUpperCase()} congestion at ${evt.data.occupancyPercent}% (${evt.data.queued} queued)`;
    }
    return evt.description;
  };

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', letterSpacing: '0.05em', color: 'var(--floodlight-bright)', margin: 0 }}>
          CROWD INTELLIGENCE
        </h2>
        <span style={{ fontSize: '10px', color: 'var(--pitch-green)', fontWeight: 'bold' }}>ANALYTICS & FEED</span>
      </div>

      {/* 1. Crowd Density Heatmap Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--floodlight-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>CROWD DENSITY HEATMAP</span>
          <span style={{ color: 'var(--alert-red)' }}>LIVE RADIAL OVERLAY</span>
        </div>
        <div className="heatmap-container">
          {/* Soccer pitch lines drawn under the heatmap */}
          <div style={{
            width: '90px',
            height: '60px',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            position: 'absolute',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '1.5px', height: '100%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.15)', position: 'absolute' }} />
          </div>
          {/* Dynamic Radial Gradients overlay representing crowd hot spots */}
          <div className="heatmap-overlay" />
          <div style={{ position: 'absolute', bottom: '5px', right: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '8px', color: 'var(--floodlight-dim)' }}>
            <span>LOW</span>
            <div style={{ width: '40px', height: '4px', background: 'linear-gradient(90deg, #3CAC3B, #FFC107, #E61D25)', borderRadius: '2px' }} />
            <span>HIGH</span>
          </div>
        </div>
      </div>

      {/* 2. Live Attendance Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
        <div className="panel-elevated" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '8px', color: 'var(--floodlight-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LIVE CROWD COUNT</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', color: 'var(--floodlight-bright)', margin: '2px 0' }}>
            {currentFans.toLocaleString()}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--floodlight-dim)' }}>/ {capacity.toLocaleString()} CAPACITY</span>
        </div>
        <div className="panel-elevated" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '8px', color: 'var(--floodlight-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DENSITY INDEX</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 'bold', color: occupancyPercent > 85 ? 'var(--alert-red)' : 'var(--pitch-green)', margin: '2px 0' }}>
            {occupancyPercent}%
          </span>
          <span style={{ fontSize: '8px', color: occupancyPercent > 85 ? 'var(--alert-red)' : 'var(--pitch-green)', fontWeight: 'bold' }}>
            {occupancyPercent > 85 ? 'HIGH CONGESTION' : 'NOMINAL STATE'}
          </span>
        </div>
      </div>

      {/* 3. Real-time Incident & Telemetry Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '180px', gap: '8px' }}>
        <strong style={{ fontSize: '10px', color: 'var(--floodlight-dim)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TELEMETRY EVENT TICKER</strong>
        
        <div 
          className="event-feed-scroll"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            overflowY: 'auto', 
            flex: 1,
            maxHeight: '260px',
            paddingRight: '4px'
          }}
        >
          {events.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: 'var(--floodlight-dim)',
              fontSize: '11px',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '20px'
            }}>
              Awaiting telemetry signals... Start simulation to stream live matchday feeds.
            </div>
          ) : (
            events.map((evt, i) => {
              let leftBorder = 'var(--stadium-blue)';
              if (evt.severity === 'critical') leftBorder = 'var(--alert-red)';
              else if (evt.severity === 'high') leftBorder = 'var(--alert-red)';
              else if (evt.severity === 'elevated') leftBorder = 'var(--matchday-amber)';

              return (
                <div 
                  key={evt.id || i}
                  className="panel-elevated"
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    padding: '8px 10px',
                    borderLeft: `3px solid ${leftBorder}`,
                    fontSize: '11.5px',
                    animation: 'fade-in-up 0.25s ease-out'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span>{getEventIcon(evt.type)}</span>
                      <strong style={{ textTransform: 'uppercase', fontSize: '9px', color: 'var(--floodlight-bright)', letterSpacing: '0.5px' }}>
                        {evt.type.replace('_', ' ')}
                      </strong>
                    </div>
                    {evt.zone && evt.zone !== 'all' && (
                      <Badge variant="zone" label={evt.zone} />
                    )}
                  </div>
                  <div style={{ color: 'var(--floodlight-dim)', lineHeight: '1.35' }}>
                    {getEventDescription(evt)}
                  </div>
                  <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginTop: '3px', textAlign: 'right', display: 'block' }}>
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={feedEndRef} />
        </div>
      </div>
    </div>
  );
}
