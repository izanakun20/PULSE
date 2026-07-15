/**
 * StadiumOPS — Fan Portal Page
 */

'use client';

import { useState } from 'react';
import { usePulse } from '@/lib/store';
import AlertCard from '@/components/fan/AlertCard';
import GateInfo from '@/components/fan/GateInfo';
import IncidentReport from '@/components/fan/IncidentReport';
import { TODAY_MATCHES } from '@/lib/constants';

export default function FanPage() {
  const { state, dispatch } = usePulse();
  const { fanAlerts, simulationState, approvedActions, currentHostCity, currentVenue, currentMatchId } = state;
  const [activeTab, setActiveTab] = useState('home');

  // Find active match details
  const activeMatch = TODAY_MATCHES.find(m => m.id === currentMatchId) || TODAY_MATCHES[0];

  // Find the latest approved actions to display as proactive AI tips
  const latestApproved = approvedActions[approvedActions.length - 1];

  const handleMatchChange = (e) => {
    const selectedId = e.target.value;
    const match = TODAY_MATCHES.find(m => m.id === selectedId);
    if (match) {
      dispatch({
        type: 'SET_TOURNAMENT_CONTEXT',
        payload: {
          hostCity: match.city,
          venue: match.venue,
          matchId: match.id
        }
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* Dynamic Match Banner */}
      <div 
        className="panel"
        style={{ 
          background: 'var(--bg-surface)',
          padding: '16px', 
          border: '1px solid var(--border)',
          borderRadius: '10px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--success)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            FIFA World Cup 2026 • Fan Assistant
          </span>
        </div>

        <select
          value={currentMatchId}
          onChange={handleMatchChange}
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '14px',
            padding: '4px 8px',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            marginBottom: '8px'
          }}
        >
          {TODAY_MATCHES.map(m => (
            <option key={m.id} value={m.id}>
              {m.home.toUpperCase()} vs {m.away.toUpperCase()} ({m.venue})
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-status-live" style={{ fontSize: '10px' }}>
            {simulationState.phaseLabel.toUpperCase()}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {Math.floor(simulationState.elapsedSeconds / 60)}&apos;
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        {[
          { id: 'home', label: 'Matchday', icon: '🏟️' },
          { id: 'alerts', label: 'AI Alerts', icon: '📢', badge: fanAlerts.length },
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
              padding: '8px 4px',
              background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
              border: activeTab === tab.id ? '1px solid var(--border-light)' : 'none',
              borderRadius: '6px',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: activeTab === tab.id ? 'bold' : '500',
              cursor: 'pointer',
              outline: 'none',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '12px',
                backgroundColor: 'var(--critical)',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
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
            
            {/* StadiumIQ Assistant Card */}
            <div className="panel-ai" style={{ borderLeftColor: 'var(--success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px' }}>🤖</span>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>StadiumIQ Assistant</strong>
                <span className="badge badge-ai" style={{ fontSize: '9px' }}>Active</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                {latestApproved ? (
                  `💡 Active Recommendation: ${latestApproved.proposal.description} — approved by operations leads. Alternate routing and wayfinding teams deployed to assist you.`
                ) : (
                  `I am monitoring gate wait times, local transport loads, and weather events at ${currentVenue}. I will broadcast alerts and smart routing guidelines here as matchday develops.`
                )}
              </p>
            </div>

            <div className="panel" style={{ padding: '15px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
                ENTRY INFORMATION
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--bg-elevated)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <div style={{ 
                  fontFamily: 'var(--font-display)', 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  border: '2px solid var(--success)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: 'var(--text-primary)'
                }}>
                  3
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)' }}>ASSIGNED ENTRY: GATE 3</h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Closest gate for East Stand seats. Crowd flow and queue rate are nominal.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel" style={{ padding: '15px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
                WAYFINDING MAP
              </h2>
              {/* Custom SVG wayfinding diagram */}
              <div style={{ width: '100%', height: '180px', background: 'var(--bg-elevated)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                <svg width="220" height="150" viewBox="0 0 220 150">
                  {/* Stadium bowl */}
                  <ellipse cx="110" cy="75" rx="90" ry="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <ellipse cx="110" cy="75" rx="60" ry="35" fill="none" stroke="rgba(52, 211, 153, 0.15)" strokeWidth="3" />
                  <rect x="85" y="58" width="50" height="34" fill="var(--bg-surface)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  {/* Gates */}
                  <circle cx="110" cy="15" r="4" fill="var(--success)" /><text x="110" y="8" fill="var(--text-muted)" fontSize="8" textAnchor="middle">G1/G2</text>
                  <circle cx="200" cy="75" r="4" fill="var(--success)" /><text x="212" y="78" fill="var(--text-muted)" fontSize="8" textAnchor="start">G3/G4</text>
                  <circle cx="110" cy="135" r="4" fill="var(--success)" /><text x="110" y="146" fill="var(--text-muted)" fontSize="8" textAnchor="middle">G5/G6</text>
                  <circle cx="20" cy="75" r="4" fill="var(--success)" /><text x="8" y="78" fill="var(--text-muted)" fontSize="8" textAnchor="end">G7/G8</text>
                  
                  {/* Active highlight route */}
                  <path d="M 200 75 Q 160 75 140 75" fill="none" stroke="var(--warning)" strokeWidth="2.5" strokeDasharray="4 2" />
                  <circle cx="140" cy="75" r="3.5" fill="var(--warning)" />
                </svg>
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '9px', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  StadiumIQ Wayfinding Active
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="panel-ai" style={{ borderLeftColor: 'var(--ai-blue)', padding: '10px 15px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                ℹ️ StadiumIQ AI Alerts Feed
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'var(--text-muted)' }}>
                Real-time translations are processed automatically.
              </p>
            </div>
            
            {fanAlerts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '50px 20px', 
                border: '1px dashed var(--border)', 
                borderRadius: '8px',
                color: 'var(--text-muted)'
              }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🔔</span>
                <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '13px' }}>NO ACTIVE BROADCASTS</h3>
                <p style={{ margin: 0, fontSize: '11px' }}>AI-generated route updates and weather alerts will appear here.</p>
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
