import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiFolder } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';

export default function SavedTripsModal({ open, onClose, savedTrips, onDelete }) {
  const { loadTrip } = useTrip();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-[28px]"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <div>
              <h2 className="font-display text-xl font-bold">Saved Trips</h2>
              <p className="text-sm text-slate-500 dark:text-white/50">Stored locally in your browser</p>
            </div>
            <button type="button" onClick={onClose} className="btn-ghost !px-3" aria-label="Close">
              <FiX />
            </button>
          </div>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto p-5">
            {savedTrips.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-white/15 dark:text-white/50">
                No saved trips yet. Generate one and hit Save Trip.
              </p>
            )}

            {savedTrips.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      {entry.trip?.tripName || 'Untitled trip'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-white/55">
                      {entry.trip?.destination} · {entry.trip?.duration}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-white/40">
                      Saved {new Date(entry.savedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-ghost !py-2 !text-xs"
                      onClick={() => {
                        const ok = loadTrip(entry.trip, entry.prompt || '');
                        if (ok) {
                          onClose();
                          navigate('/dashboard');
                        }
                      }}
                    >
                      <FiFolder />
                      Load
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-200"
                      onClick={() => onDelete(entry.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
