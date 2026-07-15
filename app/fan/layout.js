/**
 * StadiumOPS — Fan Layout Wrapper with Transparent A11y Navbar
 */

'use client';

import Link from 'next/link';

export default function FanLayout({ children }) {
  return (
    <div className="fan-layout animate-in" style={{ minHeight: '100vh', background: '#0a0a0c' }}>
      
      {/* Custom styles exclusive to Fan layout */}
      <style jsx global>{`
        .fan-navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(10, 10, 12, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
        }

        .fan-nav-links {
          display: flex;
          gap: 12px;
        }

        .fan-nav-link {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .fan-nav-link:hover, .fan-nav-link.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .fan-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 1024px) {
          .fan-nav-links {
            display: none; /* Collapsed on mobile for clean screen spacing */
          }
        }
      `}</style>

      {/* Transparent navbar with slight blur */}
      <header className="fan-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#fff' }}>
            StadiumOPS
          </span>
          <span className="badge" style={{ fontSize: '9px', fontWeight: 'bold', padding: '2px 8px', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            FAN PORTAL
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="fan-nav-links">
          <Link href="/fan" className="fan-nav-link active">Home</Link>
          <Link href="/" className="fan-nav-link">Main Portal</Link>
          <Link href="/volunteer" className="fan-nav-link">Volunteer</Link>
          <Link href="/command" className="fan-nav-link">Operations</Link>
        </nav>

        {/* Right Side Options */}
        <div className="fan-nav-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
            <span>🌐</span>
            <strong>EN</strong>
          </div>
          
          <button aria-label="Notifications" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '15px', padding: 0 }}>
            🔔
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <span>👤</span>
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <strong style={{ display: 'block', fontSize: '12px', color: '#fff' }}>Siddharth</strong>
              <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Fan ID: F123456</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Egress Container (Full width to allow cover banners) */}
      <main className="fan-viewport-main" style={{ width: '100%', margin: '0 auto', paddingBottom: '60px' }}>
        {children}
      </main>
    </div>
  );
}
