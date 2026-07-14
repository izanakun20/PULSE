/**
 * PULSE — Shared React State Context & Firebase Sync Store
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { MATCH_PHASES } from './simulator/event-types';

const PulseContext = createContext(null);

const FIREBASE_URL = 'https://pulse-2493a-default-rtdb.asia-southeast1.firebasedatabase.app/';

// Initial State
const initialState = {
  simulationState: {
    isRunning: false,
    isPaused: false,
    phase: 'PRE_MATCH',
    phaseLabel: 'Pre-Match',
    phaseIcon: '🏟️',
    speed: 1,
    elapsedSeconds: 0,
  },
  events: [],
  agentProposals: [],
  orchestratorActions: [],
  approvedActions: [],
  volunteerTasks: [],
  fanAlerts: [],
  stadiumState: {
    north: { occupancyPercent: 0, fanCount: 0, trend: 'stable', severity: 'nominal' },
    south: { occupancyPercent: 0, fanCount: 0, trend: 'stable', severity: 'nominal' },
    east: { occupancyPercent: 0, fanCount: 0, trend: 'stable', severity: 'nominal' },
    west: { occupancyPercent: 0, fanCount: 0, trend: 'stable', severity: 'nominal' },
    concourse_n: { occupancyPercent: 0, fanCount: 0, trend: 'stable', severity: 'nominal' },
    concourse_s: { occupancyPercent: 0, fanCount: 0, trend: 'stable', severity: 'nominal' },
    gates: {
      G1: { status: 'open', scansPerMinute: 0, queueLength: 0, exitRate: 0 },
      G2: { status: 'open', scansPerMinute: 0, queueLength: 0, exitRate: 0 },
      G3: { status: 'open', scansPerMinute: 0, queueLength: 0, exitRate: 0 },
      G4: { status: 'open', scansPerMinute: 0, queueLength: 0, exitRate: 0 },
      G5: { status: 'open', scansPerMinute: 0, queueLength: 0, exitRate: 0 },
      G6: { status: 'open', scansPerMinute: 0, queueLength: 0, exitRate: 0 },
      G7: { status: 'open', scansPerMinute: 0, queueLength: 0, exitRate: 0 },
      G8: { status: 'open', scansPerMinute: 0, queueLength: 0, exitRate: 0 },
    },
    transit: {
      metro_north: { occupancyPercent: 0, queued: 0, capacity: 3000, severity: 'nominal' },
      metro_south: { occupancyPercent: 0, queued: 0, capacity: 3000, severity: 'nominal' },
      bus_east: { occupancyPercent: 0, queued: 0, capacity: 1500, severity: 'nominal' },
      shuttle_west: { occupancyPercent: 0, queued: 0, capacity: 2000, severity: 'nominal' },
    }
  }
};

// Helper to push to Firebase
async function writeToFirebase(path, data) {
  try {
    await fetch(`${FIREBASE_URL}${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('Firebase write error:', err);
  }
}

// Reducer
function pulseReducer(state, action) {
  switch (action.type) {
    case 'SET_SIMULATION_STATE': {
      const newState = {
        ...state,
        simulationState: {
          ...state.simulationState,
          ...action.payload,
        }
      };
      // Trigger side-effect write
      if (typeof window !== 'undefined') {
        writeToFirebase('simulation_state', newState.simulationState);
      }
      return newState;
    }

        case 'ADD_EVENTS': {
      const uniquePayload = action.payload.filter(
        evt => !state.events.some(existing => existing.id === evt.id)
      );
      if (uniquePayload.length === 0) return state;
      const newEvents = [...state.events, ...uniquePayload].slice(-100);
      return {
        ...state,
        events: newEvents,
      };
    }

    case 'SET_PHASE': {
      const phaseInfo = MATCH_PHASES[action.payload] || { label: action.payload, icon: '⚽' };
      const newSimState = {
        ...state.simulationState,
        phase: action.payload,
        phaseLabel: phaseInfo.label,
        phaseIcon: phaseInfo.icon,
      };
      if (typeof window !== 'undefined') {
        writeToFirebase('simulation_state', newSimState);
      }
      return {
        ...state,
        simulationState: newSimState
      };
    }

    case 'ADD_PROPOSALS': {
      return {
        ...state,
        agentProposals: [...state.agentProposals, ...action.payload].slice(-30),
      };
    }

    case 'SET_ORCHESTRATOR_ACTIONS': {
      return {
        ...state,
        orchestratorActions: action.payload,
      };
    }

    case 'APPROVE_ACTION': {
      const actionId = action.payload;
      const approvedItem = state.orchestratorActions.find(a => a.proposal.action_id === actionId);
      if (!approvedItem) return state;

      const remainingActions = state.orchestratorActions.filter(a => a.proposal.action_id !== actionId);
      const newApproved = [...state.approvedActions, { ...approvedItem, status: 'approved', approvedAt: new Date().toISOString() }];

      // Sync approved actions list to firebase
      if (typeof window !== 'undefined') {
        writeToFirebase('approved_actions', newApproved);
      }

      return {
        ...state,
        orchestratorActions: remainingActions,
        approvedActions: newApproved,
      };
    }

    case 'REJECT_ACTION': {
      const actionId = action.payload;
      const remainingActions = state.orchestratorActions.filter(a => a.proposal.action_id !== actionId);
      return {
        ...state,
        orchestratorActions: remainingActions,
      };
    }

    case 'ADD_VOLUNTEER_TASK': {
      const newTasks = [...state.volunteerTasks, action.payload];
      if (typeof window !== 'undefined') {
        writeToFirebase('volunteer_tasks', newTasks);
      }
      return {
        ...state,
        volunteerTasks: newTasks,
      };
    }

    case 'UPDATE_VOLUNTEER_TASKS': {
      // Direct replacement (e.g. from Firebase sync)
      return {
        ...state,
        volunteerTasks: action.payload || []
      };
    }

    case 'UPDATE_TASK_STATUS': {
      const { taskId, status } = action.payload;
      const newTasks = state.volunteerTasks.map(t => 
        t.id === taskId ? { ...t, status, completedAt: status === 'completed' ? new Date().toISOString() : null } : t
      );
      if (typeof window !== 'undefined') {
        writeToFirebase('volunteer_tasks', newTasks);
      }
      return {
        ...state,
        volunteerTasks: newTasks
      };
    }

    case 'ADD_FAN_ALERT': {
      const newAlerts = [action.payload, ...state.fanAlerts].slice(0, 20);
      if (typeof window !== 'undefined') {
        writeToFirebase('fan_alerts', newAlerts);
      }
      return {
        ...state,
        fanAlerts: newAlerts,
      };
    }

    case 'UPDATE_FAN_ALERTS': {
      return {
        ...state,
        fanAlerts: action.payload || []
      };
    }

    case 'UPDATE_STADIUM_STATE': {
      const nextStadium = { ...state.stadiumState };
      const events = action.payload;

      events.forEach(evt => {
        // Update Zone Density
        if (evt.type === 'zone_density' && nextStadium[evt.zone]) {
          nextStadium[evt.zone] = {
            ...nextStadium[evt.zone],
            occupancyPercent: evt.data.occupancyPercent,
            fanCount: evt.data.fanCount,
            trend: evt.data.trend || 'stable',
            severity: evt.severity,
          };
        }

        // Update Gate status
        if (evt.type === 'gate_throughput' && evt.gate && nextStadium.gates[evt.gate]) {
          nextStadium.gates[evt.gate] = {
            ...nextStadium.gates[evt.gate],
            scansPerMinute: evt.data.scansPerMinute || 0,
            queueLength: evt.data.queueLength || 0,
            exitRate: evt.data.exitRate || 0,
            severity: evt.severity,
          };
        }

        // Update transit
        if (evt.type === 'transit_occupancy' && evt.data.stop && nextStadium.transit[evt.data.stop]) {
          nextStadium.transit[evt.data.stop] = {
            ...nextStadium.transit[evt.data.stop],
            occupancyPercent: evt.data.occupancyPercent || 0,
            queued: evt.data.departingFansQueued || 0,
            severity: evt.severity,
          };
        }
      });

      return {
        ...state,
        stadiumState: nextStadium
      };
    }

    case 'APPLY_STATE_FROM_SYNC': {
      return {
        ...state,
        ...action.payload
      };
    }

    case 'RESET_ALL_STATE': {
      if (typeof window !== 'undefined') {
        writeToFirebase('volunteer_tasks', null);
        writeToFirebase('fan_alerts', null);
        writeToFirebase('approved_actions', null);
        writeToFirebase('fan_incidents', null);
        writeToFirebase('simulation_state', initialState.simulationState);
      }
      return {
        ...initialState,
        simulationState: {
          ...initialState.simulationState,
        }
      };
    }

    default:
      return state;
  }
}

export function PulseProvider({ children }) {
  const [state, dispatch] = useReducer(pulseReducer, initialState);
  const eventSourceRef = useRef(null);

  // Sync state from Firebase on mount and listen for real-time changes
  useEffect(() => {
    // Initial fetch
    async function loadInitial() {
      try {
        const res = await fetch(`${FIREBASE_URL}.json`);
        const db = await res.json();
        if (db) {
          const syncPayload = {};
          if (db.simulation_state) syncPayload.simulationState = db.simulation_state;
          if (db.volunteer_tasks) syncPayload.volunteerTasks = db.volunteer_tasks;
          if (db.fan_alerts) syncPayload.fanAlerts = db.fan_alerts;
          if (db.approved_actions) syncPayload.approvedActions = db.approved_actions;
          
          dispatch({ type: 'APPLY_STATE_FROM_SYNC', payload: syncPayload });
        }
      } catch (err) {
        console.warn('Unable to reach Firebase. Running in isolated local memory mode.');
      }
    }
    loadInitial();

    // SSE EventSource for real-time Firebase DB sync
    try {
      const es = new EventSource(`${FIREBASE_URL}.json`);
      eventSourceRef.current = es;

      es.addEventListener('put', (e) => {
        const payload = JSON.parse(e.data);
        if (!payload) return;

        const { path, data } = payload;
        
        if (path === '/volunteer_tasks') {
          dispatch({ type: 'UPDATE_VOLUNTEER_TASKS', payload: data });
        } else if (path === '/fan_alerts') {
          dispatch({ type: 'UPDATE_FAN_ALERTS', payload: data });
        } else if (path === '/simulation_state' && data) {
          dispatch({ type: 'SET_SIMULATION_STATE', payload: data });
        } else if (path === '/fan_incidents' && data) {
          const incidents = Object.values(data).filter(Boolean);
          if (incidents.length > 0) {
            dispatch({ type: 'ADD_EVENTS', payload: incidents });
            dispatch({ type: 'UPDATE_STADIUM_STATE', payload: incidents });
          }
        } else if (path.startsWith('/fan_incidents/') && data) {
          dispatch({ type: 'ADD_EVENTS', payload: [data] });
          dispatch({ type: 'UPDATE_STADIUM_STATE', payload: [data] });
        }
      });
    } catch (e) {
      console.warn('Real-time sync EventSource failed. Falling back to local events.');
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <PulseContext.Provider value={{ state, dispatch }}>
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
}
