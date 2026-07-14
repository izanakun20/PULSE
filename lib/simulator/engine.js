/**
 * PULSE — Simulator Engine
 * 
 * Core event generator that runs the scripted matchday scenario.
 * Emits events at compressed time intervals via callbacks or as an async generator.
 */

import { generateMatchdayScenario } from './scenarios.js';
import { generateEventId, resetEventCounter, MATCH_PHASES } from './event-types.js';

/**
 * Create a simulator instance.
 * Returns an object with start(), pause(), resume(), stop(), and getState() methods.
 * 
 * @param {Object} options
 * @param {Function} options.onEvent - Called with each event batch: (events, phase, matchTime) => void
 * @param {Function} options.onPhaseChange - Called when match phase changes: (newPhase) => void  
 * @param {Function} options.onComplete - Called when simulation ends
 * @param {number} options.speed - Playback speed multiplier (1 = normal, 2 = 2x, etc.)
 */
export function createSimulator(options = {}) {
  const {
    onEvent = () => {},
    onPhaseChange = () => {},
    onComplete = () => {},
    speed = 1,
  } = options;

  let scenario = null;
  let currentIndex = 0;
  let startTime = null;
  let pauseTime = null;
  let pauseOffset = 0;
  let timeoutId = null;
  let currentPhase = null;
  let playbackSpeed = speed;
  let isRunning = false;
  let isPaused = false;

  function scheduleNext() {
    if (!isRunning || isPaused || currentIndex >= scenario.length) {
      if (currentIndex >= scenario.length && isRunning) {
        isRunning = false;
        onComplete();
      }
      return;
    }

    const entry = scenario[currentIndex];
    const elapsed = Date.now() - startTime - pauseOffset;
    const targetTime = entry.timeOffset / playbackSpeed;
    const delay = Math.max(0, targetTime - elapsed);

    timeoutId = setTimeout(() => {
      // Check for phase change
      const phaseId = entry.phase;
      if (phaseId !== currentPhase) {
        currentPhase = phaseId;
        onPhaseChange(MATCH_PHASES[phaseId] || { id: phaseId, label: phaseId });
      }

      // Emit events with IDs and timestamps
      const events = entry.events.map(evt => ({
        ...evt,
        id: generateEventId(),
        timestamp: new Date().toISOString(),
        phase: phaseId,
      }));

      onEvent(events, phaseId, entry.timeOffset);

      currentIndex++;
      scheduleNext();
    }, delay);
  }

  return {
    start() {
      resetEventCounter();
      scenario = generateMatchdayScenario();
      currentIndex = 0;
      startTime = Date.now();
      pauseOffset = 0;
      currentPhase = null;
      isRunning = true;
      isPaused = false;
      scheduleNext();
    },

    pause() {
      if (!isRunning || isPaused) return;
      isPaused = true;
      pauseTime = Date.now();
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },

    resume() {
      if (!isRunning || !isPaused) return;
      isPaused = false;
      pauseOffset += Date.now() - pauseTime;
      scheduleNext();
    },

    stop() {
      isRunning = false;
      isPaused = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },

    setSpeed(newSpeed) {
      const wasRunning = isRunning && !isPaused;
      if (wasRunning) {
        // Recalculate timing with new speed
        const elapsed = Date.now() - startTime - pauseOffset;
        pauseOffset = 0;
        startTime = Date.now() - elapsed * (playbackSpeed / newSpeed);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }
      playbackSpeed = newSpeed;
      if (wasRunning) {
        scheduleNext();
      }
    },

    getState() {
      return {
        isRunning,
        isPaused,
        currentPhase: currentPhase ? MATCH_PHASES[currentPhase] : null,
        progress: scenario ? currentIndex / scenario.length : 0,
        currentIndex,
        totalEvents: scenario ? scenario.length : 0,
        speed: playbackSpeed,
      };
    },
  };
}

/**
 * Async generator version for SSE streaming.
 * Yields event batches with proper timing.
 */
export async function* simulatorStream(speed = 1) {
  resetEventCounter();
  const scenario = generateMatchdayScenario();
  let currentPhase = null;

  for (let i = 0; i < scenario.length; i++) {
    const entry = scenario[i];

    // Wait for the appropriate delay between events
    if (i > 0) {
      const delay = (entry.timeOffset - scenario[i - 1].timeOffset) / speed;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Check for phase change
    const phaseId = entry.phase;
    const phaseChanged = phaseId !== currentPhase;
    if (phaseChanged) {
      currentPhase = phaseId;
    }

    // Emit events with IDs
    const events = entry.events.map(evt => ({
      ...evt,
      id: generateEventId(),
      timestamp: new Date().toISOString(),
      phase: phaseId,
    }));

    yield {
      events,
      phase: MATCH_PHASES[phaseId] || { id: phaseId, label: phaseId },
      phaseChanged,
      matchTimeOffset: entry.timeOffset,
      progress: (i + 1) / scenario.length,
    };
  }
}
