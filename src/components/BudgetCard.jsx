import { motion } from 'framer-motion';
import { FiDollarSign, FiHome, FiCoffee, FiTruck, FiActivity, FiShoppingBag, FiNavigation } from 'react-icons/fi';
import { formatCurrency } from '../utils/constants';

const rows = [
  { key: 'hotel', label: 'Hotel', Icon: FiHome, color: 'bg-amber-400' },
  { key: 'flights', label: 'Flights', Icon: FiNavigation, color: 'bg-orange-400' },
  { key: 'food', label: 'Food', Icon: FiCoffee, color: 'bg-amber-400' },
  { key: 'transport', label: 'Transport', Icon: FiTruck, color: 'bg-amber-400' },
  { key: 'activities', label: 'Activities', Icon: FiActivity, color: 'bg-emerald-400' },
  { key: 'shopping', label: 'Shopping', Icon: FiShoppingBag, color: 'bg-pink-400' },
];

export default function BudgetCard({ budget }) {
  const total = budget.total || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass h-full rounded-3xl p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-white/45">Budget Summary</p>
          <h3 className="font-display text-2xl font-bold">{formatCurrency(budget.total)}</h3>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 text-white">
          <FiDollarSign />
        </div>
      </div>

      <div className="space-y-3">
        {rows.map(({ key, label, Icon, color }) => {
          const value = Number(budget[key] || 0);
          const pct = Math.min(100, Math.round((value / total) * 100));
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-white/70">
                  <Icon className="text-amber-500 dark:text-amber-300" />
                  {label}
                </span>
                <span className="font-medium">{formatCurrency(value)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
