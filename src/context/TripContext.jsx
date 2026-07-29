import { useCallback, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { generateTrip, refineTrip } from '../services/api';
import { enrichTripWithIds, LAST_PROMPT_KEY } from '../utils/constants';
import { validateTrip } from '../utils/schema';
import { TripContext } from './TripContextDef';


export function TripProvider({ children }) {
  const [trip, setTrip] = useState(null);
  const [prompt, setPrompt] = useState(() => localStorage.getItem(LAST_PROMPT_KEY) || '');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [isRefining, setIsRefining] = useState(false);
  const latestCreateRequestId = useRef(0);

  const applyValidatedTrip = useCallback((rawTrip, { clearOnFail = true } = {}) => {
    const result = validateTrip(rawTrip);
    if (!result.success) {
      const validationError = {
        code: 'INVALID_SCHEMA',
        message: 'AI generated invalid itinerary.',
        details: result.error.issues?.slice(0, 8),
      };
      setError(validationError);
      setStatus('error');
      if (clearOnFail) setTrip(null);
      return false;
    }
    setTrip(enrichTripWithIds(result.data));
    setError(null);
    setStatus('success');
    return true;
  }, []);

  const createTrip = useCallback(
    async (userPrompt) => {
      const trimmed = userPrompt.trim();
      const requestId = latestCreateRequestId.current + 1;
      latestCreateRequestId.current = requestId;

      setPrompt(trimmed);
      localStorage.setItem(LAST_PROMPT_KEY, trimmed);
      setStatus('loading');
      setError(null);
      setTrip(null);

      try {
        const data = await generateTrip(trimmed);
        if (requestId !== latestCreateRequestId.current) {
          return false;
        }
        const ok = applyValidatedTrip(data, { clearOnFail: true });
        if (ok) toast.success('Your itinerary is ready!');
        return ok;
      } catch (err) {
        if (requestId !== latestCreateRequestId.current) {
          return false;
        }
        setError(err);
        setStatus('error');
        toast.error(err.message || 'Failed to generate trip.');
        return false;
      }
    },
    [applyValidatedTrip]
  );

  const improveTrip = useCallback(
    async (refinement) => {
      if (!trip) return false;
      setIsRefining(true);
      setError(null);

      try {
        const data = await refineTrip(trip, refinement);
        const ok = applyValidatedTrip(data, { clearOnFail: false });
        if (ok) toast.success('Trip improved!');
        return ok;
      } catch (err) {
        setError(err);
        // Keep existing trip visible; show retry overlay only
        setStatus('error');
        toast.error(err.message || 'Failed to refine trip.');
        return false;
      } finally {
        setIsRefining(false);
      }
    },
    [trip, applyValidatedTrip]
  );

  const loadTrip = useCallback((savedTrip, savedPrompt = '') => {
    const ok = applyValidatedTrip(savedTrip, { clearOnFail: false });
    if (ok) {
      setPrompt(savedPrompt);
      toast.success('Saved trip loaded.');
    }
    return ok;
  }, [applyValidatedTrip]);

  const updateTrip = useCallback((updater) => {
    setTrip((current) => {
      if (!current) return current;
      return typeof updater === 'function' ? updater(current) : updater;
    });
  }, []);

  const clearTrip = useCallback(() => {
    setTrip(null);
    setStatus('idle');
    setError(null);
  }, []);

  const retry = useCallback(async () => {
    if (!prompt.trim()) return false;
    return createTrip(prompt);
  }, [prompt, createTrip]);

  const value = useMemo(
    () => ({
      trip,
      prompt,
      setPrompt,
      status,
      error,
      isRefining,
      createTrip,
      improveTrip,
      loadTrip,
      updateTrip,
      clearTrip,
      retry,
      setError,
      setStatus,
    }),
    [
      trip,
      prompt,
      status,
      error,
      isRefining,
      createTrip,
      improveTrip,
      loadTrip,
      updateTrip,
      clearTrip,
      retry,
    ]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}



