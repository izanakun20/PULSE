'use client';

import Link from 'next/link';

const CAPABILITIES = [
  { icon: '🧭', title: 'Navigation', desc: 'Provides fans with alternate entry gates and optimized concourse wayfinding.' },
  { icon: '👥', title: 'Crowd Intelligence', desc: 'Predicts section bottlenecks and occupancy surges 15-30 minutes ahead.' },
  { icon: '♿', title: 'Accessibility', desc: 'Coordinates wheelchair guides and sensory support routing.' },
  { icon: '🚇', title: 'Transportation', desc: 'Triggers staggered egress holds to balance bus and metro loads.' },
  { icon: '🌍', title: 'Multilingual', desc: 'Broadcasts translated alerts to fans in English, Spanish, and French.' },
  { icon: '🌱', title: 'Sustainability', desc: 'Monitors waste bin capacities and coordinates power-saving grid modes.' },
  { icon: '🚨', title: 'Incident Response', desc: 'Identifies fan incident reports and dispatches nearby stewards.' },
  { icon: '📊', title: 'Executive Reports', desc: 'Generates matchday summaries, efficiency levels, and operations audits.' }
];

export default function HomePage() {
  return (
    <main className="landing-root" style={{ background: '#0a0a0c', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      {/* Custom Styles exclusive to the Landing Page */}
      <style jsx global>{`
        .hero-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background-image: url('/hero_bg.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dark-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(10, 10, 12, 0.58) 0%,
            rgba(10, 10, 12, 0.35) 50%,
            rgba(10, 10, 12, 0.5) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .slow-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 2;
          animation: slowMove 20s infinite alternate ease-in-out;
        }

        @keyframes slowMove {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        .blue-glow-glow {
          position: absolute;
          top: 25%;
          left: 10%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 2;
          filter: blur(40px);
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px var(--space-xl);
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding-bottom: 20px;
        }

        .nav-links {
          display: flex;
          gap: 15px;
        }

        .nav-link-item {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .nav-link-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .hero-left {
          max-width: 580px;
          margin-top: auto;
          margin-bottom: auto;
          padding: 40px 0;
          text-align: left;
        }

        .a11y-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 600;
          color: #f3f4f6;
          margin-bottom: 15px;
        }

        .glass-card-ticker {
          background: rgba(10, 10, 12, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          border-radius: 8px;
          padding: 10px 16px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .glass-card-ticker:hover {
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .choose-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 1200px;
          margin: 40px auto var(--space-xl) auto;
          padding: 0 var(--space-xl);
        }

        .premium-role-card {
          background: rgba(15, 15, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 24px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
        }

        .premium-role-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
          background: rgba(20, 20, 25, 0.7);
        }

        .premium-role-card.fan:hover {
          box-shadow: 0 10px 30px rgba(34, 197, 94, 0.05);
          border-color: rgba(34, 197, 94, 0.25);
        }

        .premium-role-card.volunteer:hover {
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.05);
          border-color: rgba(139, 92, 246, 0.25);
        }

        .premium-role-card.operations:hover {
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.25);
        }

        .premium-role-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 15px;
        }

        .capabilities-grid-layout {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          width: 100%;
        }

        .capability-card-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 15px;
          transition: all 0.2s ease;
        }

        .capability-card-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 1024px) {
          .choose-grid {
            grid-template-columns: 1fr;
          }
          .capabilities-grid-layout {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .nav-bar {
            flex-direction: column;
            gap: 15px;
          }
          .hero-left {
            max-width: 100%;
            padding: 20px 0;
          }
          .capabilities-grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── 1. HERO BACKGROUND SECTION ── */}
      <div className="hero-container">
        <div className="dark-overlay" />
        <div className="slow-gradient" />
        <div className="blue-glow-glow" />

        <div className="hero-content-wrapper">
          {/* Top Navigation */}
          <header className="nav-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/fifa26_logo.png" 
                alt="FIFA 26 Logo" 
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
              />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                StadiumOPS
              </span>
            </div>
            <nav className="nav-links">
              <Link href="/" className="nav-link-item">Home</Link>
              <Link href="/fan" className="nav-link-item">Fan Portal</Link>
              <Link href="/volunteer" className="nav-link-item">Volunteer Portal</Link>
              <Link href="/command" className="nav-link-item">Operations Center</Link>
            </nav>
          </header>

          {/* Hero Content Area */}
          <div className="hero-left">
            <div className="a11y-badge">
              ⚽ FIFA World Cup 2026 • USA • Canada • Mexico
            </div>
            
            <h1 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '3.6rem', 
              lineHeight: '1.05', 
              color: '#ffffff',
              margin: '0 0 15px 0',
              fontWeight: '700',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              StadiumOPS
              <span style={{ display: 'block', fontSize: '1.6rem', color: 'var(--ai-blue)', marginTop: '5px', fontWeight: '500' }}>
                GenAI Matchday Intelligence Platform
              </span>
            </h1>

            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.85)', 
              lineHeight: '1.6', 
              margin: '0 0 25px 0',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)'
            }}>
              One intelligent AI platform helping fans, volunteers, venue staff, and organizers with 
              navigation, crowd intelligence, transportation, accessibility, multilingual assistance, 
              and real-time operational decision support.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/command" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '13px', textDecoration: 'none' }}>
                🚀 Explore Platform
              </Link>
              <Link href="/fan" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '13px', textDecoration: 'none', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                🤖 Meet StadiumIQ
              </Link>
            </div>
          </div>

          {/* Floating Overview Glassmorphism Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '12px', 
            width: '100%',
            marginTop: 'auto',
            paddingTop: '20px'
          }}>
            <div className="glass-card-ticker">
              <span style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>🏟️</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#fff' }}>16 Host Cities</strong>
            </div>
            <div className="glass-card-ticker">
              <span style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>⚽</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#fff' }}>104 Matches</strong>
            </div>
            <div className="glass-card-ticker">
              <span style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>🌎</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#fff' }}>3 Countries</strong>
            </div>
            <div className="glass-card-ticker">
              <span style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>🤖</span>
              <strong style={{ display: 'block', fontSize: '13px', color: 'var(--success)' }}>AI Online</strong>
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. CHOOSE YOUR EXPERIENCE ── */}
      <section style={{ maxWidth: '1200px', margin: '60px auto 0 auto', padding: '0 var(--space-xl)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '15px' }}>
          Choose Your Experience
        </h2>
      </section>

      <div className="choose-grid">
        <Link href="/fan" className="premium-role-card fan">
          <div>
            <div className="premium-role-icon" style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>👥</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', margin: '0 0 8px 0' }}>Fan Portal</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: '1.5' }}>
              AI companion for navigation, transport, accessibility and matchday assistance.
            </p>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 'bold', marginTop: '15px', display: 'block' }}>Enter Fan Portal →</span>
        </Link>

        <Link href="/volunteer" className="premium-role-card volunteer">
          <div>
            <div className="premium-role-icon" style={{ background: 'var(--warning-dim)', color: 'var(--warning)' }}>🦺</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', margin: '0 0 8px 0' }}>Volunteer Portal</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: '1.5' }}>
              AI-powered assignments, translation, routing and reporting.
            </p>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: 'bold', marginTop: '15px', display: 'block' }}>Enter Volunteer Portal →</span>
        </Link>

        <Link href="/command" className="premium-role-card operations">
          <div>
            <div className="premium-role-icon" style={{ background: 'var(--ai-blue-dim)', color: 'var(--ai-blue)' }}>🖥️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', margin: '0 0 8px 0' }}>Operations Center</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0, lineHeight: '1.5' }}>
              AI decision support, crowd intelligence and operational coordination.
            </p>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--ai-blue)', fontWeight: 'bold', marginTop: '15px', display: 'block' }}>Enter Operations Center →</span>
        </Link>
      </div>

      {/* ── 3. POWERED BY STADIUMIQ (AI CAPABILITIES) ── */}
      <section style={{ maxWidth: '1200px', margin: '60px auto 40px auto', padding: '0 var(--space-xl)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '15px' }}>
          Powered by StadiumIQ
        </h2>
        
        <div className="panel" style={{ padding: '24px' }}>
          <div className="capabilities-grid-layout">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="capability-card-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '18px' }}>{cap.icon}</span>
                  <strong style={{ fontSize: '13px', color: '#fff' }}>{cap.title}</strong>
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', margin: 0, lineHeight: '1.4' }}>
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer" style={{ borderTop: '1px solid var(--border)', marginTop: '40px', paddingTop: '20px' }}>
        <p>StadiumOPS · GenAI Matchday Intelligence Platform · FIFA World Cup 2026 Challenge Project</p>
        <p style={{ marginTop: '4px', fontSize: '11px' }}>
          This is an independent challenge project. Not affiliated with FIFA.
        </p>
      </footer>
    </main>
  );
}
