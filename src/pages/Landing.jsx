import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PromptInput from '../components/PromptInput';
import Footer from '../components/Footer';
import LoadingSkeleton from '../components/LoadingSkeleton';
import RetryPopup from '../components/RetryPopup';
import { useTrip } from '../hooks/useTrip';

export default function Landing() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const { createTrip, status, error, retry, setError, setStatus } = useTrip();

  const handleGenerate = async ({ from, destination, budget, startDate, endDate, days }) => {
    if (!from?.trim() || !destination?.trim() || !budget || Number(budget) <= 0) {
      toast.error('Please enter From, Destination, and a valid Budget.');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Please select both Start Date and End Date for your trip.');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      toast.error('End Date must be on or after Start Date.');
      return;
    }
    const calculatedDays = days > 0 ? days : Math.round((end - start) / (1000 * 3600 * 24)) + 1;
    if (calculatedDays < 1 || calculatedDays > 60) {
      toast.error('Trip duration must be between 1 and 60 days.');
      return;
    }

    const startFormatted = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const endFormatted = end.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    const preferencesSection = isRelevantTripPreference(description, { from, destination })
      ? `

TRIP PREFERENCES ONLY — use these for interests, pace, food, and activities. Do not let any destination, duration, dates, or budget mentioned here override the authoritative details above:
${description.trim()}`
      : '';
    const tripRequest = `AUTHORITATIVE TRIP DETAILS — these values must be used exactly:
From: ${from.trim()}
Destination: ${destination.trim()}
Start Date: ${startFormatted} (${startDate})
End Date: ${endFormatted} (${endDate})
Duration: ${calculatedDays} days
Total budget: ₹${Number(budget).toLocaleString('en-IN')}

CRITICAL DATE RULE: Each day in "days" array MUST have an explicit "date" property assigned, starting from Day 1 on ${startFormatted} and incrementing by 1 day for each day.
${preferencesSection}`;
    const ok = await createTrip(tripRequest);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <AnimatePresence mode="wait">
        {status === 'loading' ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSkeleton />
          </motion.div>
        ) : (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <Hero onExampleClick={setDescription} />
            <div className="px-4 pb-16 sm:px-6">
              <PromptInput
                value={description}
                onChange={setDescription}
                onSubmit={handleGenerate}
                loading={status === 'loading'}
              />
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <Footer />

      {status === 'error' && error && (
        <RetryPopup
          error={error}
          onRetry={async () => {
            const ok = await retry();
            if (ok) navigate('/dashboard');
          }}
          onDismiss={() => {
            setError(null);
            setStatus('idle');
          }}
        />
      )}
    </div>
  );
}

function isRelevantTripPreference(description, { from, destination }) {
  const text = String(description || '').trim();
  if (!text) return false;

  const normalizedText = text.toLowerCase();
  const tokens = normalizedText.match(/[a-z]{2,}/g) || [];
  const tripTokens = new Set(
    [from, destination]
      .flatMap((value) => String(value || '').toLowerCase().match(/[a-z]{2,}/g) || [])
      .filter(Boolean)
  );

  const travelKeywords = [
    'travel',
    'trip',
    'vacation',
    'holiday',
    'family',
    'friends',
    'solo',
    'couple',
    'food',
    'beach',
    'mountain',
    'nature',
    'culture',
    'museum',
    'shopping',
    'relax',
    'adventure',
    'hiking',
    'nightlife',
    'hotel',
    'slow',
    'vegetarian',
    'sightseeing',
    'itinerary',
    'budget',
    'pace',
    'local',
    'road',
    'explore',
  ];

  if (tokens.some((word) => travelKeywords.some((keyword) => word.startsWith(keyword)))) {
    return true;
  }

  return tokens.some((word) => tripTokens.has(word));
}

