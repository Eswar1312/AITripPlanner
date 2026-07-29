import { motion } from 'framer-motion';
import {
  FiClock,
  FiMapPin,
  FiTrash2,
  FiCopy,
  FiHeart,
  FiCamera,
  FiStar,
  FiCloudRain,
  FiCoffee,
  FiInfo,
  FiNavigation,
} from 'react-icons/fi';
import { CATEGORY_COLORS } from '../utils/constants';

export default function ActivityCard({
  activity,
  provided,
  snapshot,
  onDelete,
  onDuplicate,
  onFavorite,
}) {
  const categoryKey = String(activity.category || '').toLowerCase();
  const gradient =
    CATEGORY_COLORS[categoryKey] || 'from-slate-400 to-slate-600';

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={provided.draggableProps.style}
      className={`mb-3 ${snapshot.isDragging ? 'opacity-95' : ''}`}
    >
      <motion.article
        layout={!snapshot.isDragging}
        transition={{ layout: { type: 'spring', stiffness: 380, damping: 42, mass: 0.9 } }}
        whileHover={{ y: -2 }}
        style={{ willChange: 'transform' }}
        className={`rounded-2xl border border-slate-200 bg-white/70 p-3 transition sm:p-4 dark:border-white/10 dark:bg-white/5 ${
          snapshot.isDragging ? 'shadow-2xl shadow-amber-400/20 ring-2 ring-amber-300/40' : ''
        } ${activity.favorite ? 'border-pink-400/40 bg-pink-500/5' : ''}`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 w-full flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-800 dark:bg-white/10 dark:text-amber-100">
                <FiClock />
                {activity.time}
              </span>
              <span
                className={`rounded-full bg-gradient-to-r ${gradient} px-2.5 py-1 text-xs font-semibold text-white`}
              >
                {activity.category}
              </span>
              {activity.isHiddenGem && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-200">
                  <FiStar /> Hidden Gem
                </span>
              )}
              {activity.isInstagramSpot && (
                <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-1 text-[11px] font-semibold text-fuchsia-700 dark:text-fuchsia-200">
                  <FiCamera /> Instagram Spot
                </span>
              )}
            </div>

            <h4 className="font-display text-lg font-bold leading-snug sm:text-xl">{activity.place}</h4>
            <p className="mt-1 break-words text-sm leading-relaxed text-slate-600 dark:text-white/65">{activity.description}</p>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-white/55">
              <span className="inline-flex items-center gap-1">
                <FiMapPin /> {activity.cost}
              </span>
              <span className="inline-flex items-center gap-1">
                <FiNavigation /> Walk: {activity.walkingDistance}
              </span>
              {activity.imageHint && (
                <span className="inline-flex items-center gap-1 opacity-70">
                  Visual: {activity.imageHint}
                </span>
              )}
            </div>

            {(activity.foodTip || activity.rainBackup || activity.travelTip) && (
              <div className="mt-3 grid gap-2 text-xs text-slate-600 min-[480px]:grid-cols-2 sm:grid-cols-3 dark:text-white/60">
                {activity.foodTip && (
                  <p className="rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-white/10 dark:bg-black/20">
                    <span className="mb-1 flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-200">
                      <FiCoffee /> Food
                    </span>
                    {activity.foodTip}
                  </p>
                )}
                {activity.rainBackup && (
                  <p className="rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-white/10 dark:bg-black/20">
                    <span className="mb-1 flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-200">
                      <FiCloudRain /> Rain backup
                    </span>
                    {activity.rainBackup}
                  </p>
                )}
                {activity.travelTip && (
                  <p className="rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-white/10 dark:bg-black/20">
                    <span className="mb-1 flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-200">
                      <FiInfo /> Tip
                    </span>
                    {activity.travelTip}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="order-first flex shrink-0 self-end gap-1 rounded-xl bg-slate-100/70 p-1 sm:order-none sm:self-auto sm:bg-transparent sm:p-0 dark:bg-white/5 sm:dark:bg-transparent">
            <button
              type="button"
              onClick={onFavorite}
              className={`rounded-xl p-2 transition hover:bg-slate-200/70 dark:hover:bg-white/10 ${
                activity.favorite ? 'text-pink-500 dark:text-pink-300' : 'text-slate-400 dark:text-white/50'
              }`}
              title="Favorite stop"
              aria-label="Favorite stop"
            >
              <FiHeart className={activity.favorite ? 'fill-current' : ''} />
            </button>
            <button
              type="button"
              onClick={onDuplicate}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-200/70 hover:text-amber-600 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-amber-200"
              title="Duplicate stop"
              aria-label="Duplicate stop"
            >
              <FiCopy />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-100 hover:text-rose-600 dark:text-white/50 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
              title="Delete stop"
              aria-label="Delete stop"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
