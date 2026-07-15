/**
 * StadiumOPS — UI Component: AI Workflow Tracker
 * Displays the real-time AI processing pipeline stages
 */

'use client';

import { usePulse } from '@/lib/store';

const STEPS = [
  { id: 'detect', label: 'Detect', icon: '📡' },
  { id: 'analyze', label: 'Analyze', icon: '🧠' },
  { id: 'recommend', label: 'Recommend', icon: '💡' },
  { id: 'approve', label: 'Approve', icon: '✅' },
  { id: 'dispatch', label: 'Dispatch', icon: '📋' },
  { id: 'alert', label: 'Alert', icon: '📢' },
  { id: 'report', label: 'Report', icon: '📄' },
];

export default function WorkflowTracker() {
  const { state } = usePulse();
  const { simulationState, orchestratorActions, approvedActions, volunteerTasks, fanAlerts } = state;
  const { isRunning } = simulationState;

  // Determine active and completed steps
  let activeIndex = -1;
  let completedIndex = -1;

  if (isRunning) {
    if (fanAlerts.length > 0) {
      completedIndex = 5; // Detect, Analyze, Recommend, Approve, Dispatch, Alert
      activeIndex = 6;    // Report
    } else if (volunteerTasks.length > 0) {
      completedIndex = 4; // Detect, Analyze, Recommend, Approve, Dispatch
      activeIndex = 5;    // Alert
    } else if (approvedActions.length > 0) {
      completedIndex = 3; // Detect, Analyze, Recommend, Approve
      activeIndex = 4;    // Dispatch
    } else if (orchestratorActions.length > 0) {
      completedIndex = 2; // Detect, Analyze, Recommend
      activeIndex = 3;    // Approve
    } else {
      completedIndex = -1;
      activeIndex = 1;    // Detect & Analyze active
    }
  }

  return (
    <div className="workflow-tracker">
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px', marginRight: '15px' }}>
        StadiumIQ Pipeline:
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
        {STEPS.map((step, index) => {
          let stepClass = 'wf-step';
          
          if (isRunning) {
            // Special handling for Detect & Analyze active together
            if (index <= completedIndex) {
              stepClass += ' completed';
            } else if (index === activeIndex || (activeIndex === 1 && index === 0)) {
              stepClass += ' active';
            }
          }

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={stepClass}>
                <span className="wf-step-icon">{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <span className="wf-arrow">→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
