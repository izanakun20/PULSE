/**
 * PULSE — Command: Simulator Controls
 * 
 * Controls the scripted matchday simulation stream (SSE) and handles routing 
 * incoming events into the specialist agent pipeline.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { usePulse } from '@/lib/store';
import PulseIndicator from '@/components/ui/PulseIndicator';

export default function SimulatorControls() {
  const { state, dispatch } = usePulse();
  const { isRunning, isPaused, speed } = state.simulationState;
  
  const [loading, setLoading] = useState(false);
  const [processingAgents, setProcessingAgents] = useState(false);
  const eventSourceRef = useRef(null);

  // Stop simulation on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const startSimulation = async () => {
    if (isRunning) return;
    
    setLoading(true);
    dispatch({ type: 'RESET_ALL_STATE' });

    // Give state reset a moment to propagate
    setTimeout(() => {
      const url = `/api/simulator?speed=${speed}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      dispatch({
        type: 'SET_SIMULATION_STATE',
        payload: { isRunning: true, isPaused: false }
      });

      setLoading(false);

      es.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        
        if (data.complete) {
          es.close();
          dispatch({
            type: 'SET_SIMULATION_STATE',
            payload: { isRunning: false, isPaused: false }
          });
          return;
        }

        if (data.error) {
          console.error('Simulation error:', data.error);
          es.close();
          dispatch({
            type: 'SET_SIMULATION_STATE',
            payload: { isRunning: false, isPaused: false }
          });
          return;
        }

        const { events, phase, matchTimeOffset } = data;

        // 1. Dispatch phase updates
        dispatch({ type: 'SET_PHASE', payload: phase.id });

        // 2. Add events to logger
        dispatch({ type: 'ADD_EVENTS', payload: events });

        // 3. Update live stadium occupancy & gate states
        dispatch({ type: 'UPDATE_STADIUM_STATE', payload: events });

        // 4. Update elapsed clock seconds
        dispatch({
          type: 'SET_SIMULATION_STATE',
          payload: { elapsedSeconds: Math.round(matchTimeOffset / 1000) }
        });

        // 5. Fire specialist agent + orchestrator pipeline
        processAgentPipeline(events);
      };

      es.onerror = () => {
        es.close();
        dispatch({
          type: 'SET_SIMULATION_STATE',
          payload: { isRunning: false, isPaused: false }
        });
      };
    }, 100);
  };

  const processAgentPipeline = async (batchEvents) => {
    // Only send relevant events to keep pipeline clean
    const relevantEvents = batchEvents.filter(e => 
      ['gate_throughput', 'zone_density', 'queue_length', 'transit_occupancy', 'incident_report', 'weather_update'].includes(e.type)
    );

    if (relevantEvents.length === 0) return;

    setProcessingAgents(true);

    try {
      const res = await fetch('/api/agents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: relevantEvents,
          stadiumState: state.stadiumState,
          phase: state.simulationState.phase
        })
      });

      const result = await res.json();

      if (result.orchestratorResult?.ranked_actions) {
        // Push the resolved, ranked action proposals into the review queue
        dispatch({
          type: 'SET_ORCHESTRATOR_ACTIONS',
          payload: result.orchestratorResult.ranked_actions
        });
      }
    } catch (err) {
      console.error('Failed to run agent pipeline:', err);
    } finally {
      setProcessingAgents(false);
    }
  };

  const togglePause = () => {
    if (!isRunning) return;
    
    if (isPaused) {
      // Re-initialize eventSource at current speed
      dispatch({ type: 'SET_SIMULATION_STATE', payload: { isPaused: false } });
      startSimulation();
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      dispatch({ type: 'SET_SIMULATION_STATE', payload: { isPaused: true } });
    }
  };

  const changeSpeed = (newSpeed) => {
    dispatch({ type: 'SET_SIMULATION_STATE', payload: { speed: newSpeed } });
    // If running, restart connection to stream with the new speed setting
    if (isRunning && !isPaused) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      const url = `/api/simulator?speed=${newSpeed}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        if (data.complete) {
          es.close();
          dispatch({ type: 'SET_SIMULATION_STATE', payload: { isRunning: false } });
          return;
        }
        const { events, phase, matchTimeOffset } = data;
        dispatch({ type: 'SET_PHASE', payload: phase.id });
        dispatch({ type: 'ADD_EVENTS', payload: events });
        dispatch({ type: 'UPDATE_STADIUM_STATE', payload: events });
        dispatch({
          type: 'SET_SIMULATION_STATE',
          payload: { elapsedSeconds: Math.round(matchTimeOffset / 1000) }
        });
        processAgentPipeline(events);
      };
    }
  };

  return (
    <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', marginBottom: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {!isRunning ? (
          <button 
            className="btn btn-primary"
            onClick={startSimulation}
            disabled={loading}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
              fontSize: '14px',
              animation: 'glow-pulse 2s infinite ease-in-out'
            }}
          >
            <PulseIndicator status="alert" size="sm" />
            SIMULATE KICKOFF
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn btn-danger" 
              onClick={() => {
                if (eventSourceRef.current) eventSourceRef.current.close();
                dispatch({ type: 'RESET_ALL_STATE' });
              }}
              style={{ fontFamily: 'var(--font-display)', fontSize: '13px' }}
            >
              STOP SIMULATION
            </button>
            <button 
              className="btn btn-outline" 
              onClick={togglePause}
              style={{ fontFamily: 'var(--font-display)', fontSize: '13px' }}
            >
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: 'var(--floodlight-dim)', fontFamily: 'var(--font-body)', fontWeight: 'bold' }}>SPEED</span>
          <button 
            onClick={() => changeSpeed(1)} 
            className={`btn-sm ${speed === 1 ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '2px 8px', fontSize: '11px', fontFamily: 'var(--font-display)' }}
          >
            1X
          </button>
          <button 
            onClick={() => changeSpeed(2)} 
            className={`btn-sm ${speed === 2 ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '2px 8px', fontSize: '11px', fontFamily: 'var(--font-display)' }}
          >
            2X
          </button>
          <button 
            onClick={() => changeSpeed(4)} 
            className={`btn-sm ${speed === 4 ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '2px 8px', fontSize: '11px', fontFamily: 'var(--font-display)' }}
          >
            4X
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {processingAgents && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--amber)' }}>
            <div className="spinner" style={{ width: '12px', height: '12px', border: '2px solid rgba(245,158,11,0.2)', borderTopColor: 'var(--amber)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            <span>AI AGENTS REASONING...</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PulseIndicator status={isRunning ? (isPaused ? 'idle' : 'active') : 'idle'} />
          <span style={{ fontSize: '11px', color: 'var(--floodlight-dim)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isRunning ? (isPaused ? 'TELEMETRY PAUSED' : 'LIVE TELEMETRY STREAM') : 'OFFLINE'}
          </span>
        </div>
      </div>
    </div>
  );
}
