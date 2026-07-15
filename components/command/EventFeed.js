/**
 * StadiumOPS — Command Center: Live Event Stream & Heatmap
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { usePulse } from '@/lib/store';
import Badge from '@/components/ui/Badge';

export default function EventFeed() {
  const { state } = usePulse();
  const { events } = state;
  const feedEndRef = useRef(null);
  const [filterType, setFilterType] = useState('all');

  // Auto-scroll to bottom of events list when new events come in
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
      case 'incident_report': return '⚠️';
      case 'weather_update': return '☀️';
      case 'match_event': return '⚽';
      default: return '📢';
    }
  };

  const getSeverityBorderColor = (severity) => {
    switch (severity) {
      case 'critical': return 'var(--critical)';
      case 'high': return 'var(--critical)';
      case 'elevated': return 'var(--warning)';
      default: return 'var(--border)';
    }
  };

  const filteredEvents = events.filter(evt => {
    if (filterType === 'all') return true;
    if (filterType === 'incidents') return evt.type === 'incident_report';
    if (filterType === 'crowd') return ['zone_density', 'gate_throughput', 'queue_length'].includes(evt.type);
    if (filterType === 'transit') return evt.type === 'transit_occupancy';
    return true;
  });

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.05em', color: 'var(--text-primary)', margin: 0 }}>
          LIVE EVENT STREAM
        </h2>
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontSize: '11px',
            padding: '2px 4px',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="all">All Events</option>
          <option value="incidents">Incidents</option>
          <option value="crowd">Crowd Flow</option>
          <option value="transit">Transit</option>
        </select>
      </div>

      {/* Dynamic Seating Heatmap Overlay */}
      <div style={{ position: 'relative', height: '120px', background: 'var(--bg-elevated)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {/* Simple grid texture representing heatmap */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 35% 45%, rgba(248, 113, 113, 0.25) 0%, transparent 45%), radial-gradient(circle at 75% 65%, rgba(251, 191, 36, 0.15) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          CROWD DENSITY HEATMAP
        </div>
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '6px', fontSize: '8px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: '6px', height: '6px', background: 'var(--critical)', borderRadius: '50%' }} /> High</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: '6px', height: '6px', background: 'var(--warning)', borderRadius: '50%' }} /> Med</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><span style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%' }} /> Low</span>
        </div>
      </div>

      {/* Scrolling Events Feed List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '2px' }}>
        {filteredEvents.length === 0 ? (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center', padding: '40px' }}>
            No matching events logged.<br />Start match simulation.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const time = evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
            return (
              <div 
                key={evt.id}
                className="panel-elevated"
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '8px', 
                  padding: '6px 8px',
                  borderLeft: `2.5px solid ${getSeverityBorderColor(evt.severity)}`,
                  fontSize: '11px',
                  animation: 'slide-in 0.15s ease both'
                }}
              >
                <span style={{ fontSize: '14px', marginTop: '1px' }} role="img" aria-label={evt.type}>
                  {getEventIcon(evt.type)}
                </span>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2px' }}>
                      {evt.type.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{time}</span>
                  </div>
                  
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.3', wordBreak: 'break-word' }}>
                    {evt.data?.message || evt.data?.description || `Telemetry alert for sector. Value: ${evt.data?.occupancyPercent || evt.data?.queueLength || 'nominal'}`}
                  </p>
                  
                  {evt.zone && (
                    <div style={{ marginTop: '3px', display: 'flex', gap: '3px' }}>
                      <Badge variant="zone" label={evt.zone} />
                      {evt.gate && (
                        <span style={{ fontSize: '8px', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '0 4px', borderRadius: '2px' }}>
                          GATE {evt.gate}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
}
