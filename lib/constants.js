/**
 * StadiumOPS — Shared Operations & Tournament Constants
 */

import tournamentData from './tournament-data.json';

// Export unified data model parsed from JSON
export const HOST_CITIES = tournamentData.hostCities;
export const ALL_MATCHES = tournamentData.matches;
export const TODAY_MATCHES = tournamentData.matches.filter(m => m.category === 'today' || m.status === 'live');
export const UPCOMING_MATCHES = tournamentData.matches.filter(m => m.category === 'upcoming');
export const COMPLETED_MATCHES = tournamentData.matches.filter(m => m.category === 'completed');

// Backwards compatibility fallbacks
const defaultMatch = TODAY_MATCHES[0] || tournamentData.matches[0];
export const STADIUM_NAME = defaultMatch.venue;
export const STADIUM_CAPACITY = HOST_CITIES.find(c => c.venue === STADIUM_NAME)?.capacity || 82500;

export const MATCH_INFO = {
  teams: {
    home: defaultMatch.home,
    away: defaultMatch.away,
  },
  date: 'July 15, 2026',
  kickoffTime: defaultMatch.kickoffTime,
  venue: STADIUM_NAME,
};

export const ZONES = {
  north: { id: 'north', label: 'North Stand', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  south: { id: 'south', label: 'South Stand', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  east: { id: 'east', label: 'East Stand', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  west: { id: 'west', label: 'West Stand', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  concourse_n: { id: 'concourse_n', label: 'North Concourse', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
  concourse_s: { id: 'concourse_s', label: 'South Concourse', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
};

export const GATES = {
  G1: { id: 'G1', label: 'Gate 1', zone: 'north', capacity: 800 },
  G2: { id: 'G2', label: 'Gate 2', zone: 'north', capacity: 800 },
  G3: { id: 'G3', label: 'Gate 3', zone: 'east', capacity: 1000 },
  G4: { id: 'G4', label: 'Gate 4', zone: 'east', capacity: 1000 },
  G5: { id: 'G5', label: 'Gate 5', zone: 'south', capacity: 800 },
  G6: { id: 'G6', zone: 'south', label: 'Gate 6', capacity: 800 },
  G7: { id: 'G7', zone: 'west', label: 'Gate 7', capacity: 1200 },
  G8: { id: 'G8', zone: 'west', label: 'Gate 8', capacity: 1200 },
};

export const TRANSIT_STOPS = {
  metro_north: { id: 'metro_north', label: 'Metro North Station', capacity: 3000 },
  metro_south: { id: 'metro_south', label: 'Metro South Station', capacity: 3000 },
  bus_east: { id: 'bus_east', label: 'East Bus Terminal', capacity: 1500 },
  shuttle_west: { id: 'shuttle_west', label: 'West Shuttle Loop', capacity: 2000 },
};

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
