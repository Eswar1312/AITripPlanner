import { useCallback, useEffect, useState } from 'react';
import { SAVED_TRIPS_KEY } from '../utils/constants';

function readSavedTrips() {
  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getTripSignature(trip, prompt) {
  return JSON.stringify({ trip, prompt: String(prompt || '').trim() });
}

export function useSavedTrips() {
  const [savedTrips, setSavedTrips] = useState(() => readSavedTrips());

  const persist = useCallback((next) => {
    setSavedTrips(next);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('talk2trip:saved-trips-changed'));
  }, []);

  const saveTrip = useCallback(
    (trip, prompt = '') => {
      const current = readSavedTrips();
      const signature = getTripSignature(trip, prompt);
      const existing = current.find((item) => (item.signature || getTripSignature(item.trip, item.prompt)) === signature);

      if (existing) {
        return { entry: existing, created: false };
      }

      const entry = {
        id: `trip_${Date.now()}`,
        savedAt: new Date().toISOString(),
        prompt,
        trip,
        signature,
      };
      const next = [entry, ...current].slice(0, 20);
      persist(next);
      return { entry, created: true };
    },
    [persist]
  );

  const deleteTrip = useCallback(
    (id) => {
      const next = readSavedTrips().filter((item) => item.id !== id);
      persist(next);
    },
    [persist]
  );

  const refresh = useCallback(() => {
    setSavedTrips(readSavedTrips());
  }, []);

  useEffect(() => {
    window.addEventListener('talk2trip:saved-trips-changed', refresh);
    return () => window.removeEventListener('talk2trip:saved-trips-changed', refresh);
  }, [refresh]);

  return { savedTrips, saveTrip, deleteTrip, refresh };
}
