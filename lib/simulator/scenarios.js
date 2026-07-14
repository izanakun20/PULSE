/**
 * PULSE — Scripted Matchday Scenario
 * 
 * A fully scripted timeline of events covering a compressed matchday:
 * Pre-match → Kickoff → First Half → Halftime → Second Half → Goal → Full Time → Egress
 * 
 * Total compressed duration: ~120 seconds for demo
 * Each entry: { timeOffset (ms), phase, events[] }
 */

import { EVENT_TYPES, SEVERITY, MATCH_PHASES } from './event-types.js';

/**
 * Generate a matchday scenario — an array of { timeOffset, phase, events[] }
 * timeOffset is in milliseconds from simulation start.
 * 
 * The scenario is deterministic but uses slight randomization for realism.
 */
export function generateMatchdayScenario() {
  const scenario = [];
  
  // Helper to add jitter
  const jitter = (base, range) => base + Math.floor(Math.random() * range) - range / 2;

  // ═══════════════════════════════════════════════════════════════
  // PRE-MATCH: T+0s to T+20s — Gates opening, fans arriving
  // ═══════════════════════════════════════════════════════════════
  
  // T+0s: Gates open
  scenario.push({
    timeOffset: 0,
    phase: MATCH_PHASES.PRE_MATCH.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'gates_open', description: 'Stadium gates are now open. Fans beginning to arrive.' },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.WEATHER_UPDATE,
        zone: 'all',
        gate: null,
        data: { temperature: 28, humidity: 65, condition: 'Partly Cloudy', wind: '12 km/h SW', uvIndex: 6 },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+3s: Initial gate activity
  scenario.push({
    timeOffset: 3000,
    phase: MATCH_PHASES.PRE_MATCH.id,
    events: [
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'north',
        gate: 'G1',
        data: { scansPerMinute: jitter(45, 10), queueLength: jitter(15, 5), waitTimeMinutes: 2 },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'east',
        gate: 'G3',
        data: { scansPerMinute: jitter(62, 10), queueLength: jitter(25, 8), waitTimeMinutes: 3 },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'north',
        gate: null,
        data: { stop: 'metro_north', occupancyPercent: 35, arrivalsPerMinute: 120 },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+6s: Building up — queues growing
  scenario.push({
    timeOffset: 6000,
    phase: MATCH_PHASES.PRE_MATCH.id,
    events: [
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'west',
        gate: 'G7',
        data: { scansPerMinute: jitter(95, 15), queueLength: jitter(80, 20), waitTimeMinutes: 8 },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'north',
        gate: 'G2',
        data: { scansPerMinute: jitter(70, 10), queueLength: jitter(40, 10), waitTimeMinutes: 4 },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'west',
        gate: null,
        data: { occupancyPercent: 42, fanCount: 8400, trend: 'rising' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+9s: Gate 7 congestion developing
  scenario.push({
    timeOffset: 9000,
    phase: MATCH_PHASES.PRE_MATCH.id,
    events: [
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'west',
        gate: 'G7',
        data: { scansPerMinute: jitter(110, 10), queueLength: jitter(140, 20), waitTimeMinutes: 14 },
        severity: SEVERITY.HIGH,
      },
      {
        type: EVENT_TYPES.QUEUE_LENGTH,
        zone: 'concourse_n',
        gate: null,
        data: { location: 'Food Court A', queueLength: jitter(35, 10), waitTimeMinutes: 6, type: 'food_beverage' },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'east',
        gate: null,
        data: { occupancyPercent: 55, fanCount: 11000, trend: 'rising' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+12s: More arrivals, transit building up
  scenario.push({
    timeOffset: 12000,
    phase: MATCH_PHASES.PRE_MATCH.id,
    events: [
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'south',
        gate: 'G5',
        data: { scansPerMinute: jitter(80, 10), queueLength: jitter(50, 15), waitTimeMinutes: 5 },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'south',
        gate: null,
        data: { stop: 'metro_south', occupancyPercent: 58, arrivalsPerMinute: 200 },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.VOLUNTEER_STATUS,
        zone: 'west',
        gate: 'G7',
        data: { volunteerId: 'V07', name: 'Luca Bianchi', status: 'reporting_congestion', message: 'Gate 7 queue extending past the perimeter fence. Need additional stewards.' },
        severity: SEVERITY.HIGH,
      },
    ],
  });

  // T+15s: Weather change
  scenario.push({
    timeOffset: 15000,
    phase: MATCH_PHASES.PRE_MATCH.id,
    events: [
      {
        type: EVENT_TYPES.WEATHER_UPDATE,
        zone: 'all',
        gate: null,
        data: { temperature: 30, humidity: 70, condition: 'Hot & Humid', wind: '8 km/h SW', uvIndex: 8, alert: 'Heat advisory: UV index elevated. Hydration stations recommended.' },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'north',
        gate: null,
        data: { occupancyPercent: 68, fanCount: 13600, trend: 'rising' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+18s: Last pre-match push
  scenario.push({
    timeOffset: 18000,
    phase: MATCH_PHASES.PRE_MATCH.id,
    events: [
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'east',
        gate: 'G4',
        data: { scansPerMinute: jitter(120, 15), queueLength: jitter(100, 20), waitTimeMinutes: 10 },
        severity: SEVERITY.HIGH,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'south',
        gate: null,
        data: { occupancyPercent: 72, fanCount: 14400, trend: 'rising' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // KICKOFF: T+20s — Match begins
  // ═══════════════════════════════════════════════════════════════
  
  scenario.push({
    timeOffset: 20000,
    phase: MATCH_PHASES.KICKOFF.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'kickoff', description: 'Match has kicked off! Argentina vs France.', minute: 0 },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'west',
        gate: 'G7',
        data: { scansPerMinute: jitter(140, 10), queueLength: jitter(60, 15), waitTimeMinutes: 5 },
        severity: SEVERITY.ELEVATED,
      },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // FIRST HALF: T+25s to T+45s
  // ═══════════════════════════════════════════════════════════════

  scenario.push({
    timeOffset: 25000,
    phase: MATCH_PHASES.FIRST_HALF.id,
    events: [
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'north',
        gate: null,
        data: { occupancyPercent: 88, fanCount: 17600, trend: 'stable' },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'north',
        gate: 'G1',
        data: { scansPerMinute: jitter(20, 5), queueLength: jitter(5, 3), waitTimeMinutes: 1 },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+30s: Minor incident
  scenario.push({
    timeOffset: 30000,
    phase: MATCH_PHASES.FIRST_HALF.id,
    events: [
      {
        type: EVENT_TYPES.INCIDENT_REPORT,
        zone: 'east',
        gate: null,
        data: { 
          incidentType: 'medical_minor', 
          description: 'Fan reporting heat exhaustion in Section 214, Row K. Requesting medical volunteer.',
          location: 'Section 214, Row K, Seat 18',
          priority: 'medium',
        },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.QUEUE_LENGTH,
        zone: 'concourse_s',
        gate: null,
        data: { location: 'Restroom Block B', queueLength: jitter(20, 5), waitTimeMinutes: 4, type: 'restroom' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+35s: Steady state
  scenario.push({
    timeOffset: 35000,
    phase: MATCH_PHASES.FIRST_HALF.id,
    events: [
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'west',
        gate: null,
        data: { occupancyPercent: 92, fanCount: 18400, trend: 'stable' },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'east',
        gate: null,
        data: { occupancyPercent: 90, fanCount: 18000, trend: 'stable' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+40s: Match event — yellow card
  scenario.push({
    timeOffset: 40000,
    phase: MATCH_PHASES.FIRST_HALF.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'yellow_card', description: 'Yellow card shown to #10. Crowd reaction moderate.', minute: 38 },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // HALFTIME: T+45s to T+55s — Concourse rush
  // ═══════════════════════════════════════════════════════════════
  
  scenario.push({
    timeOffset: 45000,
    phase: MATCH_PHASES.HALFTIME.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'halftime', description: 'Half-time whistle. Score: Argentina 0 – 0 France.', minute: 45 },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'concourse_n',
        gate: null,
        data: { occupancyPercent: 78, fanCount: 15600, trend: 'rising_fast' },
        severity: SEVERITY.HIGH,
      },
    ],
  });

  // T+48s: Food/drink queues explode
  scenario.push({
    timeOffset: 48000,
    phase: MATCH_PHASES.HALFTIME.id,
    events: [
      {
        type: EVENT_TYPES.QUEUE_LENGTH,
        zone: 'concourse_n',
        gate: null,
        data: { location: 'Food Court A', queueLength: jitter(90, 15), waitTimeMinutes: 18, type: 'food_beverage' },
        severity: SEVERITY.HIGH,
      },
      {
        type: EVENT_TYPES.QUEUE_LENGTH,
        zone: 'concourse_s',
        gate: null,
        data: { location: 'Food Court B', queueLength: jitter(75, 15), waitTimeMinutes: 14, type: 'food_beverage' },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.QUEUE_LENGTH,
        zone: 'concourse_n',
        gate: null,
        data: { location: 'Restroom Block A', queueLength: jitter(55, 10), waitTimeMinutes: 10, type: 'restroom' },
        severity: SEVERITY.HIGH,
      },
    ],
  });

  // T+52s: Halftime settling
  scenario.push({
    timeOffset: 52000,
    phase: MATCH_PHASES.HALFTIME.id,
    events: [
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'concourse_n',
        gate: null,
        data: { occupancyPercent: 85, fanCount: 17000, trend: 'stable' },
        severity: SEVERITY.HIGH,
      },
      {
        type: EVENT_TYPES.VOLUNTEER_STATUS,
        zone: 'concourse_n',
        gate: null,
        data: { volunteerId: 'V09', name: 'David Kim', status: 'crowd_management', message: 'North concourse very congested around Food Court A. Directing overflow to south concourse.' },
        severity: SEVERITY.ELEVATED,
      },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // SECOND HALF START: T+55s
  // ═══════════════════════════════════════════════════════════════

  scenario.push({
    timeOffset: 55000,
    phase: MATCH_PHASES.SECOND_HALF_START.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'second_half_kickoff', description: 'Second half underway.', minute: 46 },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'concourse_n',
        gate: null,
        data: { occupancyPercent: 45, fanCount: 9000, trend: 'falling' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // SECOND HALF: T+60s to T+75s — Then GOAL!
  // ═══════════════════════════════════════════════════════════════

  scenario.push({
    timeOffset: 60000,
    phase: MATCH_PHASES.SECOND_HALF.id,
    events: [
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'south',
        gate: null,
        data: { occupancyPercent: 94, fanCount: 18800, trend: 'stable' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+65s: Tension building
  scenario.push({
    timeOffset: 65000,
    phase: MATCH_PHASES.SECOND_HALF.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'chance', description: 'Close chance for Argentina! Crowd on their feet.', minute: 72 },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+70s: ⚽ GOAL SCORED!
  scenario.push({
    timeOffset: 70000,
    phase: MATCH_PHASES.GOAL_SURGE.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'goal', description: '⚽ GOAL! Argentina scores in the 78th minute! Massive crowd surge in the south and west stands.', minute: 78, team: 'Argentina', scorer: '#10' },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'south',
        gate: null,
        data: { occupancyPercent: 98, fanCount: 19600, trend: 'spike', alert: 'Crush risk — fans surging forward' },
        severity: SEVERITY.CRITICAL,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'west',
        gate: null,
        data: { occupancyPercent: 96, fanCount: 19200, trend: 'spike' },
        severity: SEVERITY.HIGH,
      },
    ],
  });

  // T+73s: Post-goal effects
  scenario.push({
    timeOffset: 73000,
    phase: MATCH_PHASES.GOAL_SURGE.id,
    events: [
      {
        type: EVENT_TYPES.QUEUE_LENGTH,
        zone: 'concourse_s',
        gate: null,
        data: { location: 'Celebration Merch Stand', queueLength: jitter(60, 10), waitTimeMinutes: 12, type: 'merchandise' },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.INCIDENT_REPORT,
        zone: 'south',
        gate: null,
        data: { 
          incidentType: 'crowd_safety', 
          description: 'Crowd compression detected in Section 118-120 after goal celebration. Stewards requesting support.',
          location: 'Section 118-120, Lower Bowl',
          priority: 'high',
        },
        severity: SEVERITY.CRITICAL,
      },
    ],
  });

  // T+77s: Settling after goal
  scenario.push({
    timeOffset: 77000,
    phase: MATCH_PHASES.SECOND_HALF.id,
    events: [
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'south',
        gate: null,
        data: { occupancyPercent: 93, fanCount: 18600, trend: 'stabilizing' },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.VOLUNTEER_STATUS,
        zone: 'south',
        gate: null,
        data: { volunteerId: 'V05', name: 'James O\'Brien', status: 'resolved', message: 'Crowd compression easing in Sections 118-120. Additional stewards arrived.' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  // FULL TIME: T+85s — Egress planning kicks in
  // ═══════════════════════════════════════════════════════════════

  scenario.push({
    timeOffset: 85000,
    phase: MATCH_PHASES.FULL_TIME.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'full_time', description: 'Full time! Argentina 1 – 0 France. Egress protocols activating.', minute: 90 },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'north',
        gate: null,
        data: { stop: 'metro_north', occupancyPercent: 45, arrivalsPerMinute: 10, departingCapacity: 2400 },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'south',
        gate: null,
        data: { stop: 'metro_south', occupancyPercent: 40, arrivalsPerMinute: 8, departingCapacity: 2400 },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+90s: Egress wave 1
  scenario.push({
    timeOffset: 90000,
    phase: MATCH_PHASES.EGRESS.id,
    events: [
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'west',
        gate: 'G7',
        data: { scansPerMinute: 0, exitRate: jitter(280, 30), queueLength: jitter(200, 40), direction: 'outbound' },
        severity: SEVERITY.HIGH,
      },
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'south',
        gate: 'G5',
        data: { scansPerMinute: 0, exitRate: jitter(250, 25), queueLength: jitter(180, 30), direction: 'outbound' },
        severity: SEVERITY.HIGH,
      },
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'north',
        gate: null,
        data: { stop: 'metro_north', occupancyPercent: 78, arrivalsPerMinute: 0, departingFansQueued: 2800 },
        severity: SEVERITY.HIGH,
      },
    ],
  });

  // T+95s: Transit at capacity
  scenario.push({
    timeOffset: 95000,
    phase: MATCH_PHASES.EGRESS.id,
    events: [
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'north',
        gate: null,
        data: { stop: 'metro_north', occupancyPercent: 95, departingFansQueued: 4200, alert: 'Platform near capacity. Recommend staggered gate release.' },
        severity: SEVERITY.CRITICAL,
      },
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'south',
        gate: null,
        data: { stop: 'metro_south', occupancyPercent: 88, departingFansQueued: 3600 },
        severity: SEVERITY.HIGH,
      },
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'east',
        gate: 'G3',
        data: { scansPerMinute: 0, exitRate: jitter(200, 20), queueLength: jitter(150, 25), direction: 'outbound' },
        severity: SEVERITY.ELEVATED,
      },
    ],
  });

  // T+100s: Egress wave 2
  scenario.push({
    timeOffset: 100000,
    phase: MATCH_PHASES.EGRESS.id,
    events: [
      {
        type: EVENT_TYPES.GATE_THROUGHPUT,
        zone: 'north',
        gate: 'G1',
        data: { scansPerMinute: 0, exitRate: jitter(180, 20), queueLength: jitter(100, 20), direction: 'outbound' },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'east',
        gate: null,
        data: { stop: 'bus_east', occupancyPercent: 92, departingFansQueued: 1800 },
        severity: SEVERITY.HIGH,
      },
    ],
  });

  // T+108s: Egress calming
  scenario.push({
    timeOffset: 108000,
    phase: MATCH_PHASES.EGRESS.id,
    events: [
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'north',
        gate: null,
        data: { stop: 'metro_north', occupancyPercent: 72, departingFansQueued: 2100 },
        severity: SEVERITY.ELEVATED,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'north',
        gate: null,
        data: { occupancyPercent: 35, fanCount: 7000, trend: 'falling' },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'south',
        gate: null,
        data: { occupancyPercent: 28, fanCount: 5600, trend: 'falling' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+115s: Winding down
  scenario.push({
    timeOffset: 115000,
    phase: MATCH_PHASES.EGRESS.id,
    events: [
      {
        type: EVENT_TYPES.ZONE_DENSITY,
        zone: 'west',
        gate: null,
        data: { occupancyPercent: 15, fanCount: 3000, trend: 'falling' },
        severity: SEVERITY.NOMINAL,
      },
      {
        type: EVENT_TYPES.TRANSIT_OCCUPANCY,
        zone: 'south',
        gate: null,
        data: { stop: 'metro_south', occupancyPercent: 48, departingFansQueued: 800 },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  // T+120s: Simulation complete
  scenario.push({
    timeOffset: 120000,
    phase: MATCH_PHASES.EGRESS.id,
    events: [
      {
        type: EVENT_TYPES.MATCH_EVENT,
        zone: 'all',
        gate: null,
        data: { event: 'simulation_complete', description: 'Matchday simulation complete. Stadium clearing operations winding down.' },
        severity: SEVERITY.NOMINAL,
      },
    ],
  });

  return scenario;
}
