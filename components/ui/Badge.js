/**
 * PULSE — UI Component: Status & Zone Badges
 */

'use client';

import { ZONES } from '@/lib/constants';

export default function Badge({ variant = 'status', label = '', severity = null, zone = null, agent = null }) {
  let badgeClass = 'badge';
  let customStyle = {};

  if (variant === 'severity' || severity) {
    const sev = (severity || label).toLowerCase();
    badgeClass += ` badge-severity-${sev}`;
  } else if (variant === 'zone' || zone) {
    const zKey = zone || label;
    badgeClass += ` badge-zone`;
    const zInfo = ZONES[zKey];
    if (zInfo) {
      customStyle = {
        borderColor: zInfo.color,
        color: zInfo.color,
        backgroundColor: zInfo.bg,
      };
    }
  } else if (variant === 'agent' || agent) {
    const aKey = (agent || label).toLowerCase().replace(/\s+/g, '-');
    badgeClass += ` badge-agent-${aKey}`;
  } else {
    // General statuses
    const status = label.toLowerCase();
    if (status === 'live' || status === 'active' || status === 'approved') {
      badgeClass += ' badge-status-live';
    } else if (status === 'resolved' || status === 'completed') {
      badgeClass += ' badge-status-resolved';
    } else {
      badgeClass += ' badge-status-pending';
    }
  }

  return (
    <span className={badgeClass} style={customStyle}>
      {label}
    </span>
  );
}
