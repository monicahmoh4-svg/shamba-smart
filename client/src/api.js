const BASE = '/api';

async function req(url, options = {}) {
  const r = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Crops
export const getCrops    = ()                => req('/crops');

// Market prices
export const getMarket   = ()                => req('/market');

// AI features
export const askAdvisor  = (message, history)            => req('/ai/advisor', { method: 'POST', body: { message, history } });
export const diagnose    = (crop, symptoms, description) => req('/ai/doctor',  { method: 'POST', body: { crop, symptoms, description } });

// Weather (real data — no API key needed on client)
export const getWeather  = ()                => req('/weather');

// Contact / support messages
export const sendMessage = (name, phone, message) => req('/admin/messages', { method: 'POST', body: { name, phone, message } });

// Health check
export const checkHealth = () => req('/health');
