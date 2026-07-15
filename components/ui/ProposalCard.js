/**
 * StadiumOPS — UI Component: ProposalCard
 * Displays StadiumIQ AI recommendations with structured reasoning.
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
    <div className="proposal-card">
      <div className={`proposal-card-accent urgency-${urgency}`} />
      
      <div className="proposal-card-body">
        {/* Header: Agent info and confidence metric */}
        <div className="proposal-card-header">
          <div className="proposal-card-agent">
            <span className="proposal-card-agent-icon">{getAgentIcon(agent)}</span>
            <Badge variant="agent" label={agent} />
          </div>

          <div className="proposal-card-confidence">
            <span className="proposal-card-confidence-value" style={{ color: 'var(--ai-blue)' }}>
              {confidencePercentage}% Conf.
            </span>
            <div className="proposal-card-confidence-bar">
              <div 
                className="proposal-card-confidence-fill" 
                style={{ 
                  width: `${confidencePercentage}%`, 
                  background: 'var(--ai-gradient)' 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Title / Description */}
        <h3 className="proposal-card-title">{description}</h3>

        {/* Dynamic Affected Badges */}
        <div className="proposal-card-zones">
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

        {/* Structured AI Reasoning Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          {/* Situation */}
          <div className="reasoning-section">
            <div className="reasoning-label">Situation</div>
            <p className="reasoning-text" style={{ color: 'var(--text-primary)' }}>
              {description}
            </p>
          </div>

          {/* Reasoning */}
          <div className="reasoning-section">
            <div className="reasoning-label">Reasoning</div>
            <p className="reasoning-text">
              {expanded ? reasoning : `${reasoning.slice(0, 100)}${reasoning.length > 100 ? '...' : ''}`}
            </p>
            {reasoning.length > 100 && (
              <button 
                onClick={() => setExpanded(!expanded)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--ai-blue)', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  marginTop: '4px',
                  padding: 0
                }}
              >
                {expanded ? 'Show Less ▲' : 'Read Full Analysis ▼'}
              </button>
            )}
          </div>

          {/* Expanded sections */}
          {expanded && (
            <>
              {/* Predicted Impact */}
              <div className="reasoning-section animate-in">
                <div className="reasoning-label">Predicted Impact</div>
                <p className="reasoning-text" style={{ color: 'var(--success)' }}>
                  {getPredictedImpact(urgency)}
                </p>
              </div>

              {/* Alternative Options */}
              <div className="reasoning-section animate-in">
                <div className="reasoning-label">Alternative Option</div>
                <p className="reasoning-text">
                  {getAlternativeOption(action_type)}
                </p>
              </div>

              {/* Coordinator Rationale */}
              {orchestrator_reasoning && (
                <div className="reasoning-section animate-in" style={{ background: 'var(--bg-elevated)', padding: '8px', borderRadius: '4px' }}>
                  <div className="reasoning-label">Orchestration Decision</div>
                  <p className="reasoning-text" style={{ fontStyle: 'italic' }}>
                    {orchestrator_reasoning}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="proposal-card-actions">
          <button 
            className="btn btn-approve"
            style={{ flex: 1 }}
            onClick={() => onApprove(action_id)}
          >
            Approve Recommendation
          </button>
          <button 
            className="btn btn-reject"
            onClick={() => onReject(action_id)}
          >
            Override
          </button>
        </div>
      </div>
    </div>
  );
}
