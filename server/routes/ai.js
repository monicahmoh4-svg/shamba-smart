require('dotenv').config();
const express   = require('express');
const router    = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const db        = require('../db');

const MODEL  = 'claude-sonnet-4-6';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ADVISOR_SYSTEM = `You are Shamba AI, an expert agricultural advisor for smallholder farmers in Kenya and East Africa, especially Kisii County (highlands 1500-2000m altitude). You have deep expertise in:
- Local crop varieties and optimal growing conditions for Kisii highlands
- Common pests, diseases, and organic or affordable treatments available in Kenya
- Soil management with locally available and affordable resources
- Market timing and post-harvest handling techniques
- Climate-smart farming, water conservation, and irrigation
- Kenya government agricultural programs, KALRO resources, and subsidies
- Farm business planning, input costs, and profitability

Response style: warm, practical, encouraging. Use simple language a farmer can act on immediately. Give specific, actionable advice. Mention costs in Kenyan Shillings where relevant. Keep responses 150-320 words. Use numbered steps for procedures. Put the most critical information first.`;

const DOCTOR_SYSTEM = `You are a Crop Disease and Pest Specialist for East African smallholder farming. Based on described symptoms, provide a structured diagnosis:

**Diagnosis** — name the most likely disease or pest specifically
**Confidence** — High / Medium / Low, with brief reason
**Immediate Action** — exactly what to do TODAY to stop spread
**Organic Treatment** — specific affordable local methods (neem, ash, soap solution, pyrethrum, etc.) with preparation instructions
**Chemical Treatment** — exact product names sold in Kenyan agrovets with approximate KES cost per litre/kg and application rate
**Prevention** — 2-3 specific steps to avoid this next season
**Spread Risk** — Yes/No and how fast it spreads to neighbouring plants

Be specific with product names, dilution rates, and KES costs. Keep response under 400 words.`;

// POST /api/ai/advisor
router.post('/advisor', async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured. Set it in your environment variables.' });
    }

    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const messages = [
      ...history.slice(-12).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await client.messages.create({
      model: MODEL, max_tokens: 700, system: ADVISOR_SYSTEM, messages,
    });

    const reply = response.content[0].text;
    db.logQuery('advisor', message, reply).catch(() => {});
    res.json({ reply });

  } catch (err) {
    console.error('AI Advisor error:', err.message);
    const msg = err.status === 401 ? 'Invalid ANTHROPIC_API_KEY — check your environment variables.'
      : err.status === 429 ? 'Rate limit reached — please wait a moment and try again.'
      : err.message || 'AI service error. Please try again.';
    res.status(500).json({ error: msg });
  }
});

// POST /api/ai/doctor
router.post('/doctor', async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured. Set it in your environment variables.' });
    }

    const { crop, symptoms = [], description } = req.body;
    if (!crop && !symptoms.length && !description) {
      return res.status(400).json({ error: 'Please provide at least a crop name, symptoms, or description.' });
    }

    const userMessage = `Crop: ${crop || 'Unknown'}
Symptoms: ${symptoms.length ? symptoms.join(', ') : 'None specified'}
Details: ${description || 'None provided'}
Location: Kisii County, Kenya highlands (1500-2000m)`;

    const response = await client.messages.create({
      model: MODEL, max_tokens: 800, system: DOCTOR_SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.content[0].text;
    db.logQuery('doctor', userMessage, reply).catch(() => {});
    res.json({ reply });

  } catch (err) {
    console.error('AI Doctor error:', err.message);
    const msg = err.status === 401 ? 'Invalid ANTHROPIC_API_KEY — check your environment variables.'
      : err.status === 429 ? 'Rate limit reached — please wait a moment and try again.'
      : err.message || 'AI service error. Please try again.';
    res.status(500).json({ error: msg });
  }
});

module.exports = router;
