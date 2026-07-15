'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing-root" style={{ background: '#020204', minHeight: '100vh', color: '#fff', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      
      {/* Custom CSS overrides to match the exact mockup composition */}
      <style jsx global>{`
        .hero-container-main {
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
          justify-content: space-between;
          padding: 24px 40px;
        }

        .dark-overlay-main {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(2, 2, 4, 0.45) 0%,
            rgba(2, 2, 4, 0.25) 50%,
            rgba(2, 2, 4, 0.5) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .hero-glow-main {
          position: absolute;
          top: 35%;
          left: 15%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: 2;
          filter: blur(60px);
        }

        .nav-bar-main {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .brand-block {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-text-wrapper {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .brand-name {
          font-family: var(--font-display);
          font-size: 20px;
          fontWeight: 700;
          letter-spacing: 0.05em;
          color: #fff;
          margin: 0;
          line-height: 1.1;
        }

        .brand-sub {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 2px;
          letter-spacing: 0.02em;
        }

        .header-badge-right {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.85);
        }

        .hero-center-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: auto auto;
          text-align: center;
          padding: 40px 20px;
        }

        .moment-badge {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          color: var(--ai-blue);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: inline-block;
        }

        .main-hero-title {
          font-family: var(--font-display);
          font-size: 2.8rem;
          line-height: 1.1;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin: 0 0 15px 0;
          text-shadow: 0 4px 15px rgba(0,0,0,0.6);
        }

        .main-hero-desc {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          max-width: 620px;
          margin: 0 auto 30px auto;
          text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }

        .capabilities-bar-row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 20px;
        }

        .cap-bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
        }

        .cap-bar-icon {
          font-size: 16px;
          margin-bottom: 2px;
        }

        .choose-portal-row {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 30px auto;
        }

        .mock-portal-card {
          background: rgba(10, 10, 15, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 20px;
          text-decoration: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }

        .mock-portal-card:hover {
          background: rgba(15, 15, 20, 0.85);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .mock-portal-card-left {
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
        }

        .mock-portal-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .mock-portal-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 2px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mock-portal-desc {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
          line-height: 1.3;
        }

        .mock-portal-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.2s ease;
        }

        .mock-portal-card:hover .mock-portal-arrow {
          border-color: #fff;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .bottom-overview-ticker {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 15px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
        }

        .ticker-items-group {
          display: flex;
          gap: 24px;
        }

        .ticker-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ticker-metric-val {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: bold;
          color: #fff;
        }

        .ticker-metric-lbl {
          font-size: 8px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 2px;
        }

        @media (max-width: 1024px) {
          .choose-portal-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .bottom-overview-ticker {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>

      {/* ── MAIN HERO WRAPPER WITH BACKGROUND ── */}
      <div className="hero-container-main">
        <div className="dark-overlay-main" />
        <div className="hero-glow-main" />

        {/* Top Navbar */}
        <header className="nav-bar-main">
          <div className="brand-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/fifa26_logo.png" 
              alt="FIFA 26 logo badge" 
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
            />
            <div className="brand-text-wrapper">
              <span className="brand-name">StadiumOPS</span>
              <span className="brand-sub">GenAI Matchday Intelligence Platform</span>
            </div>
          </div>

          <div className="header-badge-right">
            <span>🌐</span>
            <strong>FIFA WORLD CUP 2026</strong>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>|</span>
            <span>USA • CANADA • MEXICO</span>
          </div>
        </header>

        {/* Center Hero Block */}
        <div className="hero-center-content">
          <span className="moment-badge">
            One AI. Every Stadium. Every Moment.
          </span>
          
          <h2 className="main-hero-title">
            Intelligent Operations.<br />Unforgettable Experiences.
          </h2>

          <p className="main-hero-desc">
            StadiumIQ empowers fans, volunteers, and organizers with real-time intelligence 
            for safer, smarter, and seamless matchdays.
          </p>

          {/* Capabilities Bar Row (8 Icons matching screenshot) */}
          <div className="capabilities-bar-row">
            <div className="cap-bar-item">
              <span className="cap-bar-icon">📍</span>
              <strong>VENUE NAVIGATION</strong>
            </div>
            <div className="cap-bar-item">
              <span className="cap-bar-icon">👥</span>
              <strong>CROWD INTELLIGENCE</strong>
            </div>
            <div className="cap-bar-item">
              <span className="cap-bar-icon">🚍</span>
              <strong>TRANSPORTATION PLANNER</strong>
            </div>
            <div className="cap-bar-item">
              <span className="cap-bar-icon">♿</span>
              <strong>ACCESSIBILITY ASSISTANT</strong>
            </div>
            <div className="cap-bar-item">
              <span className="cap-bar-icon">🌍</span>
              <strong>MULTILINGUAL SUPPORT</strong>
            </div>
            <div className="cap-bar-item">
              <span className="cap-bar-icon">🌱</span>
              <strong>SUSTAINABILITY MONITOR</strong>
            </div>
            <div className="cap-bar-item">
              <span className="cap-bar-icon">📋</span>
              <strong>EXECUTIVE REPORTS</strong>
            </div>
            <div className="cap-bar-item">
              <span className="cap-bar-icon">🚨</span>
              <strong>INCIDENT RESPONSE</strong>
            </div>
          </div>

          {/* Core Navigation Triggers */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '30px' }}>
            <Link href="/command" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '13px', textDecoration: 'none' }}>
              🚀 Explore Platform
            </Link>
            <Link href="/fan" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '13px', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
              🤖 Meet StadiumIQ
            </Link>
          </div>
        </div>

        {/* Portal Entry Blocks (Choose Your Experience) */}
        <div style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '12px' }}>
            Choose Your Experience
          </div>
          
          <div className="choose-portal-row">
            <Link href="/fan" className="mock-portal-card">
              <div className="mock-portal-card-left">
                <div className="mock-portal-icon-box" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--ai-blue)' }}>👥</div>
                <div>
                  <h4 className="mock-portal-title">Fan Portal</h4>
                  <p className="mock-portal-desc">Your AI companion for seamless matchday experiences.</p>
                </div>
              </div>
              <div className="mock-portal-arrow">→</div>
            </Link>

            <Link href="/volunteer" className="mock-portal-card">
              <div className="mock-portal-card-left">
                <div className="mock-portal-icon-box" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>🦺</div>
                <div>
                  <h4 className="mock-portal-title">Volunteer Portal</h4>
                  <p className="mock-portal-desc">AI-powered tools to help you serve better and stay connected.</p>
                </div>
              </div>
              <div className="mock-portal-arrow">→</div>
            </Link>

            <Link href="/command" className="mock-portal-card">
              <div className="mock-portal-card-left">
                <div className="mock-portal-icon-box" style={{ background: 'rgba(34, 197, 94, 0.12)', color: 'var(--success)' }}>🖥️</div>
                <div>
                  <h4 className="mock-portal-title">Operations Center</h4>
                  <p className="mock-portal-desc">Real-time intelligence and decision support for organizers.</p>
                </div>
              </div>
              <div className="mock-portal-arrow">→</div>
            </Link>
          </div>

          {/* Bottom Live Matchday Overview Ticker */}
          <div className="bottom-overview-ticker">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot" style={{ background: 'var(--success)' }} />
              <strong>LIVE MATCHDAY OVERVIEW</strong>
            </div>

            <div className="ticker-items-group">
              <div className="ticker-metric">
                <span className="ticker-metric-val">16</span>
                <span className="ticker-metric-lbl">Host Cities</span>
              </div>
              <div className="ticker-metric">
                <span className="ticker-metric-val">104</span>
                <span className="ticker-metric-lbl">Matches</span>
              </div>
              <div className="ticker-metric">
                <span className="ticker-metric-val">48</span>
                <span className="ticker-metric-lbl">Teams</span>
              </div>
              <div className="ticker-metric">
                <span className="ticker-metric-val">3</span>
                <span className="ticker-metric-lbl">Countries</span>
              </div>
              <div className="ticker-metric">
                <span className="ticker-metric-val">1</span>
                <span className="ticker-metric-lbl">Global Platform</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>AI STATUS</span>
              <strong style={{ color: 'var(--success)' }}>● OPERATIONAL</strong>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}
