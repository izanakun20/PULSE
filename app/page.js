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
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          padding: 24px 40px;
        }

        .dark-overlay-main {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(2, 2, 4, 0.45);
          pointer-events: none;
          z-index: 1;
        }

        .hero-glow-main {
          position: absolute;
          top: 25%;
          left: 15%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 2;
          filter: blur(80px);
        }

        .nav-bar-main {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 60px;
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
          font-weight: 700;
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

        /* Rebuilt Hero: Vertical Flexbox Layout */
        .hero-vertical-layout {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin: 90px auto 0 auto; /* Top margin from navbar: 90px */
          text-align: center;
        }

        /* Premium Masking Card to hide background baked-in text */
        .hero-masking-card {
          background: rgba(2, 2, 4, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 1050px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }

        .moment-badge {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          color: var(--ai-blue);
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 4px 12px;
          border-radius: 50px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 20px; /* Badge -> Heading: 20px */
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
          max-width: 900px; /* Max width: 900px */
          margin: 0 0 28px 0; /* Heading -> Description: 28px */
        }

        .main-hero-desc {
          font-size: 18px; /* Use 18px font */
          color: #f3f4f6; /* High contrast */
          line-height: 1.6;
          max-width: 700px; /* Maximum width: 700px */
          margin: 0 auto 32px auto; /* Description -> Buttons: 32px */
        }

        .cta-buttons-row {
          display: flex;
          gap: 20px; /* Gap: 20px */
          justify-content: center;
          margin-bottom: 60px; /* Buttons -> Feature Grid: 60px */
        }

        /* 8-Card Responsive Feature Grid below buttons */
        .capabilities-grid-layout-main {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px; /* Grid spacing: 24px */
          width: 100%;
          margin-bottom: 70px; /* Feature Grid -> Portal Cards: 70px */
        }

        .capability-card-item-main {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border-radius: 8px; /* Rounded corners */
          padding: 20px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .capability-card-item-main:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px); /* Hover animation */
        }

        .cap-bar-icon-main {
          font-size: 20px; /* Icon above title */
        }

        .cap-bar-title-main {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .cap-bar-desc-main {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          line-height: 1.4;
        }

        /* Portal Cards */
        .choose-portal-row-main {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* Three equal-width premium cards */
          gap: 20px;
          width: 100%;
          margin-bottom: 60px;
        }

        .mock-portal-card-main {
          background: rgba(10, 10, 15, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 8px;
          padding: 20px;
          text-decoration: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
        }

        .mock-portal-card-main:hover {
          background: rgba(15, 15, 20, 0.9);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-3px);
        }

        .mock-portal-card-left-main {
          display: flex;
          align-items: center;
          gap: 15px;
          text-align: left;
        }

        .mock-portal-icon-box-main {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .mock-portal-title-main {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 2px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mock-portal-desc-main {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
          margin: 0;
          line-height: 1.3;
        }

        .mock-portal-arrow-main {
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

        .mock-portal-card-main:hover .mock-portal-arrow-main {
          border-color: #fff;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .bottom-overview-ticker-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 20px;
          margin-top: auto;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
        }

        .ticker-items-group-main {
          display: flex;
          gap: 32px;
        }

        .ticker-metric-main {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ticker-metric-val-main {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: bold;
          color: #fff;
        }

        .ticker-metric-lbl-main {
          font-size: 8px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 2px;
        }

        @media (max-width: 1024px) {
          .capabilities-grid-layout-main {
            grid-template-columns: repeat(2, 1fr);
          }
          .choose-portal-row-main {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .bottom-overview-ticker-main {
            flex-direction: column;
            gap: 15px;
          }
        }

        @media (max-width: 768px) {
          .nav-bar-main {
            flex-direction: column;
            height: auto;
            gap: 15px;
          }
          .capabilities-grid-layout-main {
            grid-template-columns: 1fr;
          }
          .main-hero-title {
            font-size: 2rem;
          }
          .main-hero-desc {
            font-size: 15px;
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

        {/* Rebuilt Hero: Clean Vertical Flexbox Layout */}
        <div className="hero-vertical-layout">
          <div className="hero-masking-card">
            
            {/* 1. Small Badge */}
            <span className="moment-badge">
              One AI. Every Stadium. Every Moment.
            </span>
            
            {/* 2. Main Heading (Centered, max-width 900px, ONLY ONE heading) */}
            <h1 className="main-hero-title">
              Intelligent Operations.<br />Unforgettable Experiences.
            </h1>

            {/* 3. Description (Centered, max-width 700px, 18px font, high contrast) */}
            <p className="main-hero-desc">
              StadiumIQ empowers fans, volunteers, and organizers with real-time intelligence 
              for safer, smarter, and seamless matchdays.
            </p>

            {/* 4. Primary & Secondary CTA (Center aligned, gap 20px) */}
            <div className="cta-buttons-row">
              <Link href="/command" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '13px', textDecoration: 'none' }}>
                Explore Platform
              </Link>
              <Link href="/fan" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '13px', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Meet StadiumIQ
              </Link>
            </div>

            {/* 5. Feature Grid (8-card responsive grid below buttons, grid spacing 24px) */}
            <div className="capabilities-grid-layout-main">
              <div className="capability-card-item-main">
                <span className="cap-bar-icon-main">🧭</span>
                <strong className="cap-bar-title-main">Venue Navigation</strong>
                <p className="cap-bar-desc-main">Find the fastest route to your gate section.</p>
              </div>

              <div className="capability-card-item-main">
                <span className="cap-bar-icon-main">👥</span>
                <strong className="cap-bar-title-main">Crowd Intelligence</strong>
                <p className="cap-bar-desc-main">Predict section bottlenecks and density surges.</p>
              </div>

              <div className="capability-card-item-main">
                <span className="cap-bar-icon-main">🚍</span>
                <strong className="cap-bar-title-main">Transportation</strong>
                <p className="cap-bar-desc-main">Balance metro, bus, and shuttle egress loads.</p>
              </div>

              <div className="capability-card-item-main">
                <span className="cap-bar-icon-main">♿</span>
                <strong className="cap-bar-title-main">Accessibility</strong>
                <p className="cap-bar-desc-main">Coordinate wheelchair and sensory assistance.</p>
              </div>

              <div className="capability-card-item-main">
                <span className="cap-bar-icon-main">🌍</span>
                <strong className="cap-bar-title-main">Multilingual Support</strong>
                <p className="cap-bar-desc-main">Broadcast translations in EN, ES, and FR.</p>
              </div>

              <div className="capability-card-item-main">
                <span className="cap-bar-icon-main">🌱</span>
                <strong className="cap-bar-title-main">Sustainability</strong>
                <p className="cap-bar-desc-main">Eco-standby power and water waste controls.</p>
              </div>

              <div className="capability-card-item-main">
                <span className="cap-bar-icon-main">📋</span>
                <strong className="cap-bar-title-main">Executive Reports</strong>
                <p className="cap-bar-desc-main">Compile tournament summaries and audits.</p>
              </div>

              <div className="capability-card-item-main">
                <span className="cap-bar-icon-main">🚨</span>
                <strong className="cap-bar-title-main">Incident Response</strong>
                <p className="cap-bar-desc-main">Dispatch security and medical volunteers.</p>
              </div>
            </div>

            {/* 6. Choose Your Experience Portal Cards (3 equal width cards, 60px from grid) */}
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>
                Choose Your Experience
              </div>
              
              <div className="choose-portal-row-main">
                <Link href="/fan" className="mock-portal-card-main">
                  <div className="mock-portal-card-left-main">
                    <div className="mock-portal-icon-box-main" style={{ background: 'rgba(34, 197, 94, 0.12)', color: 'var(--success)' }}>👥</div>
                    <div>
                      <h4 className="mock-portal-title-main">Fan Portal</h4>
                      <p className="mock-portal-desc-main">Your AI companion for seamless matchday experiences.</p>
                    </div>
                  </div>
                  <div className="mock-portal-arrow-main">→</div>
                </Link>

                <Link href="/volunteer" className="mock-portal-card-main">
                  <div className="mock-portal-card-left-main">
                    <div className="mock-portal-icon-box-main" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>🦺</div>
                    <div>
                      <h4 className="mock-portal-title-main">Volunteer Portal</h4>
                      <p className="mock-portal-desc-main">AI-powered tools to help you serve better and stay connected.</p>
                    </div>
                  </div>
                  <div className="mock-portal-arrow-main">→</div>
                </Link>

                <Link href="/command" className="mock-portal-card-main">
                  <div className="mock-portal-card-left-main">
                    <div className="mock-portal-icon-box-main" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--ai-blue)' }}>🖥️</div>
                    <div>
                      <h4 className="mock-portal-title-main">Operations Center</h4>
                      <p className="mock-portal-desc-main">Real-time intelligence and decision support for organizers.</p>
                    </div>
                  </div>
                  <div className="mock-portal-arrow-main">→</div>
                </Link>
              </div>
            </div>

            {/* Bottom Live Matchday Overview Ticker */}
            <div className="bottom-overview-ticker-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="pulse-dot" style={{ background: 'var(--success)' }} />
                <strong>LIVE MATCHDAY OVERVIEW</strong>
              </div>

              <div className="ticker-items-group-main">
                <div className="ticker-metric-main">
                  <span className="ticker-metric-val-main">16</span>
                  <span className="ticker-metric-lbl-main">Host Cities</span>
                </div>
                <div className="ticker-metric-main">
                  <span className="ticker-metric-val-main">104</span>
                  <span className="ticker-metric-lbl-main">Matches</span>
                </div>
                <div className="ticker-metric-main">
                  <span className="ticker-metric-val-main">48</span>
                  <span className="ticker-metric-lbl-main">Teams</span>
                </div>
                <div className="ticker-metric-main">
                  <span className="ticker-metric-val-main">3</span>
                  <span className="ticker-metric-lbl-main">Countries</span>
                </div>
                <div className="ticker-metric-main">
                  <span className="ticker-metric-val-main">1</span>
                  <span className="ticker-metric-lbl-main">Global Platform</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>AI STATUS</span>
                <strong style={{ color: 'var(--success)' }}>● OPERATIONAL</strong>
              </div>
            </div>

          </div>
        </div>

      </div>

    </main>
  );
}
