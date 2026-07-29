import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSliders, FiSend } from 'react-icons/fi';
import { REFINE_PRESETS } from '../utils/constants';
import { useTrip } from '../hooks/useTrip';

export default function RefinePanel() {
  const { improveTrip, isRefining } = useTrip();
  const [instruction, setInstruction] = useState('');

  const submit = async (text) => {
    const value = (text ?? instruction).trim();
    if (!value) return;
    await improveTrip(value);
    setInstruction('');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-[28px] p-5 sm:p-6"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-200">
        <FiSliders />
        Improve Trip
      </div>
      <p className="text-sm text-slate-500 dark:text-white/55">
        Refine the existing itinerary instead of regenerating from scratch.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {REFINE_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={isRefining}
            onClick={() => submit(preset)}
            className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs text-slate-700 transition hover:border-amber-400/60 hover:bg-amber-400/10 disabled:opacity-50 dark:border-white/15 dark:bg-white/5 dark:text-white/75 dark:hover:border-amber-300/40"
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g. Add a rooftop dinner and cut transport costs"
          disabled={isRefining}
          className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-400/60 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-white/35 dark:focus:border-amber-300/40"
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
        <button
          type="button"
          onClick={() => submit()}
          disabled={isRefining || !instruction.trim()}
          className="btn-primary shrink-0"
        >
          {isRefining ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Improving...
            </>
          ) : (
            <>
              <FiSend />
              Apply
            </>
          )}
        </button>
      </div>
    </motion.section>
  );
}
