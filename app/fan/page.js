/**
 * StadiumOPS — Fan Portal Page
 * Refined with cinematic stadium background, today's match card, floating AI advisor, and interactive tools.
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

  // StadiumIQ Quick Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'Hi Siddharth! I am StadiumIQ, your FIFA World Cup 2026 matchday assistant. How can I help you navigate or retrieve accessibility/transit info today?' }
  ]);

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
      setTranslationOutput('');
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

  // Chat Submission AI response
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMessage = { role: 'user', text: chatQuery };
    const queryToSend = chatQuery;
    
    // Add user message to history instantly
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
      const errorMessage = { role: 'assistant', text: 'Connection error. Please check your network and try again.' };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div style={{ background: '#0a0a0c', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Exclusive Styling Block for Fan Portal Banners */}
      <style jsx global>{`
        .fan-hero-section {
          position: relative;
          width: 100%;
          min-height: 80vh;
          background-image: url('/fan_bg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 60px 40px;
        }

        .fan-hero-overlay {
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

        .fan-hero-glow {
          position: absolute;
          top: 30%;
          left: 20%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 2;
          filter: blur(50px);
        }

        .fan-hero-grid {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .fan-service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: -40px auto 40px auto;
          padding: 0 40px;
          position: relative;
          z-index: 20;
        }

        .service-card-premium {
          background: rgba(15, 15, 20, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          text-align: left;
        }

        .service-card-premium:hover {
          border-color: rgba(59, 130, 246, 0.25);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.06);
          transform: translateY(-3px);
        }

        .service-card-icon {
          font-size: 24px;
          margin-bottom: 8px;
          display: block;
        }

        .glass-match-card {
          background: rgba(10, 10, 12, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .glass-chat-card {
          background: rgba(10, 10, 12, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          min-height: 280px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }

        @media (max-width: 1024px) {
          .fan-hero-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .fan-service-grid {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 20px;
            padding: 0 20px;
          }
          .fan-hero-section {
            padding: 40px 20px;
          }
        }

        @media (max-width: 768px) {
          .fan-service-grid {
            grid-template-columns: 1fr;
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
            ← Back to Portal Home
          </button>
        </div>
      )}

      {/* ── TAB PANELS ── */}
      <div style={{ minHeight: '400px' }}>
        {activeTab === 'home' && (
          <div>
            
            {/* ── A. CINEMATIC HERO BACKGROUND SECTION ── */}
            <section className="fan-hero-section">
              <div className="fan-hero-overlay" />
              <div className="fan-hero-glow" />

              <div className="fan-hero-grid">
                
                {/* Hero left content column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
                  <div className="a11y-badge" style={{ alignSelf: 'flex-start' }}>
                    ⚽ FIFA World Cup 2026
                  </div>
                  
                  <h1 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '3.2rem', 
                    lineHeight: '1.05', 
                    color: '#fff', 
                    margin: 0,
                    fontWeight: '700'
                  }}>
                    Fan Portal
                    <span style={{ display: 'block', fontSize: '1.5rem', color: 'var(--success)', marginTop: '5px', fontWeight: '500' }}>
                      Smarter Matchday Experience Powered by AI
                    </span>
                  </h1>

                  <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', margin: 0 }}>
                    Navigate every FIFA World Cup match effortlessly. Receive live gate guidance, transport 
                    recommendations, accessibility assistance, multilingual support, safety alerts, weather updates, 
                    and personalized matchday information through StadiumIQ.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <button className="btn btn-primary" onClick={() => { setActiveTool('journey'); document.getElementById('ai-tools-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                      Plan My Journey
                    </button>
                    <button className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }} onClick={() => setChatOpen(true)}>
                      Talk to StadiumIQ
                    </button>
                  </div>

                  {/* Today's Featured Match Dynamic Card */}
                  <div className="glass-match-card" style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Today&apos;s Featured Match
                      </span>
                      <select 
                        value={currentMatchId} 
                        onChange={handleMatchChange}
                        aria-label="Select Attendee Match"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                      <strong style={{ fontSize: '18px', color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                        {activeMatch.home.toUpperCase()} vs {activeMatch.away.toUpperCase()}
                      </strong>
                      <span className="badge badge-status-live" style={{ fontSize: '9px' }}>
                        {activeMatch.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>Venue</span>
                        <strong style={{ color: '#fff' }}>{activeMatch.venue}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>Kickoff</span>
                        <strong style={{ color: '#fff' }}>{activeMatch.kickoffTime}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>Countdown</span>
                        <strong style={{ color: 'var(--success)' }}>In 02h 15m 32s</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero right floating AI Assistant card */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="glass-chat-card" style={{ width: '100%' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🤖</span>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Meet StadiumIQ
                        </h3>
                      </div>
                      
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px 0' }}>
                        I can help you dynamically with:
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11.5px', color: '#fff' }}>
                        <div>• Navigation routing</div>
                        <div>• Queue prediction</div>
                        <div>• Accessibility paths</div>
                        <div>• Transport timetables</div>
                        <div>• Weather alerts</div>
                        <div>• Lost & Found</div>
                        <div>• Emergency support</div>
                        <div>• Food concessions</div>
                        <div>• Match facts</div>
                        <div>• Translation aids</div>
                      </div>
                    </div>

                    <button 
                      className="btn btn-primary" 
                      onClick={() => setChatOpen(true)}
                      style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                      <span>💬</span> Ask StadiumIQ
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* ── B. SIX PREMIUM QUICK SERVICES CARDS ── */}
            <section className="fan-service-grid">
              <div className="service-card-premium" onClick={() => { setActiveTool('gate'); document.getElementById('ai-tools-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="service-card-icon">🗺️</span>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>Venue Navigation</h4>
                <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.4' }}>
                  Find the fastest route to your gate section.
                </p>
              </div>

              <div className="service-card-premium" onClick={() => { setActiveTool('journey'); document.getElementById('ai-tools-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="service-card-icon">🚍</span>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>Transportation</h4>
                <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.4' }}>
                  Live shuttle, metro, parking and traffic updates.
                </p>
              </div>

              <div className="service-card-premium" onClick={() => { setActiveTool('access'); document.getElementById('ai-tools-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="service-card-icon">♿</span>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>Accessibility</h4>
                <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.4' }}>
                  Wheelchair routes, elevators and assistance.
                </p>
              </div>

              <div className="service-card-premium" onClick={() => { setActiveTool('translate'); document.getElementById('ai-tools-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="service-card-icon">🌐</span>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>Multilingual Assistant</h4>
                <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.4' }}>
                  Translate announcements instantly.
                </p>
              </div>

              <div className="service-card-premium" onClick={() => { setActiveTool('food'); document.getElementById('ai-tools-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
                <span className="service-card-icon">🍔</span>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>Food & Services</h4>
                <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.4' }}>
                  Nearby food stalls, washrooms and merchandise.
                </p>
              </div>

              <div className="service-card-premium" onClick={() => setActiveTab('alerts')}>
                <span className="service-card-icon">🚨</span>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', margin: '0 0 4px 0' }}>Live Alerts</h4>
                <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: '1.4' }}>
                  Emergency notifications and operational updates.
                </p>
              </div>
            </section>

            {/* ── C. INTERACTIVE UTILITIES PANEL (FOCUS/SCROLL SECTION) ── */}
            <section id="ai-tools-section" style={{ maxWidth: '1200px', margin: '0 auto 40px auto', padding: '0 40px' }}>
              
              <div className="panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    StadiumIQ AI Utility Workbench
                  </h3>
                  <span className="badge badge-ai">Interactive Form Mode</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { id: 'gate', label: 'Find My Gate', icon: '🧭' },
                    { id: 'journey', label: 'Plan My Journey', icon: '🚇' },
                    { id: 'queue', label: 'Check Queue Times', icon: '🚶' },
                    { id: 'translate', label: 'Translate Broadcast', icon: '🌍' },
                    { id: 'food', label: 'Locate Food & Services', icon: '🍔' },
                    { id: 'access', label: 'Accessibility Support', icon: '♿' },
                    { id: 'emergency', label: 'Emergency Help', icon: '🚨' }
                  ].map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                      className="btn btn-outline"
                      style={{
                        justifyContent: 'flex-start',
                        fontSize: '11.5px',
                        padding: '10px 12px',
                        color: '#fff',
                        borderColor: activeTool === tool.id ? 'var(--ai-blue)' : 'rgba(255,255,255,0.1)',
                        background: activeTool === tool.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                      }}
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.label}</span>
                    </button>
                  ))}
                </div>

                {/* Form expansions */}
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
                            placeholder="Enter seat section, e.g. 214"
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

                    {/* Check Queue */}
                    {activeTool === 'queue' && (
                      <div>
                        <label htmlFor="queue-gate-select" style={{ fontSize: '11px', display: 'block', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Check Queue Times</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                          <select
                            id="queue-gate-select"
                            value={selectedGate}
                            onChange={(e) => setSelectedGate(e.target.value)}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px', fontSize: '12px', color: '#fff', outline: 'none', cursor: 'pointer' }}
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
                        {queueResult && <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(255,255,255,0.8)' }}>{queueResult}</p>}
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
                    Select an option from the Quick Services grid or click any utility badge above to activate form controls.
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
