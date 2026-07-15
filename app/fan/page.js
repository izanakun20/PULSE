/**
 * StadiumOPS — Fan Portal Page
 * Transformed into an AI-powered matchday companion: Apple / FIFA+ / Google Maps aesthetic.
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
  const [findGateSection, setFindGateSection] = useState('118');
  const [findGateResult, setFindGateResult] = useState('');

  // Plan Journey states
  const [journeyMode, setJourneyMode] = useState('metro');
  const [journeyResult, setJourneyResult] = useState('');

  // Check Queue states
  const [selectedGate, setSelectedGate] = useState('G3');
  const [queueResult, setQueueResult] = useState('');

  // Translation states
  const [phraseToTranslate, setPhraseToTranslate] = useState('');
  const [translationOutput, setTranslationOutput] = useState('');

  // Food & Services states
  const [foodSelection, setFoodSelection] = useState('water');
  const [foodResult, setFoodResult] = useState('');

  // Accessibility states
  const [assistanceType, setAssistanceType] = useState('wheelchair');
  const [accSuccess, setAccSuccess] = useState(false);

  // Emergency help states
  const [emergencyLevel, setEmergencyLevel] = useState('minor');
  const [emergencySuccess, setEmergencySuccess] = useState(false);

  // StadiumIQ Chat overlay states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Hi Siddharth! I am StadiumIQ, your FIFA World Cup 2026 matchday assistant. Ask me anything about gate directions, queue times, or transport.' }
  ]);

  // Explore Stadium active cards
  const [selectedExploreCard, setSelectedExploreCard] = useState(null);

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
      // Clear states
      setActiveTool(null);
      setFindGateResult('');
      setJourneyResult('');
      setQueueResult('');
      setTranslationOutput('');
      setFoodResult('');
      setAccSuccess(false);
      setEmergencySuccess(false);
      setSelectedExploreCard(null);
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

  // 4. Food Nearby AI logic
  const handleFoodNearby = () => {
    if (foodSelection === 'water') {
      setFoodResult(`🌱 StadiumIQ Sustainability Map: Free ecological water refilling station located directly in Concourse North near Section 112, and Concourse South near Section 232.`);
    } else if (foodSelection === 'firstaid') {
      setFoodResult(`➕ StadiumIQ Emergency Services: First Aid post is located in the East Stand concourse behind Section 120. Medical stewards are available in all sectors.`);
    } else {
      setFoodResult(`🌭 StadiumIQ Concessions Map: Food courts and recycling waste bins are located at East Concourse (Section 118) and West Concourse (Section 144).`);
    }
  };

  // 5. Accessibility Support AI logic
  const handleRequestAccessibility = () => {
    setAccSuccess(true);
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

  // 6. Emergency Help AI logic
  const handleTriggerEmergency = () => {
    setEmergencySuccess(true);
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

  // Translation helpers
  const translateToSpanish = (text) => {
    if (text.toLowerCase().includes('concourse')) return '¿Dónde está el corredor principal?';
    if (text.toLowerCase().includes('ticket')) return 'Por favor, muestre su boleto.';
    if (text.toLowerCase().includes('restroom')) return 'Los baños están cruzando la pasarela.';
    return `[ES] ${text}`;
  };

  const translateToFrench = (text) => {
    if (text.toLowerCase().includes('concourse')) return 'Où se trouve le hall principal?';
    if (text.toLowerCase().includes('ticket')) return 'Veuillez présenter votre billet.';
    if (text.toLowerCase().includes('restroom')) return 'Les toilettes sont en face de la passerelle.';
    return `[FR] ${text}`;
  };

  const handleTranslatePhrase = () => {
    if (!phraseToTranslate.trim()) return;
    setTranslationOutput(`🌍 translations:
• [ES]: ${translateToSpanish(phraseToTranslate)}
• [FR]: ${translateToFrench(phraseToTranslate)}`);
  };

  // Chat Submission AI response
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMessage = { role: 'user', text: chatQuery };
    const queryToSend = chatQuery;
    
    setChatHistory(prev => [...prev, userMessage]);
    setChatQuery('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryToSend,
          matchContext: {
            home: activeMatch.home,
            away: activeMatch.away,
            venue: activeMatch.venue,
            city: activeMatch.city
          }
        })
      });
      
      const data = await res.json();
      const assistantMessage = { role: 'assistant', text: data.response || 'I had trouble connecting to the StadiumIQ processor.' };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = { role: 'assistant', text: 'Connection error. Please try again.' };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div style={{ background: '#0a0a0c', minHeight: '100vh', color: '#fff', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      
      {/* Exclusive Styling Block for Apple/FIFA+ Companion Aesthetic */}
      <style jsx global>{`
        .fan-companion-hero {
          position: relative;
          width: 100%;
          min-height: 80vh;
          background-image: url('/fan_bg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          padding: 60px 40px;
        }

        .fan-companion-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(10, 10, 12, 0.45) 0%,
            rgba(10, 10, 12, 0.6) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .fan-companion-grid {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .fan-pills-row {
          position: relative;
          z-index: 15;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          max-width: 1200px;
          margin: 30px auto 0 auto;
          padding: 0 40px;
        }

        .fan-pill-recommendation {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 500;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .fan-quick-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 15px;
          max-width: 1200px;
          margin: 30px auto 40px auto;
          padding: 0 40px;
        }

        .fan-quick-card {
          background: rgba(15, 15, 20, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }

        .fan-quick-card:hover {
          border-color: var(--ai-blue);
          transform: translateY(-3px);
          background: rgba(20, 20, 25, 0.85);
        }

        .fan-quick-icon {
          font-size: 24px;
          margin-bottom: 8px;
          display: block;
        }

        .fan-quick-title {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 4px;
        }

        .fan-quick-desc {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.3;
          margin: 0;
        }

        .feed-ticket-explore-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto 50px auto;
          padding: 0 40px;
        }

        .timeline-container {
          background: rgba(15, 15, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
        }

        .timeline-item {
          display: flex;
          gap: 15px;
          padding-bottom: 20px;
          border-left: 2px solid rgba(255, 255, 255, 0.08);
          padding-left: 15px;
          margin-left: 10px;
          position: relative;
        }

        .timeline-item::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--ai-blue);
        }

        .ticket-qr-card {
          background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.05), transparent), rgba(15, 15, 20, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .explore-stadium-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          width: 100%;
        }

        .explore-item-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .explore-item-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 1024px) {
          .fan-companion-grid, .feed-ticket-explore-row {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .fan-quick-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .fan-pills-row, .fan-companion-hero {
            padding: 30px 20px;
          }
          .fan-quick-grid, .feed-ticket-explore-row {
            padding: 0 20px;
          }
        }

        @media (max-width: 640px) {
          .fan-quick-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* ── TABS NAVIGATION (IF NOT HOME) ── */}
      {activeTab !== 'home' && (
        <div style={{ maxWidth: '1200px', margin: '20px auto 0 auto', padding: '0 20px' }}>
          <button 
            className="btn btn-outline btn-sm" 
            onClick={() => setActiveTab('home')}
            style={{ marginBottom: '15px' }}
          >
            ← Back to Companion Home
          </button>
        </div>
      )}

      {/* ── TAB PANELS ── */}
      <div style={{ minHeight: '400px' }}>
        {activeTab === 'home' && (
          <div>
            
            {/* ── 1. CINEMATIC HERO COMPANION SECTION ── */}
            <section className="fan-companion-hero">
              <div className="fan-companion-overlay" />
              
              <div className="fan-companion-grid">
                
                {/* Hero Left: Dynamic Match Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
                  <div className="a11y-badge" style={{ alignSelf: 'flex-start' }}>
                    ⚽ FIFA WORLD CUP 2026
                  </div>
                  
                  <h1 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '2.6rem', 
                    lineHeight: '1.05', 
                    color: '#fff', 
                    margin: 0,
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    Fan Portal
                  </h1>
                  
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '-8px' }}>
                    Smarter Matchday Experience Powered by AI
                  </span>

                  {/* Today's Match Card (Dynamic fixture) */}
                  <div className="glass-match-card" style={{ background: 'rgba(10, 10, 12, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Today&apos;s Match
                      </span>
                      
                      <select 
                        value={currentMatchId} 
                        onChange={handleMatchChange}
                        aria-label="Active match contextual selector"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          fontSize: '11px',
                          padding: '2px 8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          outline: 'none'
                        }}
                      >
                        {TODAY_MATCHES.map(m => (
                          <option key={m.id} value={m.id} style={{ background: '#0a0a0c' }}>
                            {m.home} vs {m.away}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '22px', color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                        {activeMatch.home.toUpperCase()} vs {activeMatch.away.toUpperCase()}
                      </strong>
                      <span className="badge badge-status-live" style={{ fontSize: '9px', padding: '2px 8px' }}>
                        {activeMatch.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '11.5px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '5px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Venue</span>
                        <strong style={{ color: '#fff' }}>{activeMatch.venue}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kickoff</span>
                        <strong style={{ color: '#fff' }}>{activeMatch.kickoffTime}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weather</span>
                        <strong style={{ color: 'var(--success)' }}>75°F (Clear)</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                      <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { setActiveTool('journey'); document.getElementById('workbench-anchor')?.scrollIntoView({ behavior: 'smooth' }); }}>
                        Plan Journey
                      </button>
                      <button className="btn btn-outline btn-sm" style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }} onClick={() => setChatOpen(true)}>
                        Open StadiumIQ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hero Right: StadiumIQ Recommendation Card */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="glass-chat-card" style={{ width: '100%', background: 'rgba(10, 10, 12, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px' }}>
                        <span style={{ fontSize: '18px' }}>🤖</span>
                        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          StadiumIQ Recommendation
                        </strong>
                      </div>

                      <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                        Good afternoon Siddharth. Live conditions at MetLife Stadium:
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#fff' }}>
                        <div>✔ Crowd levels normal</div>
                        <div>✔ Gate C recommended (3 min queue)</div>
                        <div>✔ Metro arriving in 9 min</div>
                        <div>✔ Rain unlikely (clear skies)</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Need anything else?</span>
                      <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => setChatOpen(true)}>
                        Open AI Assistant
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* ── 2. AI RECOMMENDATION PILLS HIGHLIGHT BAR ── */}
            <div className="fan-pills-row">
              <div className="fan-pill-recommendation">
                <span>🏃</span>
                <span>Leave in 45 minutes.</span>
              </div>
              <div className="fan-pill-recommendation">
                <span>🎫</span>
                <span>Gate D has 6-minute shorter queues.</span>
              </div>
              <div className="fan-pill-recommendation">
                <span>🚇</span>
                <span>Metro arriving in 8 minutes.</span>
              </div>
            </div>

            {/* ── 3. SIX PREMIUM QUICK SERVICES CARDS ── */}
            <section className="fan-quick-grid">
              <div className="fan-quick-card" onClick={() => { setActiveTool('gate'); document.getElementById('workbench-anchor')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="fan-quick-icon">🗺️</span>
                <h4 className="fan-quick-title">Navigation</h4>
                <p className="fan-quick-desc">Find the fastest route to your gate section.</p>
              </div>

              <div className="fan-quick-card" onClick={() => { setActiveTool('journey'); document.getElementById('workbench-anchor')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="fan-quick-icon">🚌</span>
                <h4 className="fan-quick-title">Transportation</h4>
                <p className="fan-quick-desc">Live shuttle, metro, parking and traffic updates.</p>
              </div>

              <div className="fan-quick-card" onClick={() => { setActiveTool('food'); document.getElementById('workbench-anchor')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="fan-quick-icon">🍔</span>
                <h4 className="fan-quick-title">Food</h4>
                <p className="fan-quick-desc">Concession mapping, washrooms, and refills.</p>
              </div>

              <div className="fan-quick-card" onClick={() => { setActiveTool('access'); document.getElementById('workbench-anchor')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="fan-quick-icon">♿</span>
                <h4 className="fan-quick-title">Accessibility</h4>
                <p className="fan-quick-desc">Wheelchair routes, elevators, and escort aids.</p>
              </div>

              <div className="fan-quick-card" onClick={() => { setActiveTool('translate'); document.getElementById('workbench-anchor')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="fan-quick-icon">🌐</span>
                <h4 className="fan-quick-title">Translate</h4>
                <p className="fan-quick-desc">Translate announcements and signage text.</p>
              </div>

              <div className="fan-quick-card" onClick={() => { setActiveTool('emergency'); document.getElementById('workbench-anchor')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="fan-quick-icon">🚨</span>
                <h4 className="fan-quick-title">Emergency</h4>
                <p className="fan-quick-desc">Direct dispatch trigger for medical/first aid.</p>
              </div>
            </section>

            {/* ── 4. LIVE MATCHDAY FEED, TICKET CARD, AND EXPLORE STADIUM ROW ── */}
            <section className="feed-ticket-explore-row">
              
              {/* Left Column: Live Feed & Explore Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Live Matchday Feed */}
                <div className="timeline-container">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                    Live Matchday Feed
                  </h3>
                  
                  <div className="timeline-item">
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>10:42</span>
                    <div>
                      <strong style={{ fontSize: '12px', color: '#fff', display: 'block' }}>Gate D opened</strong>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Scan lines are clear. Scanning wait times are under 2 minutes.</span>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>10:39</span>
                    <div>
                      <strong style={{ fontSize: '12px', color: '#fff', display: 'block' }}>Metro delayed</strong>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Platform congestion at MetLife station loops is minor. Delay: 4 mins.</span>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>10:35</span>
                    <div>
                      <strong style={{ fontSize: '12px', color: '#fff', display: 'block' }}>Weather update</strong>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Humidity levels are at 45%. Sun exposure is moderate. Stay hydrated.</span>
                    </div>
                  </div>

                  <div className="timeline-item" style={{ paddingBottom: 0 }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>10:28</span>
                    <div>
                      <strong style={{ fontSize: '12px', color: '#fff', display: 'block' }}>Food Court B discount</strong>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Save 15% on ecological water reusable cups before kickoff.</span>
                    </div>
                  </div>
                </div>

                {/* Explore Stadium */}
                <div className="timeline-container">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                    Explore Stadium
                  </h3>
                  
                  <div className="explore-stadium-card-grid">
                    {[
                      { id: 'food', label: 'Food Court', icon: '🍔', desc: 'Section 112 & 232 concessions.' },
                      { id: 'store', label: 'FIFA Store', icon: '👕', desc: 'Official World Cup 26 jerseys.' },
                      { id: 'museum', label: 'Museum', icon: '🏆', desc: 'Trophy showcase at East Concourse.' },
                      { id: 'family', label: 'Family Zone', icon: '🧸', desc: 'Kids activities behind Section 104.' },
                      { id: 'aid', label: 'First Aid', icon: '➕', desc: 'Medical base post behind Section 120.' },
                      { id: 'festival', label: 'Fan Festival', icon: '🎶', desc: 'Live pre-match shows in Lot D.' }
                    ].map(card => (
                      <div 
                        key={card.id} 
                        className="explore-item-btn" 
                        onClick={() => setSelectedExploreCard(selectedExploreCard === card.id ? null : card.id)}
                        style={{
                          background: selectedExploreCard === card.id ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                          borderColor: selectedExploreCard === card.id ? 'var(--ai-blue)' : 'rgba(255,255,255,0.06)'
                        }}
                      >
                        <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>{card.icon}</span>
                        <strong style={{ fontSize: '11.5px', display: 'block', color: '#fff' }}>{card.label}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Explore card detail expansion */}
                  {selectedExploreCard && (
                    <div className="panel-elevated animate-in" style={{ marginTop: '15px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <strong style={{ fontSize: '12px', display: 'block', color: '#fff' }}>
                        {selectedExploreCard.toUpperCase()} LOCATION DETAILS
                      </strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                        Located in the main concourse loop. Follow wayfinding signs pointing to Section 120. Estimated walking time from your seat: 3 minutes.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Ticket Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="ticket-qr-card">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', width: '100%', textAlign: 'center' }}>
                    My Match Ticket
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', width: '100%', textAlign: 'center', fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>Section</span>
                      <strong style={{ fontSize: '15px', color: '#fff' }}>118</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>Row</span>
                      <strong style={{ fontSize: '15px', color: '#fff' }}>14</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>Seat</span>
                      <strong style={{ fontSize: '15px', color: '#fff' }}>9</strong>
                    </div>
                  </div>

                  <div style={{ width: '100%', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Entry Gate:</span>
                      <strong style={{ color: '#fff' }}>Gate C</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Parking Access:</span>
                      <strong style={{ color: '#fff' }}>Lot A</strong>
                    </div>
                  </div>

                  {/* Styled Mock QR Code */}
                  <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', marginTop: '10px', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}>
                    <svg width="110" height="110" viewBox="0 0 110 110">
                      <rect width="110" height="110" fill="#fff" />
                      <path d="M10 10h30v30h-30zm40 0h10v10h-10zm20 0h30v30h-30zm-60 40h10v10h-10zm20 0h20v10h-20zm30 0h10v20h-10zm20 0h10v10h-10zm-70 20h30v30h-30zm40 10h10v10h-10zm10 0h20v20h-20zm-20 10h10v10h-10zm30 0h20v10h-20z" fill="#000" />
                    </svg>
                  </div>
                </div>
              </div>

            </section>

            {/* ── 5. INTERACTIVE WORKBENCH ANCHOR PANEL ── */}
            <section id="workbench-anchor" style={{ maxWidth: '1200px', margin: '0 auto 40px auto', padding: '0 40px' }}>
              <div className="panel" style={{ padding: '20px', background: 'rgba(15, 15, 20, 0.7)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    StadiumIQ AI Utility Workbench
                  </h3>
                  <span className="badge badge-ai">Interactive Companion Forms</span>
                </div>

                {activeTool ? (
                  <div className="panel-elevated animate-in" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    
                    {/* Find Gate */}
                    {activeTool === 'gate' && (
                      <div>
                        <label htmlFor="gate-sec-input" style={{ fontSize: '11px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Find My Gate</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <input
                            id="gate-sec-input"
                            type="text"
                            value={findGateSection}
                            onChange={(e) => setFindGateSection(e.target.value)}
                            placeholder="Enter seat section, e.g. 118"
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: '#fff', outline: 'none' }}
                          />
                          <button className="btn btn-primary btn-sm" onClick={handleFindGate}>Find Gate</button>
                        </div>
                        {findGateResult && <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255,255,255,0.8)' }}>{findGateResult}</p>}
                      </div>
                    )}

                    {/* Plan Journey */}
                    {activeTool === 'journey' && (
                      <div>
                        <label htmlFor="journey-mode-select" style={{ fontSize: '11px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Plan Journey</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <select
                            id="journey-mode-select"
                            value={journeyMode}
                            onChange={(e) => setJourneyMode(e.target.value)}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: '#fff', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="metro">Metro / Train Station</option>
                            <option value="bus">Express Shuttle Bus</option>
                            <option value="rideshare">Rideshare Pick-up Zone</option>
                          </select>
                          <button className="btn btn-primary btn-sm" onClick={handlePlanJourney}>Plan Trip</button>
                        </div>
                        {journeyResult && <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255,255,255,0.8)' }}>{journeyResult}</p>}
                      </div>
                    )}

                    {/* Food & Services */}
                    {activeTool === 'food' && (
                      <div>
                        <label htmlFor="food-locate-select" style={{ fontSize: '11px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Locate Services</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <select
                            id="food-locate-select"
                            value={foodSelection}
                            onChange={(e) => setFoodSelection(e.target.value)}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: '#fff', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="water">Eco Water Refill Stations</option>
                            <option value="firstaid">First Aid & Medical Posts</option>
                            <option value="concessions">Food Court & Recycling Bins</option>
                          </select>
                          <button className="btn btn-primary btn-sm" onClick={handleFoodNearby}>Locate</button>
                        </div>
                        {foodResult && <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255,255,255,0.8)' }}>{foodResult}</p>}
                      </div>
                    )}

                    {/* Accessibility Support */}
                    {activeTool === 'access' && (
                      <div>
                        <label htmlFor="access-req-select" style={{ fontSize: '11px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Request Escort</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <select
                            id="access-req-select"
                            value={assistanceType}
                            onChange={(e) => setAssistanceType(e.target.value)}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: '#fff', outline: 'none', cursor: 'pointer' }}
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

                    {/* Translate Broadcast */}
                    {activeTool === 'translate' && (
                      <div>
                        <label htmlFor="phrase-translate-input" style={{ fontSize: '11px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Translate Phrase</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <input
                            id="phrase-translate-input"
                            type="text"
                            value={phraseToTranslate}
                            onChange={(e) => setPhraseToTranslate(e.target.value)}
                            placeholder="Enter English phrase, e.g. Where is concourse?"
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: '#fff', outline: 'none' }}
                          />
                          <button className="btn btn-primary btn-sm" onClick={handleTranslatePhrase}>Translate</button>
                        </div>
                        {translationOutput && (
                          <pre style={{ margin: 0, fontSize: '11px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'rgba(255,255,255,0.8)' }}>{translationOutput}</pre>
                        )}
                      </div>
                    )}

                    {/* Emergency Help */}
                    {activeTool === 'emergency' && (
                      <div>
                        <label htmlFor="emerg-req-select" style={{ fontSize: '11px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Request Emergency Help</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <select
                            id="emerg-req-select"
                            value={emergencyLevel}
                            onChange={(e) => setEmergencyLevel(e.target.value)}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: '#fff', outline: 'none', cursor: 'pointer' }}
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
                ) : (
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Select an option from the Quick Services grid above to activate interactive forms.
                  </p>
                )}
              </div>
            </section>

          </div>
        )}

        {activeTab === 'alerts' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
            <GateInfo />
          </div>
        )}

        {activeTab === 'report' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
            <IncidentReport />
          </div>
        )}
      </div>

      {/* ── STADIUMIQ FLOATING CHAT OVERLAY ── */}
      {chatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '350px',
          height: '450px',
          background: 'rgba(10, 10, 12, 0.95)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '10px 15px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🤖</span>
              <strong style={{ fontSize: '13px', color: '#fff' }}>StadiumIQ Assist</strong>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              aria-label="Close Chat"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? 'var(--ai-blue)' : 'var(--bg-elevated)',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  maxWidth: '85%',
                  lineHeight: '1.4'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleChatSubmit} style={{ display: 'flex', borderTop: '1px solid var(--border)', padding: '10px' }}>
            <input
              type="text"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              placeholder="Ask about gates, water, weather, etc..."
              style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '6px 10px', fontSize: '12px', color: '#fff', outline: 'none' }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ marginLeft: '6px' }}>Send</button>
          </form>
        </div>
      )}

    </div>
  );
}
