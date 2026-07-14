/**
 * PULSE — Command: Simulator Controls
 * 
 * Controls the scripted matchday simulation stream (SSE) and handles routing 
 * incoming events into the specialist agent pipeline.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePulse } from '@/lib/store';
import PulseIndicator from '@/components/ui/PulseIndicator';

export default function SimulatorControls() {
  const { state, dispatch } = usePulse();
  const { isRunning, isPaused, speed } = state.simulationState;
  
  const [loading, setLoading] = useState(false);
  const [processingAgents, setProcessingAgents] = useState(false);
  const eventSourceRef = useRef(null);
  
  // Track the last processed event batch index for resume/speed changes
  const lastIndexRef = useRef(-1);
  
  // AbortController ref to cancel overlapping API calls to the agent pipeline
  const pipelineAbortControllerRef = useRef(null);

  // Track processed event IDs to prevent double-processing of incidents
  const processedEventsRef = useRef(new Set());

  // Define processAgentPipeline using useCallback and position it at the top
  const processAgentPipeline = useCallback(async (batchEvents) => {
    // Only send relevant events to keep pipeline clean
    const relevantEvents = batchEvents.filter(e => 
      ['gate_throughput', 'zone_density', 'queue_length', 'transit_occupancy', 'incident_report', 'weather_update'].includes(e.type)
    );

    if (relevantEvents.length === 0) return;

    // Abort previous pipeline call if it's still running
    if (pipelineAbortControllerRef.current) {
      pipelineAbortControllerRef.current.abort();
    }
    
    // Create new abort controller for this fetch request
    const controller = new AbortController();
    pipelineAbortControllerRef.current = controller;

    setProcessingAgents(true);

    try {
      const res = await fetch('/api/agents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          events: relevantEvents,
          stadiumState: state.stadiumState,
          phase: state.simulationState.phase
        })
      });

      const result = await res.json();

      // Only update state if this is still the active request
      if (!controller.signal.aborted && result.orchestratorResult?.ranked_actions) {
        dispatch({
          type: 'SET_ORCHESTRATOR_ACTIONS',
          payload: result.orchestratorResult.ranked_actions
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to run agent pipeline:', err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setProcessingAgents(false);
      }
    }
  }, [state.stadiumState, state.simulationState.phase, dispatch]);

  // Stop simulation and cancel fetches on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pipelineAbortControllerRef.current) {
        pipelineAbortControllerRef.current.abort();
      }
    };
  }, []);

  // Process fan-reported incidents immediately when they sync in from Firebase
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const unprocessedIncidents = state.events.filter(e => 
      e.type === 'incident_report' && !processedEventsRef.current.has(e.id)
    );

    if (unprocessedIncidents.length > 0) {
      // Mark as processed
      unprocessedIncidents.forEach(e => processedEventsRef.current.add(e.id));
      
      // Trigger the specialist agent + orchestrator pipeline on these incidents
      processAgentPipeline(unprocessedIncidents);
    }
  }, [state.events, isRunning, isPaused, processAgentPipeline]);

  const startSimulation = async (startIndex = 0, forcedSpeed = null) => {
    // If starting fresh, reset all state
    if (startIndex === 0) {
      setLoading(true);
      dispatch({ type: 'RESET_ALL_STATE' });
      lastIndexRef.current = -1;
      processedEventsRef.current.clear();
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const currentSpeed = forcedSpeed !== null ? forcedSpeed : speed;

    // Give state reset a moment to propagate if starting fresh
    const delayTime = startIndex === 0 ? 100 : 0;

    setTimeout(() => {
      const url = `/api/simulator?speed=${currentSpeed}&startIndex=${startIndex}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      dispatch({
        type: 'SET_SIMULATION_STATE',
        payload: { isRunning: true, isPaused: false, speed: currentSpeed }
      });

      setLoading(false);

      es.onmessage = async (e) => {
        // Safe check: ignore message if connection was closed or replaced
        if (eventSourceRef.current !== es) {
          es.close();
          return;
        }

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

        const { events, phase, matchTimeOffset, index } = data;

        // Record the current event index so we can resume
        if (typeof index === 'number') {
          lastIndexRef.current = index;
        }

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
        if (eventSourceRef.current === es) {
          es.close();
          dispatch({
            type: 'SET_SIMULATION_STATE',
            payload: { isRunning: false, isPaused: false }
          });
        }
      };
    }, delayTime);
  };

  const togglePause = () => {
    if (!isRunning) return;
    
    if (isPaused) {
      // Resume connection from where we left off
      startSimulation(lastIndexRef.current + 1);
    } else {
      // Pause: close EventSource but keep isRunning as true
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      dispatch({ 
        type: 'SET_SIMULATION_STATE', 
        payload: { isPaused: true } 
      });
    }
  };

  const changeSpeed = (newSpeed) => {
    dispatch({ type: 'SET_SIMULATION_STATE', payload: { speed: newSpeed } });
    
    // If running, restart connection to stream with the new speed setting and startIndex
    if (isRunning && !isPaused) {
      startSimulation(lastIndexRef.current + 1, newSpeed);
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
                if (eventSourceRef.current) {
                  eventSourceRef.current.close();
                  eventSourceRef.current = null;
                }
                if (pipelineAbortControllerRef.current) {
                  pipelineAbortControllerRef.current.abort();
                }
                lastIndexRef.current = -1;
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
