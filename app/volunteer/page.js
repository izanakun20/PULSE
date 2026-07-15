/**
 * StadiumOPS — Volunteer Active Task Dispatch Dashboard
 */

'use client';

import { useState } from 'react';
import { usePulse } from '@/lib/store';
import TaskCard from '@/components/volunteer/TaskCard';
import { TODAY_MATCHES } from '@/lib/constants';

export default function VolunteerPage() {
  const { state, dispatch } = usePulse();
  const { volunteerTasks, currentVenue, currentHostCity, currentMatchId, fanAlerts } = state;

  // Active matchday context
  const activeMatch = TODAY_MATCHES.find(m => m.id === currentMatchId) || TODAY_MATCHES[0];

  // Tool states
  const [activeVolunteerTool, setActiveVolunteerTool] = useState(null);
  
  // Quick Report states
  const [reportType, setReportType] = useState('hazard');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Translation states
  const [phraseToTranslate, setPhraseToTranslate] = useState('');
  const [translationOutput, setTranslationOutput] = useState('');

  const handleUpdateStatus = (taskId, status) => {
    dispatch({
      type: 'UPDATE_TASK_STATUS',
      payload: { taskId, status }
    });
  };

  // Submit quick report from field
  const handleQuickReport = async () => {
    if (!reportDetails.trim()) return;
    setReportSuccess(true);

    const newEvent = {
      id: `evt_vol_report_${Date.now()}`,
      type: 'incident_report',
      zone: 'west',
      severity: reportType === 'medical' ? 'high' : 'elevated',
      timestamp: new Date().toISOString(),
      data: {
        incidentType: reportType,
        location: 'Section 114 (West Stand)',
        description: reportDetails,
        message: `⚠️ Field Report: ${reportType.toUpperCase()} - ${reportDetails} reported by Steward Marcus Chen at Section 114.`
      }
    };

    // Add to local store events list immediately (which triggers agent pipeline)
    dispatch({
      type: 'ADD_EVENTS',
      payload: [newEvent]
    });

    setReportDetails('');
    setTimeout(() => setReportSuccess(false), 3000);
  };

  // Translate phrase for fan
  const handleTranslatePhrase = () => {
    if (!phraseToTranslate.trim()) return;
    setTranslationOutput(`🌍 translations:
• [ES]: ${translateToSpanish(phraseToTranslate)}
• [FR]: ${translateToFrench(phraseToTranslate)}`);
  };

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

  // Filter tasks
  const activeTasks = volunteerTasks.filter(t => t.status === 'active');
  const pendingTasks = volunteerTasks.filter(t => t.status === 'pending');
  const completedTasks = volunteerTasks.filter(t => t.status === 'completed');

  // Filter emergency alerts pushed by coordinator
  const emergencyBroadcasts = fanAlerts.filter(a => a.urgency === 'critical' || a.urgency === 'high');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* ── 1. SHIFT BRANDING & RADIO OVERVIEW ── */}
      <div style={{ background: '#1c1917', color: '#fafaf9', padding: '12px 15px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 'bold' }}>
          <span>SHIFT: 14:00 - 22:00 (ACTIVE)</span>
          <span style={{ color: '#22c55e' }}>● RADIO CONNECTED</span>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--success)' }}>
          CHANNEL 4: WEST-STEWARDS
        </div>
        <div style={{ fontSize: '11px', color: '#a8a29e' }}>
          Fixture: {activeMatch.home} vs {activeMatch.away} • {currentVenue}
        </div>
      </div>

      {/* ── 2. ACTIVE AI DISPATCH TASKS ── */}
      {volunteerTasks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activeTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', margin: '0 0 8px 0', color: '#16a34a', borderBottom: '2px solid #16a34a', paddingBottom: '2px', letterSpacing: '0.5px' }}>
                ACTIVE AI ASSIGNMENTS ({activeTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}

          {pendingTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', margin: '10px 0 8px 0', color: '#dc2626', borderBottom: '2px solid #dc2626', paddingBottom: '2px', letterSpacing: '0.5px' }}>
                PENDING ACCEPTANCE ({pendingTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', margin: '15px 0 8px 0', color: '#666', borderBottom: '2px solid #666', paddingBottom: '2px', letterSpacing: '0.5px' }}>
                COMPLETED TODAY ({completedTasks.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.85 }}>
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── 3. SHIFT STANDBY / CHECKLIST (IF NO TASKS DISPATCHED) ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div className="panel" style={{ padding: '15px', borderColor: '#1c1917', background: '#fff' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#1c1917', margin: '0 0 10px 0', borderBottom: '2px solid #1c1917', paddingBottom: '4px' }}>
              UPCOMING SHIFT CHECKLIST
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked disabled style={{ transform: 'scale(1.2)' }} />
                <span>Verify section barrier gates G7/G8 locks</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" defaultChecked disabled style={{ transform: 'scale(1.2)' }} />
                <span>Confirm local sector water refilling is clear</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                <strong>Perform radio check with Concourse lead</strong>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                <strong>Confirm accessible routes are clear of obstacles</strong>
              </label>
            </div>
          </div>

          {/* Pending Instructions / Supervisor Memo */}
          <div className="panel" style={{ padding: '15px', borderColor: '#e5e5e5', background: '#f5f5f4' }}>
            <strong style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '4px' }}>
              PENDING INSTRUCTIONS
            </strong>
            <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.4', color: '#444' }}>
              StadiumIQ analysis shows inbound queue surges forming at Gate 7. Wayfinding redirects might activate. Maintain present concourse routing coordinates and stand by for radio updates.
            </p>
          </div>
        </div>
      )}

      {/* ── 4. STADIUM SECTOR NAVIGATION MAP ── */}
      <div className="panel" style={{ padding: '15px', background: '#fff', borderColor: '#1c1917' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#1c1917', margin: '0 0 10px 0', borderBottom: '2px solid #1c1917', paddingBottom: '4px' }}>
          NAVIGATION MAP · WEST STAND
        </h2>
        
        {/* Custom SVG Navigation map */}
        <div style={{ width: '100%', height: '140px', background: '#f5f5f4', borderRadius: '4px', border: '1.5px solid #1c1917', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <svg width="220" height="120" viewBox="0 0 220 120">
            <ellipse cx="110" cy="60" rx="80" ry="45" fill="none" stroke="#e5e5e5" strokeWidth="6" />
            {/* Highlighted West Sector (where Marcus is assigned) */}
            <path d="M 30 60 A 80 45 0 0 1 50 30" fill="none" stroke="#16a34a" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="110" cy="60" rx="50" ry="25" fill="none" stroke="#e5e5e5" strokeWidth="2" />
            <circle cx="20" cy="60" r="5" fill="#dc2626" />
            <text x="28" y="63" fill="#1c1917" fontSize="8" fontWeight="bold">Gate 7 (Busy)</text>
          </svg>
          <div style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '9px', fontWeight: 'bold', background: '#1c1917', color: '#fff', padding: '2px 6px', borderRadius: '2px' }}>
            Current Zone: West Concourse
          </div>
        </div>

        <div style={{ marginTop: '10px', fontSize: '12px', color: '#444', lineHeight: '1.4' }}>
          <strong>AI Route Guide:</strong> Concourse West is currently at 82% density. Main gate G7 has high wait times. Shortest path to assist: walk north to corridor W-2.
        </div>
      </div>

      {/* ── 5. INTERACTIVE VOLUNTEER TOOLS ── */}
      <div className="panel" style={{ padding: '15px', background: '#fff', borderColor: '#1c1917' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: '#1c1917', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Volunteer Tools
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { id: 'report', label: 'Quick Report', icon: '⚠️' },
            { id: 'translate', label: 'Translation Tool', icon: '🌍' },
            { id: 'broadcast', label: 'AI Broadcasts', icon: '📢', badge: emergencyBroadcasts.length },
            { id: 'team', label: 'Nearby Team', icon: '👥' }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveVolunteerTool(activeVolunteerTool === tool.id ? null : tool.id)}
              className="btn btn-outline"
              style={{
                justifyContent: 'flex-start',
                fontSize: '12px',
                padding: '10px 12px',
                borderColor: '#1c1917',
                color: '#1c1917',
                background: activeVolunteerTool === tool.id ? '#f5f5f4' : 'transparent',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '15px' }}>{tool.icon}</span>
              <span>{tool.label}</span>
              {tool.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '12px',
                  backgroundColor: '#dc2626',
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
                  {tool.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TOOL PANEL EXPANSIONS ── */}
        {activeVolunteerTool && (
          <div className="panel-elevated animate-in" style={{ marginTop: '15px', padding: '12px', background: '#fafaf9', border: '1.5px solid #1c1917' }}>
            
            {/* TOOL 1: QUICK REPORT */}
            {activeVolunteerTool === 'report' && (
              <div>
                <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>QUICK INCIDENT REPORT</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    style={{ background: '#fff', border: '1.5px solid #1c1917', borderRadius: '4px', padding: '6px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="hazard">Facility Spill / Slip hazard</option>
                    <option value="medical">Minor Medical Aid requested</option>
                    <option value="lost">Lost Person support</option>
                    <option value="access">Accessibility path blocked</option>
                  </select>
                  
                  <textarea
                    rows="2"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe issue (e.g. wet floor at section 112)"
                    style={{ background: '#fff', border: '1.5px solid #1c1917', borderRadius: '4px', padding: '8px', fontSize: '12px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                  />

                  <button className="btn btn-primary" onClick={handleQuickReport}>Submit Report</button>
                </div>
                {reportSuccess && (
                  <p style={{ margin: 0, fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>
                    ✓ Report logged and synced with Operations Center! Specialist agents notified.
                  </p>
                )}
              </div>
            )}

            {/* TOOL 2: TRANSLATION TOOL */}
            {activeVolunteerTool === 'translate' && (
              <div>
                <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>TRANSLATE INSTRUCTIONS</strong>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={phraseToTranslate}
                    onChange={(e) => setPhraseToTranslate(e.target.value)}
                    placeholder="Enter English phrase, e.g. Where is concourse?"
                    style={{ flex: 1, background: '#fff', border: '1.5px solid #1c1917', borderRadius: '4px', padding: '6px', fontSize: '12px', outline: 'none' }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleTranslatePhrase}>Translate</button>
                </div>
                {translationOutput && (
                  <pre style={{ margin: 0, fontSize: '11px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#444' }}>{translationOutput}</pre>
                )}
              </div>
            )}

            {/* TOOL 3: EMERGENCY BROADCASTS */}
            {activeVolunteerTool === 'broadcast' && (
              <div>
                <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px', color: '#dc2626' }}>EMERGENCY BROADCAST FEED</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {emergencyBroadcasts.length === 0 ? (
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>No active emergency broadcasts at this time.</p>
                  ) : (
                    emergencyBroadcasts.map(broadcast => (
                      <div key={broadcast.id} style={{ padding: '8px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '4px', fontSize: '11.5px', color: '#991b1b', lineHeight: '1.3' }}>
                        🔔 <strong>{broadcast.title}:</strong> {broadcast.messages.en}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TOOL 4: NEARBY TEAM */}
            {activeVolunteerTool === 'team' && (
              <div>
                <strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>STEWARDS IN WEST STAND</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #e5e5e5' }}>
                    <span>👤 Luca Bianchi (Gate Steward)</span>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>● Gate 7</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #e5e5e5' }}>
                    <span>👤 Nina Petrov (Wayfinding Guide)</span>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>● Gate 7 outer</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>👤 Emma Johansson (Wayfinding Guide)</span>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>● Gate 8</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
