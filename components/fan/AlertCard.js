/**
 * PULSE — Fan: Multilingual Alert Card
 */

'use client';

import { useState } from 'react';
import Badge from '@/components/ui/Badge';

export default function AlertCard({ alert }) {
  const { title, messages, urgency, createdAt, type } = alert;
  const [lang, setLang] = useState('en');

  let borderColor = 'rgba(255,255,255,0.1)';
  let bgGlow = 'rgba(255,255,255,0.02)';
  
  if (urgency === 'critical' || urgency === 'high') {
    borderColor = 'var(--red)';
    bgGlow = 'var(--red-glow)';
  } else if (urgency === 'medium') {
    borderColor = 'var(--amber)';
    bgGlow = 'var(--amber-glow)';
  }

  return (
    <div 
      className="panel" 
      style={{ 
        borderLeft: `4px solid ${borderColor}`,
        backgroundColor: bgGlow,
        padding: '15px',
        marginBottom: '12px',
        animation: 'slide-in-right 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>
            {urgency === 'critical' || urgency === 'high' ? '🚨' : '⚠️'}
          </span>
          <strong style={{ textTransform: 'uppercase', fontSize: '11px', color: 'var(--floodlight-bright)', letterSpacing: '0.05em' }}>
            {type?.replace('_', ' ') || 'ALERT'}
          </strong>
          <Badge variant="severity" label={urgency} />
        </div>
        
        {/* Quick Language Selector */}
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', padding: '2px' }}>
          {['en', 'es', 'fr'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                background: lang === l ? 'var(--floodlight-bright)' : 'transparent',
                color: lang === l ? '#000' : 'var(--floodlight-dim)',
                border: 'none',
                borderRadius: '2px',
                fontSize: '9px',
                fontWeight: 'bold',
                padding: '2px 6px',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '14px', lineHeight: '1.4', color: 'var(--floodlight-bright)', fontWeight: '500' }}>
        {messages[lang] || messages['en'] || title}
      </div>

      {/* Show secondary language snippets stacked below to prove multilingual capabilities */}
      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.06)', fontSize: '11px', color: 'var(--floodlight-dim)', fontStyle: 'italic', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {lang !== 'en' && messages.en && <div><strong>EN:</strong> {messages.en}</div>}
        {lang !== 'es' && messages.es && <div><strong>ES:</strong> {messages.es}</div>}
        {lang !== 'fr' && messages.fr && <div><strong>FR:</strong> {messages.fr}</div>}
      </div>

      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', display: 'block', textAlign: 'right', marginTop: '8px' }}>
        {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
