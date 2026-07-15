/**
 * StadiumOPS — UI Component: Pulse Indicator Dot
 */

'use client';

export default function PulseIndicator({ status = 'active', size = 'md' }) {
  const statusClass = {
    active: 'status-active',
    idle: '',
    alert: 'status-alert',
    warning: 'status-warning',
  }[status] || '';

  const sizeStyle = size === 'sm' ? { width: '6px', height: '6px' } : {};

  return (
    <div className={`pulse-dot ${statusClass}`} style={sizeStyle} />
  );
}
