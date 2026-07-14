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
    const body = await request.json();
    const { events, stadiumState, phase } = body;

    if (!events || !Array.isArray(events)) {
      return Response.json({ error: 'Missing events array' }, { status: 400 });
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
