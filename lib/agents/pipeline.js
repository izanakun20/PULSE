/**
 * PULSE — Agent Pipeline
 *
 * Mock agent processing pipeline that simulates the multi-agent orchestration.
 * Converts raw simulator events into specialist agent analyses,
 * then orchestrates and ranks proposals for the human operator.
 */

import { EVENT_TYPES, SEVERITY, STADIUM } from '@/lib/simulator/event-types';

let proposalCounter = 0;

function generateProposalId() {
  proposalCounter++;
  return `prop_${String(proposalCounter).padStart(4, '0')}`;
}

export function resetProposalCounter() {
  proposalCounter = 0;
}

// Agent type configurations
const AGENT_TYPES = {
  'crowd-flow': { label: 'Crowd Flow AI', color: '#3b82f6', icon: '👁️' },
  'dispatch': { label: 'Dispatch AI', color: '#f59e0b', icon: '📋' },
  'comms': { label: 'Comms AI', color: '#22c55e', icon: '📢' },
  'safety': { label: 'Safety AI', color: '#ef4444', icon: '🛡️' },
  'transit': { label: 'Transit AI', color: '#8b5cf6', icon: '🚇' },
};

/**
 * Process a batch of simulator events through the agent pipeline.
 * Returns an array of orchestrator proposals (may be empty if events are routine).
 */
export function processEventBatch(events) {
  const proposals = [];

  for (const event of events) {
    const generated = generateProposalsFromEvent(event);
    proposals.push(...generated);
  }

  // Sort by urgency and confidence
  const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  proposals.sort((a, b) => {
    const urgDiff = (urgencyOrder[a.urgency] || 3) - (urgencyOrder[b.urgency] || 3);
    if (urgDiff !== 0) return urgDiff;
    return b.confidence - a.confidence;
  });

  return proposals;
}

function generateProposalsFromEvent(event) {
  const proposals = [];

  switch (event.type) {
    case EVENT_TYPES.GATE_THROUGHPUT:
      if (event.severity === SEVERITY.HIGH || event.severity === SEVERITY.CRITICAL) {
        proposals.push({
          id: generateProposalId(),
          agent: 'crowd-flow',
          agentMeta: AGENT_TYPES['crowd-flow'],
          title: `Redirect flow at ${event.gate || 'gate'}`,
          description: `${event.gate} showing ${event.data.queueLength} fans queued with ${event.data.waitTimeMinutes}min wait. Throughput at ${event.data.scansPerMinute} scans/min.`,
          reasoning: `Queue length has exceeded safe thresholds. Current wait time of ${event.data.waitTimeMinutes} minutes risks fan frustration and potential safety concerns. Recommend opening additional scanning lanes and redirecting fans to adjacent gates with lower utilisation. Historical data shows that wait times over 10 minutes correlate with a 40% increase in crowd incidents.`,
          confidence: event.severity === SEVERITY.CRITICAL ? 94 : 82,
          urgency: event.severity === SEVERITY.CRITICAL ? 'critical' : 'high',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Deploy 2 additional stewards to ${event.gate}` },
            { type: 'fan_alert', description: `Suggest alternate gate entry via app notification` },
          ],
          sourceEvent: event.id,
        });
      }
      if (event.data.direction === 'outbound' && event.severity >= SEVERITY.ELEVATED) {
        proposals.push({
          id: generateProposalId(),
          agent: 'crowd-flow',
          agentMeta: AGENT_TYPES['crowd-flow'],
          title: `Manage egress flow at ${event.gate}`,
          description: `Exit rate ${event.data.exitRate}/min with ${event.data.queueLength} fans waiting at ${event.gate}.`,
          reasoning: `High exit volume detected. Staggered gate release recommended to prevent platform overcrowding at connected transit hubs. This gate feeds into a transit stop that is approaching capacity.`,
          confidence: 78,
          urgency: 'high',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Position crowd managers at exit corridor` },
          ],
          sourceEvent: event.id,
        });
      }
      break;

    case EVENT_TYPES.ZONE_DENSITY:
      if (event.severity === SEVERITY.CRITICAL) {
        proposals.push({
          id: generateProposalId(),
          agent: 'safety',
          agentMeta: AGENT_TYPES['safety'],
          title: `URGENT: Crowd density alert — ${getZoneLabel(event.zone)}`,
          description: `${getZoneLabel(event.zone)} at ${event.data.occupancyPercent}% capacity (${event.data.fanCount.toLocaleString()} fans). Trend: ${event.data.trend}.`,
          reasoning: `Crowd density has exceeded critical safety thresholds. ${event.data.alert || 'Immediate intervention required to prevent crush risk.'}  Activating crowd relief protocols: open additional egress routes, deploy medical standby, and alert section stewards for crowd management.`,
          confidence: 96,
          urgency: 'critical',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Deploy safety team to ${getZoneLabel(event.zone)}` },
            { type: 'fan_alert', description: `Safety advisory for ${getZoneLabel(event.zone)} section` },
          ],
          sourceEvent: event.id,
        });
      } else if (event.severity === SEVERITY.HIGH) {
        proposals.push({
          id: generateProposalId(),
          agent: 'crowd-flow',
          agentMeta: AGENT_TYPES['crowd-flow'],
          title: `Monitor density — ${getZoneLabel(event.zone)}`,
          description: `${getZoneLabel(event.zone)} at ${event.data.occupancyPercent}% capacity. Trend: ${event.data.trend}.`,
          reasoning: `Zone density is elevated and trending ${event.data.trend}. Pre-emptive crowd management recommended to avoid reaching critical levels. Concourse diversion signs should be activated.`,
          confidence: 75,
          urgency: 'medium',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Wayfinding volunteers redirect to less-crowded areas` },
          ],
          sourceEvent: event.id,
        });
      }
      break;

    case EVENT_TYPES.INCIDENT_REPORT:
      if (event.data.priority === 'high') {
        proposals.push({
          id: generateProposalId(),
          agent: 'safety',
          agentMeta: AGENT_TYPES['safety'],
          title: `Respond to ${event.data.incidentType.replace(/_/g, ' ')}`,
          description: event.data.description,
          reasoning: `High-priority ${event.data.incidentType.replace(/_/g, ' ')} reported at ${event.data.location}. Immediate dispatch of appropriate response team required. Safety protocols mandate response within 3 minutes for incidents of this severity.`,
          confidence: 91,
          urgency: 'critical',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Dispatch safety team to ${event.data.location}` },
            { type: 'fan_alert', description: `Advisory: temporary section restriction near ${event.data.location}` },
          ],
          sourceEvent: event.id,
        });
      } else {
        proposals.push({
          id: generateProposalId(),
          agent: 'dispatch',
          agentMeta: AGENT_TYPES['dispatch'],
          title: `Dispatch medical for ${event.data.incidentType.replace(/_/g, ' ')}`,
          description: event.data.description,
          reasoning: `${event.data.incidentType.replace(/_/g, ' ')} incident reported at ${event.data.location}. Dispatching nearest available medical volunteer. Standard response protocol applies.`,
          confidence: 85,
          urgency: 'high',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Send medical volunteer to ${event.data.location}` },
          ],
          sourceEvent: event.id,
        });
      }
      break;

    case EVENT_TYPES.QUEUE_LENGTH:
      if (event.severity === SEVERITY.HIGH || event.severity === SEVERITY.CRITICAL) {
        proposals.push({
          id: generateProposalId(),
          agent: 'dispatch',
          agentMeta: AGENT_TYPES['dispatch'],
          title: `Queue management — ${event.data.location}`,
          description: `${event.data.location}: ${event.data.queueLength} people in queue, ~${event.data.waitTimeMinutes}min wait.`,
          reasoning: `${event.data.type === 'food_beverage' ? 'Food & beverage' : event.data.type === 'restroom' ? 'Restroom' : 'Service'} queue has exceeded acceptable thresholds. Fan experience impact is significant. Recommend deploying queue management volunteers and activating overflow ${event.data.type === 'restroom' ? 'facilities' : 'kiosks'}.`,
          confidence: 72,
          urgency: 'medium',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Queue management at ${event.data.location}` },
            { type: 'fan_alert', description: `Alternative ${event.data.type} locations available nearby` },
          ],
          sourceEvent: event.id,
        });
      }
      break;

    case EVENT_TYPES.WEATHER_UPDATE:
      if (event.severity !== SEVERITY.NOMINAL && event.data.alert) {
        proposals.push({
          id: generateProposalId(),
          agent: 'comms',
          agentMeta: AGENT_TYPES['comms'],
          title: `Weather advisory broadcast`,
          description: `${event.data.condition} — ${event.data.temperature}°C, UV ${event.data.uvIndex}. ${event.data.alert}`,
          reasoning: `Weather conditions have changed significantly. Fan comfort and safety may be impacted. Recommend activating PA announcements, digital signage updates, and push notifications to fans with hydration/shelter guidance.`,
          confidence: 88,
          urgency: 'medium',
          affectedZones: ['all'],
          actions: [
            { type: 'fan_alert', description: event.data.alert },
            { type: 'volunteer_task', description: `Activate hydration stations and shade areas` },
          ],
          sourceEvent: event.id,
        });
      }
      break;

    case EVENT_TYPES.TRANSIT_OCCUPANCY:
      if (event.severity === SEVERITY.CRITICAL) {
        proposals.push({
          id: generateProposalId(),
          agent: 'transit',
          agentMeta: AGENT_TYPES['transit'],
          title: `Transit platform at capacity — ${event.data.stop.replace(/_/g, ' ')}`,
          description: `${event.data.stop.replace(/_/g, ' ')} at ${event.data.occupancyPercent}% capacity. ${event.data.departingFansQueued?.toLocaleString() || 'Many'} fans queued. ${event.data.alert || ''}`,
          reasoning: `Transit platform approaching dangerous overcrowding. Recommend implementing staggered gate release protocol for adjacent zones to throttle the flow of fans reaching the platform. Coordinate with transit authority for additional service frequency.`,
          confidence: 90,
          urgency: 'critical',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Manage crowd flow to ${event.data.stop.replace(/_/g, ' ')}` },
            { type: 'fan_alert', description: `Consider alternative transport options. ${event.data.stop.replace(/_/g, ' ')} is experiencing high demand.` },
          ],
          sourceEvent: event.id,
        });
      } else if (event.severity === SEVERITY.HIGH) {
        proposals.push({
          id: generateProposalId(),
          agent: 'transit',
          agentMeta: AGENT_TYPES['transit'],
          title: `Transit load building — ${event.data.stop.replace(/_/g, ' ')}`,
          description: `${event.data.stop.replace(/_/g, ' ')} at ${event.data.occupancyPercent}% capacity.`,
          reasoning: `Transit demand building. If trends continue, platform will reach capacity within 10 minutes. Pre-emptive crowd throttling recommended.`,
          confidence: 73,
          urgency: 'high',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Position wayfinding at transit approaches` },
          ],
          sourceEvent: event.id,
        });
      }
      break;

    case EVENT_TYPES.VOLUNTEER_STATUS:
      if (event.severity === SEVERITY.HIGH || event.severity === SEVERITY.ELEVATED) {
        proposals.push({
          id: generateProposalId(),
          agent: 'dispatch',
          agentMeta: AGENT_TYPES['dispatch'],
          title: `Volunteer report: ${event.data.name}`,
          description: event.data.message,
          reasoning: `Field volunteer ${event.data.name} (${event.data.volunteerId}) has reported a situation requiring command attention. ${event.data.status === 'reporting_congestion' ? 'Ground-level confirmation of congestion detected by sensors.' : 'Field observation adds context to sensor data.'}`,
          confidence: 80,
          urgency: event.severity === SEVERITY.HIGH ? 'high' : 'medium',
          affectedZones: [event.zone],
          actions: [
            { type: 'volunteer_task', description: `Send backup to ${event.data.name}'s location` },
          ],
          sourceEvent: event.id,
        });
      }
      break;
  }

  return proposals;
}

function getZoneLabel(zoneId) {
  const zone = STADIUM.zones.find(z => z.id === zoneId);
  return zone ? zone.label : zoneId;
}

export { AGENT_TYPES };
