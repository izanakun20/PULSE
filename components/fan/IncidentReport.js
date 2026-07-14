/**
 * PULSE — Fan: Report an Issue form
 */

'use client';

import { useState } from 'react';
import { usePulse } from '@/lib/store';

export default function IncidentReport() {
  const { dispatch } = usePulse();
  const [type, setType] = useState('medical_minor');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !location) return;

    setSubmitting(true);

    // Mock incident report event
    const incidentEvent = {
      id: `evt_fan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'incident_report',
      zone: 'west', // Default to west for testing
      gate: null,
      severity: type === 'medical_minor' || type === 'crowd_safety' ? 'high' : 'elevated',
      data: {
        incidentType: type,
        description,
        location,
        priority: type === 'medical_minor' ? 'high' : 'medium'
      }
    };

    // Simulate sending to backend.
    // We add it to the state directly so the agents process it!
    setTimeout(() => {
      // Add raw incident event to the store
      dispatch({ type: 'ADD_EVENTS', payload: [incidentEvent] });
      
      // Update local state
      dispatch({ type: 'UPDATE_STADIUM_STATE', payload: [incidentEvent] });

      setSubmitting(false);
      setSuccess(true);
      setDescription('');
      setLocation('');
    }, 800);
  };

  if (success) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '30px 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '15px' }}>✅</div>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--floodlight-bright)', margin: '0 0 5px 0' }}>REPORT SUBMITTED</h3>
        <p style={{ fontSize: '13px', color: 'var(--floodlight-dim)', margin: '0 0 20px 0' }}>
          Stadium stewards and medical responders in your zone have been dispatched. Keep this view active for updates.
        </p>
        <button 
          className="btn btn-outline" 
          onClick={() => setSuccess(false)}
          style={{ width: '100%' }}
        >
          SUBMIT NEW REPORT
        </button>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '15px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', letterSpacing: '0.05em', color: 'var(--floodlight-bright)', margin: 0 }}>
          REPORT OPERATIONAL INCIDENT
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--floodlight-dim)' }}>ISSUE TYPE</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{ 
              background: 'rgba(255,255,255,0.06)', 
              border: '1.5px solid var(--border)', 
              borderRadius: '4px',
              color: '#fff',
              padding: '10px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              outline: 'none'
            }}
          >
            <option value="medical_minor" style={{ background: '#1c1c1c' }}>Medical assistance needed</option>
            <option value="lost_child" style={{ background: '#1c1c1c' }}>Lost person/child</option>
            <option value="crowd_safety" style={{ background: '#1c1c1c' }}>Crowd compression / Safety concern</option>
            <option value="accessibility" style={{ background: '#1c1c1c' }}>Accessibility block / Wheelchair assistance</option>
            <option value="hazard" style={{ background: '#1c1c1c' }}>Facility damage / Liquid spill</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--floodlight-dim)' }}>LOCATION (SECTION/ROW/SEAT)</label>
          <input 
            type="text" 
            placeholder="e.g. Section 214, Row K, Seat 18" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ 
              background: 'rgba(255,255,255,0.06)', 
              border: '1.5px solid var(--border)', 
              borderRadius: '4px',
              color: '#fff',
              padding: '10px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--floodlight-dim)' }}>DESCRIPTION & DETAILS</label>
          <textarea 
            rows="3"
            placeholder="Please provide details (e.g., descriptions of clothing for lost persons, symptom descriptions for medical issues)" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ 
              background: 'rgba(255,255,255,0.06)', 
              border: '1.5px solid var(--border)', 
              borderRadius: '4px',
              color: '#fff',
              padding: '10px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={submitting}
          style={{ padding: '12px', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
        >
          {submitting ? 'SENDING TELEMETRY...' : 'TRANSMIT EMERGENCY ALERT'}
        </button>
      </form>
    </div>
  );
}
