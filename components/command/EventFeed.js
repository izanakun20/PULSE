/**
 * PULSE — Command: Live Event Ticker Feed
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePulse } from '@/lib/store';
import Badge from '@/components/ui/Badge';

export default function EventFeed() {
  const { state } = usePulse();
  const { events } = state;
  const feedEndRef = useRef(null);

  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

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
      return `${evt.gate} scan rate is ${evt.data.scansPerMinute}/min (queue: ${evt.data.queueLength})`;
    }
    if (evt.type === 'zone_density') {
      return `${evt.zone.toUpperCase()} Sector density at ${evt.data.occupancyPercent}% (${evt.data.fanCount.toLocaleString()} fans)`;
    }
    if (evt.type === 'queue_length') {
      return `${evt.data.location} queue length is ${evt.data.queueLength} (${evt.data.waitTimeMinutes} min wait)`;
    }
    if (evt.type === 'transit_occupancy') {
      const queued = evt.data.departingFansQueued !== undefined ? ` (${evt.data.departingFansQueued} queued)` : '';
      return `${evt.data.stop.toUpperCase()} occupancy is ${evt.data.occupancyPercent}%${queued}`;
    }
    if (evt.type === 'weather_update') {
      return `Weather station: ${evt.data.temperature}°C, ${evt.data.condition}. ${evt.data.alert || ''}`;
    }
    if (evt.type === 'incident_report') {
      return `[INCIDENT] ${evt.data.incidentType.toUpperCase()} - ${evt.data.description} at ${evt.data.location}`;
    }
    if (evt.type === 'match_event') {
      return evt.data.description;
    }
    if (evt.type === 'volunteer_status') {
      return `${evt.data.name} (${evt.zone.toUpperCase()}): ${evt.data.message}`;
    }
    return JSON.stringify(evt.data);
  };

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '15px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.05em', color: 'var(--floodlight-bright)', margin: 0 }}>
          RAW INTEL FEED
        </h2>
        <span className="badge badge-status-live" style={{ fontSize: '10px' }}>
          {events.length} EVENTS
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {events.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1, 
            textAlign: 'center',
            color: 'var(--floodlight-dim)',
            padding: '20px' 
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', margin: '0 0 4px 0' }}>NO ACTIVE INGEST</h3>
            <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.4' }}>Simulator telemetry feed is offline.</p>
          </div>
        ) : (
          events.map((evt, i) => {
            let leftBorder = 'rgba(255,255,255,0.05)';
            if (evt.severity === 'critical') leftBorder = 'var(--red)';
            else if (evt.severity === 'high') leftBorder = 'var(--red)';
            else if (evt.severity === 'elevated') leftBorder = 'var(--amber)';

            return (
              <div 
                key={evt.id || i}
                className="panel-elevated"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '8px 12px',
                  borderLeft: `2.5px solid ${leftBorder}`,
                  fontSize: '12px',
                  animation: 'fade-in-up 0.3s ease-out'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{getEventIcon(evt.type)}</span>
                    <strong style={{ textTransform: 'uppercase', fontSize: '10px', color: 'var(--floodlight-bright)', letterSpacing: '0.03em' }}>
                      {evt.type.replace('_', ' ')}
                    </strong>
                  </div>
                  {evt.zone && evt.zone !== 'all' && (
                    <Badge variant="zone" label={evt.zone} />
                  )}
                </div>
                <div style={{ color: 'var(--floodlight-dim)', lineHeight: '1.4' }}>
                  {getEventDescription(evt)}
                </div>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', marginTop: '4px', textAlign: 'right', display: 'block' }}>
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
