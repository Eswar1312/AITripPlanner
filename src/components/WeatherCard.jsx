import { motion } from 'framer-motion';
import { FiCloud } from 'react-icons/fi';

export default function WeatherCard({ weather }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="glass h-full rounded-3xl p-5"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-200">
        <FiCloud />
        Weather Badge
      </div>
      <p className="font-display text-xl font-bold">{weather}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-white/55">
        Plan outdoor stops for clearer windows and keep rain backups handy.
      </p>
    </motion.div>
  );
}
