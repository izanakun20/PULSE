/**
 * PULSE — UI Component: ProposalCard with confidence score, impact metrics, and premium World Cup styling
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
      case 'security': return '🛡️';
      case 'medical': return '➕';
      default: return '🤖';
    }
  };

  // Derive dynamic confidence bar colors
  let confidenceColor = 'var(--pitch-green)'; // Green
  if (confidence < 0.6) confidenceColor = 'var(--alert-red)'; // Red
  else if (confidence < 0.85) confidenceColor = 'var(--matchday-amber)'; // Amber

  // Derive dynamic impact level based on urgency
  let impactText = 'LOW IMPACT';
  let impactColor = 'var(--stadium-blue)';
  let borderStyle = { borderLeft: '4px solid var(--stadium-blue)' };
  
  if (urgency === 'critical') {
    impactText = 'CRITICAL IMPACT';
    impactColor = 'var(--alert-red)';
    borderStyle = { borderLeft: '4px solid var(--alert-red)', boxShadow: '0 0 15px rgba(230, 29, 37, 0.15)' };
  } else if (urgency === 'high') {
    impactText = 'HIGH IMPACT';
    impactColor = 'var(--alert-red)';
    borderStyle = { borderLeft: '4px solid var(--alert-red)' };
  } else if (urgency === 'medium') {
    impactText = 'MEDIUM IMPACT';
    impactColor = 'var(--matchday-amber)';
    borderStyle = { borderLeft: '4px solid var(--matchday-amber)' };
  }

  return (
    <div className="panel panel-interactive" style={{ ...borderStyle, padding: '12px' }}>
      {/* Card Header: Agent Badge, Impact, Confidence */}
      <div className="panel-header" style={{ marginBottom: '6px', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.2))' }}>
            {getAgentIcon(agent)}
          </span>
          <Badge variant="agent" label={agent} />
          <span style={{ 
            fontSize: '9px', 
            fontWeight: 'bold', 
            color: impactColor, 
            letterSpacing: '0.5px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: '2px 6px',
            borderRadius: '4px',
            border: `1px solid rgba(255,255,255,0.05)`
          }}>
            {impactText}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '8px', color: 'var(--floodlight-dim)', fontFamily: 'var(--font-body)', fontWeight: 'bold' }}>CONFIDENCE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: confidenceColor }}>
              {confidencePercentage}%
            </span>
            <div style={{ width: '40px', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${confidencePercentage}%`, height: '100%', backgroundColor: confidenceColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* Description Text */}
      <h3 style={{ 
        fontFamily: 'var(--font-display)', 
        fontSize: '1.1rem', 
        letterSpacing: '0.02em', 
        color: 'var(--floodlight-bright)', 
        margin: '2px 0 6px 0',
        lineHeight: '1.25'
      }}>
        {description}
      </h3>

      {/* Target Sectors / Gates badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '4px 0' }}>
        {affected_zones?.map(z => (
          <Badge key={z} variant="zone" label={z} />
        ))}
        {affected_gates?.map(g => (
          <span 
            key={g} 
            style={{ 
              fontSize: '8px', 
              fontWeight: 'bold', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              background: 'rgba(255,255,255,0.05)', 
              color: 'var(--floodlight-bright)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'var(--font-display)'
            }}
          >
            GATE {g}
          </span>
        ))}
      </div>

      {/* Collapsible Reasoning & Conflict resolution */}
      <div style={{ margin: '6px 0', fontSize: '12px', color: 'var(--floodlight-dim)', lineHeight: '1.35' }}>
        <p style={{ margin: 0 }}>
          {expanded ? reasoning : `${reasoning.slice(0, 80)}${reasoning.length > 80 ? '...' : ''}`}
        </p>
        
        {expanded && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <strong style={{ color: 'var(--floodlight-bright)', display: 'block', fontSize: '9px', textTransform: 'uppercase', marginBottom: '2px' }}>
              OPERATIONAL RATIONALE
            </strong>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '11px' }}>{orchestrator_reasoning}</p>
            
            {action.conflicts_resolved?.length > 0 && (
              <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--matchday-amber)', fontWeight: 'bold' }}>
                ✓ Resolved conflict with: {action.conflicts_resolved.join(', ')}
              </div>
            )}
          </div>
        )}

        {reasoning.length > 80 && (
          <button 
            onClick={() => setExpanded(!expanded)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--pitch-green)', 
              cursor: 'pointer', 
              padding: '2px 0 0 0', 
              fontSize: '10px',
              fontWeight: 'bold',
              fontFamily: 'var(--font-display)'
            }}
          >
            {expanded ? '▲ COLLAPSE' : '▼ DETAILS'}
          </button>
        )}
      </div>

      {/* Approve / Reject Controls */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
        <button 
          className="btn btn-approve" 
          style={{ flex: 2, padding: '6px 12px', fontSize: '0.75rem' }}
          onClick={() => onApprove(action_id)}
        >
          APPROVE RECOMMENDATION
        </button>
        <button 
          className="btn btn-reject" 
          style={{ flex: 1, padding: '6px 12px', fontSize: '0.75rem' }}
          onClick={() => onReject(action_id)}
        >
          OVERRIDE
        </button>
      </div>
    </div>
  );
}
