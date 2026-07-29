import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_MESSAGES } from '../utils/constants';

export default function LoadingSkeleton({ refining = false }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? 92 : prev + Math.random() * 7));
    }, 500);
    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-[28px] p-8 text-center sm:p-12"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-400/30">
          <motion.span
            className="h-8 w-8 rounded-full border-4 border-white/30 border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          {refining ? 'Improving your trip...' : 'Architecting your trip...'}
        </h2>

        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 text-amber-700 dark:text-amber-200/90"
          >
            {LOADING_MESSAGES[index]}
          </motion.p>
        </AnimatePresence>

        <div className="mx-auto mt-8 h-2 max-w-md overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-teal-400"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-3 h-3 w-1/2 rounded bg-slate-300 dark:bg-white/15" />
              <div className="mb-2 h-3 w-full rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-white/10" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
