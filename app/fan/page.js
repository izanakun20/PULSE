/**
 * StadiumOPS — Fan Portal Page
 * Personalized AI matchday utilities powered by StadiumIQ
 */

'use client';

import { useState } from 'react';
import { usePulse } from '@/lib/store';
import AlertCard from '@/components/fan/AlertCard';
import GateInfo from '@/components/fan/GateInfo';
import IncidentReport from '@/components/fan/IncidentReport';
import { TODAY_MATCHES } from '@/lib/constants';

export default function FanPage() {
  const { state, dispatch } = usePulse();
  const { fanAlerts, simulationState, approvedActions, currentHostCity, currentVenue, currentMatchId } = state;
  const [activeTab, setActiveTab] = useState('home');

  // Interactive AI states
  const [activeTool, setActiveTool] = useState(null);
  
  // Find My Gate states
  const [findGateSection, setFindGateSection] = useState('100');
  const [findGateResult, setFindGateResult] = useState('');

  // Plan Journey states
  const [journeyMode, setJourneyMode] = useState('metro');
  const [journeyResult, setJourneyResult] = useState('');

  // Check Queue states
  const [selectedGate, setSelectedGate] = useState('G3');
  const [queueResult, setQueueResult] = useState('');

  // Translation states
  const [announcementToTranslate, setAnnouncementToTranslate] = useState('');
  const [translationResult, setTranslationResult] = useState('');

  // Food & Services states
  const [foodSelection, setFoodSelection] = useState('water');
  const [foodResult, setFoodResult] = useState('');

  // Accessibility states
  const [assistanceType, setAssistanceType] = useState('wheelchair');
  const [accSuccess, setAccSuccess] = useState(false);

  // Emergency help states
  const [emergencyLevel, setEmergencyLevel] = useState('minor');
  const [emergencySuccess, setEmergencySuccess] = useState(false);

  // Find active match details
  const activeMatch = TODAY_MATCHES.find(m => m.id === currentMatchId) || TODAY_MATCHES[0];
  const latestApproved = approvedActions[approvedActions.length - 1];

  const handleMatchChange = (e) => {
    const selectedId = e.target.value;
    const match = TODAY_MATCHES.find(m => m.id === selectedId);
    if (match) {
      dispatch({
        type: 'SET_TOURNAMENT_CONTEXT',
        payload: {
          hostCity: match.city,
          venue: match.venue,
          matchId: match.id
        }
      });
      // Clear interactive tools state on match change
      setActiveTool(null);
      setFindGateResult('');
      setJourneyResult('');
      setQueueResult('');
      setTranslationResult('');
      setFoodResult('');
      setAccSuccess(false);
      setEmergencySuccess(false);
    }
  };

  // 1. Plan Journey AI logic
  const handlePlanJourney = () => {
    if (journeyMode === 'metro') {
      setJourneyResult(`🚇 StadiumIQ Transit Plan: Egress release at ${activeMatch.venue} is staggered. Staggered releases are in place for the North and West stands. Platform wait at Metro North Station is estimated at 8 minutes. We recommend waiting in the concourse for 10 minutes post-match.`);
    } else if (journeyMode === 'bus') {
      setJourneyResult(`🚌 StadiumIQ Bus Plan: East Bus Terminal is operating at 60% capacity. Express shuttle loops are departing every 5 minutes from Gate 4 outer perimeter.`);
    } else {
      setJourneyResult(`🚗 StadiumIQ Rideshare Plan: Designated pick-up is at Zone F (South Concourse outer lot). Standard city traffic delays apply; wait times are estimated at 18 minutes.`);
    }
  };

  // 2. Find My Gate AI logic
  const handleFindGate = () => {
    const sectionNum = parseInt(findGateSection, 10);
    if (isNaN(sectionNum)) {
      setFindGateResult('❌ Invalid section format. Please input a numerical section number.');
      return;
    }
    
    if (sectionNum >= 100 && sectionNum <= 150) {
      setFindGateResult(`🧭 StadiumIQ Route: Section ${sectionNum} is in the Lower Bowl (North Stand). Enter through Gate 1 or Gate 2. Current queue wait time: <2 minutes.`);
    } else if (sectionNum >= 200 && sectionNum <= 250) {
      setFindGateResult(`🧭 StadiumIQ Route: Section ${sectionNum} is in the Upper Bowl (East Stand). Enter through Gate 3 or Gate 4. Current queue wait time: <3 minutes.`);
    } else if (sectionNum >= 300 && sectionNum <= 350) {
      setFindGateResult(`🧭 StadiumIQ Route: Section ${sectionNum} is in the South Stand. Enter through Gate 5 or Gate 6. Current queue wait time: 5 minutes.`);
    } else {
      setFindGateResult(`🧭 StadiumIQ Route: Section ${sectionNum} is in the West Stand concourse. Enter through Gate 7 or Gate 8. Current queue wait time: 4 minutes.`);
    }
  };

  // 3. Check Queue Times AI logic
  const handleCheckQueue = () => {
    if (selectedGate === 'G7' || selectedGate === 'G8') {
      setQueueResult(`🚶 StadiumIQ Queue Status for ${selectedGate}: Busy (approx. 110 fans in queue, wait time: 11 minutes). We recommend walking 2 minutes north to Gate 1/2 for faster entry.`);
    } else if (selectedGate === 'G3' || selectedGate === 'G4') {
      setQueueResult(`🚶 StadiumIQ Queue Status for ${selectedGate}: Normal (approx. 40 fans in queue, wait time: 3 minutes). Flow is operating efficiently.`);
    } else {
      setQueueResult(`🚶 StadiumIQ Queue Status for ${selectedGate}: Clear (approx. 10 fans in queue, wait time: <2 minutes). Immediate scanning active.`);
    }
  };

  // 4. Translate Announcement AI logic
  const handleTranslateAnnouncement = () => {
    if (!announcementToTranslate.trim()) return;
    setTranslationResult(`🌍 Translated by StadiumIQ:
• [ES]: ${translateToSpanish(announcementToTranslate)}
• [FR]: ${translateToFrench(announcementToTranslate)}`);
  };

  const translateToSpanish = (text) => {
    if (text.toLowerCase().includes('congested')) return 'La puerta está congestionada. Use accesos alternativos.';
    if (text.toLowerCase().includes('closed')) return 'La puerta está cerrada temporalmente.';
    return `[ES] ${text}`;
  };

  const translateToFrench = (text) => {
    if (text.toLowerCase().includes('congested')) return 'La porte est encombrée. Veuillez utiliser d’autres entrées.';
    if (text.toLowerCase().includes('closed')) return 'La porte est temporairement fermée.';
    return `[FR] ${text}`;
  };

  // 5. Food Nearby AI logic
  const handleFoodNearby = () => {
    if (foodSelection === 'water') {
      setFoodResult(`🌱 StadiumIQ Sustainability Map: Free ecological water refilling station located directly in Concourse North near Section 112, and Concourse South near Section 232.`);
    } else if (foodSelection === 'firstaid') {
      setFoodResult(`➕ StadiumIQ Emergency Services: First Aid post is located in the East Stand concourse behind Section 120. Medical stewards are available in all sectors.`);
    } else {
      setFoodResult(`🌭 StadiumIQ Concessions Map: Food courts and recycling waste bins are located at East Concourse (Section 118) and West Concourse (Section 144).`);
    }
  };

  // 6. Accessibility Support AI logic
  const handleRequestAccessibility = () => {
    setAccSuccess(true);
    // Dispatch a volunteer task for help
    dispatch({
      type: 'ADD_VOLUNTEER_TASK',
      payload: {
        id: `task_acc_${Date.now()}`,
        title: `Dispatch Accessibility Aid: Assist fan with ${assistanceType} request`,
        zone: 'east',
        priority: 'high',
        assignedTo: ['V06'],
        status: 'pending',
        createdAt: new Date().toISOString(),
        source: 'dispatch',
        description: `Steward requested to coordinate wheelchair/sensory escort at East Concourse Gate 3 entrance.`
      }
    });
  };

  // 7. Emergency Help AI logic
  const handleTriggerEmergency = () => {
    setEmergencySuccess(true);
    // Dispatch urgent safety task
    dispatch({
      type: 'ADD_VOLUNTEER_TASK',
      payload: {
        id: `task_emerg_${Date.now()}`,
        title: `URGENT: Dispatch Medical/Safety team`,
        zone: 'west',
        priority: 'critical',
        assignedTo: ['V04', 'V11'],
        status: 'pending',
        createdAt: new Date().toISOString(),
        source: 'dispatch',
        description: `Urgent fan report submitted. Dispatching medical and safety stewards to West stand concourse immediately.`
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* ── MY MATCH & TODAY'S FIXTURE SELECTOR ── */}
      <div 
        className="panel"
        style={{ 
          background: 'var(--bg-surface)',
          padding: '16px', 
          border: '1px solid var(--border)',
          borderRadius: '10px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--success)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            FIFA World Cup 2026 • My Match
          </span>
        </div>

        <select
          value={currentMatchId}
          onChange={handleMatchChange}
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '14px',
            padding: '6px 12px',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            marginBottom: '8px'
          }}
        >
          {TODAY_MATCHES.map(m => (
            <option key={m.id} value={m.id}>
              {m.home.toUpperCase()} vs {m.away.toUpperCase()} ({m.venue})
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-status-live" style={{ fontSize: '10px' }}>
            {simulationState.phaseLabel.toUpperCase()}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {Math.floor(simulationState.elapsedSeconds / 60)}&apos;
          </span>
        </div>
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
        {[
          { id: 'home', label: 'Matchday', icon: '🏟️' },
          { id: 'alerts', label: 'AI Alerts', icon: '📢', badge: fanAlerts.length },
          { id: 'gates', label: 'Gates', icon: '🎫' },
          { id: 'report', label: 'Report', icon: '⚠️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 4px',
              background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
              border: activeTab === tab.id ? '1px solid var(--border-light)' : 'none',
              borderRadius: '6px',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: activeTab === tab.id ? 'bold' : '500',
              cursor: 'pointer',
              outline: 'none',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: '16px', marginBottom: '2px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '12px',
                backgroundColor: 'var(--critical)',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ minHeight: '300px' }}>
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* StadiumIQ AI Assistant Personalized Guidelines */}
            <div className="panel-ai" style={{ borderLeftColor: 'var(--success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px' }}>🤖</span>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>StadiumIQ Assistant</strong>
                <span className="badge badge-ai" style={{ fontSize: '9px' }}>Live at {currentVenue}</span>
              </div>
              
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>📍 Host Venue:</strong> {currentVenue} ({currentHostCity})</div>
                <div><strong>☀️ Weather:</strong> 25°C, Sunny. UV Index: Moderate. Stay hydrated.</div>
                <p style={{ margin: '4px 0 0 0', lineHeight: '1.4' }}>
                  {latestApproved ? (
                    `💡 Active Recommendation: ${latestApproved.proposal.description} — approved by operations leads. Alternate routing and wayfinding teams deployed to assist you.`
                  ) : (
                    "I am monitoring gate wait times, local transport loads, and weather events. I will broadcast alerts and smart routing guidelines here as matchday develops."
                  )}
                </p>
              </div>
            </div>

            {/* ── INTERACTIVE AI UTILITIES GRID (USEFUL ACTIONS) ── */}
            <div className="panel" style={{ padding: '15px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text-primary)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Interactive Matchday Tools
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { id: 'gate', label: 'Find My Gate', icon: '🧭' },
                  { id: 'journey', label: 'Plan My Journey', icon: '🚇' },
                  { id: 'queue', label: 'Check Queue Times', icon: '🚶' },
                  { id: 'translate', label: 'Translate Broadcast', icon: '🌍' },
                  { id: 'food', label: 'Food & Services', icon: '🌭' },
                  { id: 'access', label: 'Accessibility Support', icon: '♿' },
                  { id: 'emergency', label: 'Emergency Help', icon: '🚨' }
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                    className="btn btn-outline"
                    style={{
                      justifyContent: 'flex-start',
                      fontSize: '12px',
                      padding: '10px 12px',
                      background: activeTool === tool.id ? 'var(--bg-hover)' : 'transparent',
                      borderColor: activeTool === tool.id ? 'var(--ai-blue)' : 'var(--border)'
                    }}
                  >
                    <span style={{ fontSize: '15px' }}>{tool.icon}</span>
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>

              {/* ── TOOL PANEL EXPANSIONS ── */}
              {activeTool && (
                <div className="panel-elevated animate-in" style={{ marginTop: '15px', padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  
                  {/* TOOL 1: FIND MY GATE */}
                  {activeTool === 'gate' && (
                    <div>
                      <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>FIND MY ENTRY GATE</strong>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input
                          type="text"
                          value={findGateSection}
                          onChange={(e) => setFindGateSection(e.target.value)}
                          placeholder="Enter seat section, e.g. 214"
                          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={handleFindGate}>Find Gate</button>
                      </div>
                      {findGateResult && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{findGateResult}</p>
                      )}
                    </div>
                  )}

                  {/* TOOL 2: PLAN JOURNEY */}
                  {activeTool === 'journey' && (
                    <div>
                      <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>PLAN MY JOURNEY</strong>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <select
                          value={journeyMode}
                          onChange={(e) => setJourneyMode(e.target.value)}
                          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="metro">Metro / Train Station</option>
                          <option value="bus">Express Shuttle Bus</option>
                          <option value="rideshare">Rideshare Pick-up Zone</option>
                        </select>
                        <button className="btn btn-primary btn-sm" onClick={handlePlanJourney}>Plan Trip</button>
                      </div>
                      {journeyResult && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{journeyResult}</p>
                      )}
                    </div>
                  )}

                  {/* TOOL 3: CHECK QUEUE */}
                  {activeTool === 'queue' && (
                    <div>
                      <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>CHECK QUEUE TIMES</strong>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <select
                          value={selectedGate}
                          onChange={(e) => setSelectedGate(e.target.value)}
                          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="G1">Gate 1 (North)</option>
                          <option value="G2">Gate 2 (North)</option>
                          <option value="G3">Gate 3 (East)</option>
                          <option value="G4">Gate 4 (East)</option>
                          <option value="G5">Gate 5 (South)</option>
                          <option value="G6">Gate 6 (South)</option>
                          <option value="G7">Gate 7 (West)</option>
                          <option value="G8">Gate 8 (West)</option>
                        </select>
                        <button className="btn btn-primary btn-sm" onClick={handleCheckQueue}>Check Queue</button>
                      </div>
                      {queueResult && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{queueResult}</p>
                      )}
                    </div>
                  )}

                  {/* TOOL 4: TRANSLATE BROADCAST */}
                  {activeTool === 'translate' && (
                    <div>
                      <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>TRANSLATE ANNOUNCEMENT</strong>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input
                          type="text"
                          value={announcementToTranslate}
                          onChange={(e) => setAnnouncementToTranslate(e.target.value)}
                          placeholder="Paste announcement here..."
                          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={handleTranslateAnnouncement}>Translate</button>
                      </div>
                      {translationResult && (
                        <pre style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{translationResult}</pre>
                      )}
                    </div>
                  )}

                  {/* TOOL 5: FOOD & SERVICES */}
                  {activeTool === 'food' && (
                    <div>
                      <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>LOCATE SERVICES NEARBY</strong>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <select
                          value={foodSelection}
                          onChange={(e) => setFoodSelection(e.target.value)}
                          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="water">Eco Water Refill Stations</option>
                          <option value="firstaid">First Aid & Medical Posts</option>
                          <option value="concessions">Food Court & Recycling Bins</option>
                        </select>
                        <button className="btn btn-primary btn-sm" onClick={handleFoodNearby}>Locate</button>
                      </div>
                      {foodResult && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{foodResult}</p>
                      )}
                    </div>
                  )}

                  {/* TOOL 6: ACCESSIBILITY SUPPORT */}
                  {activeTool === 'access' && (
                    <div>
                      <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>REQUEST ACCESSIBILITY ESCORT</strong>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <select
                          value={assistanceType}
                          onChange={(e) => setAssistanceType(e.target.value)}
                          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="wheelchair">Wheelchair Assistance</option>
                          <option value="sensory">Sensory Guide escort</option>
                          <option value="visual">Visual Aid support</option>
                        </select>
                        <button className="btn btn-approve btn-sm" onClick={handleRequestAccessibility}>Request Guide</button>
                      </div>
                      {accSuccess && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--success)', fontWeight: 'bold' }}>
                          ✓ Accessibility steward request successfully dispatched. A volunteer will meet you at the nearest gate soon.
                        </p>
                      )}
                    </div>
                  )}

                  {/* TOOL 7: EMERGENCY HELP */}
                  {activeTool === 'emergency' && (
                    <div>
                      <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: 'var(--critical)' }}>🚨 TRIGGER EMERGENCY RESPONSE</strong>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <select
                          value={emergencyLevel}
                          onChange={(e) => setEmergencyLevel(e.target.value)}
                          style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="minor">Minor Medical (Spill / Heat exhaustion)</option>
                          <option value="hazard">Concourse Hazard / Slip / Spill</option>
                          <option value="lost">Lost Child / Separated Companion</option>
                        </select>
                        <button className="btn btn-danger btn-sm" onClick={handleTriggerEmergency}>Request Help</button>
                      </div>
                      {emergencySuccess && (
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--critical)', fontWeight: 'bold' }}>
                          ⚠️ Emergency dispatch active! StadiumIQ has alerted nearby medical and safety volunteers to check your sector.
                        </p>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Custom SVG wayfinding diagram */}
            <div className="panel" style={{ padding: '15px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--text-primary)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                WAYFINDING MAP
              </h2>
              
              <div style={{ width: '100%', height: '180px', background: 'var(--bg-elevated)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                <svg width="220" height="150" viewBox="0 0 220 150">
                  <ellipse cx="110" cy="75" rx="90" ry="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <ellipse cx="110" cy="75" rx="60" ry="35" fill="none" stroke="rgba(52, 211, 153, 0.15)" strokeWidth="3" />
                  <rect x="85" y="58" width="50" height="34" fill="var(--bg-surface)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <circle cx="110" cy="15" r="4" fill="var(--success)" /><text x="110" y="8" fill="var(--text-muted)" fontSize="8" textAnchor="middle">G1/G2</text>
                  <circle cx="200" cy="75" r="4" fill="var(--success)" /><text x="212" y="78" fill="var(--text-muted)" fontSize="8" textAnchor="start">G3/G4</text>
                  <circle cx="110" cy="135" r="4" fill="var(--success)" /><text x="110" y="146" fill="var(--text-muted)" fontSize="8" textAnchor="middle">G5/G6</text>
                  <circle cx="20" cy="75" r="4" fill="var(--success)" /><text x="8" y="78" fill="var(--text-muted)" fontSize="8" textAnchor="end">G7/G8</text>
                  
                  <path d="M 200 75 Q 160 75 140 75" fill="none" stroke="var(--warning)" strokeWidth="2.5" strokeDasharray="4 2" />
                  <circle cx="140" cy="75" r="3.5" fill="var(--warning)" />
                </svg>
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '9px', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  StadiumIQ Wayfinding Active
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="panel-ai" style={{ borderLeftColor: 'var(--ai-blue)', padding: '10px 15px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                ℹ️ StadiumIQ AI Alerts Feed
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'var(--text-muted)' }}>
                Real-time translations are processed automatically.
              </p>
            </div>
            
            {fanAlerts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '50px 20px', 
                border: '1px dashed var(--border)', 
                borderRadius: '8px',
                color: 'var(--text-muted)'
              }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🔔</span>
                <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '13px' }}>NO ACTIVE BROADCASTS</h3>
                <p style={{ margin: 0, fontSize: '11px' }}>AI-generated route updates and weather alerts will appear here.</p>
              </div>
            ) : (
              fanAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            )}
          </div>
        )}

        {activeTab === 'gates' && (
          <GateInfo />
        )}

        {activeTab === 'report' && (
          <IncidentReport />
        )}
      </div>
    </div>
  );
}
