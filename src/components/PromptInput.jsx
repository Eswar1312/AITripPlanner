import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiArrowRight, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { computeTripDates, formatDateString } from '../utils/constants';

const PLACEHOLDER = 'What kind of trip would you like? (Optional) For example: travelling with family, prefer beaches and local food, easy-paced days, and vegetarian options.';

export default function PromptInput({ value, onChange, onSubmit, loading }) {
  const [focused, setFocused] = useState(false);
  const [details, setDetails] = useState({
    from: '',
    destination: '',
    budget: '',
    startDate: '',
    endDate: '',
  });

  const updateDetail = (key, nextValue) => setDetails((current) => ({ ...current, [key]: nextValue }));

  const dateInfo = useMemo(() => {
    return computeTripDates(details.startDate, details.endDate);
  }, [details.startDate, details.endDate]);

  const handleSubmit = () => {
    onSubmit({
      ...details,
      days: dateInfo.valid ? dateInfo.days : 0,
      description: value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.55 }}
      className={`glass-strong relative mx-auto max-w-3xl rounded-[28px] p-4 sm:p-6 ${focused ? 'ring-2 ring-amber-300/40' : ''}`}
    >
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white/70">
          <FiStar className="text-amber-500 dark:text-amber-300" />
          Plan your trip
        </label>
        <p className="mt-1 text-xs text-slate-500 dark:text-white/45">Fields marked * are required. Select your travel dates to auto-compute itinerary days.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white/70">
          From *
          <span className="relative mt-1.5 block">
            <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
            <input value={details.from} onChange={(event) => updateDetail('from', event.target.value)} placeholder="e.g. Hyderabad" disabled={loading} className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-amber-400/60 dark:border-white/10 dark:bg-black/20 dark:text-white" />
          </span>
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-white/70">
          Destination *
          <span className="relative mt-1.5 block">
            <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
            <input value={details.destination} onChange={(event) => updateDetail('destination', event.target.value)} placeholder="e.g. Goa" disabled={loading} className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-amber-400/60 dark:border-white/10 dark:bg-black/20 dark:text-white" />
          </span>
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-white/70">
          Start Date *
          <span className="relative mt-1.5 block">
            <FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
            <input type="date" value={details.startDate} onChange={(event) => updateDetail('startDate', event.target.value)} disabled={loading} className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-amber-400/60 dark:border-white/10 dark:bg-black/20 dark:text-white" />
          </span>
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-white/70">
          End Date *
          <span className="relative mt-1.5 block">
            <FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
            <input type="date" value={details.endDate} onChange={(event) => updateDetail('endDate', event.target.value)} disabled={loading} className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-amber-400/60 dark:border-white/10 dark:bg-black/20 dark:text-white" />
          </span>
        </label>

        <label className="text-sm font-medium text-slate-700 sm:col-span-2 dark:text-white/70">
          Budget (₹) *
          <span className="relative mt-1.5 block">
            <FiDollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
            <input type="number" min="1" value={details.budget} onChange={(event) => updateDetail('budget', event.target.value)} placeholder="e.g. 50000" disabled={loading} className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-3 text-slate-900 outline-none transition focus:border-amber-400/60 dark:border-white/10 dark:bg-black/20 dark:text-white" />
          </span>
        </label>
      </div>

      {dateInfo.valid && (
        <div className="mt-3 rounded-xl border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-700 dark:text-teal-200">
          Duration: {dateInfo.days} day{dateInfo.days === 1 ? '' : 's'} ({formatDateString(details.startDate)} – {formatDateString(details.endDate)})
        </div>
      )}

      <label htmlFor="trip-prompt" className="mb-2 mt-5 block text-sm font-medium text-slate-700 dark:text-white/70">
        Trip style
      </label>
      <textarea id="trip-prompt" rows={4} value={value} onChange={(event) => onChange(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={PLACEHOLDER} disabled={loading} className="w-full resize-y rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 text-base leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-amber-400/60 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/35 dark:focus:border-amber-300/40" />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-white/45">Dates will be assigned to each day of your itinerary.</p>
        <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary w-full sm:w-auto sm:min-w-45">
          {loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Architecting...</> : <>Generate Trip <FiArrowRight /></>}
        </button>
      </div>
    </motion.div>
  );
}
