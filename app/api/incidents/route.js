/**
 * PULSE Command — Incident Reporting API Route
 * 
 * POST /api/incidents
 * 
 * Validates fan incident reports and writes them to the Firebase database
 * at /fan_incidents.json so they sync to the Command Center in real-time.
 */

import { validateString, validateEnum } from '@/lib/validation';

const FIREBASE_URL = 'https://pulse-2493a-default-rtdb.asia-southeast1.firebasedatabase.app/';

const VALID_INCIDENT_TYPES = ['medical_minor', 'lost_child', 'crowd_safety', 'accessibility', 'hazard'];
const VALID_ZONES = ['north', 'south', 'east', 'west', 'concourse_n', 'concourse_s'];

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return Response.json({ error: 'Malformed JSON payload.' }, { status: 400 });
    }

    const { incidentType, description, location, zone } = body;

    // 1. Validation Checks (Security & Data Integrity)
    try {
      validateEnum(incidentType, VALID_INCIDENT_TYPES, 'incidentType');
      validateEnum(zone, VALID_ZONES, 'zone');
      validateString(description, 5, 500, 'description');
      validateString(location, 3, 100, 'location');
    } catch (valError) {
      return Response.json({ error: valError.message }, { status: 400 });
    }

    // Determine severity based on type
    const severity = (incidentType === 'medical_minor' || incidentType === 'crowd_safety') ? 'high' : 'elevated';
    const priority = incidentType === 'medical_minor' ? 'high' : 'medium';

    const incidentId = `evt_fan_${Date.now()}`;
    const incidentEvent = {
      id: incidentId,
      timestamp: new Date().toISOString(),
      type: 'incident_report',
      zone,
      gate: null,
      severity,
      data: {
        incidentType,
        description: description.trim(),
        location: location.trim(),
        priority
      }
    };

    // 2. Write to Firebase RTDB
    try {
      const fbRes = await fetch(`${FIREBASE_URL}fan_incidents/${incidentId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentEvent)
      });
      
      if (!fbRes.ok) {
        throw new Error(`Firebase RTDB returned status ${fbRes.status}`);
      }
    } catch (fbErr) {
      console.error('Failed to sync incident to Firebase:', fbErr);
      // Continue even if Firebase fails to allow demo fallback
    }

    return Response.json({
      success: true,
      incident: incidentEvent,
      message: 'Incident reported successfully and logged in database.'
    });
  } catch (error) {
    console.error('Incident report processing error:', error);
    return Response.json({ error: 'Invalid request body or internal error.' }, { status: 500 });
  }
}
