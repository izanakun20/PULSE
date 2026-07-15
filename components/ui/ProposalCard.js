/**
 * StadiumOPS — UI Component: ProposalCard
 * Displays StadiumIQ AI recommendations with clear reasoning, impact, and action triggers.
 */

'use client';

import { useState } from 'react';
import Badge from './Badge';

export default function ProposalCard({ action, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const { proposal, orchestrator_reasoning, confidence } = action;
  const { action_id, agent, action_type, description, reasoning, urgency, affected_zones, affected_gates } = proposal;

  const confidencePercentage = Math.round(confidence * 100);

  // Derive custom icon based on agent type
  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case 'crowd-flow': return '👥';
      case 'dispatch': return '📋';
      case 'comms': return '📢';
      case 'transit': return '🚇';
      case 'safety': return '🛡️';
      default: return '🤖';
    }
  };

  // Define predicted impact based on urgency
  const getPredictedImpact = (level) => {
    switch (level) {
      case 'critical':
        return 'Prevents potential crowd safety incident and mitigates zone density hazards immediately.';
      case 'high':
        return 'Reduces overall operational risks and balances gate queues to minimize wait times below safe thresholds.';
      case 'medium':
        return 'Improves fan experience, wayfinding, and service flow rates across affected sectors.';
      default:
        return 'Monitors operational metrics and ensures normal tournament workflow parameters.';
    }
  };

  // Define alternative option based on action type
  const getAlternativeOption = (type) => {
    switch (type) {
      case 'gate_reallocation':
        return 'Open additional scanning lanes manually at the target gate instead of rerouting.';
      case 'volunteer_dispatch':
        return 'Broadcast details to nearby supervisors via local radio and request manual patrol deployment.';
      case 'fan_alert':
        return 'Deliver notice via physical signs and stadium announcer instead of push notification.';
      default:
        return 'Monitor conditions closely for 5 minutes and reassess before taking action.';
    }
  };

  return (
    <div className="proposal-card" style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-surface)' }}>
      {/* Dynamic urgency color accent bar */}
      <div className={`proposal-card-accent urgency-${urgency}`} />
      
      <div className="proposal-card-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Header: Agent metadata + Confidence metric */}
        <div className="proposal-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="proposal-card-agent" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="proposal-card-agent-icon" style={{ fontSize: '16px' }}>{getAgentIcon(agent)}</span>
            <Badge variant="agent" label={agent} />
            <span className="badge badge-zone" style={{ fontSize: '9px', background: 'var(--bg-elevated)' }}>
              {urgency.toUpperCase()}
            </span>
          </div>

          <div className="proposal-card-confidence" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="proposal-card-confidence-value" style={{ color: 'var(--ai-blue)', fontSize: '12px', fontWeight: 'bold' }}>
              {confidencePercentage}% Match
            </span>
            <div 
              className="proposal-card-confidence-bar" 
              role="progressbar"
              aria-valuenow={confidencePercentage}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="AI Recommendation Confidence"
              style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}
            >
              <div 
                className="proposal-card-confidence-fill" 
                style={{ 
                  width: `${confidencePercentage}%`, 
                  height: '100%',
                  background: 'var(--ai-gradient)' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Dynamic Affected Sectors */}
        <div className="proposal-card-zones" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '2px 0' }}>
          {affected_zones?.map(z => (
            <Badge key={z} variant="zone" label={z} />
          ))}
          {affected_gates?.map(g => (
            <span 
              key={g} 
              style={{ 
                fontSize: '9px', 
                fontWeight: 'bold', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                background: 'var(--bg-elevated)', 
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-display)'
              }}
            >
              GATE {g}
            </span>
          ))}
        </div>

        {/* Main Prominent Recommended Action */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
          <div className="reasoning-label" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>
            Recommended Action
          </div>
          <h3 className="proposal-card-title" style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.4', margin: 0 }}>
            {description}
          </h3>
        </div>

        {/* Structured AI Reasoning Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Situation */}
          <div className="reasoning-section">
            <div className="reasoning-label" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>
              Situation
            </div>
            <p className="reasoning-text" style={{ fontSize: '12.5px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
              {description}
            </p>
          </div>

          {/* Reasoning */}
          <div className="reasoning-section">
            <div className="reasoning-label" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>
              Reasoning
            </div>
            <p className="reasoning-text" style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              {expanded ? reasoning : `${reasoning.slice(0, 100)}${reasoning.length > 100 ? '...' : ''}`}
            </p>
            {reasoning.length > 100 && (
              <button 
                onClick={() => setExpanded(!expanded)} 
                aria-expanded={expanded}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--ai-blue)', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  marginTop: '4px',
                  padding: 0,
                  cursor: 'pointer'
                }}
              >
                {expanded ? 'Show Less ▲' : 'Read Full Analysis ▼'}
              </button>
            )}
          </div>

          {/* Expected Impact */}
          <div className="reasoning-section" style={{ background: 'var(--bg-elevated)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid var(--success)' }}>
            <div className="reasoning-label" style={{ fontSize: '9px', color: 'var(--success)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>
              Expected Impact
            </div>
            <p className="reasoning-text" style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              {getPredictedImpact(urgency)}
            </p>
          </div>

          {/* Collapsible parts */}
          {expanded && (
            <>
              {/* Alternative Options */}
              <div className="reasoning-section animate-in">
                <div className="reasoning-label" style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>
                  Alternative Option
                </div>
                <p className="reasoning-text" style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  {getAlternativeOption(action_type)}
                </p>
              </div>

              {/* Coordinator Rationale */}
              {orchestrator_reasoning && (
                <div className="reasoning-section animate-in" style={{ background: 'var(--bg-elevated)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <div className="reasoning-label" style={{ fontSize: '9px', color: 'var(--ai-blue)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>
                    Orchestrator Decision Rationale
                  </div>
                  <p className="reasoning-text" style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4', fontStyle: 'italic' }}>
                    {orchestrator_reasoning}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="proposal-card-actions" style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <button 
            className="btn btn-approve"
            style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px' }}
            onClick={() => onApprove(action_id)}
          >
            Approve Recommendation
          </button>
          <button 
            className="btn btn-reject"
            style={{ padding: '8px 16px', fontSize: '12.5px' }}
            onClick={() => onReject(action_id)}
          >
            Override
          </button>
        </div>
      </div>
    </div>
  );
}
