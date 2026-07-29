import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency } from '../utils/constants';

const COLORS = ['#38bdf8', '#a78bfa', '#fbbf24', '#22d3ee', '#34d399', '#f472b6'];

export default function ExpenseChart({ budget }) {
  const data = [
    { name: 'Hotel', value: budget.hotel || 0 },
    { name: 'Flights', value: budget.flights || 0 },
    { name: 'Food', value: budget.food || 0 },
    { name: 'Transport', value: budget.transport || 0 },
    { name: 'Activities', value: budget.activities || 0 },
    { name: 'Shopping', value: budget.shopping || 0 },
  ].filter((item) => item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass h-full rounded-3xl p-5 sm:p-6"
    >
      <h3 className="font-display text-xl font-bold">Expense Breakdown</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-white/50">Hotel · Flights · Food · Shopping · Transport · Activities</p>

      <div className="mt-2 h-64 w-full sm:h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-white/50">
            No budget data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  background: 'rgba(11,18,32,0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  color: '#fff',
                }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
