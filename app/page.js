'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredPortal, setHoveredPortal] = useState(null); // 'fan' | 'volunteer' | 'operations' | null
  const containerRef = useRef(null);
  const fgRefs = useRef({});
  const [coords, setCoords] = useState({
    bgRect: { left: 0, top: 0, width: 0, height: 0 },
    hotspots: {},
    fgCards: {},
  });

  const updateCoordinates = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    if (!containerWidth || !containerHeight) return;

    const imgRatio = 1024 / 682; // 1.501466 aspect ratio of hero_bg.jpg
    const containerRatio = containerWidth / containerHeight;
    let bgWidth, bgHeight, bgLeft, bgTop;

    if (containerRatio > imgRatio) {
      bgWidth = containerWidth;
      bgHeight = containerWidth / imgRatio;
      bgLeft = 0;
      bgTop = (containerHeight - bgHeight) / 2;
    } else {
      bgHeight = containerHeight;
      bgWidth = containerHeight * imgRatio;
      bgLeft = (containerWidth - bgWidth) / 2;
      bgTop = 0;
    }

    // Exact normalized bounding boxes of the 3 portal regions baked into hero_bg.jpg
    const hotspotDefs = {
      fan: { 
        normLeft: 0.074, normTop: 0.783, normWidth: 0.229, normHeight: 0.082, 
        color: '#22c55e', rgb: '34, 197, 94', label: 'Fan Portal' 
      },
      volunteer: { 
        normLeft: 0.371, normTop: 0.783, normWidth: 0.229, normHeight: 0.082, 
        color: '#8b5cf6', rgb: '139, 92, 246', label: 'Volunteer Portal' 
      },
      operations: { 
        normLeft: 0.668, normTop: 0.783, normWidth: 0.229, normHeight: 0.082, 
        color: '#3b82f6', rgb: '59, 130, 246', label: 'Operations Center' 
      },
    };

    const hotspots = {};
    Object.entries(hotspotDefs).forEach(([id, def]) => {
      const left = bgLeft + def.normLeft * bgWidth;
      const top = bgTop + def.normTop * bgHeight;
      const width = def.normWidth * bgWidth;
      const height = def.normHeight * bgHeight;
      hotspots[id] = {
        left,
        top,
        width,
        height,
        centerX: left + width / 2,
        centerY: top, // Center top edge for connection line attachment
        color: def.color,
        rgb: def.rgb,
        label: def.label,
      };
    });

    const fgCards = {};
    const containerRect = container.getBoundingClientRect();
    Object.entries(fgRefs.current).forEach(([id, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const left = rect.left - containerRect.left + container.scrollLeft;
        const top = rect.top - containerRect.top + container.scrollTop;
        fgCards[id] = {
          left,
          top,
          width: rect.width,
          height: rect.height,
          centerX: left + rect.width / 2,
          centerY: top + rect.height, // Center bottom edge for connection line attachment
        };
      }
    });

    setCoords({
      bgRect: { left: bgLeft, top: bgTop, width: bgWidth, height: bgHeight },
      hotspots,
      fgCards,
    });
  }, []);

  useEffect(() => {
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    
    let observer;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        updateCoordinates();
      });
      observer.observe(containerRef.current);
    }
    
    const timer1 = setTimeout(updateCoordinates, 100);
    const timer2 = setTimeout(updateCoordinates, 350);

    return () => {
      window.removeEventListener('resize', updateCoordinates);
      if (observer) observer.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [updateCoordinates]);

  useEffect(() => {
    const handleScroll = () => updateCoordinates();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [updateCoordinates]);

  return (
    <main className="landing-root" style={{ background: '#020204', minHeight: '100vh', color: '#fff', fontFamily: 'var(--font-body)', overflowX: 'hidden', opacity: isNavigating ? 0.3 : 1, transition: 'opacity 300ms ease' }}>
      
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
          background: linear-gradient(180deg, rgba(2, 2, 4, 0.55) 0%, rgba(2, 2, 4, 0.45) 60%, rgba(2, 2, 4, 0.15) 78%, rgba(2, 2, 4, 0.65) 100%);
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
          z-index: 14;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin: 60px auto 0 auto;
          text-align: center;
          pointer-events: none;
        }

        .hero-vertical-layout > * {
          pointer-events: auto;
        }

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
          margin-bottom: 30px;
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

        /* Foreground Portal Section */
        .foreground-portal-section {
          background: rgba(10, 10, 16, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          border-radius: 16px;
          padding: 28px 40px;
          width: 100%;
          max-width: 1050px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
          margin-bottom: 220px; /* Space to reveal the 3 background portal boxes below */
        }

        .choose-portal-row-main {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
        }

        .mock-portal-card-main {
          background: rgba(10, 10, 15, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border-radius: 8px;
          padding: 20px;
          text-decoration: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mock-portal-card-main:hover, .mock-portal-card-main.is-highlighted {
          background: rgba(14, 14, 22, 0.95);
          transform: translateY(-8px);
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
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mock-portal-card-main:hover .mock-portal-arrow-main,
        .mock-portal-card-main.is-highlighted .mock-portal-arrow-main {
          transform: translateX(6px);
          border-color: #fff;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Interactive Background Hotspots HUD */
        @keyframes hotspotPulse {
          0%, 100% {
            box-shadow: 0 0 0px transparent;
            border-color: rgba(255, 255, 255, 0.12);
            background: rgba(2, 2, 4, 0.03);
          }
          50% {
            box-shadow: 0 0 18px rgba(59, 130, 246, 0.28);
            border-color: rgba(255, 255, 255, 0.32);
            background: rgba(255, 255, 255, 0.05);
          }
        }

        @keyframes flowDash {
          to {
            stroke-dashoffset: -28;
          }
        }

        .bg-hotspot-zone {
          position: absolute;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          cursor: pointer;
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
          animation: hotspotPulse 4s infinite ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-decoration: none;
          z-index: 11;
        }

        .bg-hotspot-zone:hover, .bg-hotspot-zone.is-hovered {
          animation: none;
          transform: translateY(-4px) scale(1.02);
        }

        .hotspot-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border-color: rgba(255, 255, 255, 0.35);
          transition: all 300ms ease;
          pointer-events: none;
        }

        .bg-hotspot-zone:hover .hotspot-corner, .bg-hotspot-zone.is-hovered .hotspot-corner {
          width: 14px;
          height: 14px;
          border-color: #fff;
        }

        .bottom-overview-ticker-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1050px;
          background: rgba(2, 2, 4, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          border-radius: 12px;
          padding: 16px 28px;
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
          .foreground-portal-section {
            margin-bottom: 180px;
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
      <div className="hero-container-main" ref={containerRef}>
        <div className="dark-overlay-main" />
        <div className="hero-glow-main" />

        {/* Interactive Background Hotspots (Z-index 11) */}
        {Object.entries(coords.hotspots).map(([id, hotspot]) => {
          const isHovered = hoveredPortal === id;
          const routeMap = { fan: '/fan', volunteer: '/volunteer', operations: '/operations' };
          
          return (
            <Link
              key={`bg-hotspot-${id}`}
              href={routeMap[id]}
              role="link"
              aria-label={`Interactive background map region: navigate to ${hotspot.label}`}
              className={`bg-hotspot-zone ${isHovered ? 'is-hovered' : ''}`}
              style={{
                left: `${hotspot.left}px`,
                top: `${hotspot.top}px`,
                width: `${hotspot.width}px`,
                height: `${hotspot.height}px`,
                borderColor: isHovered ? hotspot.color : undefined,
                boxShadow: isHovered 
                  ? `0 0 35px rgba(${hotspot.rgb}, 0.65), inset 0 0 25px rgba(${hotspot.rgb}, 0.35)` 
                  : undefined,
                background: isHovered ? `rgba(${hotspot.rgb}, 0.16)` : undefined,
              }}
              onMouseEnter={() => setHoveredPortal(id)}
              onMouseLeave={() => setHoveredPortal(null)}
              onFocus={() => setHoveredPortal(id)}
              onBlur={() => setHoveredPortal(null)}
              onClick={() => setIsNavigating(true)}
            >
              <span className="hotspot-corner" style={{ top: 4, left: 4, borderTop: `2px solid ${isHovered ? hotspot.color : 'rgba(255,255,255,0.3)'}`, borderLeft: `2px solid ${isHovered ? hotspot.color : 'rgba(255,255,255,0.3)'}` }} />
              <span className="hotspot-corner" style={{ top: 4, right: 4, borderTop: `2px solid ${isHovered ? hotspot.color : 'rgba(255,255,255,0.3)'}`, borderRight: `2px solid ${isHovered ? hotspot.color : 'rgba(255,255,255,0.3)'}` }} />
              <span className="hotspot-corner" style={{ bottom: 4, left: 4, borderBottom: `2px solid ${isHovered ? hotspot.color : 'rgba(255,255,255,0.3)'}`, borderLeft: `2px solid ${isHovered ? hotspot.color : 'rgba(255,255,255,0.3)'}` }} />
              <span className="hotspot-corner" style={{ bottom: 4, right: 4, borderBottom: `2px solid ${isHovered ? hotspot.color : 'rgba(255,255,255,0.3)'}`, borderRight: `2px solid ${isHovered ? hotspot.color : 'rgba(255,255,255,0.3)'}` }} />
            </Link>
          );
        })}

        {/* Animated Connection Lines Overlay (Z-index 12) */}
        <svg 
          className="connection-lines-svg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${containerRef.current?.scrollHeight || 1350}px`,
            pointerEvents: 'none',
            zIndex: 12,
          }}
        >
          <defs>
            {Object.entries(coords.hotspots).map(([id, hotspot]) => (
              <linearGradient key={`grad-${id}`} id={`line-grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={hotspot.color} stopOpacity="0.95" />
                <stop offset="100%" stopColor={hotspot.color} stopOpacity="0.45" />
              </linearGradient>
            ))}
          </defs>

          {Object.entries(coords.hotspots).map(([id, hotspot]) => {
            const fg = coords.fgCards[id];
            if (!fg || !hotspot) return null;

            const isHovered = hoveredPortal === id;
            const x1 = fg.centerX;
            const y1 = fg.centerY;
            const x2 = hotspot.centerX;
            const y2 = hotspot.centerY;
            const midY = (y1 + y2) / 2;
            const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

            return (
              <g key={`conn-${id}`} style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 300ms ease' }}>
                <path
                  d={d}
                  stroke={`url(#line-grad-${id})`}
                  strokeWidth="3"
                  fill="none"
                  style={{ filter: `drop-shadow(0 0 10px ${hotspot.color})` }}
                />
                <path
                  d={d}
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  fill="none"
                  style={{ animation: 'flowDash 1s linear infinite' }}
                />
                <circle cx={x1} cy={y1} r="4.5" fill={hotspot.color} style={{ filter: `drop-shadow(0 0 6px ${hotspot.color})` }} />
                <circle cx={x2} cy={y2} r="5.5" fill={hotspot.color} style={{ filter: `drop-shadow(0 0 8px ${hotspot.color})` }} />
              </g>
            );
          })}
        </svg>

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
            
            <span className="moment-badge">
              One AI. Every Stadium. Every Moment.
            </span>
            
            <h1 className="main-hero-title">
              Intelligent Operations.<br />Unforgettable Experiences.
            </h1>

            <p className="main-hero-desc">
              StadiumIQ empowers fans, volunteers, and organizers with real-time intelligence 
              for safer, smarter, and seamless matchdays.
            </p>

            <div className="cta-buttons-row">
              <Link href="/command" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '13px', textDecoration: 'none' }}>
                Explore Platform
              </Link>
              <Link href="/fan" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '13px', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Meet StadiumIQ
              </Link>
            </div>

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
          </div>

          {/* 6. Choose Your Experience Foreground Portal Cards */}
          <div className="foreground-portal-section">
            <div style={{ textAlign: 'center', fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>
              Choose Your Experience • Hover or Click Interactive Background Map Below
            </div>
            
            <div className="choose-portal-row-main">
              <Link 
                ref={el => { fgRefs.current['fan'] = el; }}
                href="/fan" 
                className={`mock-portal-card-main ${hoveredPortal === 'fan' ? 'is-highlighted' : ''}`}
                style={{
                  borderColor: hoveredPortal === 'fan' ? '#22c55e' : undefined,
                  boxShadow: hoveredPortal === 'fan' ? '0 0 28px rgba(34, 197, 94, 0.45), 0 20px 45px rgba(0, 0, 0, 0.6)' : undefined,
                }}
                onClick={() => setIsNavigating(true)}
                onMouseEnter={() => setHoveredPortal('fan')}
                onMouseLeave={() => setHoveredPortal(null)}
                onFocus={() => setHoveredPortal('fan')}
                onBlur={() => setHoveredPortal(null)}
                aria-label="Enter the Fan Portal Companion experience"
              >
                <div className="mock-portal-card-left-main">
                  <div className="mock-portal-icon-box-main" style={{ background: 'rgba(34, 197, 94, 0.12)', color: 'var(--success)' }}>👥</div>
                  <div>
                    <h4 className="mock-portal-title-main">Fan Portal</h4>
                    <p className="mock-portal-desc-main">Your AI companion for seamless matchday experiences.</p>
                  </div>
                </div>
                <div className="mock-portal-arrow-main">→</div>
              </Link>

              <Link 
                ref={el => { fgRefs.current['volunteer'] = el; }}
                href="/volunteer" 
                className={`mock-portal-card-main ${hoveredPortal === 'volunteer' ? 'is-highlighted' : ''}`}
                style={{
                  borderColor: hoveredPortal === 'volunteer' ? '#8b5cf6' : undefined,
                  boxShadow: hoveredPortal === 'volunteer' ? '0 0 28px rgba(139, 92, 246, 0.45), 0 20px 45px rgba(0, 0, 0, 0.6)' : undefined,
                }}
                onClick={() => setIsNavigating(true)}
                onMouseEnter={() => setHoveredPortal('volunteer')}
                onMouseLeave={() => setHoveredPortal(null)}
                onFocus={() => setHoveredPortal('volunteer')}
                onBlur={() => setHoveredPortal(null)}
                aria-label="Enter the Volunteer Shift Dispatch and Translation Portal"
              >
                <div className="mock-portal-card-left-main">
                  <div className="mock-portal-icon-box-main" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>🦺</div>
                  <div>
                    <h4 className="mock-portal-title-main">Volunteer Portal</h4>
                    <p className="mock-portal-desc-main">AI-powered tools to help you serve better and stay connected.</p>
                  </div>
                </div>
                <div className="mock-portal-arrow-main">→</div>
              </Link>

              <Link 
                ref={el => { fgRefs.current['operations'] = el; }}
                href="/operations" 
                className={`mock-portal-card-main ${hoveredPortal === 'operations' ? 'is-highlighted' : ''}`}
                style={{
                  borderColor: hoveredPortal === 'operations' ? '#3b82f6' : undefined,
                  boxShadow: hoveredPortal === 'operations' ? '0 0 28px rgba(59, 130, 246, 0.45), 0 20px 45px rgba(0, 0, 0, 0.6)' : undefined,
                }}
                onClick={() => setIsNavigating(true)}
                onMouseEnter={() => setHoveredPortal('operations')}
                onMouseLeave={() => setHoveredPortal(null)}
                onFocus={() => setHoveredPortal('operations')}
                onBlur={() => setHoveredPortal(null)}
                aria-label="Enter the Operations Center Command and Simulation Center"
              >
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

    </main>
  );
}
