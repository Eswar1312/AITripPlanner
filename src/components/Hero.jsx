import { motion } from 'framer-motion';
import { EXAMPLE_PROMPTS } from '../utils/constants';

const floatingPlaces = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1590393275627-0c48482c60e3?auto=format&fit=crop&w=700&q=80', className: 'left-[3%] top-[8%] rotate-[-9deg]', delay: 0.1 },
  { name: 'Kyoto', image: 'https://images.unsplash.com/photo-1742516700713-4346fc280875?auto=format&fit=crop&w=700&q=80', className: 'right-[3%] top-[8%] rotate-[9deg]', delay: 0.45 },
  { name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1650442940325-7f57848ffb9c?auto=format&fit=crop&w=700&q=80', className: 'left-[12%] top-[46%] rotate-[7deg]', delay: 0.8 },
  { name: 'Ooty', image: 'https://images.unsplash.com/photo-1756009481685-1513779372cf?auto=format&fit=crop&w=700&q=80', className: 'right-[12%] top-[46%] rotate-[-7deg]', delay: 1.15 },
];

export default function Hero({ onExampleClick }) {
  return (
    <section className="relative overflow-hidden pb-8 pt-10 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingPlaces.map(({ name, image, className, delay }, index) => (
          <motion.div
            key={name}
            className={`absolute hidden h-32 w-24 overflow-hidden rounded-2xl border-4 border-white/70 shadow-xl shadow-slate-900/20 sm:block md:h-40 md:w-32 lg:h-44 lg:w-34 dark:border-white/20 ${className}`}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5 + index, repeat: Infinity, delay, ease: 'easeInOut' }}
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-white">{name}</span>
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200"
        >
          AI Powered Trip Architect
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-gradient">Talk2Trip</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-white/70"
        >
          Describe your dream trip in plain language. Get a structured, interactive
          itinerary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => onExampleClick(example.text)}
              className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-700 transition hover:border-amber-400/60 hover:bg-amber-400/10 hover:text-slate-900 dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:border-amber-300/40 dark:hover:text-white"
            >
              {example.label}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
