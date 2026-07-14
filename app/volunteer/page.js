/**
 * PULSE — Volunteer Active Task Dispatch Dashboard
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
      {/* Radio status banner */}
      <div style={{ background: '#000', color: '#fff', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '12px' }}>
        <span>RADIO CHANNEL: CONCOURSE-WEST</span>
        <span style={{ animation: 'blink-urgent 1s infinite alternate', color: 'var(--green-accent)' }}>● STANDBY</span>
      </div>

      {volunteerTasks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px', 
          border: '2px dashed #000', 
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#555'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '15px', opacity: 0.6 }}>
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <path d="M12 18H12.01" />
            <path d="M7 14h10" />
            <path d="M12 2v2" />
          </svg>
          <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 5px 0', textTransform: 'uppercase' }}>NO ACTIVE DISPATCHES</h2>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Standing by for supervisor instructions. Keep screen active.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Active Tasks Section */}
          {activeTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', margin: '0 0 8px 0', color: '#15803d', borderBottom: '2px solid #15803d', paddingBottom: '2px' }}>
                IN PROGRESS ({activeTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}

          {/* Pending Dispatches */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', margin: '10px 0 8px 0', color: '#dc2626', borderBottom: '2px solid #dc2626', paddingBottom: '2px' }}>
                PENDING ACCEPTANCE ({pendingTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}

          {/* Completed History */}
          {completedTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', margin: '15px 0 8px 0', color: '#555', borderBottom: '2px solid #555', paddingBottom: '2px' }}>
                COMPLETED TODAY ({completedTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: 0.8 }}>
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
