import { useState } from 'react';
import Dashboard    from './pages/Dashboard.jsx';
import AIAdvisor    from './pages/AIAdvisor.jsx';
import CropDoctor   from './pages/CropDoctor.jsx';
import PlantingCal  from './pages/PlantingCalendar.jsx';
import MarketPrices from './pages/MarketPrices.jsx';
import Weather      from './pages/Weather.jsx';
import Calculator   from './pages/Calculator.jsx';

const TABS = [
  { id: 'dashboard',  icon: '🏡', label: 'Home'       },
  { id: 'advisor',    icon: '🤖', label: 'AI Chat'    },
  { id: 'doctor',     icon: '🔬', label: 'Doctor'     },
  { id: 'calendar',   icon: '📅', label: 'Planting'   },
  { id: 'market',     icon: '💹', label: 'Market'     },
  { id: 'weather',    icon: '🌤️', label: 'Weather'    },
  { id: 'calculator', icon: '🧮', label: 'Calculator'  },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Header ──────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'linear-gradient(135deg, #0a1f3d 0%, #1447a0 55%, #1a5fc8 100%)',
        boxShadow: '0 2px 20px rgba(10,31,61,0.35)',
        padding: '0 20px', height: 66,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="float" style={{
            width: 44, height: 44, borderRadius: 13,
            background: 'rgba(255,255,255,0.18)',
            border: '1.5px solid rgba(255,255,255,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>🌾</div>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 700, fontSize: 20, color: '#fff', lineHeight: 1.1 }}>
              Shamba Smart
            </div>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.60)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500 }}>
              Agriculture & Food Security
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)', borderRadius: 999, padding: '6px 14px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pdot 2s ease infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Kisii, Kenya</span>
        </div>
      </header>

      {/* ── Tab Nav ─────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 66, zIndex: 90,
        background: '#ffffff', borderBottom: '1.5px solid var(--border)',
        boxShadow: '0 2px 12px rgba(20,71,160,0.07)',
        padding: '8px 12px', display: 'flex', gap: 3, overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? 'linear-gradient(135deg, var(--blue-600), var(--blue-700))' : 'transparent',
            color: tab === t.id ? '#fff' : 'var(--muted)',
            border: 'none', borderRadius: 10, padding: '8px 14px',
            fontFamily: 'var(--font-b)', fontWeight: tab === t.id ? 700 : 500,
            fontSize: 12.5, cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 5,
            transition: 'all 0.22s ease',
            boxShadow: tab === t.id ? '0 3px 12px rgba(26,95,200,0.28)' : 'none',
          }}>
            <span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {/* ── Content ─────────────────────────────────── */}
      <main style={{ maxWidth: 740, margin: '0 auto', padding: '22px 16px 80px' }}>
        {tab === 'dashboard'  && <Dashboard onNav={setTab} />}
        {tab === 'advisor'    && <AIAdvisor />}
        {tab === 'doctor'     && <CropDoctor />}
        {tab === 'calendar'   && <PlantingCal />}
        {tab === 'market'     && <MarketPrices />}
        {tab === 'weather'    && <Weather />}
        {tab === 'calculator' && <Calculator />}
      </main>
    </div>
  );
}
