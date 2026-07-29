const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildGeneratePrompt, buildRefinePrompt } = require('../utils/prompts');
const { validateTrip } = require('../utils/schema');

// gemini-2.5-flash is blocked for many new API keys; flash-latest stays current.
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-flash-latest';

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured on the server.');
    err.code = 'MISSING_API_KEY';
    throw err;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  });
}

function extractJson(text) {
  if (!text || !String(text).trim()) {
    const err = new Error('Empty response from AI model.');
    err.code = 'EMPTY_RESPONSE';
    throw err;
  }

  let cleaned = String(text).trim();

  // Strip markdown fences if the model ignores instructions
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  // Attempt to locate first JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const err = new Error('AI returned malformed JSON.');
    err.code = 'MALFORMED_JSON';
    err.raw = cleaned.slice(0, 500);
    throw err;
  }
}

function normalizeBudget(budget) {
  if (!budget || typeof budget !== 'object') return budget;
  const hotel = Math.max(0, Math.round(Number(budget.hotel) || 0));
  const flights = Math.max(0, Math.round(Number(budget.flights) || 0));
  const food = Math.max(0, Math.round(Number(budget.food) || 0));
  const transport = Math.max(0, Math.round(Number(budget.transport) || 0));
  const activities = Math.max(0, Math.round(Number(budget.activities) || 0));
  const shopping = Math.max(0, Math.round(Number(budget.shopping) || 0));

  const breakdownSum = hotel + flights + food + transport + activities + shopping;
  const total = breakdownSum > 0 ? breakdownSum : Math.max(0, Math.round(Number(budget.total) || 0));

  return {
    total,
    hotel,
    flights,
    food,
    transport,
    activities,
    shopping,
  };
}

async function generateWithPrompt(prompt) {
  const model = getModel();

  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (error) {
    const message = error?.message || 'Gemini API request failed.';
    const err = new Error(message);
    if (/\b429\b|quota|rate[\s_-]?limit|resource_exhausted|exceeded/i.test(message)) {
      err.code = 'RATE_LIMIT';
    } else if (/timeout|ETIMEDOUT|DEADLINE/i.test(message)) {
      err.code = 'TIMEOUT';
    } else if (/404|no longer available|not found/i.test(message)) {
      err.code = 'API_FAILURE';
    } else {
      err.code = 'API_FAILURE';
    }
    throw err;
  }

  const text = result?.response?.text?.() ?? '';
  const parsed = extractJson(text);
  const validation = validateTrip(parsed);

  if (!validation.success) {
    const err = new Error('AI generated invalid itinerary.');
    err.code = 'INVALID_SCHEMA';
    err.details = validation.error.issues?.slice(0, 8) ?? validation.error;
    throw err;
  }

  const tripData = validation.data;
  tripData.budget = normalizeBudget(tripData.budget);
  return tripData;
}

async function generateTrip(userPrompt) {
  const prompt = buildGeneratePrompt(userPrompt);
  return generateWithPrompt(prompt);
}

async function refineTrip(existingTrip, refinement) {
  const prompt = buildRefinePrompt(existingTrip, refinement);
  return generateWithPrompt(prompt);
}

module.exports = {
  generateTrip,
  refineTrip,
  MODEL_NAME,
};
