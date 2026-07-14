/**
 * PULSE — Volunteer: Task Card Component (Utilitarian & High Contrast)
 */

'use client';

export default function TaskCard({ task, onUpdateStatus }) {
  const { id, title, priority, assignedTo, status, createdAt, source, description, zone, gate } = task;

  const isPending = status === 'pending';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  // Priority color coding
  let priorityColor = '#000000';
  let priorityLabel = 'NORMAL';
  if (priority === 'critical' || priority === 'high') {
    priorityColor = '#dc2626'; // Vivid red
    priorityLabel = 'URGENT';
  } else if (priority === 'medium') {
    priorityColor = '#d97706'; // Amber
    priorityLabel = 'ELEVATED';
  }

  const timeString = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      className="volunteer-card" 
      style={{ 
        borderLeft: `6px solid ${priorityColor}`,
        borderColor: isCompleted ? '#888888' : priorityColor,
        opacity: isCompleted ? 0.7 : 1
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.05em', color: isCompleted ? '#888888' : priorityColor }}>
          {priorityLabel} • RECEIVED {timeString}
        </span>
        <span style={{ fontSize: '11px', background: '#000', color: '#fff', padding: '2px 6px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {source.replace('-', ' ')}
        </span>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', margin: '0 0 6px 0', textTransform: 'uppercase', lineHeight: '1.2' }}>
        {title}
      </h2>

      {description && (
        <p style={{ fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.4', fontWeight: '500' }}>
          {description}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <span style={{ fontSize: '11px', border: '1.5px solid #000', padding: '2px 6px', fontWeight: 'bold' }}>
          ZONE: {zone.toUpperCase()}
        </span>
        {gate && (
          <span style={{ fontSize: '11px', border: '1.5px solid #000', padding: '2px 6px', fontWeight: 'bold', backgroundColor: '#000', color: '#fff' }}>
            LOCATION: {gate}
          </span>
        )}
      </div>

      {isPending && (
        <button 
          className="volunteer-btn volunteer-btn-accept"
          onClick={() => onUpdateStatus(id, 'active')}
        >
          ACCEPT TASK
        </button>
      )}

      {isActive && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="volunteer-btn volunteer-btn-complete"
            onClick={() => onUpdateStatus(id, 'completed')}
            style={{ flex: 2 }}
          >
            ✓ MARK COMPLETED
          </button>
          <button 
            className="volunteer-btn"
            style={{ flex: 1, backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#b45309' }}
            onClick={() => alert('Command Center has been notified.')}
          >
            ASSIST
          </button>
        </div>
      )}

      {isCompleted && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          color: '#15803d', 
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '10px 0 0 0',
          borderTop: '1px dashed #ccc'
        }}>
          ✓ COMPLETED & REPORTED
        </div>
      )}
    </div>
  );
}
