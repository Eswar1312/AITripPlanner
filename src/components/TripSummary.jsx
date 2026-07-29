import { motion } from 'framer-motion';
import {
  FiAward,
  FiCloud,
  FiClock,
  FiMapPin,
  FiAlertCircle,
  FiZap,
} from 'react-icons/fi';
import { getBudgetRiskMeta, formatCurrency } from '../utils/constants';

function StatCard({ icon: Icon, label, value, delay = 0, accent = 'from-amber-400 to-orange-500' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass rounded-3xl p-5"
    >
      <div className={`mb-3 inline-flex rounded-2xl bg-gradient-to-br ${accent} p-2.5 text-white shadow-lg`}>
        <Icon className="text-lg" />
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-white/45">{label}</p>
      <p className="mt-1 break-words font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">{value}</p>
    </motion.div>
  );
}

export default function TripSummary({ trip }) {
  const risk = getBudgetRiskMeta(trip.budgetRisk);

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong overflow-hidden rounded-[28px]"
      >
        <div className="relative bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-teal-500/20 p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200/80">Your itinerary</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              {trip.tripName}
            </h1>
            <p className="mt-3 max-w-3xl text-slate-600 dark:text-white/70">{trip.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${risk.tone}`}>
                Budget Risk · {risk.label}
              </span>
              <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-200">
                Trip Score {trip.tripScore}/100
              </span>
              {trip.startDate && trip.endDate && (
                <span className="rounded-full border border-teal-400/30 bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-200">
                  {trip.startDate} – {trip.endDate}
                </span>
              )}
              <span className="rounded-full border border-slate-300 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-white/70">
                Total {formatCurrency(trip.budget.total)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiAward} label="Trip Score" value={`${trip.tripScore}`} delay={0.05} accent="from-amber-500 to-orange-500" />
        <StatCard icon={FiMapPin} label="Destination" value={trip.destination} delay={0.1} />
        <StatCard
          icon={FiClock}
          label="Duration & Dates"
          value={trip.startDate && trip.endDate ? `${trip.duration} (${trip.startDate} – ${trip.endDate})` : trip.duration}
          delay={0.15}
          accent="from-orange-400 to-amber-500"
        />
        <StatCard icon={FiCloud} label="Weather" value={trip.weather} delay={0.2} accent="from-amber-400 to-teal-500" />
      </div>

      {trip.travelTips?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-3xl p-5 sm:p-6"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-200">
            <FiZap />
            Travel Tips
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {trip.travelTips.map((tip, index) => (
              <li key={index} className="flex gap-2 text-sm text-slate-600 dark:text-white/70">
                <FiAlertCircle className="mt-0.5 shrink-0 text-amber-300/80" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </section>
  );
}
