import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertOctagon, FiHome } from 'react-icons/fi';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong max-w-lg rounded-[28px] p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
          <FiAlertOctagon className="text-2xl" />
        </div>
        <h1 className="font-display text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-600 dark:text-white/60">
          This route doesn't exist in Talk2Trip. Head back and plan your next adventure.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          <FiHome />
          Back to Talk2Trip
        </Link>
      </motion.div>
    </div>
  );
}
