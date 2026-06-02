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

export const getCrops    = ()                            => req('/crops');
export const getMarket   = ()                            => req('/market');
export const askAdvisor  = (message, history)            => req('/ai/advisor', { method: 'POST', body: { message, history } });
export const diagnose    = (crop, symptoms, description) => req('/ai/doctor',  { method: 'POST', body: { crop, symptoms, description } });
export const sendMessage = (name, phone, message)        => req('/admin/messages', { method: 'POST', body: { name, phone, message } });
