/**
 * StadiumOPS — Command Center: StadiumIQ Decision Pipeline
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
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '0.05em', color: 'var(--text-primary)', margin: 0 }}>
          STADIUMIQ DECISION PIPELINE
        </h2>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="badge badge-status-pending">{orchestratorActions.length} Pending</span>
          <span className="badge badge-status-resolved">{approvedActions.length} Approved</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {orchestratorActions.length === 0 ? (
          <div className="panel-ai" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1, 
            textAlign: 'center',
            color: 'var(--text-secondary)',
            padding: '30px',
            borderStyle: 'dashed'
          }}>
            <span style={{ fontSize: '32px', marginBottom: '12px' }}>🧠</span>
            <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 5px 0', color: 'var(--text-primary)', fontSize: '14px', letterSpacing: '0.5px' }}>
              STADIUMIQ STANDBY
            </h3>
            <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.4' }}>
              StadiumIQ is actively monitoring all stadium zones and telemetry. Start the matchday simulation to trigger real-time AI reasoning.
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
