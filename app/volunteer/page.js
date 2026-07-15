/**
 * StadiumOPS — Volunteer Active Task Dispatch Dashboard
 */

'use client';

import { usePulse } from '@/lib/store';
import TaskCard from '@/components/volunteer/TaskCard';

export default function VolunteerPage() {
  const { state, dispatch } = usePulse();
  const { volunteerTasks } = state;

  const handleUpdateStatus = (taskId, status) => {
    dispatch({
      type: 'UPDATE_TASK_STATUS',
      payload: { taskId, status }
    });
  };

  // Group tasks
  const activeTasks = volunteerTasks.filter(t => t.status === 'active');
  const pendingTasks = volunteerTasks.filter(t => t.status === 'pending');
  const completedTasks = volunteerTasks.filter(t => t.status === 'completed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* Radio channel status banner */}
      <div style={{ background: 'var(--volunteer-text)', color: 'var(--volunteer-bg)', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '11px', borderRadius: '4px' }}>
        <span>RADIO CHANNEL: WEST-STEWARDS</span>
        <span style={{ animation: 'blink-urgent 1s infinite alternate', color: '#22c55e' }}>● STANDBY</span>
      </div>

      {/* AI Task Assignments Status Card */}
      <div className="panel" style={{ padding: '12px 15px', borderStyle: 'solid', borderColor: '#1c1917', background: '#f5f5f4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '16px' }}>🤖</span>
          <strong style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>StadiumIQ Assignments</strong>
        </div>
        <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.4', color: '#444' }}>
          Tasks are dispatched automatically based on real-time sensor analysis and coordinator approvals. Keep screen active for new routing instructions.
        </p>
      </div>

      {volunteerTasks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          border: '2px dashed var(--volunteer-text)', 
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#555'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '12px', opacity: 0.6 }}>
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <path d="M12 18H12.01" />
            <path d="M7 14h10" />
            <path d="M12 2v2" />
          </svg>
          <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 4px 0', textTransform: 'uppercase', fontSize: '16px' }}>NO DISPATCHED TASKS</h2>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: '500' }}>Standing by for AI-generated assignments. Maintain current position.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Active Tasks Section */}
          {activeTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', margin: '0 0 8px 0', color: '#16a34a', borderBottom: '2px solid #16a34a', paddingBottom: '2px', letterSpacing: '0.5px' }}>
                ACTIVE AI ASSIGNMENTS ({activeTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}

          {/* Pending Dispatches */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', margin: '10px 0 8px 0', color: '#dc2626', borderBottom: '2px solid #dc2626', paddingBottom: '2px', letterSpacing: '0.5px' }}>
                PENDING ACCEPTANCE ({pendingTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}

          {/* Completed History */}
          {completedTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', margin: '15px 0 8px 0', color: '#666', borderBottom: '2px solid #666', paddingBottom: '2px', letterSpacing: '0.5px' }}>
                COMPLETED TODAY ({completedTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.85 }}>
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
