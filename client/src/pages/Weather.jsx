import { useState, useEffect } from 'react';
import { getWeather } from '../api.js';

const WEATHER_ICONS = {
  sunny: '☀️', clear: '☀️', 'partly cloudy': '⛅', cloudy: '☁️',
  overcast: '☁️', mist: '🌫️', fog: '🌫️', drizzle: '🌦️',
  rain: '🌧️', 'heavy rain': '🌧️', thunder: '⛈️', storm: '⛈️',
  snow: '❄️', sleet: '🌨️', blizzard: '❄️', default: '🌤️',
};

function getIcon(desc = '') {
  const d = desc.toLowerCase();
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (d.includes(key)) return icon;
  }
  return WEATHER_ICONS.default;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' });
}

const StatBox = ({ icon, label, value, unit, color = 'var(--blue-600)' }) => (
  <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-100)', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
    <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 20, color }}>{value}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)', marginLeft: 2 }}>{unit}</span></div>
    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3, fontWeight: 500 }}>{label}</div>
  </div>
);

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await getWeather();
      setWeather(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Could not load weather data.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 16, animation: 'pulse 2s infinite' }}>🌤️</div>
      <div style={{ color: 'var(--muted)', fontSize: 15 }}>Fetching live weather for Kisii...</div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ margin: '0 -16px', position: 'relative', height: 140, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1504608524841-42584120d693?w=1400&q=88&fit=crop" alt="Weather" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,31,61,0.75)', display: 'flex', alignItems: 'center', padding: '0 26px' }}>
          <div style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: '#fff', fontSize: 22 }}>🌤️ Live Farm Weather</div>
        </div>
      </div>
      <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 14, padding: 20, display: 'flex', gap: 12 }}>
        <span style={{ fontSize: 24 }}>⚠️</span>
        <div>
          <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>Weather Unavailable</div>
          <div style={{ fontSize: 13.5, color: '#7f1d1d', lineHeight: 1.6 }}>{error}</div>
          <button onClick={load} className="btn-primary" style={{ marginTop: 12, padding: '9px 18px', fontSize: 13 }}>🔄 Try Again</button>
        </div>
      </div>
    </div>
  );

  const w = weather;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Hero */}
      <div style={{ margin: '0 -16px', position: 'relative', height: 155, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1504608524841-42584120d693?w=1400&q=88&fit=crop&auto=format"
          alt="Weather and farming"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', animation: 'heroKB 12s ease forwards', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,31,61,0.92) 0%, rgba(20,71,160,0.50) 65%, transparent 100%)', display: 'flex', alignItems: 'center', padding: '0 26px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: '#fff', fontSize: 23, marginBottom: 5 }}>🌤️ Live Farm Weather</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)' }}>{w.location} · Updated {lastUpdated?.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
        <button onClick={load} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.30)', color: '#fff', borderRadius: 8, padding: '6px 13px', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, backdropFilter: 'blur(8px)' }}>
          🔄 Refresh
        </button>
      </div>

      {/* Current conditions */}
      <div className="card fade-up" style={{ padding: 24, borderTop: '4px solid var(--blue-500)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 56, lineHeight: 1 }}>{getIcon(w.description)}</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 6, fontWeight: 500 }}>{w.description}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: 56, fontWeight: 700, color: 'var(--blue-700)', lineHeight: 1 }}>{w.temperature}°</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Feels like {w.feelsLike}°C</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))', gap: 10 }}>
          <StatBox icon="💧" label="Humidity"     value={w.humidity}     unit="%"    color="var(--blue-600)" />
          <StatBox icon="💨" label="Wind Speed"   value={w.windSpeed}    unit="km/h" color="var(--sky)"      />
          <StatBox icon="🌧️" label="Rainfall"     value={w.precipitation} unit="mm" color="var(--blue-600)" />
          <StatBox icon="☀️" label="UV Index"     value={w.uvIndex}      unit=""     color={w.uvIndex >= 7 ? '#dc2626' : w.uvIndex >= 4 ? '#f59e0b' : '#10b981'} />
        </div>
      </div>

      {/* Farming tips */}
      <div className="card fade-up" style={{ padding: 20, borderLeft: '4px solid var(--green)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 13 }}>🌱 Today's Farming Recommendations</div>
        {(w.farmingTip || []).map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i < w.farmingTip.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>✅</span>
            <span style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.6 }}>{tip}</span>
          </div>
        ))}
      </div>

      {/* 3-Day Forecast */}
      <div>
        <div className="section-label">3-Day Forecast</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(w.forecast || []).map((day, i) => (
            <div key={i} className="card fade-up" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                <span style={{ fontSize: 30 }}>{getIcon(day.description)}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)' }}>{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDate(day.date)}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{day.description}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Rain</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: day.rainChance > 60 ? 'var(--blue-600)' : day.rainChance > 30 ? 'var(--sky)' : 'var(--muted)' }}>{day.rainChance}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: 15, fontWeight: 700, color: 'var(--blue-700)' }}>{day.maxTemp}°</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{day.minTemp}°</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sun times */}
      {w.forecast?.[0] && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '🌅', label: 'Sunrise', value: w.forecast[0].sunrise, tip: 'Best time to start fieldwork' },
            { icon: '🌇', label: 'Sunset',  value: w.forecast[0].sunset,  tip: 'Finish harvesting before dark' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 16, textAlign: 'center', borderTop: `3px solid ${i === 0 ? '#f59e0b' : '#8b5cf6'}` }}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11.5, color: 'var(--blue-500)', marginTop: 5, fontWeight: 500 }}>{s.tip}</div>
            </div>
          ))}
        </div>
      )}

      {/* Planting condition indicator */}
      <div className="card fade-up" style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>🌡️ Field Conditions Today</div>
        {[
          { label: 'Planting',    ok: w.precipitation < 10 && w.temperature >= 16 && w.temperature <= 30, good: 'Soil moisture ideal', bad: 'Too wet or too cold' },
          { label: 'Spraying',    ok: w.windSpeed < 20 && w.precipitation < 1,  good: 'Calm — spray now', bad: 'Too windy or wet' },
          { label: 'Harvesting',  ok: w.precipitation < 2 && w.cloudCover < 70,  good: 'Dry — good harvest day', bad: 'Risk of moisture damage' },
          { label: 'Fertilizing', ok: w.precipitation < 5,                        good: 'Apply before light rain', bad: 'Avoid — rain will wash off fertilizer' },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{c.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 12.5, color: c.ok ? 'var(--green)' : '#dc2626', fontWeight: 500 }}>{c.ok ? c.good : c.bad}</div>
              <span style={{ fontSize: 18 }}>{c.ok ? '✅' : '⚠️'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
