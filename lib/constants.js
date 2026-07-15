/**
 * StadiumOPS — Shared Operations & Tournament Constants
 */

// 16 Host Cities & Stadiums for FIFA World Cup 2026
export const HOST_CITIES = [
  { id: 'ny_nj', city: 'New York/New Jersey', venue: 'MetLife Stadium', capacity: 82500 },
  { id: 'la', city: 'Los Angeles', venue: 'SoFi Stadium', capacity: 70000 },
  { id: 'dal', city: 'Dallas', venue: 'AT&T Stadium', capacity: 92000 },
  { id: 'mex', city: 'Mexico City', venue: 'Estadio Azteca', capacity: 87500 },
  { id: 'tor', city: 'Toronto', venue: 'BMO Field', capacity: 45000 },
  { id: 'atl', city: 'Atlanta', venue: 'Mercedes-Benz Stadium', capacity: 71000 },
  { id: 'bos', city: 'Boston', venue: 'Gillette Stadium', capacity: 65878 },
  { id: 'hou', city: 'Houston', venue: 'NRG Stadium', capacity: 72220 },
  { id: 'kc', city: 'Kansas City', venue: 'Arrowhead Stadium', capacity: 76416 },
  { id: 'mia', city: 'Miami', venue: 'Hard Rock Stadium', capacity: 64767 },
  { id: 'phi', city: 'Philadelphia', venue: 'Lincoln Financial Field', capacity: 69796 },
  { id: 'sf', city: 'San Francisco Bay Area', venue: 'Levi\'s Stadium', capacity: 68500 },
  { id: 'sea', city: 'Seattle', venue: 'Lumen Field', capacity: 69000 },
  { id: 'van', city: 'Vancouver', venue: 'BC Place', capacity: 54500 },
  { id: 'gua', city: 'Guadalajara', venue: 'Estadio Akron', capacity: 48070 },
  { id: 'mon', city: 'Monterrey', venue: 'Estadio BBVA', capacity: 53500 }
];

// Today's Live Matches (Tournament-wide schedule)
export const TODAY_MATCHES = [
  {
    id: 'match_1',
    home: 'Brazil',
    away: 'France',
    city: 'New York/New Jersey',
    venue: 'MetLife Stadium',
    kickoffTime: '15:00 EST',
    status: 'live',
    phase: 'first_half'
  },
  {
    id: 'match_2',
    home: 'USA',
    away: 'England',
    city: 'Los Angeles',
    venue: 'SoFi Stadium',
    kickoffTime: '18:00 EST',
    status: 'scheduled',
    phase: 'PRE_MATCH'
  },
  {
    id: 'match_3',
    home: 'Mexico',
    away: 'Italy',
    city: 'Mexico City',
    venue: 'Estadio Azteca',
    kickoffTime: '20:00 CST',
    status: 'scheduled',
    phase: 'PRE_MATCH'
  },
  {
    id: 'match_4',
    home: 'Canada',
    away: 'Germany',
    city: 'Toronto',
    venue: 'BMO Field',
    kickoffTime: '17:00 EST',
    status: 'scheduled',
    phase: 'PRE_MATCH'
  },
  {
    id: 'match_5',
    home: 'Argentina',
    away: 'Spain',
    city: 'Dallas',
    venue: 'AT&T Stadium',
    kickoffTime: '21:00 EST',
    status: 'scheduled',
    phase: 'PRE_MATCH'
  }
];

// Backwards compatibility fallbacks
export const STADIUM_NAME = 'MetLife Stadium';
export const STADIUM_CAPACITY = 82500;

export const MATCH_INFO = {
  teams: {
    home: 'Brazil',
    away: 'France',
  },
  date: 'July 15, 2026',
  kickoffTime: '15:00 EST',
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
