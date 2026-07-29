import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiCompass, FiDownload, FiBookmark, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';
import { useTrip } from '../hooks/useTrip';
import { downloadTripPdf } from '../utils/downloadTripPdf';
import { useSavedTrips } from '../hooks/useSavedTrips';
import SavedTripsModal from './SavedTripsModal';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { trip, prompt, clearTrip } = useTrip();
  const location = useLocation();
  const navigate = useNavigate();
  const onDashboard = location.pathname.startsWith('/dashboard');
  const { savedTrips, deleteTrip, refresh } = useSavedTrips();
  const [savedTripsOpen, setSavedTripsOpen] = useState(false);
  const [showTripPrompt, setShowTripPrompt] = useState(false);

  const handleDownload = () => {
    if (!trip) {
      setShowTripPrompt(true);
      return;
    }

    const ok = downloadTripPdf(trip, prompt);
    if (ok) toast.success('PDF downloaded.');
  };

  return (
    <>
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#070b16]/55"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={() => {
            if (onDashboard) clearTrip();
          }}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-teal-400 shadow-lg shadow-amber-400/20">
            <FiCompass className="text-xl text-white" />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-600 sm:text-xl dark:text-white dark:group-hover:text-teal-200">
              Talk2Trip
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-slate-500 sm:block dark:text-white/50">
              Trip Architect
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {trip && !onDashboard && (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-ghost hidden sm:inline-flex"
            >
              Open Dashboard
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              refresh();
              setSavedTripsOpen(true);
            }}
            className="btn-ghost"
            aria-label="View saved trips"
          >
            <FiBookmark />
            <span className="hidden sm:inline">Saved{savedTrips.length ? ` (${savedTrips.length})` : ''}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-ghost"
            aria-label="Download trip PDF"
          >
            <FiDownload />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="btn-ghost !px-3"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </nav>
      </div>
    </motion.header>
    <SavedTripsModal
      open={savedTripsOpen}
      onClose={() => setSavedTripsOpen(false)}
      savedTrips={savedTrips}
      onDelete={(id) => {
        deleteTrip(id);
        toast.success('Saved trip removed.');
      }}
    />
    {showTripPrompt && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
        <div className="glass-strong w-full max-w-md rounded-[28px] p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">Download itinerary</p>
              <h2 className="mt-2 font-display text-2xl font-bold">Plan a trip first</h2>
            </div>
            <button type="button" className="btn-ghost !px-3" onClick={() => setShowTripPrompt(false)} aria-label="Close popup">
              <FiX />
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-white/65">
            Tell us where you want to go, your dates, budget, and interests. We’ll build an itinerary you can download as a PDF.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" className="btn-ghost" onClick={() => setShowTripPrompt(false)}>Not now</button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setShowTripPrompt(false);
                navigate('/');
              }}
            >
              Give trip inputs
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
