/**
 * PULSE — Simulator SSE Streaming Endpoint
 * 
 * GET /api/simulator — Starts streaming matchday events via Server-Sent Events
 * Query params:
 *   speed: playback speed multiplier (default: 1)
 */

import { simulatorStream } from '@/lib/simulator/engine';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Parse and validate speed parameter
  let speed = parseFloat(searchParams.get('speed') || '1');
  if (isNaN(speed) || speed <= 0 || speed > 100) {
    speed = 1.0;
  }

  // Parse and validate startIndex parameter
  let startIndex = parseInt(searchParams.get('startIndex') || '0', 10);
  if (isNaN(startIndex) || startIndex < 0 || startIndex > 1000) {
    startIndex = 0;
  }

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const batch of simulatorStream(speed, startIndex)) {
          const data = JSON.stringify(batch);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        // Signal completion
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ complete: true })}\n\n`));
        controller.close();
      } catch (error) {
        console.error('Simulator stream error:', error);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
