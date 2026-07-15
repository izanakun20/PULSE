/**
 * StadiumOPS — API Route: Chat with StadiumIQ
 * Securely calls the Gemini API on the server side using GEMINI_API_KEY
 */

import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const isOpenRouter = !!(apiKey && apiKey.startsWith('sk-or-v1-'));

let aiClient = null;

if (apiKey && !isOpenRouter && !apiKey.includes('placeholder') && !apiKey.includes('your_') && apiKey.trim().length > 10) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize Google Gen AI client inside chat route:', err);
  }
}

export async function POST(request) {
  try {
    const { message, matchContext } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message query is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemInstruction = `
You are StadiumIQ, the GenAI Matchday Intelligence Assistant for the FIFA World Cup 2026.
You are assisting a fan named Siddharth (Fan ID: F123456) who is currently attending the match:
${matchContext ? `${matchContext.home} vs ${matchContext.away} at ${matchContext.venue} (${matchContext.city})` : 'a World Cup fixture'}.

Provide extremely helpful, stadium-operations-centric answers. Assist with:
- Navigation & Gate routing (Gate 1/2 for North Stand, 3/4 for East Stand, 5/6 for South Stand, 7/8 for West Stand).
- Queue wait time estimations (busy vs nominal).
- Accessibility routes (ramps, sensory quiet guides, elevator bank at Sec 102).
- Staggered egress transport Loop buses and Metro North schedule loops.
- Concessions, food options, water refill stations, first aid locations (Sec 120).

Keep answers brief (1-3 sentences) and highly professional. Tone should resemble Stripe, Apple, or OpenAI assistant.
`;

    let replyContent = '';

    // 1. Check if OpenRouter key
    if (isOpenRouter) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/izanakun20/PULSE',
          'X-Title': 'PULSE Chat'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: message }
          ],
          temperature: 0.2,
        })
      });

      if (res.ok) {
        const data = await res.json();
        replyContent = data.choices?.[0]?.message?.content || '';
      }
    } 
    // 2. Check if native Google Gen AI client initialized
    else if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });
      replyContent = response.text || '';
    }

    // 3. Fallback response if no API keys are active or request fails
    if (!replyContent) {
      replyContent = getMockResponse(message, matchContext);
    }

    return new Response(JSON.stringify({ response: replyContent }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error inside /api/chat route:', error);
    return new Response(JSON.stringify({ error: 'Failed to process AI chat query' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fallback simulator AI logic
function getMockResponse(query, context) {
  const queryLower = query.toLowerCase();
  const venue = context?.venue || 'stadium';

  if (queryLower.includes('gate') || queryLower.includes('entry')) {
    return `🚪 StadiumIQ: Entering ${venue} is easiest through Gates 1 & 2 for North stand seats, and Gates 3 & 4 for East stand seats. Current average queue wait is under 3 minutes.`;
  } else if (queryLower.includes('water') || queryLower.includes('drink') || queryLower.includes('food')) {
    return `🌱 StadiumIQ Sustainability: Eco-water refilling counters are situated at Concourse North (Sec 112) and Concourse South (Sec 232). Recycling bins are placed in all food zones.`;
  } else if (queryLower.includes('transit') || queryLower.includes('metro') || queryLower.includes('bus') || queryLower.includes('train')) {
    return `🚇 StadiumIQ Transport: Metro North platforms are running at normal load. Shuttles depart every 5 minutes. Egress staggered releases are active to avoid platforms cluttering.`;
  } else if (queryLower.includes('weather') || queryLower.includes('rain')) {
    return `☀️ StadiumIQ: Live weather is 28°C and Sunny. High UV index, we advise visiting Concourse North shade zones and drinking plenty of water.`;
  } else if (queryLower.includes('accessibility') || queryLower.includes('wheelchair') || queryLower.includes('sensory')) {
    return `♿ StadiumIQ: Disabled access routes are active at East Gate 3. Elevator banks are fully functional behind Section 102. You can request a live steward guide via the Accessibility tab.`;
  }
  return `🤖 StadiumIQ: I am monitoring live operations at ${venue}. Let me know if you need assistance with gate navigation, transport, or accessibility.`;
}
