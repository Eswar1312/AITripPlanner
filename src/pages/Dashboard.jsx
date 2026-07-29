import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSave, FiHome, FiRefreshCw } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TripSummary from '../components/TripSummary';
import BudgetCard from '../components/BudgetCard';
import WeatherCard from '../components/WeatherCard';
import ExpenseChart from '../components/ExpenseChart';
import Timeline from '../components/Timeline';
import PackingChecklist from '../components/PackingChecklist';
import EmergencyContacts from '../components/EmergencyContacts';
import RefinePanel from '../components/RefinePanel';
import LoadingSkeleton from '../components/LoadingSkeleton';
import RetryPopup from '../components/RetryPopup';
import { useTrip } from '../hooks/useTrip';
import { useSavedTrips } from '../hooks/useSavedTrips';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    trip,
    prompt,
    status,
    error,
    isRefining,
    retry,
    clearTrip,
    setError,
    setStatus,
  } = useTrip();
  const { saveTrip } = useSavedTrips();

  useEffect(() => {
    if (!trip && status !== 'loading' && status !== 'error') {
      navigate('/', { replace: true });
    }
  }, [trip, status, navigate]);

  if (status === 'loading' || isRefining) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <LoadingSkeleton refining={isRefining} />
        <Footer />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          {status === 'error' && error ? (
            <RetryPopup
              error={error}
              onRetry={async () => {
                const ok = await retry();
                if (!ok) {
                  clearTrip();
                  navigate('/', { replace: true });
                }
              }}
              onDismiss={() => {
                setError(null);
                setStatus('idle');
                clearTrip();
                navigate('/', { replace: true });
              }}
            />
          ) : (
            <div className="glass-strong max-w-md rounded-[28px] p-8">
              <h2 className="font-display text-2xl font-bold">No active trip</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-white/60">
                You don't have an active itinerary. Start fresh on the home page.
              </p>
              <button
                type="button"
                className="btn-primary mt-6 inline-flex"
                onClick={() => {
                  clearTrip();
                  navigate('/');
                }}
              >
                <FiHome />
                Back to Home Page
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200/70">Dashboard</p>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Interactive trip board</h2>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                clearTrip();
                navigate('/');
              }}
            >
              <FiHome />
              New Trip
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={async () => {
                const ok = await retry();
                if (!ok) toast.error('Retry failed.');
              }}
            >
              <FiRefreshCw />
              Regenerate
            </button>
            <button
              type="button"
              className="btn-primary !py-2.5"
              onClick={() => {
                const result = saveTrip(trip, prompt);
                toast.success(result.created ? 'Trip saved locally.' : 'This trip is already saved.');
              }}
            >
              <FiSave />
              Save Trip
            </button>
          </div>
        </div>

        <TripSummary trip={trip} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <BudgetCard budget={trip.budget} />
          </div>
          <div className="lg:col-span-1">
            <ExpenseChart budget={trip.budget} />
          </div>
          <div className="lg:col-span-1">
            <WeatherCard weather={trip.weather} />
          </div>
        </div>

        <RefinePanel />

        <Timeline days={trip.days} />

        <PackingChecklist packing={trip.packing} />

        <EmergencyContacts emergency={trip.emergency} />
      </motion.main>

      <Footer />

      {status === 'error' && error && (
        <RetryPopup
          error={error}
          onRetry={retry}
          onDismiss={() => {
            setError(null);
            setStatus(trip ? 'success' : 'idle');
          }}
        />
      )}

    </div>
  );
}
