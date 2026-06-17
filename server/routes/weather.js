const express = require('express');
const router  = express.Router();

// Uses wttr.in — completely free, no API key required
// Returns real weather data for Kisii County, Kenya
router.get('/', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      'https://wttr.in/Kisii,Kenya?format=j1',
      {
        headers: { 'Accept': 'application/json', 'User-Agent': 'ShambaSmartApp/2.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Weather API returned ${response.status}`);

    const data = await response.json();

    // Extract and shape the data for the client
    const current = data.current_condition?.[0] || {};
    const days    = data.weather || [];

    const shaped = {
      location:    'Kisii County, Kenya',
      temperature: parseInt(current.temp_C || 20),
      feelsLike:   parseInt(current.FeelsLikeC || 20),
      humidity:    parseInt(current.humidity || 70),
      windSpeed:   parseInt(current.windspeedKmph || 8),
      description: current.weatherDesc?.[0]?.value || 'Partly Cloudy',
      cloudCover:  parseInt(current.cloudcover || 50),
      precipitation: parseFloat(current.precipMM || 0),
      uvIndex:     parseInt(current.uvIndex || 4),
      forecast: days.slice(0, 3).map(d => ({
        date:     d.date,
        minTemp:  parseInt(d.mintempC || 15),
        maxTemp:  parseInt(d.maxtempC || 25),
        rainChance: Math.max(...(d.hourly || []).map(h => parseInt(h.chanceofrain || 0))),
        totalRain:  d.hourly?.reduce((s, h) => s + parseFloat(h.precipMM || 0), 0).toFixed(1),
        description: d.hourly?.[4]?.weatherDesc?.[0]?.value || 'Partly Cloudy',
        sunrise:  d.astronomy?.[0]?.sunrise || '06:25 AM',
        sunset:   d.astronomy?.[0]?.sunset  || '06:35 PM',
      })),
    };

    // Attach farming advisory based on conditions
    shaped.farmingTip = getFarmingTip(shaped);

    res.json(shaped);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(503).json({ error: 'Weather request timed out. Please try again.' });
    }
    console.error('Weather route error:', err.message);
    res.status(503).json({ error: 'Weather data temporarily unavailable. Please try again shortly.' });
  }
});

function getFarmingTip(w) {
  const tips = [];
  if (w.precipitation > 5)  tips.push('Heavy rain today — avoid fertilizer application and check drainage channels.');
  if (w.precipitation > 0 && w.precipitation <= 5) tips.push('Light rain expected — good conditions for transplanting seedlings.');
  if (w.humidity > 85)      tips.push('High humidity increases disease risk — inspect crops for fungal symptoms.');
  if (w.temperature > 30)   tips.push('High temperatures — increase irrigation frequency and mulch to retain moisture.');
  if (w.temperature < 14)   tips.push('Cool temperatures — ideal for cabbage and kale. Protect tomato seedlings.');
  if (w.uvIndex >= 8)        tips.push('Very high UV — best to work in the field early morning or late afternoon.');
  if (w.windSpeed > 30)      tips.push('Strong winds — secure greenhouse covers and delay spraying operations.');
  if (w.cloudCover < 20)    tips.push('Clear sunny day — ideal for harvesting and drying grain. Check soil moisture.');
  if (tips.length === 0)     tips.push('Favourable conditions today — good day for planting, weeding, or top dressing.');
  return tips;
}

module.exports = router;
