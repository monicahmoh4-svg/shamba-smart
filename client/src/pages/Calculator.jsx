import { useState, useMemo } from 'react';

// Real agronomic data for Kisii highlands — KES prices as of 2024/2025
const CROP_DATA = {
  'Maize': {
    emoji: '🌽',
    seedKgPerAcre: 10,    seedKESPerKg: 450,
    dapKgPerAcre: 50,
    canKgPerAcre: 50,
    labourDaysPerAcre: 18,
    yieldBagsPerAcre: 25, bagWeight: 90, bagPriceKES: 4500,
    waterLitresPerAcreDay: 3000, irrigationDays: 0,
    days: 105, pesticideKES: 800,
    notes: 'Plant at 75×30cm spacing. Top-dress with CAN at 6 weeks.',
  },
  'Beans': {
    emoji: '🫘',
    seedKgPerAcre: 30,    seedKESPerKg: 150,
    dapKgPerAcre: 25,
    canKgPerAcre: 0,
    labourDaysPerAcre: 12,
    yieldBagsPerAcre: 8, bagWeight: 90, bagPriceKES: 10800,
    waterLitresPerAcreDay: 2500, irrigationDays: 0,
    days: 75, pesticideKES: 500,
    notes: 'Fixes nitrogen. Good for soil health. Harvest before pods dry completely.',
  },
  'Tomatoes': {
    emoji: '🍅',
    seedKgPerAcre: 0.1,   seedKESPerKg: 90000,
    dapKgPerAcre: 75,
    canKgPerAcre: 75,
    labourDaysPerAcre: 35,
    yieldBagsPerAcre: 0, bagWeight: 0, bagPriceKES: 0,
    cratesPerAcre: 80, cratePriceKES: 2400,
    waterLitresPerAcreDay: 4000, irrigationDays: 45,
    days: 80, pesticideKES: 2500,
    notes: 'Stake at 30cm height. Spray weekly for blight. Harvest at 70% red.',
  },
  'Kale/Sukuma': {
    emoji: '🥬',
    seedKgPerAcre: 0.5,   seedKESPerKg: 8000,
    dapKgPerAcre: 50,
    canKgPerAcre: 60,
    labourDaysPerAcre: 20,
    yieldBagsPerAcre: 0, bagWeight: 0, bagPriceKES: 0,
    bunchesPerAcre: 4000, bunchPriceKES: 15,
    waterLitresPerAcreDay: 2500, irrigationDays: 30,
    days: 50, pesticideKES: 600,
    notes: 'Harvest outer leaves weekly. Succession plant every 2 weeks for continuous income.',
  },
  'Potatoes': {
    emoji: '🥔',
    seedKgPerAcre: 600,   seedKESPerKg: 60,
    dapKgPerAcre: 50,
    canKgPerAcre: 50,
    labourDaysPerAcre: 25,
    yieldBagsPerAcre: 40, bagWeight: 50, bagPriceKES: 1800,
    waterLitresPerAcreDay: 3500, irrigationDays: 20,
    days: 105, pesticideKES: 1500,
    notes: 'Use certified seed potatoes. Earth up at 6 weeks. Watch for blight.',
  },
  'Avocado': {
    emoji: '🥑',
    seedKgPerAcre: 0,     seedKESPerKg: 0,
    treesPerAcre: 100,    treePriceKES: 350,
    dapKgPerAcre: 25,
    canKgPerAcre: 25,
    labourDaysPerAcre: 15,
    yieldBagsPerAcre: 0, bagWeight: 0, bagPriceKES: 0,
    traysPerAcrePerYear: 300, trayPriceKES: 1200,
    waterLitresPerAcreDay: 4000, irrigationDays: 60,
    days: 365, pesticideKES: 1000,
    notes: 'Hass variety. Takes 3 years to first harvest. Long-term high-value investment.',
  },
  'Cabbage': {
    emoji: '🥦',
    seedKgPerAcre: 0.05,  seedKESPerKg: 200000,
    dapKgPerAcre: 50,
    canKgPerAcre: 60,
    labourDaysPerAcre: 22,
    yieldBagsPerAcre: 0, bagWeight: 0, bagPriceKES: 0,
    headsPerAcre: 1800, headPriceKES: 50,
    waterLitresPerAcreDay: 3000, irrigationDays: 30,
    days: 90, pesticideKES: 800,
    notes: 'Transplant at 4 weeks. Wide spacing 60×60cm for large heads.',
  },
};

const DAP_PRICE  = 85;   // KES per kg
const CAN_PRICE  = 65;   // KES per kg
const LABOUR_KES = 500;  // KES per day
const WATER_KES  = 0.05; // KES per litre (pump/irrigation cost)

function calcRevenue(crop, data, acres) {
  if (data.cratesPerAcre)  return data.cratesPerAcre * data.cratePriceKES * acres;
  if (data.bunchesPerAcre) return data.bunchesPerAcre * data.bunchPriceKES * acres;
  if (data.traysPerAcrePerYear) return data.traysPerAcrePerYear * data.trayPriceKES * acres;
  if (data.headsPerAcre)   return data.headsPerAcre * data.headPriceKES * acres;
  if (data.treesPerAcre)   return 0; // first year no revenue
  return (data.yieldBagsPerAcre || 0) * (data.bagPriceKES || 0) * acres;
}

const fmt = n => Math.round(n).toLocaleString('en-KE');

export default function Calculator() {
  const [crop,  setCrop]  = useState('Maize');
  const [acres, setAcres] = useState(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const data = CROP_DATA[crop];

  const costs = useMemo(() => {
    const a = parseFloat(acres) || 1;
    const seed     = (data.seedKgPerAcre * data.seedKESPerKg + (data.treesPerAcre ? data.treesPerAcre * data.treePriceKES : 0)) * a;
    const dap      = data.dapKgPerAcre * DAP_PRICE * a;
    const can      = data.canKgPerAcre * CAN_PRICE * a;
    const labour   = data.labourDaysPerAcre * LABOUR_KES * a;
    const water    = data.waterLitresPerAcreDay * data.irrigationDays * WATER_KES * a;
    const pest     = data.pesticideKES * a;
    const total    = seed + dap + can + labour + water + pest;
    const revenue  = calcRevenue(crop, data, a);
    const profit   = revenue - total;
    const roi      = total > 0 ? ((profit / total) * 100) : 0;
    const perAcre  = revenue / a;
    return { seed, dap, can, labour, water, pest, total, revenue, profit, roi, perAcre, a };
  }, [crop, acres, data]);

  const profitColor = costs.profit > 0 ? 'var(--green)' : costs.profit < 0 ? 'var(--red)' : 'var(--muted)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Hero */}
      <div style={{ margin: '0 -16px', position: 'relative', height: 150, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=88&fit=crop&auto=format"
          alt="Farm financial planning"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', animation: 'heroKB 12s ease forwards', display: 'block' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1400&q=85&fit=crop'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(10,31,61,0.92) 0%,rgba(20,71,160,0.50) 65%,transparent 100%)', display: 'flex', alignItems: 'center', padding: '0 26px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-d)', fontWeight: 700, color: '#fff', fontSize: 23, marginBottom: 5 }}>🧮 Farm Profit Calculator</div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.82)' }}>Know your costs and profits before you plant</div>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="card fade-up" style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Select Crop & Farm Size</div>

        {/* Crop picker */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {Object.entries(CROP_DATA).map(([name, d]) => (
            <button key={name} onClick={() => setCrop(name)} style={{
              background: crop === name ? 'var(--blue-600)' : 'var(--blue-50)',
              color: crop === name ? '#fff' : 'var(--blue-700)',
              border: `1.5px solid ${crop === name ? 'var(--blue-600)' : 'var(--blue-200)'}`,
              borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
              fontSize: 13.5, fontWeight: crop === name ? 700 : 500,
              fontFamily: 'var(--font-b)', transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {d.emoji} {name}
            </button>
          ))}
        </div>

        {/* Acreage */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 7 }}>
            Farm Size (acres)
          </label>
          <input
            type="number" min="0.25" max="100" step="0.25"
            value={acres} onChange={e => setAcres(e.target.value)}
            className="input" style={{ fontSize: 16, fontWeight: 600 }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {[0.25, 0.5, 1, 2, 5, 10].map(a => (
              <button key={a} onClick={() => setAcres(a)} style={{
                background: parseFloat(acres) === a ? 'var(--blue-100)' : 'var(--gray-100)',
                color: parseFloat(acres) === a ? 'var(--blue-700)' : 'var(--muted)',
                border: `1px solid ${parseFloat(acres) === a ? 'var(--blue-300)' : 'var(--border)'}`,
                borderRadius: 7, padding: '5px 12px', cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-b)',
              }}>{a} {a < 1 ? 'acre' : 'acres'}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Profit summary */}
      <div className="card-blue fade-up" style={{ padding: 24, color: '#fff' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', marginBottom: 4, fontWeight: 500 }}>
          {data.emoji} {crop} · {costs.a} acre{costs.a !== 1 ? 's' : ''} · {data.days} days
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 12 }}>
          {[
            { label: 'Total Costs',    value: `KES ${fmt(costs.total)}`,   sub: 'All inputs',         color: '#FCA5A5' },
            { label: 'Expected Income',value: `KES ${fmt(costs.revenue)}`, sub: 'At market price',    color: '#86EFAC' },
            { label: 'Expected Profit',value: `KES ${fmt(costs.profit)}`,  sub: `ROI: ${costs.roi.toFixed(0)}%`, color: costs.profit >= 0 ? '#86EFAC' : '#FCA5A5' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: 15, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.90)', marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, padding: '12px 14px', background: 'rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>
          💡 <strong>Verdict:</strong> {costs.profit > 0
            ? `Profitable! You earn KES ${fmt(costs.profit)} profit after all costs. ROI of ${costs.roi.toFixed(0)}%.`
            : costs.profit === 0
            ? 'Breaking even. Consider reducing costs or finding better market prices.'
            : `Loss of KES ${fmt(Math.abs(costs.profit))}. Consider a different crop or reduce input costs.`}
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="card fade-up" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showBreakdown ? 14 : 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>📊 Cost Breakdown</div>
          <button onClick={() => setShowBreakdown(p => !p)} className="btn-ghost" style={{ padding: '6px 14px', fontSize: 12.5 }}>
            {showBreakdown ? 'Hide' : 'Show'} Details
          </button>
        </div>
        {showBreakdown && (
          <div>
            {[
              { label: 'Seeds / Planting Material',   value: costs.seed,   icon: '🌱', pct: costs.seed/costs.total*100   },
              { label: 'DAP Fertilizer (basal)',       value: costs.dap,    icon: '🧪', pct: costs.dap/costs.total*100    },
              { label: 'CAN / Top-dress Fertilizer',  value: costs.can,    icon: '⚗️', pct: costs.can/costs.total*100    },
              { label: 'Labour',                       value: costs.labour, icon: '👷', pct: costs.labour/costs.total*100  },
              { label: 'Pesticides / Fungicides',      value: costs.pest,   icon: '🧴', pct: costs.pest/costs.total*100   },
              { label: 'Irrigation / Water',           value: costs.water,  icon: '💧', pct: costs.water/costs.total*100  },
            ].filter(r => r.value > 0).map((r, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < arr.length-1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-m)', fontWeight: 700, color: 'var(--text)' }}>KES {fmt(r.value)}</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--gray-200)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${r.pct}%`, background: 'linear-gradient(90deg, var(--blue-500), var(--sky))', borderRadius: 3, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{r.pct.toFixed(0)}%</span>
              </div>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '2px solid var(--blue-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Total Investment</span>
              <span style={{ fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 16, color: 'var(--blue-700)' }}>KES {fmt(costs.total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input requirements */}
      <div className="card fade-up" style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>📦 What You Need to Buy</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 10 }}>
          {[
            data.seedKgPerAcre > 0 && { label: 'Seeds', value: `${(data.seedKgPerAcre * costs.a).toFixed(1)} kg`, icon: '🌱', bg: '#f0fdf9', c: 'var(--green)' },
            data.treesPerAcre && { label: 'Seedlings', value: `${data.treesPerAcre * costs.a} trees`, icon: '🌳', bg: '#f0fdf9', c: 'var(--green)' },
            data.dapKgPerAcre > 0 && { label: 'DAP Fertilizer', value: `${data.dapKgPerAcre * costs.a} kg`, icon: '🧪', bg: 'var(--blue-50)', c: 'var(--blue-600)' },
            data.canKgPerAcre > 0 && { label: 'CAN Fertilizer', value: `${data.canKgPerAcre * costs.a} kg`, icon: '⚗️', bg: 'var(--blue-50)', c: 'var(--blue-600)' },
            { label: 'Labour Days',   value: `${data.labourDaysPerAcre * costs.a} days`, icon: '👷', bg: '#fffbeb', c: 'var(--amber)' },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ background: item.bg, borderRadius: 12, padding: '12px 13px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: item.c, fontFamily: 'var(--font-m)' }}>{item.value}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2, fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Crop tip */}
      <div className="card fade-up" style={{ padding: 18, borderLeft: '4px solid var(--amber)' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 7 }}>💡 Agronomic Tip for {crop}</div>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65 }}>{data.notes}</div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted-l)', lineHeight: 1.6 }}>
        Estimates based on Kisii County averages (2024–2025). Actual costs and yields vary with season, soil, and management. Always consult your local agronomist.
      </p>
    </div>
  );
}
