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

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType: type,
          description: description.trim(),
          location: location.trim(),
          zone: 'west' // Default to West Sector for the hackathon demo scenario (Gate 7/8)
        })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Add incident event to the local store for local feedback
        dispatch({ type: 'ADD_EVENTS', payload: [result.incident] });
        dispatch({ type: 'UPDATE_STADIUM_STATE', payload: [result.incident] });

        setSuccess(true);
        setDescription('');
        setLocation('');
      } else {
        alert(`Error: ${result.error || 'Failed to submit report'}`);
      }
    } catch (err) {
      console.error('Failed to submit incident:', err);
      alert('Network error. Unable to transmit report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '30px 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '15px' }}>✅</div>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--floodlight-bright)', margin: '0 0 5px 0' }}>REPORT RECEIVED</h3>
        <p style={{ fontSize: '13px', color: 'var(--floodlight-dim)', margin: '0 0 20px 0' }}>
          Awaiting review by the Command Center operations supervisor. Standby for status updates.
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
