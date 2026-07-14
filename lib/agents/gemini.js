/**
 * PULSE — Gemini API Client Wrapper & Mock Agent Pipeline
 */

import { GoogleGenAI } from '@google/genai';
import { 
  CROWD_FLOW_PROMPT, 
  DISPATCH_PROMPT, 
  COMMS_PROMPT, 
  TRANSIT_PROMPT, 
  ORCHESTRATOR_PROMPT 
} from './prompts';

// Initialize the Google Gen AI client if key exists and is not OpenRouter
const apiKey = process.env.GEMINI_API_KEY;
const isOpenRouter = !!(apiKey && apiKey.startsWith('sk-or-v1-'));

let aiClient = null;

if (apiKey && !isOpenRouter && !apiKey.includes('placeholder') && !apiKey.includes('your_') && apiKey.trim().length > 10) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize Google Gen AI client:', err);
  }
}

/**
 * Call Gemini 2.0 Flash with structured output (supports Google Gen AI and OpenRouter endpoints)
 */
async function callGemini(systemInstruction, userMessage, responseSchema) {
  if (isOpenRouter) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/izanakun20/PULSE',
          'X-Title': 'PULSE Command'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userMessage }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        })
      });

      if (!res.ok) {
        throw new Error(`OpenRouter returned status ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error('OpenRouter returned empty choices');
      }
      const text = data.choices[0].message.content;
      return JSON.parse(text);
    } catch (error) {
      console.error('OpenRouter API call failed:', error);
      throw error;
    }
  }

  if (!aiClient) {
    throw new Error('API Client not initialized');
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,
      }
    });

    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

// ─── Crowd Flow Specialist Agent ─────────────────────────────────
export async function callCrowdFlowAgent(events, stadiumState, phase) {
  const userPrompt = `
Match Phase: ${phase}
Active Events: ${JSON.stringify(events)}
Stadium State: ${JSON.stringify(stadiumState)}
  `;

  if (aiClient) {
    try {
      return await callGemini(CROWD_FLOW_PROMPT, userPrompt);
    } catch (e) {
      console.warn('Falling back to mock crowd-flow responses.');
    }
  }

  // MOCK FALLBACK
  const proposals = [];
  const gate7congestion = events.find(e => e.gate === 'G7' && e.severity === 'high');
  const gate4congestion = events.find(e => e.gate === 'G4' && e.severity === 'high');
  const goalSpike = events.find(e => e.phase === 'GOAL_SURGE' && e.type === 'zone_density');

  if (gate7congestion) {
    proposals.push({
      action_id: `act_crowd_reallocate_G7_${Date.now()}`,
      agent: 'crowd-flow',
      action_type: 'gate_reallocation',
      description: 'Reallocate Gate 7 inbound queue to Gate 8',
      reasoning: 'Gate 7 queue length exceeds 140 fans (wait time ~14 min). Gate 8 has 2 min wait time and shares the West Stand concourse entry.',
      affected_zones: ['west'],
      affected_gates: ['G7', 'G8'],
      urgency: 'high',
      confidence: 0.92
    });
  }

  if (gate4congestion) {
    proposals.push({
      action_id: `act_crowd_reallocate_G4_${Date.now()}`,
      agent: 'crowd-flow',
      action_type: 'gate_reallocation',
      description: 'Divert Gate 4 queue to Gate 3',
      reasoning: 'Gate 4 is experiencing high arrivals with wait times climbing to 10 mins. Gate 3 is under capacity.',
      affected_zones: ['east'],
      affected_gates: ['G3', 'G4'],
      urgency: 'medium',
      confidence: 0.85
    });
  }

  if (goalSpike) {
    proposals.push({
      action_id: `act_crowd_redirect_south_${Date.now()}`,
      agent: 'crowd-flow',
      action_type: 'crowd_redirect',
      description: 'Open South Concourse safety barriers',
      reasoning: 'Zone density in South Stand spiked to 98% following goal celebration. Opening safety barriers into the concourse will relieve lower bowl pressure.',
      affected_zones: ['south', 'concourse_s'],
      affected_gates: [],
      urgency: 'critical',
      confidence: 0.95
    });
  }

  return { proposals };
}

// ─── Dispatch Specialist Agent ──────────────────────────────────
export async function callDispatchAgent(events, stadiumState, phase) {
  const userPrompt = `
Match Phase: ${phase}
Active Events: ${JSON.stringify(events)}
Stadium State: ${JSON.stringify(stadiumState)}
  `;

  if (aiClient) {
    try {
      return await callGemini(DISPATCH_PROMPT, userPrompt);
    } catch (e) {
      console.warn('Falling back to mock dispatch responses.');
    }
  }

  // MOCK FALLBACK
  const proposals = [];
  const medicalIncident = events.find(e => e.data?.incidentType === 'medical_minor');
  const crowdSafety = events.find(e => e.data?.incidentType === 'crowd_safety');
  const gate7congestion = events.find(e => e.gate === 'G7' && e.severity === 'high');

  if (medicalIncident) {
    proposals.push({
      action_id: `act_dispatch_med_${Date.now()}`,
      agent: 'dispatch',
      action_type: 'volunteer_dispatch',
      description: `Dispatch medical volunteer to ${medicalIncident.data.location || 'Section 214'}`,
      reasoning: `Minor medical issue (heat exhaustion) reported at ${medicalIncident.data.location || 'Section 214'}. Dispatching Yuki Tanaka (medical) who is available in the East Stand.`,
      affected_zones: [medicalIncident.zone || 'east'],
      affected_gates: [],
      urgency: 'high',
      confidence: 0.98,
      target_volunteers: ['V04']
    });
  }

  // Handle lost_child reports
  const lostChildIncident = events.find(e => e.data?.incidentType === 'lost_child');
  if (lostChildIncident) {
    proposals.push({
      action_id: `act_dispatch_lost_${Date.now()}`,
      agent: 'dispatch',
      action_type: 'volunteer_dispatch',
      description: `Initiate search for Lost Child at ${lostChildIncident.data.location}`,
      reasoning: `Lost child report submitted at ${lostChildIncident.data.location}. Dispatching Amal Osei (wayfinding, North zone) and notifying MetLife Stadium Security to monitor exit gates.`,
      affected_zones: [lostChildIncident.zone || 'west'],
      affected_gates: [],
      urgency: 'high',
      confidence: 0.90,
      target_volunteers: ['V02']
    });
  }

  // Handle accessibility assistance requests
  const accessibilityIncident = events.find(e => e.data?.incidentType === 'accessibility');
  if (accessibilityIncident) {
    proposals.push({
      action_id: `act_dispatch_access_${Date.now()}`,
      agent: 'dispatch',
      action_type: 'volunteer_dispatch',
      description: `Provide accessibility assistance at ${accessibilityIncident.data.location}`,
      reasoning: `Accessibility assistance/wheelchair requested at ${accessibilityIncident.data.location}. Dispatching Fatima Al-Hassan (accessibility specialist, South zone) with assistance gear.`,
      affected_zones: [accessibilityIncident.zone || 'south'],
      affected_gates: [],
      urgency: 'medium',
      confidence: 0.95,
      target_volunteers: ['V06']
    });
  }

  // Handle facility hazards
  const hazardIncident = events.find(e => e.data?.incidentType === 'hazard');
  if (hazardIncident) {
    proposals.push({
      action_id: `act_dispatch_hazard_${Date.now()}`,
      agent: 'dispatch',
      action_type: 'volunteer_dispatch',
      description: `Resolve facility hazard at ${hazardIncident.data.location}`,
      reasoning: `Facility hazard (obstruction/spill) reported at ${hazardIncident.data.location}. Dispatching West zone steward Luca Bianchi to secure the area and clear the hazard.`,
      affected_zones: [hazardIncident.zone || 'west'],
      affected_gates: [],
      urgency: 'medium',
      confidence: 0.88,
      target_volunteers: ['V07']
    });
  }

  if (crowdSafety) {
    proposals.push({
      action_id: `act_dispatch_safety_${Date.now()}`,
      agent: 'dispatch',
      action_type: 'volunteer_dispatch',
      description: 'Deploy crowd management team (V09, V10) to South Stand Section 118',
      reasoning: 'Crowd safety incident (compression celebration surge). Dispatched concourse crowd managers to assist local gate stewards.',
      affected_zones: ['south', 'concourse_s'],
      affected_gates: [],
      urgency: 'critical',
      confidence: 0.90,
      target_volunteers: ['V09', 'V10']
    });
  }

  if (gate7congestion) {
    proposals.push({
      action_id: `act_dispatch_gate7_${Date.now()}`,
      agent: 'dispatch',
      action_type: 'volunteer_dispatch',
      description: 'Deploy wayfinding support (V08, V12) to Gate 7 queue perimeter',
      reasoning: 'Luca Bianchi (gate steward G7) reported queue overflow. Deploying Nina Petrov and Emma Johansson to assist with queue management and redirections.',
      affected_zones: ['west'],
      affected_gates: ['G7'],
      urgency: 'high',
      confidence: 0.88,
      target_volunteers: ['V08', 'V12']
    });
  }

  return { proposals };
}

// ─── Comms Specialist Agent ─────────────────────────────────────
export async function callCommsAgent(events, stadiumState, phase) {
  const userPrompt = `
Match Phase: ${phase}
Active Events: ${JSON.stringify(events)}
Stadium State: ${JSON.stringify(stadiumState)}
  `;

  if (aiClient) {
    try {
      return await callGemini(COMMS_PROMPT, userPrompt);
    } catch (e) {
      console.warn('Falling back to mock comms responses.');
    }
  }

  // MOCK FALLBACK
  const proposals = [];
  const gate7congestion = events.find(e => e.gate === 'G7' && e.severity === 'high');
  const heatAdvisory = events.find(e => e.type === 'weather_update' && e.severity === 'elevated');

  if (gate7congestion) {
    proposals.push({
      action_id: `act_comms_gate7_${Date.now()}`,
      agent: 'comms',
      action_type: 'fan_alert',
      description: 'Send Gate 7 reroute alert to West Stand attendees',
      reasoning: 'High congestion at Gate 7. Directing arriving fans to Gate 8 to balance throughput.',
      affected_zones: ['west'],
      affected_gates: ['G7'],
      urgency: 'high',
      confidence: 0.95,
      multilingual_messages: {
        en: '📢 Gate 7 is congested. For faster entry, please walk 2 minutes north to Gate 8.',
        es: '📢 La Puerta 7 está congestionada. Para un ingreso más rápido, camine 2 minutos al norte hacia la Puerta 8.',
        fr: '📢 La porte 7 est encombrée. Pour une entrée plus rapide, veuillez marcher 2 minutes vers le nord jusqu\'à la porte 8.'
      }
    });
  }

  if (heatAdvisory) {
    proposals.push({
      action_id: `act_comms_heat_${Date.now()}`,
      agent: 'comms',
      action_type: 'fan_alert',
      description: 'Send heat and hydration advisory to all stadium zones',
      reasoning: 'Weather station reported 30°C temperature with high UV index. Reminding fans of free water stations.',
      affected_zones: ['all'],
      affected_gates: [],
      urgency: 'medium',
      confidence: 0.90,
      multilingual_messages: {
        en: '☀️ Stay hydrated! Free water refill stations are located in all concourse zones.',
        es: '☀️ ¡Manténgase hidratado! Hay estaciones de agua gratuitas en todas las zonas del corredor.',
        fr: '☀️ Restez hydraté! Des fontaines d\'eau gratuites sont situées dans tous les halls.'
      }
    });
  }

  return { proposals };
}

// ─── Transit Specialist Agent ────────────────────────────────────
export async function callTransitAgent(events, stadiumState, phase) {
  const userPrompt = `
Match Phase: ${phase}
Active Events: ${JSON.stringify(events)}
Stadium State: ${JSON.stringify(stadiumState)}
  `;

  if (aiClient) {
    try {
      return await callGemini(TRANSIT_PROMPT, userPrompt);
    } catch (e) {
      console.warn('Falling back to mock transit responses.');
    }
  }

  // MOCK FALLBACK
  const proposals = [];
  const metroCongested = events.find(e => e.data?.stop === 'metro_north' && e.severity === 'critical');

  if (metroCongested) {
    proposals.push({
      action_id: `act_transit_stagger_${Date.now()}`,
      agent: 'transit',
      action_type: 'transit_stagger',
      description: 'Implement Staggered Egress: Hold North Stand egress, clear West/East stands first',
      reasoning: 'Metro North station platform is at 95% capacity. Holding North Stand stadium exits for 10 minutes will prevent dangerous overcrowding on transit platforms.',
      affected_zones: ['north'],
      affected_gates: ['G1', 'G2'],
      urgency: 'critical',
      confidence: 0.94,
      multilingual_messages: {
        en: '🚇 Transit Delay: Metro North platform is currently crowded. North gates will open shortly. Enjoy the post-match show!',
        es: '🚇 Retraso en transporte: Metro Norte está saturado. Las puertas del norte abrirán pronto. ¡Disfrute del espectáculo!',
        fr: '🚇 Retard transit: La station Métro Nord est bondée. Les portes nord ouvriront sous peu. Profitez du spectacle!'
      }
    });
  }

  return { proposals };
}

// ─── Orchestrator Coordinator Agent ──────────────────────────────
export async function callOrchestrator(proposals, stadiumState, phase) {
  const userPrompt = `
Match Phase: ${phase}
Proposals: ${JSON.stringify(proposals)}
Stadium State: ${JSON.stringify(stadiumState)}
  `;

  if (aiClient) {
    try {
      return await callGemini(ORCHESTRATOR_PROMPT, userPrompt);
    } catch (e) {
      console.warn('Falling back to local heuristic orchestrator.');
    }
  }

  // LOCAL HEURISTIC ORCHESTRATOR
  const situation_summary = proposals.length > 0 
    ? `Multiple operational conditions require coordination, including ${proposals.map(p => p.description).join(' and ')}.`
    : 'All stadium sectors are operating within nominal parameters.';

  // Resolve conflicts and rank
  const ranked_actions = [];
  
  // Sort proposals by urgency: critical > high > medium > low
  const urgencyWeight = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortedProposals = [...proposals].sort((a, b) => {
    return (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
  });

  const processedActionIds = new Set();

  sortedProposals.forEach((prop, index) => {
    if (processedActionIds.has(prop.action_id)) return;

    // Detect conflicts and merge
    const conflicts_resolved = [];
    let mergedProposal = { ...prop };

    // E.g., if we are redirecting Gate 7 (crowd-flow) and have a comms alert for Gate 7, merge them!
    if (prop.agent === 'crowd-flow' && prop.action_type === 'gate_reallocation') {
      const matchingComms = sortedProposals.find(
        p => p.agent === 'comms' && 
             p.action_type === 'fan_alert' && 
             p.affected_gates?.includes(prop.affected_gates?.[0])
      );

      if (matchingComms) {
        conflicts_resolved.push(matchingComms.action_id);
        processedActionIds.add(matchingComms.action_id);
        
        mergedProposal.description = `Gate Reallocation & Notification: Reroute Gate 7 to 8`;
        mergedProposal.reasoning = `${prop.reasoning} Coordinated with fan alert: "${matchingComms.multilingual_messages?.en}"`;
        mergedProposal.multilingual_messages = matchingComms.multilingual_messages;
      }
    }

    ranked_actions.push({
      rank: ranked_actions.length + 1,
      action_id: prop.action_id,
      proposal: mergedProposal,
      orchestrator_reasoning: `Elevated based on operational urgency (${prop.urgency}). Merged with related alerts to present a single decision to the supervisor.`,
      conflicts_resolved,
      confidence: (prop.confidence + 0.05) > 1.0 ? 1.0 : (prop.confidence + 0.05)
    });

    processedActionIds.add(prop.action_id);
  });

  return {
    situation_summary,
    ranked_actions
  };
}
