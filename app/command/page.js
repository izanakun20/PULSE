/**
 * PULSE — Command Center Page
 */

'use client';

import SimulatorControls from '@/components/command/SimulatorControls';
import ZoneOverview from '@/components/command/ZoneOverview';
import ProposalQueue from '@/components/command/ProposalQueue';
import EventFeed from '@/components/command/EventFeed';

export default function CommandPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>
      {/* Simulation Master Controller bar */}
      <SimulatorControls />

      {/* Primary Broadcast Dashboard Grid */}
      <div className="command-grid">
        {/* Left Column: Stand & Gate Metrics */}
        <section style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <ZoneOverview />
        </section>

        {/* Center Column: AI Proposals Queue */}
        <section style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <ProposalQueue />
        </section>

        {/* Right Column: Live Event Ingestion Logger */}
        <section style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <EventFeed />
        </section>
      </div>
    </div>
  );
}
