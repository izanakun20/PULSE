/**
 * PULSE — UI Component: ProposalCard with confidence score and approval buttons
 */

'use client';

import { useState } from 'react';
import Badge from './Badge';

export default function ProposalCard({ action, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const { proposal, orchestrator_reasoning, confidence } = action;
  const { action_id, agent, action_type, description, reasoning, urgency, affected_zones, affected_gates } = proposal;

  const confidencePercentage = Math.round(confidence * 100);

  // Confidence color
  let confidenceColor = '#22c55e'; // Green
  if (confidence < 0.6) confidenceColor = '#ef4444'; // Red
  else if (confidence < 0.85) confidenceColor = '#f59e0b'; // Amber

  // Urgency indicator styling
  let borderStyle = {};
  if (urgency === 'critical') borderStyle = { borderLeft: '4px solid #ef4444', boxShadow: '0 0 12px rgba(239, 68, 68, 0.15)' };
  else if (urgency === 'high') borderStyle = { borderLeft: '4px solid #ef4444' };
  else if (urgency === 'medium') borderStyle = { borderLeft: '4px solid #f59e0b' };
  else borderStyle = { borderLeft: '4px solid #3b82f6' };

  return (
    <div className="panel panel-interactive" style={borderStyle}>
      <div className="panel-header" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="agent" label={agent} />
          <Badge variant="severity" label={urgency} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '10px', color: 'var(--floodlight-dim)', fontFamily: 'var(--font-body)' }}>CONFIDENCE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'var(--font-display)', color: confidenceColor }}>
              {confidencePercentage}%
            </span>
            <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${confidencePercentage}%`, height: '100%', backgroundColor: confidenceColor }} />
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.03em', color: 'var(--floodlight-bright)', margin: '4px 0 8px 0' }}>
        {description}
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
        {affected_zones?.map(z => (
          <Badge key={z} variant="zone" label={z} />
        ))}
        {affected_gates?.map(g => (
          <Badge key={g} label={g} />
        ))}
      </div>

      <div style={{ margin: '8px 0', fontSize: '13px', color: 'var(--floodlight-dim)', lineHeight: '1.4' }}>
        <p style={{ margin: 0 }}>
          {expanded ? reasoning : `${reasoning.slice(0, 100)}${reasoning.length > 100 ? '...' : ''}`}
        </p>
        
        {expanded && (
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <strong style={{ color: 'var(--floodlight)', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>
              Orchestrator Resolution
            </strong>
            <p style={{ margin: 0, fontStyle: 'italic' }}>{orchestrator_reasoning}</p>
            {action.conflicts_resolved?.length > 0 && (
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--amber)' }}>
                ✓ Merged conflict with: {action.conflicts_resolved.join(', ')}
              </div>
            )}
          </div>
        )}

        {reasoning.length > 100 && (
          <button 
            onClick={() => setExpanded(!expanded)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--blue-accent)', 
              cursor: 'pointer', 
              padding: '4px 0 0 0', 
              fontSize: '11px',
              fontWeight: '500'
            }}
          >
            {expanded ? '▲ COLLAPSE' : '▼ READ FULL REASONING'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button 
          className="btn btn-approve" 
          style={{ flex: 2 }}
          onClick={() => onApprove(action_id)}
        >
          APPROVE ACTION
        </button>
        <button 
          className="btn btn-reject" 
          style={{ flex: 1 }}
          onClick={() => onReject(action_id)}
        >
          OVERRIDE
        </button>
      </div>
    </div>
  );
}
