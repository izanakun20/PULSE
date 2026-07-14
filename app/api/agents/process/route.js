/**
 * PULSE — Agent Processing API Routes
 * 
 * POST /api/agents/process — Main endpoint for processing simulator events through agents
 * 
 * Receives a batch of simulator events, routes them to appropriate specialist agents,
 * then runs the orchestrator to produce a ranked action list.
 */

import { callCrowdFlowAgent, callDispatchAgent, callCommsAgent, callOrchestrator } from '@/lib/agents/gemini';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return Response.json({ error: 'Malformed JSON payload.' }, { status: 400 });
    }

    const { events, stadiumState, phase } = body;

    // 1. Validate 'events' parameter
    if (!events || !Array.isArray(events)) {
      return Response.json({ error: 'Missing or invalid events array' }, { status: 400 });
    }

    if (events.length > 50) {
      return Response.json({ error: 'Events batch size cannot exceed 50 items.' }, { status: 400 });
    }

    // Validate each event object
    const VALID_EVENT_TYPES = ['gate_throughput', 'zone_density', 'queue_length', 'transit_occupancy', 'weather_update', 'incident_report', 'match_event', 'volunteer_status'];
    const VALID_SEVERITIES = ['nominal', 'elevated', 'high', 'critical'];

    for (let i = 0; i < events.length; i++) {
      const evt = events[i];
      if (typeof evt !== 'object' || evt === null) {
        return Response.json({ error: `Event at index ${i} must be a valid object.` }, { status: 400 });
      }
      if (typeof evt.type !== 'string' || !VALID_EVENT_TYPES.includes(evt.type)) {
        return Response.json({ error: `Event at index ${i} has missing or invalid type.` }, { status: 400 });
      }
      if (evt.zone && (typeof evt.zone !== 'string' || evt.zone.length > 50)) {
        return Response.json({ error: `Event at index ${i} has invalid zone.` }, { status: 400 });
      }
      if (evt.severity && (typeof evt.severity !== 'string' || !VALID_SEVERITIES.includes(evt.severity))) {
        return Response.json({ error: `Event at index ${i} has invalid severity.` }, { status: 400 });
      }
      if (evt.gate && (typeof evt.gate !== 'string' || evt.gate.length > 10)) {
        return Response.json({ error: `Event at index ${i} has invalid gate name.` }, { status: 400 });
      }
    }

    // 2. Validate 'stadiumState'
    if (stadiumState && (typeof stadiumState !== 'object' || stadiumState === null)) {
      return Response.json({ error: 'stadiumState must be a valid object.' }, { status: 400 });
    }

    // 3. Validate 'phase'
    if (phase && (typeof phase !== 'string' || phase.length > 50)) {
      return Response.json({ error: 'phase must be a valid string.' }, { status: 400 });
    }

    // Route events to specialist agents in parallel
    const agentPromises = [];

    // Crowd-flow agent: processes zone density and gate throughput events
    const crowdEvents = events.filter(e => 
      ['zone_density', 'gate_throughput', 'queue_length'].includes(e.type)
    );
    if (crowdEvents.length > 0) {
      agentPromises.push(
        callCrowdFlowAgent(crowdEvents, stadiumState, phase)
          .catch(err => ({ error: err.message, agent: 'crowd-flow' }))
      );
    }

    // Dispatch agent: processes incidents, volunteer status, and crowd events
    const dispatchEvents = events.filter(e =>
      ['incident_report', 'volunteer_status', 'zone_density'].includes(e.type)
    );
    if (dispatchEvents.length > 0) {
      agentPromises.push(
        callDispatchAgent(dispatchEvents, stadiumState, phase)
          .catch(err => ({ error: err.message, agent: 'dispatch' }))
      );
    }

    // Comms agent: processes match events and incidents that need fan communication
    const commsEvents = events.filter(e =>
      ['match_event', 'weather_update', 'incident_report'].includes(e.type)
    );
    if (commsEvents.length > 0) {
      agentPromises.push(
        callCommsAgent(commsEvents, stadiumState, phase)
          .catch(err => ({ error: err.message, agent: 'comms' }))
      );
    }

    // Wait for all agents
    const agentResults = await Promise.all(agentPromises);
    
    // Collect valid proposals
    const proposals = agentResults
      .filter(r => !r.error && r.proposals)
      .flatMap(r => r.proposals);

    // If we have proposals, run the orchestrator
    let orchestratorResult = null;
    if (proposals.length > 0) {
      orchestratorResult = await callOrchestrator(proposals, stadiumState, phase)
        .catch(err => ({ error: err.message }));
    }

    return Response.json({
      agentResults,
      proposals,
      orchestratorResult,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Agent processing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
