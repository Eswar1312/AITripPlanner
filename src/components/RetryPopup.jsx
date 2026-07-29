import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CODE_COPY = {
  NETWORK_ERROR: 'We could not reach the Talk2Trip API.',
  TIMEOUT: 'The AI took too long to respond.',
  INVALID_SCHEMA: 'AI generated invalid itinerary.',
  MALFORMED_JSON: 'The model returned malformed JSON.',
  EMPTY_RESPONSE: 'The AI returned an empty response.',
  RATE_LIMIT: 'Rate limit hit — please wait a moment.',
  API_FAILURE: 'The Gemini API request failed.',
  MISSING_API_KEY: 'Server is missing GEMINI_API_KEY.',
};

export default function RetryPopup({ error, onRetry, onDismiss }) {
  const navigate = useNavigate();
  const code = error?.code || 'SERVER_ERROR';
  const headline = CODE_COPY[code] || error?.message || 'Something went wrong.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="glass-strong w-full max-w-lg rounded-[28px] p-6 sm:p-8"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
          <FiAlertTriangle className="text-2xl" />
        </div>
        <h2 className="font-display text-2xl font-bold">Couldn't finish your trip</h2>
        <p className="mt-2 text-slate-600 dark:text-white/70">{headline}</p>
        {error?.message && error.message !== headline && (
          <p className="mt-2 text-sm text-slate-500 dark:text-white/50">{error.message}</p>
        )}
        {code === 'INVALID_SCHEMA' && (
          <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-100">
            Zod validation rejected the AI payload. Retry to generate a fresh itinerary.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onRetry} className="btn-primary flex-1">
            <FiRefreshCw />
            Retry
          </button>
          <button
            type="button"
            onClick={() => {
              onDismiss?.();
              navigate('/');
            }}
            className="btn-ghost flex-1"
          >
            <FiHome />
            Back to Home Page
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
