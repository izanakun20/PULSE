/**
 * PULSE — Fan Portal Page
 */

'use client';

import { useState } from 'react';
import { usePulse } from '@/lib/store';
import AlertCard from '@/components/fan/AlertCard';
import GateInfo from '@/components/fan/GateInfo';
import IncidentReport from '@/components/fan/IncidentReport';
import { MATCH_INFO } from '@/lib/constants';

export default function FanPage() {
  const { state } = usePulse();
  const { fanAlerts, simulationState } = state;
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* Dynamic Match Banner */}
      <div 
        className="panel"
        style={{ 
          background: 'linear-gradient(135deg, var(--pitch-light) 0%, var(--pitch-dark) 100%)',
          padding: '20px', 
          border: '1.5px solid var(--border-light)',
          borderRadius: '12px',
          textAlign: 'center'
        }}
      >
        <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          FIFA WORLD CUP 2026 • METLIFE ARENA
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', margin: '5px 0', letterSpacing: '0.02em', color: 'var(--floodlight-bright)' }}>
          {MATCH_INFO.teams.home.toUpperCase()} vs {MATCH_INFO.teams.away.toUpperCase()}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '8px' }}>
          <span className="badge badge-status-live" style={{ fontSize: '11px' }}>
            {simulationState.phaseLabel.toUpperCase()}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 'bold', color: 'var(--floodlight)' }}>
            CLOCK: {Math.floor(simulationState.elapsedSeconds / 60)}'
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        {[
          { id: 'home', label: 'Matchday', icon: '🏟️' },
          { id: 'alerts', label: 'Alerts', icon: '📢', badge: fanAlerts.length },
          { id: 'gates', label: 'Gates', icon: '🎫' },
          { id: 'report', label: 'Report', icon: '⚠️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px',
              background: activeTab === tab.id ? 'var(--pitch-light)' : 'transparent',
              border: activeTab === tab.id ? '1px solid var(--border-light)' : 'none',
              borderRadius: '6px',
              color: activeTab === tab.id ? 'var(--floodlight-bright)' : 'var(--floodlight-dim)',
              fontSize: '11px',
              fontWeight: activeTab === tab.id ? 'bold' : '500',
              cursor: 'pointer',
              outline: 'none',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '18px', marginBottom: '2px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '12px',
                backgroundColor: 'var(--red)',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '300px' }}>
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="panel" style={{ padding: '18px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--floodlight-bright)', margin: '0 0 10px 0' }}>
                YOUR ENTRY INFORMATION
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ 
                  fontFamily: 'var(--font-display)', 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  border: '3px solid var(--amber)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '26px',
                  color: 'var(--floodlight-bright)',
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
                }}>
                  3
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', color: 'var(--floodlight-bright)' }}>ASSIGNED GATE: GATE 3</h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: 'var(--floodlight-dim)' }}>
                    Closest entry for East Stand seats. Standby wait time is currently nominal.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel" style={{ padding: '18px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--floodlight-bright)', margin: '0 0 10px 0' }}>
                STADIUM MAP & WAYFINDING
              </h2>
              {/* Custom SVG wayfinding diagram */}
              <div style={{ width: '100%', height: '180px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                <svg width="220" height="150" viewBox="0 0 220 150">
                  {/* Stadium bowl */}
                  <ellipse cx="110" cy="75" rx="90" ry="60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                  <ellipse cx="110" cy="75" rx="60" ry="35" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="4" />
                  <rect x="85" y="58" width="50" height="34" fill="var(--pitch)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  {/* Gates */}
                  <circle cx="110" cy="15" r="5" fill="var(--green-accent)" /><text x="110" y="8" fill="var(--floodlight-dim)" fontSize="8" textAnchor="middle">G1/G2</text>
                  <circle cx="200" cy="75" r="5" fill="var(--green-accent)" /><text x="215" y="78" fill="var(--floodlight-dim)" fontSize="8" textAnchor="start">G3/G4</text>
                  <circle cx="110" cy="135" r="5" fill="var(--green-accent)" /><text x="110" y="148" fill="var(--floodlight-dim)" fontSize="8" textAnchor="middle">G5/G6</text>
                  <circle cx="20" cy="75" r="5" fill="var(--green-accent)" /><text x="5" y="78" fill="var(--floodlight-dim)" fontSize="8" textAnchor="end">G7/G8</text>
                  
                  {/* Active highlight route */}
                  <path d="M 200 75 Q 160 75 140 75" fill="none" stroke="var(--amber)" strokeWidth="3" strokeDasharray="5 3" />
                  <circle cx="140" cy="75" r="4" fill="var(--amber)" />
                </svg>
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '10px', color: 'var(--floodlight-dim)', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
                  MAP TELEMETRY ACTIVE
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {fanAlerts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                border: '1.5px dashed var(--border)', 
                borderRadius: '8px',
                color: 'var(--floodlight-dim)'
              }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>🔔</span>
                <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 4px 0', color: 'var(--floodlight-bright)' }}>NO OPERATIONS BROADCASTS</h3>
                <p style={{ margin: 0, fontSize: '12px' }}>Operational alerts will display here. Enjoy the tournament.</p>
              </div>
            ) : (
              fanAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            )}
          </div>
        )}

        {activeTab === 'gates' && (
          <GateInfo />
        )}

        {activeTab === 'report' && (
          <IncidentReport />
        )}
      </div>
    </div>
  );
}
