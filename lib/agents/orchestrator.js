/**
 * PULSE — Orchestration Layer Helper
 */

import { callOrchestrator } from './gemini';

export async function orchestrateProposals(proposals, stadiumState, phase) {
  return await callOrchestrator(proposals, stadiumState, phase);
}
