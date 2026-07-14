/**
 * PULSE — Action Approval API Route
 * 
 * POST /api/actions/approve — Approve or reject an orchestrator proposal
 * 
 * When approved:
 * - If volunteer_dispatch action: creates a volunteer task
 * - If fan_alert action: creates a fan alert
 * - If gate_reallocation: updates gate status
 */

import { validateString, validateEnum, validateObject } from '@/lib/validation';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return Response.json({ error: 'Malformed JSON payload.' }, { status: 400 });
    }

    const { actionId, status, operatorNote, action } = body;

    // Validate inputs
    try {
      validateString(actionId, 3, 100, 'actionId');
      validateEnum(status, ['approved', 'rejected'], 'status');
      
      if (operatorNote) {
        validateString(operatorNote, 1, 500, 'operatorNote');
      }

      if (action) {
        validateObject(action, 'action');
      }
    } catch (valError) {
      return Response.json({ error: valError.message }, { status: 400 });
    }

    const result = {
      actionId,
      status,
      operatorNote: operatorNote ? operatorNote.trim() : null,
      processedAt: new Date().toISOString(),
      downstreamEffects: [],
    };

    // If approved, determine downstream effects
    if (status === 'approved' && action) {
      switch (action.action_type) {
        case 'volunteer_dispatch':
          result.downstreamEffects.push({
            type: 'volunteer_task',
            data: {
              id: `task_${Date.now()}`,
              title: action.description,
              zone: action.affected_zones?.[0] || 'unknown',
              gate: action.affected_gates?.[0] || null,
              priority: action.urgency,
              assignedTo: action.target_volunteers || [],
              status: 'pending',
              createdAt: new Date().toISOString(),
              source: action.agent,
              description: action.reasoning,
            },
          });
          break;

        case 'fan_alert':
        case 'crowd_redirect':
          result.downstreamEffects.push({
            type: 'fan_alert',
            data: {
              id: `alert_${Date.now()}`,
              title: action.description,
              messages: action.multilingual_messages || {
                en: action.description,
                es: action.description_es || action.description,
                fr: action.description_fr || action.description,
              },
              urgency: action.urgency,
              zones: action.affected_zones || [],
              createdAt: new Date().toISOString(),
              source: action.agent,
              type: action.action_type,
            },
          });
          break;

        case 'gate_reallocation':
          result.downstreamEffects.push({
            type: 'gate_update',
            data: {
              gates: action.affected_gates || action.affected_zones || [],
              newStatus: action.gate_status || 'modified',
              reason: action.description,
            },
          });
          // Gate changes also generate fan alerts
          result.downstreamEffects.push({
            type: 'fan_alert',
            data: {
              id: `alert_${Date.now()}_gate`,
              title: `Gate Update: ${action.description}`,
              messages: {
                en: action.description,
                es: `Actualización de puerta: ${action.description}`,
                fr: `Mise à jour de porte: ${action.description}`,
              },
              urgency: action.urgency,
              zones: action.affected_zones || [],
              createdAt: new Date().toISOString(),
              source: 'system',
              type: 'gate_reallocation',
            },
          });
          break;

        case 'transit_stagger':
          result.downstreamEffects.push({
            type: 'fan_alert',
            data: {
              id: `alert_${Date.now()}_transit`,
              title: action.description,
              messages: action.multilingual_messages || {
                en: action.description,
                es: `Aviso de transporte: ${action.description}`,
                fr: `Avis de transport: ${action.description}`,
              },
              urgency: action.urgency,
              zones: action.affected_zones || [],
              createdAt: new Date().toISOString(),
              source: action.agent,
              type: 'transit_stagger',
            },
          });
          break;

        default:
          break;
      }
    }

    return Response.json(result);
  } catch (error) {
    console.error('Action approval error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
