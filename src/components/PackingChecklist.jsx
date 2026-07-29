import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckSquare, FiPackage } from 'react-icons/fi';

export default function PackingChecklist({ packing }) {
  const [checked, setChecked] = useState(() => packing.map(() => false));

  useEffect(() => {
    setChecked(packing.map(() => false));
  }, [packing]);

  const progress = useMemo(() => {
    if (!packing.length) return 0;
    const done = checked.filter(Boolean).length;
    return Math.round((done / packing.length) * 100);
  }, [checked, packing.length]);

  const toggle = (index) => {
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-5 sm:p-6"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-200">
            <FiPackage />
            Packing Checklist
          </div>
          <h3 className="font-display text-xl font-bold">{progress}% complete</h3>
        </div>
        <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-white/60">
          {checked.filter(Boolean).length}/{packing.length}
        </span>
      </div>

      <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {packing.map((item, index) => (
          <li key={`${item}-${index}`}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition ${
                checked[index]
                  ? 'border-amber-400/40 bg-amber-100/60 text-slate-900 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-white'
                  : 'border-slate-200 bg-white/60 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:bg-white/10'
              }`}
            >
              <FiCheckSquare
                className={checked[index] ? 'text-amber-500 dark:text-amber-300' : 'text-slate-400 dark:text-white/35'}
              />
              <span className={checked[index] ? 'line-through opacity-70' : ''}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
