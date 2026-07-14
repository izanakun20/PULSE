/**
 * PULSE — Synthetic Matchday Event Types & Stadium Configuration
 * 
 * Defines all event types, match phases, zones, gates, and severity levels
 * used by the simulator engine and consumed by specialist agents.
 */

// ─── Match Phases ────────────────────────────────────────────────
export const MATCH_PHASES = {
  PRE_MATCH: { id: 'PRE_MATCH', label: 'Pre-Match', icon: '🏟️' },
  KICKOFF: { id: 'KICKOFF', label: 'Kick Off', icon: '⚽' },
  FIRST_HALF: { id: 'FIRST_HALF', label: '1st Half', icon: '⚽' },
  HALFTIME: { id: 'HALFTIME', label: 'Half Time', icon: '⏸️' },
  SECOND_HALF_START: { id: 'SECOND_HALF_START', label: '2nd Half', icon: '⚽' },
  SECOND_HALF: { id: 'SECOND_HALF', label: '2nd Half', icon: '⚽' },
  GOAL_SURGE: { id: 'GOAL_SURGE', label: 'GOAL!', icon: '🎉' },
  FULL_TIME: { id: 'FULL_TIME', label: 'Full Time', icon: '🏁' },
  EGRESS: { id: 'EGRESS', label: 'Egress', icon: '🚶' },
};

// ─── Event Types ─────────────────────────────────────────────────
export const EVENT_TYPES = {
  GATE_THROUGHPUT: 'gate_throughput',
  ZONE_DENSITY: 'zone_density',
  QUEUE_LENGTH: 'queue_length',
  TRANSIT_OCCUPANCY: 'transit_occupancy',
  WEATHER_UPDATE: 'weather_update',
  INCIDENT_REPORT: 'incident_report',
  MATCH_EVENT: 'match_event',
  VOLUNTEER_STATUS: 'volunteer_status',
};

// ─── Severity Levels ─────────────────────────────────────────────
export const SEVERITY = {
  NOMINAL: 'nominal',
  ELEVATED: 'elevated',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// ─── Stadium Configuration ───────────────────────────────────────
export const STADIUM = {
  name: 'MetLife Arena',
  capacity: 82500,
  zones: [
    { id: 'north', label: 'North Stand', color: '#22c55e' },
    { id: 'south', label: 'South Stand', color: '#3b82f6' },
    { id: 'east', label: 'East Stand', color: '#f59e0b' },
    { id: 'west', label: 'West Stand', color: '#ef4444' },
    { id: 'concourse_n', label: 'North Concourse', color: '#06b6d4' },
    { id: 'concourse_s', label: 'South Concourse', color: '#8b5cf6' },
  ],
  gates: [
    { id: 'G1', zone: 'north', label: 'Gate 1', capacity: 800 },
    { id: 'G2', zone: 'north', label: 'Gate 2', capacity: 800 },
    { id: 'G3', zone: 'east', label: 'Gate 3', capacity: 1000 },
    { id: 'G4', zone: 'east', label: 'Gate 4', capacity: 1000 },
    { id: 'G5', zone: 'south', label: 'Gate 5', capacity: 800 },
    { id: 'G6', zone: 'south', label: 'Gate 6', capacity: 800 },
    { id: 'G7', zone: 'west', label: 'Gate 7', capacity: 1200 },
    { id: 'G8', zone: 'west', label: 'Gate 8', capacity: 1200 },
  ],
  transitStops: [
    { id: 'metro_north', label: 'Metro North Station', capacity: 3000 },
    { id: 'metro_south', label: 'Metro South Station', capacity: 3000 },
    { id: 'bus_east', label: 'East Bus Terminal', capacity: 1500 },
    { id: 'shuttle_west', label: 'West Shuttle Loop', capacity: 2000 },
  ],
};

// ─── Volunteer Pool ──────────────────────────────────────────────
export const VOLUNTEERS = [
  { id: 'V01', name: 'Marcus Chen', zone: 'north', role: 'gate_steward', status: 'available' },
  { id: 'V02', name: 'Amal Osei', zone: 'north', role: 'wayfinding', status: 'available' },
  { id: 'V03', name: 'Sofia Reyes', zone: 'east', role: 'gate_steward', status: 'available' },
  { id: 'V04', name: 'Yuki Tanaka', zone: 'east', role: 'medical', status: 'available' },
  { id: 'V05', name: 'James O\'Brien', zone: 'south', role: 'gate_steward', status: 'available' },
  { id: 'V06', name: 'Fatima Al-Hassan', zone: 'south', role: 'accessibility', status: 'available' },
  { id: 'V07', name: 'Luca Bianchi', zone: 'west', role: 'gate_steward', status: 'available' },
  { id: 'V08', name: 'Nina Petrov', zone: 'west', role: 'wayfinding', status: 'available' },
  { id: 'V09', name: 'David Kim', zone: 'concourse_n', role: 'crowd_management', status: 'available' },
  { id: 'V10', name: 'Maria Santos', zone: 'concourse_s', role: 'crowd_management', status: 'available' },
  { id: 'V11', name: 'Ahmed Diallo', zone: 'north', role: 'medical', status: 'available' },
  { id: 'V12', name: 'Emma Johansson', zone: 'west', role: 'wayfinding', status: 'available' },
];

// ─── Helper: generate event ID ───────────────────────────────────
let eventCounter = 0;
export function generateEventId() {
  eventCounter++;
  return `evt_${String(eventCounter).padStart(4, '0')}`;
}

export function resetEventCounter() {
  eventCounter = 0;
}
