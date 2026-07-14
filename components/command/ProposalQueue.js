/**
 * PULSE — Command: Orchestrator Proposal Queue
 */

'use client';

import { usePulse } from '@/lib/store';
import ProposalCard from '@/components/ui/ProposalCard';

export default function ProposalQueue() {
  const { state, dispatch } = usePulse();
  const { orchestratorActions, approvedActions } = state;

  const handleApprove = async (actionId) => {
    const action = orchestratorActions.find(a => a.proposal.action_id === actionId);
    if (!action) return;

    // 1. Move to approved in local state (which syncs list to firebase)
    dispatch({ type: 'APPROVE_ACTION', payload: actionId });

    // 2. Call backend to process downstream effects
    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionId,
          status: 'approved',
          action: action.proposal
        })
      });
      const result = await res.json();

      // 3. Dispatch the downstream effects (create volunteer tasks, push alerts, update gates)
      if (result.downstreamEffects) {
        result.downstreamEffects.forEach(effect => {
          if (effect.type === 'volunteer_task') {
            dispatch({ type: 'ADD_VOLUNTEER_TASK', payload: effect.data });
          } else if (effect.type === 'fan_alert') {
            dispatch({ type: 'ADD_FAN_ALERT', payload: effect.data });
          }
        });
      }
    } catch (err) {
      console.error('Failed to execute downstream effects for approved action:', err);
    }
  };

  const handleReject = (actionId) => {
    dispatch({ type: 'REJECT_ACTION', payload: actionId });
  };

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '15px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.05em', color: 'var(--floodlight-bright)', margin: 0 }}>
          ORCHESTRATOR DECISION PIPELINE
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-status-pending">{orchestratorActions.length} PENDING</span>
          <span className="badge badge-status-resolved">{approvedActions.length} APPROVED</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {orchestratorActions.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1, 
            textAlign: 'center',
            color: 'var(--floodlight-dim)',
            padding: '40px' 
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '15px', opacity: 0.3 }}>
              <circle cx="12" cy="12" r="10" stroke="var(--floodlight)" strokeWidth="1.5" />
              <path d="M12 8V12L14 14" stroke="var(--floodlight)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 5px 0', color: 'var(--floodlight)' }}>AWAITING ALERTS & EVENTS</h3>
            <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.4' }}>
              The coordinator pipeline is standing by. Start the matchday simulation to trigger specialist agent reasoning.
            </p>
          </div>
        ) : (
          orchestratorActions.map(action => (
            <ProposalCard 
              key={action.proposal.action_id}
              action={action}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
}
