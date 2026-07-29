export const EXAMPLE_PROMPTS = [
  {
    label: 'Weekend in Goa',
    text: 'Plan a relaxed 3-day weekend in Goa. Budget ₹40,000. I love beaches, seafood, and sunset cafes. Prefer slow paced days and avoid long walks. Include a couple of hidden gems.',
  },
  {
    label: 'Japan Cherry Blossom',
    text: 'I want a 7-day cherry blossom trip to Japan in spring. Budget ₹2,50,000 for two. Mix of Tokyo and Kyoto. Love culture, food, and Instagram spots. Vegetarian options needed.',
  },
  {
    label: 'Europe Backpacking',
    text: 'Create a 10-day Europe backpacking itinerary across Paris, Amsterdam, and Berlin. Budget €1,800. Hostel stays, nightlife, museums, and street food. Keep walking manageable.',
  },
];

export const REFINE_PRESETS = [
  'Reduce budget',
  'More nightlife',
  'Family friendly',
  'Less walking',
  'More shopping',
  'More hidden gems',
  'Better vegetarian food',
];

export const LOADING_MESSAGES = [
  'Finding destinations...',
  'Checking weather...',
  'Planning itinerary...',
  'Calculating budget...',
  'Finding hidden gems...',
  'Mapping slow-paced days...',
  'Polishing travel tips...',
];

export const SAVED_TRIPS_KEY = 'talk2trip_saved_trips';
export const THEME_KEY = 'talk2trip_theme';
export const LAST_PROMPT_KEY = 'talk2trip_last_prompt';

export const CATEGORY_COLORS = {
  sightseeing: 'from-amber-400 to-orange-500',
  food: 'from-amber-400 to-orange-500',
  beach: 'from-amber-400 to-teal-500',
  adventure: 'from-emerald-400 to-green-600',
  culture: 'from-amber-400 to-orange-500',
  shopping: 'from-pink-400 to-rose-500',
  relaxation: 'from-teal-400 to-amber-400',
  nightlife: 'from-fuchsia-500 to-purple-700',
};

export function createActivityId() {
  return `act_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeBudget(budget) {
  if (!budget || typeof budget !== 'object') {
    return {
      total: 0,
      hotel: 0,
      flights: 0,
      food: 0,
      transport: 0,
      activities: 0,
      shopping: 0,
    };
  }

  const hotel = Math.max(0, Math.round(Number(budget.hotel) || 0));
  const flights = Math.max(0, Math.round(Number(budget.flights) || 0));
  const food = Math.max(0, Math.round(Number(budget.food) || 0));
  const transport = Math.max(0, Math.round(Number(budget.transport) || 0));
  const activities = Math.max(0, Math.round(Number(budget.activities) || 0));
  const shopping = Math.max(0, Math.round(Number(budget.shopping) || 0));

  const breakdownSum = hotel + flights + food + transport + activities + shopping;
  const rawTotal = Math.max(0, Math.round(Number(budget.total) || 0));

  // If breakdownSum exists, total strictly equals breakdownSum so breakdown items and total never disagree
  const total = breakdownSum > 0 ? breakdownSum : rawTotal;

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

export function normalizeTrip(trip) {
  if (!trip) return trip;
  return {
    ...trip,
    budget: normalizeBudget(trip.budget),
  };
}

export function enrichTripWithIds(trip) {
  const normalized = normalizeTrip(trip);
  return {
    ...normalized,
    days: (normalized.days || []).map((day) => ({
      ...day,
      activities: (day.activities || []).map((activity) => ({
        ...activity,
        id: activity.id || createActivityId(),
        favorite: Boolean(activity.favorite),
      })),
    })),
  };
}

export function formatCurrency(value, fallbackPrefix = '₹') {
  if (typeof value === 'string') return value;
  if (typeof value !== 'number' || Number.isNaN(value)) return `${fallbackPrefix}0`;
  return `${fallbackPrefix}${value.toLocaleString('en-IN')}`;
}

export function getBudgetRiskMeta(risk = 'balanced') {
  const normalized = String(risk).toLowerCase();
  if (normalized.includes('high')) {
    return { label: 'High Risk', tone: 'text-rose-700 bg-rose-500/15 border-rose-400/30 dark:text-rose-300' };
  }
  if (normalized.includes('low')) {
    return { label: 'Low Risk', tone: 'text-emerald-700 bg-emerald-500/15 border-emerald-400/30 dark:text-emerald-300' };
  }
  return { label: 'Balanced', tone: 'text-amber-700 bg-amber-500/15 border-amber-400/30 dark:text-amber-300' };
}

export function computeTripDates(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return { days: 0, valid: false };
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return { days: 0, valid: false };
  const diffTime = end.getTime() - start.getTime();
  const days = Math.round(diffTime / (1000 * 3600 * 24)) + 1;
  return { days, valid: days >= 1 && days <= 60, startDate: startDateStr, endDate: endDateStr };
}

export function formatDateString(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
