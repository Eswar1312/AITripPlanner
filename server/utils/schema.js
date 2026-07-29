const { z } = require('zod');

const activitySchema = z.object({
  time: z.string().min(1),
  place: z.string().min(1),
  description: z.string().min(1),
  cost: z.union([z.string(), z.number()]).transform(String),
  walkingDistance: z.union([z.string(), z.number()]).transform(String),
  category: z.string().min(1),
  imageHint: z.string().default(''),
  isHiddenGem: z.boolean().optional().default(false),
  isInstagramSpot: z.boolean().optional().default(false),
  foodTip: z.string().optional().default(''),
  rainBackup: z.string().optional().default(''),
  travelTip: z.string().optional().default(''),
});

const daySchema = z.object({
  day: z.number().int().positive(),
  date: z.string().optional().default(''),
  title: z.string().min(1),
  activities: z.array(activitySchema).min(1),
});

const budgetSchema = z.object({
  total: z.number(),
  hotel: z.number(),
  food: z.number(),
  transport: z.number(),
  activities: z.number(),
  shopping: z.number(),
  flights: z.number().optional().default(0),
});

const emergencySchema = z.object({
  name: z.string().min(1),
  number: z.string().min(1),
});

const tripSchema = z.object({
  tripName: z.string().min(1),
  destination: z.string().min(1),
  duration: z.string().min(1),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  budget: budgetSchema,
  summary: z.string().min(1),
  weather: z.string().min(1),
  tripScore: z.number().min(0).max(100),
  packing: z.array(z.string().min(1)).min(1),
  emergency: z.array(emergencySchema).min(1),
  days: z.array(daySchema).min(1),
  budgetRisk: z.string().optional().default('balanced'),
  travelTips: z.array(z.string()).optional().default([]),
});

function validateTrip(data) {
  return tripSchema.safeParse(data);
}

module.exports = {
  tripSchema,
  activitySchema,
  daySchema,
  budgetSchema,
  validateTrip,
};
