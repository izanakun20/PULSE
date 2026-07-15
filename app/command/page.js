/**
 * StadiumOPS — Operations Center Dashboard
 * Structured around official challenge categories.
 */

'use client';

import { useState } from 'react';
import { usePulse } from '@/lib/store';
import { TODAY_MATCHES } from '@/lib/constants';
import SimulatorControls from '@/components/command/SimulatorControls';
import ZoneOverview from '@/components/command/ZoneOverview';
import ProposalQueue from '@/components/command/ProposalQueue';
import EventFeed from '@/components/command/EventFeed';
import WorkflowTracker from '@/components/ui/WorkflowTracker';

export default function CommandPage() {
  const { state, dispatch } = usePulse();
  const { currentHostCity, currentVenue, currentMatchId, approvedActions, volunteerTasks, fanAlerts } = state;
  const [activeCategory, setActiveCategory] = useState('operations');

  // Find active match details
  const activeMatch = TODAY_MATCHES.find(m => m.id === currentMatchId) || TODAY_MATCHES[0];

  // Multilingual states
  const [announcementText, setAnnouncementText] = useState('');
  const [translations, setTranslations] = useState(null);
  const [broadcasting, setBroadcasting] = useState(false);

  // Navigation optimizer states
  const [congestedGate, setCongestedGate] = useState('G7');
  const [suggestedReroute, setSuggestedReroute] = useState('G8');
  const [optimizeSuccess, setOptimizeSuccess] = useState(false);

  // Transport optimizer states
  const [staggerReleaseZone, setStaggerReleaseZone] = useState('north');
  const [egressTimelineGenerated, setEgressTimelineGenerated] = useState(false);

  // Accessibility dispatcher states
  const [accStand, setAccStand] = useState('east');
  const [accType, setAccType] = useState('wheelchair');
  const [accSuccess, setAccSuccess] = useState(false);

  // Crowd predictor states
  const [predictingCrowd, setPredictingCrowd] = useState(false);
  const [crowdPredictions, setCrowdPredictions] = useState(null);

  // Sustainability states
  const [ecoGuideline, setEcoGuideline] = useState(null);

  // Executive report states
  const [generatingReport, setGeneratingReport] = useState(false);
  const [matchReport, setMatchReport] = useState(null);

  // Helper to translate and broadcast announcements
  const handleTranslateAndBroadcast = async () => {
    if (!announcementText.trim()) return;
    setBroadcasting(true);
    
    // Simulate GenAI translation
    setTimeout(() => {
      const trans = {
        en: `📢 announcement: ${announcementText}`,
        es: `📢 anuncio: ${translateToSpanish(announcementText)}`,
        fr: `📢 annonce: ${translateToFrench(announcementText)}`
      };
      setTranslations(trans);
      setBroadcasting(false);

      // Dispatch to Fan Alerts
      dispatch({
        type: 'ADD_FAN_ALERT',
        payload: {
          id: `alert_broadcast_${Date.now()}`,
          title: `Announcement: ${announcementText}`,
          messages: trans,
          urgency: 'medium',
          zones: ['all'],
          createdAt: new Date().toISOString(),
          source: 'comms',
          type: 'fan_alert'
        }
      });
      setAnnouncementText('');
    }, 1000);
  };

  // Simple mock translators
  const translateToSpanish = (text) => {
    if (text.toLowerCase().includes('congested')) return 'La puerta está congestionada. Por favor, use entradas alternativas.';
    if (text.toLowerCase().includes('maintenance')) return 'La zona está cerrada por mantenimiento.';
    return `[Traducido] ${text}`;
  };

  const translateToFrench = (text) => {
    if (text.toLowerCase().includes('congested')) return 'La porte est encombrée. Veuillez utiliser d’autres entrées.';
    if (text.toLowerCase().includes('maintenance')) return 'Zone fermée pour maintenance.';
    return `[Traduit] ${text}`;
  };

  // Optimize alternate route
  const handleOptimizeRoute = () => {
    setOptimizeSuccess(true);
    // Dispatch a fan alert suggesting route change
    dispatch({
      type: 'ADD_FAN_ALERT',
      payload: {
        id: `alert_reroute_${Date.now()}`,
        title: `Dynamic Route Optimization: Gate ${congestedGate} Reroute`,
        messages: {
          en: `📢 Flow Optimization: Gate ${congestedGate} is congested. Please use Gate ${suggestedReroute} for faster entry.`,
          es: `📢 Optimización: La Puerta ${congestedGate} está congestionada. Use la Puerta ${suggestedReroute}.`,
          fr: `📢 Optimisation: La Porte ${congestedGate} est encombrée. Veuillez utiliser la Porte ${suggestedReroute}.`
        },
        urgency: 'high',
        zones: ['all'],
        createdAt: new Date().toISOString(),
        source: 'crowd-flow',
        type: 'gate_reallocation'
      }
    });

    setTimeout(() => setOptimizeSuccess(false), 3000);
  };

  // Optimize transport stagger release
  const handleGenerateStaggerTable = () => {
    setEgressTimelineGenerated(true);
    // Dispatch a transit staggered alert
    dispatch({
      type: 'ADD_FAN_ALERT',
      payload: {
        id: `alert_transit_stagger_${Date.now()}`,
        title: `Transit Egress: Staggered Release Active`,
        messages: {
          en: `🚇 Transit advisory: Staggered exit in place for ${staggerReleaseZone} Stand to balance Metro capacity.`,
          es: `🚇 Aviso de transporte: Salida escalonada activa para la tribuna ${staggerReleaseZone}.`,
          fr: `🚇 Avis de transport: Sortie échelonnée active pour la tribune ${staggerReleaseZone}.`
        },
        urgency: 'medium',
        zones: [staggerReleaseZone],
        createdAt: new Date().toISOString(),
        source: 'transit',
        type: 'transit_stagger'
      }
    });

    setTimeout(() => setEgressTimelineGenerated(false), 3000);
  };

  // Dispatch accessibility aid
  const handleDispatchAccessibility = () => {
    setAccSuccess(true);
    
    // Dispatch a volunteer task
    dispatch({
      type: 'ADD_VOLUNTEER_TASK',
      payload: {
        id: `task_acc_${Date.now()}`,
        title: `Dispatch ${accType} assistant to Stand ${accStand.toUpperCase()}`,
        zone: accStand,
        priority: 'high',
        assignedTo: ['V06'],
        status: 'pending',
        createdAt: new Date().toISOString(),
        source: 'dispatch',
        description: `Steward requested to assist fan needing ${accType} support in Stand ${accStand.toUpperCase()}.`
      }
    });

    setTimeout(() => setAccSuccess(false), 3000);
  };

  // Generate bottleneck predictions
  const handlePredictCrowd = () => {
    setPredictingCrowd(true);
    setTimeout(() => {
      setCrowdPredictions({
        timestamp: new Date().toLocaleTimeString(),
        bottleneckZone: 'west',
        predictedOccupancy: 96,
        confidence: 94,
        suggestedAction: 'Divert West Concourse flow to South Concourse immediately to prevent crowding.'
      });
      setPredictingCrowd(false);
    }, 1000);
  };

  // Generate eco advisory guidelines
  const handleCheckEcoLoad = () => {
    setEcoGuideline({
      timestamp: new Date().toLocaleTimeString(),
      recycleBinLoad: 68,
      powerSavingActive: true,
      recommendation: 'Crowd density is low in East Concourse. Switch sector lighting to eco-standby mode. Estimated savings: 450 kWh.'
    });
  };

  // Generate Executive operations report
  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setMatchReport({
        matchId: currentMatchId,
        teams: `${activeMatch.home} vs ${activeMatch.away}`,
        venue: currentVenue,
        city: currentHostCity,
        time: new Date().toLocaleString(),
        summary: `Matchday Operations report compiled for ${currentVenue}. All sensors sync successfully.`,
        stats: {
          approvedActionsCount: approvedActions.length,
          dispatchedTasksCount: volunteerTasks.length,
          alertsPushed: fanAlerts.length,
          incidentResolutionRate: 100
        },
        greenSavings: '450 kWh saved via Eco-Standby power routing.'
      });
      setGeneratingReport(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 95px)', overflow: 'hidden' }}>
      {/* Simulation Master Controller bar */}
      <SimulatorControls />

      {/* Dynamic Workflow pipeline tracker */}
      <div style={{ padding: '0 20px 10px 20px' }}>
        <WorkflowTracker />
      </div>

      {/* Main dashboard category split */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: 'var(--border)' }}>
        
        {/* Left Side: Challenge Category Nav */}
        <aside style={{ width: '220px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '10px' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', padding: '5px 10px' }}>
            Challenge categories
          </span>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, marginTop: '8px' }}>
            {[
              { id: 'operations', label: 'Decision Pipeline', icon: '🎛️' },
              { id: 'navigation', label: 'Navigation', icon: '🧭' },
              { id: 'transportation', label: 'Transportation', icon: '🚇' },
              { id: 'accessibility', label: 'Accessibility', icon: '♿' },
              { id: 'multilingual', label: 'Multilingual', icon: '🌍' },
              { id: 'crowd', label: 'Crowd Intelligence', icon: '👥' },
              { id: 'sustainability', label: 'Sustainability', icon: '🌱' },
              { id: 'reports', label: 'Executive Reports', icon: '📊' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`command-nav-link ${activeCategory === cat.id ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  outline: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  background: activeCategory === cat.id ? 'var(--bg-elevated)' : 'transparent',
                  color: activeCategory === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeCategory === cat.id ? '600' : '500'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </nav>

          {/* Active stadium context indicator */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '10px', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 'bold' }}>VENUE CONTEXT</span>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>{currentVenue}</strong>
            <span>{currentHostCity}</span>
          </div>
        </aside>

        {/* Right Side: Tab Contents */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-root)', padding: '20px' }}>
          
          {/* TAB 1: OPERATIONS / DECISION PIPELINE */}
          {activeCategory === 'operations' && (
            <div className="command-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr 340px', gap: '20px', height: '100%', background: 'none' }}>
              <section style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ZoneOverview />
              </section>

              <section style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ProposalQueue />
              </section>

              <section style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <EventFeed />
              </section>
            </div>
          )}

          {/* TAB 2: NAVIGATION & WAYFINDING */}
          {activeCategory === 'navigation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
              <div className="panel-ai">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span>🧭</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>StadiumIQ Wayfinding Advisor</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  I analyze scan rates across Gates 1 to 8 to balance lines. Based on live throughput telemetry, fans are directed to adjacent gates. Use this dashboard to manually trigger route reallocations.
                </p>
              </div>

              <div className="panel" style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 15px 0' }}>
                  OPTIMIZE GATE ENTRY FLOW
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label htmlFor="congested-gate-select" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                      Select Congested Gate
                    </label>
                    <select
                      id="congested-gate-select"
                      value={congestedGate}
                      onChange={(e) => setCongestedGate(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px', fontSize: '13px', outline: 'none' }}
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
                  </div>

                  <div>
                    <label htmlFor="reroute-gate-select" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                      Reroute to Underutilized Gate
                    </label>
                    <select
                      id="reroute-gate-select"
                      value={suggestedReroute}
                      onChange={(e) => setSuggestedReroute(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="G2">Gate 2 (North)</option>
                      <option value="G3">Gate 3 (East)</option>
                      <option value="G4">Gate 4 (East)</option>
                      <option value="G7">Gate 7 (West)</option>
                      <option value="G8">Gate 8 (West)</option>
                    </select>
                  </div>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={handleOptimizeRoute}
                  style={{ width: '100%' }}
                >
                  Confirm Flow Optimization & Send Fan Reroute Advisory
                </button>

                {optimizeSuccess && (
                  <div className="panel-elevated" style={{ marginTop: '15px', borderColor: 'var(--success)', background: 'var(--success-dim)', color: 'var(--success)', fontSize: '12px', padding: '10px' }}>
                    ✓ Route optimized! Alert dispatched successfully to the Fan Companion Portal.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TRANSPORTATION */}
          {activeCategory === 'transportation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
              <div className="panel-ai" style={{ borderLeftColor: 'var(--agent-transit)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span>🚇</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>StadiumIQ Transportation Planner</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  We coordinate transport load balancing at Metro North, Metro South, Bus East, and Shuttle loops. To prevent dangerous congestion spikes, we recommend staggering the release of fans by stand sectors.
                </p>
              </div>

              <div className="panel" style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 15px 0' }}>
                  EGRESS RELEASE STAGGERING
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label htmlFor="stagger-zone-select" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                      Select Stand to Hold & Stagger
                    </label>
                    <select
                      id="stagger-zone-select"
                      value={staggerReleaseZone}
                      onChange={(e) => setStaggerReleaseZone(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="north">North Stand</option>
                      <option value="south">South Stand</option>
                      <option value="east">East Stand</option>
                      <option value="west">West Stand</option>
                    </select>
                  </div>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={handleGenerateStaggerTable}
                  style={{ width: '100%' }}
                >
                  Activate Staggered Release Schedule
                </button>

                {egressTimelineGenerated && (
                  <div className="panel-elevated" style={{ marginTop: '15px', borderColor: 'var(--success)', background: 'var(--success-dim)', color: 'var(--success)', fontSize: '12px', padding: '10px' }}>
                    ✓ Egress hold timetable broadcasted to fans in the {staggerReleaseZone.toUpperCase()} stand.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ACCESSIBILITY SUPPORT */}
          {activeCategory === 'accessibility' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
              <div className="panel-ai" style={{ borderLeftColor: 'var(--success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span>♿</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>StadiumIQ Accessibility Assistant</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  StadiumOPS supports wheelchair assistance, sensory guidance, and elevator routing. Field dispatches can be created immediately to dispatch accessibility guides to stands.
                </p>
              </div>

              <div className="panel" style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 15px 0' }}>
                  DISPATCH ACCESSIBILITY STEWARDS
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label htmlFor="acc-stand-select" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                      Target Stand Location
                    </label>
                    <select
                      id="acc-stand-select"
                      value={accStand}
                      onChange={(e) => setAccStand(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="north">North Stand</option>
                      <option value="south">South Stand</option>
                      <option value="east">East Stand</option>
                      <option value="west">West Stand</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="acc-type-select" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                      Assistance Category
                    </label>
                    <select
                      id="acc-type-select"
                      value={accType}
                      onChange={(e) => setAccType(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="wheelchair">Wheelchair / Mobility Support</option>
                      <option value="sensory">Sensory Kit / Quiet Guide</option>
                      <option value="visual">Visual Escort Aid</option>
                    </select>
                  </div>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={handleDispatchAccessibility}
                  style={{ width: '100%' }}
                >
                  Dispatch Assistant to Stand
                </button>

                {accSuccess && (
                  <div className="panel-elevated" style={{ marginTop: '15px', borderColor: 'var(--success)', background: 'var(--success-dim)', color: 'var(--success)', fontSize: '12px', padding: '10px' }}>
                    ✓ Dispatch queued! Stewards notified via the Volunteer Portal.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MULTILINGUAL ASSISTANCE */}
          {activeCategory === 'multilingual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
              <div className="panel-ai" style={{ borderLeftColor: 'var(--agent-comms)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span>🌍</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>StadiumIQ Translation Broadcaster</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Broadcast matchday announcements instantly. StadiumIQ automatically translates announcements into English, Spanish, and French, dispatching them to fan mobiles.
                </p>
              </div>

              <div className="panel" style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 15px 0' }}>
                  BROADCAST TRANSLATED ANNOUNCEMENT
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  <label htmlFor="announcement-textarea" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Announcement English text
                  </label>
                  <textarea
                    id="announcement-textarea"
                    rows="3"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="e.g. Gate 7 queue is congested. Use adjacent Gate 8 for entry."
                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={handleTranslateAndBroadcast}
                  disabled={broadcasting}
                  style={{ width: '100%', gap: '10px' }}
                >
                  {broadcasting ? <div className="spinner" /> : 'Translate & Broadcast to Fans'}
                </button>

                {translations && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Generated Broadcasts:</div>
                    <div style={{ padding: '10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ marginBottom: '6px' }}>🇬🇧 <strong>EN:</strong> {translations.en}</div>
                      <div style={{ marginBottom: '6px' }}>🇪🇸 <strong>ES:</strong> {translations.es}</div>
                      <div>🇫🇷 <strong>FR:</strong> {translations.fr}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CROWD INTELLIGENCE */}
          {activeCategory === 'crowd' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
              <div className="panel-ai" style={{ borderLeftColor: 'var(--agent-crowd)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span>👥</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>StadiumIQ Crowd Predictor</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  We monitor live stand capacity percentage and flow trends to predict potential bottlenecks 15 to 30 minutes before they occur.
                </p>
              </div>

              <div className="panel" style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 15px 0' }}>
                  PREDICT CONCOURSE BOTTLENECKS
                </h3>

                <button 
                  className="btn btn-primary"
                  onClick={handlePredictCrowd}
                  disabled={predictingCrowd}
                  style={{ width: '100%', gap: '10px' }}
                >
                  {predictingCrowd ? <div className="spinner" /> : 'Run Bottleneck Predictive Algorithm'}
                </button>

                {crowdPredictions && (
                  <div className="panel-elevated" style={{ marginTop: '20px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>PREDICTED BOTTLENECK: ZONE {crowdPredictions.bottleneckZone.toUpperCase()}</strong>
                      <span className="badge badge-severity-high">{crowdPredictions.predictedOccupancy}% density</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      <strong>StadiumIQ Analysis:</strong> {crowdPredictions.suggestedAction} (Confidence level: {crowdPredictions.confidence}%)
                    </p>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                      Calculated at: {crowdPredictions.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: SUSTAINABILITY */}
          {activeCategory === 'sustainability' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
              <div className="panel-ai" style={{ borderLeftColor: 'var(--success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span>🌱</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>StadiumIQ Eco-Operations Advisor</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  StadiumOPS coordinates green tournament goals, monitoring waste bin levels, water refill statistics, and energy grids to minimize matchday carbon footprint.
                </p>
              </div>

              <div className="panel" style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 15px 0' }}>
                  SUSTAINABILITY TELEMETRY
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', textAlign: 'center' }}>
                  <div className="panel-elevated" style={{ padding: '12px' }}>
                    <div className="data-label">WATER DISPENSES</div>
                    <div className="data-value" style={{ color: 'var(--success)' }}>14,820 Liters</div>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>~29,640 plastic bottles saved</span>
                  </div>
                  <div className="panel-elevated" style={{ padding: '12px' }}>
                    <div className="data-label">GRID LOAD OPTIMIZED</div>
                    <div className="data-value">96.8% Efficiency</div>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Power grid load-balancing active</span>
                  </div>
                </div>

                <button 
                  className="btn btn-outline"
                  onClick={handleCheckEcoLoad}
                  style={{ width: '100%' }}
                >
                  Analyze Environmental Grid Efficiency
                </button>

                {ecoGuideline && (
                  <div className="panel-ai" style={{ marginTop: '20px', borderLeftColor: 'var(--success)', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Recommended Eco-Actions:
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {ecoGuideline.recommendation}
                    </p>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                      Calculated at: {ecoGuideline.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: EXECUTIVE REPORTS */}
          {activeCategory === 'reports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
              <div className="panel-ai" style={{ borderLeftColor: 'var(--ai-blue)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span>📊</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>StadiumIQ Report Generator</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Compile real-time telemetry, resolved incident rates, approved AI dispatches, and green metrics into a formatted tournament report.
                </p>
              </div>

              <div className="panel" style={{ padding: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 15px 0' }}>
                  GENERATE EXECUTIVE MATCHDAY REPORT
                </h3>

                <button 
                  className="btn btn-primary"
                  onClick={handleGenerateReport}
                  disabled={generatingReport}
                  style={{ width: '100%', gap: '10px' }}
                >
                  {generatingReport ? <div className="spinner" /> : 'Compile & Generate Operational Summary'}
                </button>

                {matchReport && (
                  <div className="panel-elevated" style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        OPERATIONAL SUMMARY REPORT
                      </strong>
                      <span style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 'bold' }}>✓ GENERATED</span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 15px', marginBottom: '12px' }}>
                      <div>📍 <strong>Venue:</strong> {matchReport.venue} ({matchReport.city})</div>
                      <div>⚽ <strong>Fixture:</strong> {matchReport.teams}</div>
                      <div>⏱️ <strong>Generated:</strong> {matchReport.time}</div>
                      <div>🗳️ <strong>AI Decisions Approved:</strong> {matchReport.stats.approvedActionsCount}</div>
                      <div>📋 <strong>Active Dispatches:</strong> {matchReport.stats.dispatchedTasksCount}</div>
                      <div>📢 <strong>Alerts Broadcasted:</strong> {matchReport.stats.alertsPushed}</div>
                    </div>

                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px', lineHeight: '1.4' }}>
                      <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '2px', color: 'var(--text-primary)' }}>EXECUTIVE RUNNING LOG:</span>
                      {matchReport.summary}
                      <span style={{ display: 'block', marginTop: '6px', color: 'var(--success)' }}>🌱 {matchReport.greenSavings}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
