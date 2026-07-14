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
  const speed = parseFloat(searchParams.get('speed') || '1');

  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const batch of simulatorStream(speed)) {
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
