/**
 * StadiumOPS — Operations Command Center Page
 */

'use client';

import SimulatorControls from '@/components/command/SimulatorControls';
import ZoneOverview from '@/components/command/ZoneOverview';
import ProposalQueue from '@/components/command/ProposalQueue';
import EventFeed from '@/components/command/EventFeed';
import WorkflowTracker from '@/components/ui/WorkflowTracker';

export default function CommandPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 95px)', overflow: 'hidden' }}>
      {/* Simulation Master Controller bar */}
      <SimulatorControls />

      {/* Dynamic Workflow pipeline tracker */}
      <div style={{ padding: '0 20px 10px 20px' }}>
        <WorkflowTracker />
      </div>

      {/* Primary Operations Dashboard Grid */}
      <div className="command-grid" style={{ flex: 1, minHeight: 0 }}>
        {/* Left Column: Stand & Gate Metrics */}
        <section className="command-col">
          <ZoneOverview />
        </section>

        {/* Center Column: AI Decision Pipeline */}
        <section className="command-col">
          <ProposalQueue />
        </section>

        {/* Right Column: Live Event Stream */}
        <section className="command-col">
          <EventFeed />
        </section>
      </div>
    </div>
  );
}
