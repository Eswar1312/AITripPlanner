import { useContext } from 'react';
import { TripContext } from '../context/TripContextDef';

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return ctx;
}
