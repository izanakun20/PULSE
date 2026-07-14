/**
 * PULSE — Agent Processing API Routes
 * 
 * POST /api/agents/process — Main endpoint for processing simulator events through agents
 * 
 * Receives a batch of simulator events, routes them to appropriate specialist agents,
 * then runs the orchestrator to produce a ranked action list.
 */

import { validateArray, validateObject, validateEnum, validateString } from '@/lib/validation';
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
    try {
      validateArray(events, 50, 'events');
      
      const VALID_EVENT_TYPES = ['gate_throughput', 'zone_density', 'queue_length', 'transit_occupancy', 'weather_update', 'incident_report', 'match_event', 'volunteer_status'];
      const VALID_SEVERITIES = ['nominal', 'elevated', 'high', 'critical'];

      events.forEach((evt, i) => {
        validateObject(evt, `Event at index ${i}`);
        validateEnum(evt.type, VALID_EVENT_TYPES, `Event type at index ${i}`);
        if (evt.zone) {
          validateString(evt.zone, 1, 50, `Event zone at index ${i}`);
        }
        if (evt.severity) {
          validateEnum(evt.severity, VALID_SEVERITIES, `Event severity at index ${i}`);
        }
        if (evt.gate) {
          validateString(evt.gate, 1, 10, `Event gate name at index ${i}`);
        }
      });

      // 2. Validate 'stadiumState'
      if (stadiumState) {
        validateObject(stadiumState, 'stadiumState');
      }

      // 3. Validate 'phase'
      if (phase) {
        validateString(phase, 1, 50, 'phase');
      }
    } catch (valError) {
      return Response.json({ error: valError.message }, { status: 400 });
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
