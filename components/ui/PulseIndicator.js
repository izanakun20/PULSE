/**
 * PULSE — UI Component: Pulse Indicator Dot
 */

'use client';

export default function PulseIndicator({ status = 'active', size = 'md', color = null }) {
  const sizeClass = {
    sm: 'pulse-dot-sm',
    md: '',
    lg: 'pulse-dot-lg',
  }[size] || '';

  const statusClass = {
    active: 'pulse-dot-active',
    idle: 'pulse-dot-idle',
    alert: 'pulse-dot-alert',
  }[status] || 'pulse-dot-active';

  const style = color ? { backgroundColor: color, '--pulse-color': color } : {};

  return (
    <div 
      className={`pulse-dot ${statusClass} ${sizeClass}`} 
      style={style}
    />
  );
}
