/**
 * PULSE — Agent Schema Definitions & Types
 */

export const AGENT_TYPES = {
  CROWD_FLOW: { id: 'crowd-flow', label: 'Crowd Flow', color: '#3b82f6', icon: '👥' },
  DISPATCH: { id: 'dispatch', label: 'Dispatch', color: '#f59e0b', icon: '📋' },
  COMMS: { id: 'comms', label: 'Comms', color: '#22c55e', icon: '📢' },
  TRANSIT: { id: 'transit', label: 'Transit', color: '#8b5cf6', icon: '🚇' }
};

export const ACTION_TYPES = {
  GATE_REALLOCATION: 'gate_reallocation',
  VOLUNTEER_DISPATCH: 'volunteer_dispatch',
  FAN_ALERT: 'fan_alert',
  TRANSIT_STAGGER: 'transit_stagger',
  CROWD_REDIRECT: 'crowd_redirect',
  EMERGENCY_RESPONSE: 'emergency_response'
};

export const URGENCY_LEVELS = ['low', 'medium', 'high', 'critical'];

// Gemini JSON schemas for structured output
export const specialistProposalSchema = {
  type: 'OBJECT',
  properties: {
    proposals: {
      type: 'ARRAY',
      description: 'List of operational proposals proposed by this specialist agent.',
      items: {
        type: 'OBJECT',
        properties: {
          action_id: { type: 'STRING', description: 'Unique action identifier, e.g. act_crowd_001' },
          agent: { type: 'STRING', enum: ['crowd-flow', 'dispatch', 'comms', 'transit'] },
          action_type: { type: 'STRING', enum: Object.values(ACTION_TYPES) },
          description: { type: 'STRING', description: 'Clear action summary for Command Center operator review.' },
          reasoning: { type: 'STRING', description: 'Detailed reasoning justifying the action.' },
          affected_zones: { 
            type: 'ARRAY', 
            items: { type: 'STRING' },
            description: 'List of stadium zones affected, e.g. ["north", "west"]'
          },
          affected_gates: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'List of gates affected, e.g. ["G7"]'
          },
          urgency: { type: 'STRING', enum: URGENCY_LEVELS },
          confidence: { type: 'NUMBER', description: 'Confidence score between 0.0 and 1.0.' },
          target_volunteers: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: 'List of volunteer IDs to assign or redeploy, e.g. ["V07"]'
          },
          multilingual_messages: {
            type: 'OBJECT',
            properties: {
              en: { type: 'STRING', description: 'English translation of the fan alert.' },
              es: { type: 'STRING', description: 'Spanish translation of the fan alert.' },
              fr: { type: 'STRING', description: 'French translation of the fan alert.' }
            },
            required: ['en', 'es', 'fr']
          }
        },
        required: ['action_id', 'agent', 'action_type', 'description', 'reasoning', 'urgency', 'confidence']
      }
    }
  },
  required: ['proposals']
};

export const orchestratorOutputSchema = {
  type: 'OBJECT',
  properties: {
    situation_summary: { type: 'STRING', description: 'Overall summary of the stadium operational status.' },
    ranked_actions: {
      type: 'ARRAY',
      description: 'A list of proposals resolved, deduplicated, and ranked by priority.',
      items: {
        type: 'OBJECT',
        properties: {
          rank: { type: 'INTEGER', description: 'Numerical ranking starting at 1.' },
          action_id: { type: 'STRING', description: 'Unique action identifier corresponding to the original proposal.' },
          proposal: {
            type: 'OBJECT',
            properties: {
              action_id: { type: 'STRING' },
              agent: { type: 'STRING' },
              action_type: { type: 'STRING' },
              description: { type: 'STRING' },
              reasoning: { type: 'STRING' },
              affected_zones: { type: 'ARRAY', items: { type: 'STRING' } },
              affected_gates: { type: 'ARRAY', items: { type: 'STRING' } },
              urgency: { type: 'STRING' },
              confidence: { type: 'NUMBER' },
              target_volunteers: { type: 'ARRAY', items: { type: 'STRING' } },
              multilingual_messages: {
                type: 'OBJECT',
                properties: {
                  en: { type: 'STRING' },
                  es: { type: 'STRING' },
                  fr: { type: 'STRING' }
                }
              }
            }
          },
          orchestrator_reasoning: { type: 'STRING', description: 'Why this item was ranked here and how conflicts were resolved.' },
          conflicts_resolved: { 
            type: 'ARRAY', 
            items: { type: 'STRING' },
            description: 'List of other action IDs that conflicted with this item and were superseded or integrated.'
          },
          confidence: { type: 'NUMBER', description: 'Overall combined confidence score.' }
        },
        required: ['rank', 'action_id', 'proposal', 'orchestrator_reasoning', 'confidence']
      }
    }
  },
  required: ['situation_summary', 'ranked_actions']
};
