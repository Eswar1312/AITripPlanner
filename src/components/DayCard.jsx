import { AnimatePresence, motion } from 'framer-motion';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ActivityCard from './ActivityCard';

export default function DayCard({
  day,
  dayIndex,
  expanded,
  onToggle,
  onDeleteActivity,
  onDuplicateActivity,
  onFavoriteActivity,
}) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: dayIndex * 0.05,
        layout: { type: 'spring', stiffness: 380, damping: 42, mass: 0.9 },
      }}
      className="glass relative overflow-hidden rounded-[28px]"
    >
      <div className="absolute bottom-0 left-6 top-6 hidden w-px bg-gradient-to-b from-amber-400/60 via-orange-400/30 to-transparent sm:block" />

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 p-4 text-left sm:gap-4 sm:p-6"
      >
        <div className="flex min-w-0 items-start gap-3 sm:gap-4 sm:pl-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 font-display text-base font-bold text-white shadow-lg shadow-amber-400/25 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg">
            {day.day}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
              Day {day.day}{day.date ? ` • ${day.date}` : ''}
            </p>
            <h3 className="font-display text-lg font-bold leading-tight sm:text-2xl">{day.title}</h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-white/50">
              {day.activities.length} stop{day.activities.length === 1 ? '' : 's'} · drag to reorder
            </p>
          </div>
        </div>
        <span className="rounded-xl border border-slate-200 bg-white/70 p-2 text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-white/70">
          {expanded ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: 'spring', stiffness: 380, damping: 42, mass: 0.9 },
              opacity: { duration: 0.2, ease: 'easeInOut' },
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200 px-3 pb-4 pt-2 sm:px-6 sm:pb-6 dark:border-white/10">
              <Droppable droppableId={`day-${dayIndex}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`ml-0 rounded-2xl p-0 transition sm:ml-4 sm:p-1 ${
                      snapshot.isDraggingOver ? 'bg-amber-400/5' : ''
                    }`}
                  >
                    {day.activities.map((activity, activityIndex) => (
                      <Draggable
                        key={activity.id}
                        draggableId={activity.id}
                        index={activityIndex}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <ActivityCard
                            activity={activity}
                            provided={dragProvided}
                            snapshot={dragSnapshot}
                            onDelete={() => onDeleteActivity(dayIndex, activityIndex)}
                            onDuplicate={() => onDuplicateActivity(dayIndex, activityIndex)}
                            onFavorite={() => onFavoriteActivity(dayIndex, activityIndex)}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
