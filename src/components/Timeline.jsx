import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import DayCard from './DayCard';
import { createActivityId } from '../utils/constants';
import { useTrip } from '../hooks/useTrip';

export default function Timeline({ days }) {
  const { updateTrip } = useTrip();
  const [expandedDays, setExpandedDays] = useState(() =>
    Object.fromEntries(days.map((_, index) => [index, index === 0]))
  );

  const toggleDay = (index) => {
    setExpandedDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const expandAll = () => {
    setExpandedDays(Object.fromEntries(days.map((_, index) => [index, true])));
  };

  const collapseAll = () => {
    setExpandedDays(Object.fromEntries(days.map((_, index) => [index, false])));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceDayIndex = Number(source.droppableId.replace('day-', ''));
    const destDayIndex = Number(destination.droppableId.replace('day-', ''));

    updateTrip((trip) => {
      const nextDays = trip.days.map((day) => ({
        ...day,
        activities: [...day.activities],
      }));

      const [moved] = nextDays[sourceDayIndex].activities.splice(source.index, 1);
      nextDays[destDayIndex].activities.splice(destination.index, 0, moved);

      return { ...trip, days: nextDays };
    });
  };

  const onDeleteActivity = (dayIndex, activityIndex) => {
    updateTrip((trip) => {
      const nextDays = trip.days.map((day, dIdx) => {
        if (dIdx !== dayIndex) return day;
        if (day.activities.length <= 1) {
          toast.error('Each day needs at least one activity.');
          return day;
        }
        return {
          ...day,
          activities: day.activities.filter((_, aIdx) => aIdx !== activityIndex),
        };
      });
      return { ...trip, days: nextDays };
    });
  };

  const onDuplicateActivity = (dayIndex, activityIndex) => {
    updateTrip((trip) => {
      const nextDays = trip.days.map((day, dIdx) => {
        if (dIdx !== dayIndex) return day;
        const original = day.activities[activityIndex];
        const clone = {
          ...original,
          id: createActivityId(),
          place: `${original.place} (copy)`,
          favorite: false,
        };
        const activities = [...day.activities];
        activities.splice(activityIndex + 1, 0, clone);
        return { ...day, activities };
      });
      return { ...trip, days: nextDays };
    });
    toast.success('Stop duplicated.');
  };

  const onFavoriteActivity = (dayIndex, activityIndex) => {
    updateTrip((trip) => {
      const nextDays = trip.days.map((day, dIdx) => {
        if (dIdx !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.map((activity, aIdx) =>
            aIdx === activityIndex
              ? { ...activity, favorite: !activity.favorite }
              : activity
          ),
        };
      });
      return { ...trip, days: nextDays };
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="section-title">Day Timeline</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/50">
            Expand days, favorite stops, and drag activities to reorder.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={expandAll} className="btn-ghost !py-2 !text-xs">
            Expand all
          </button>
          <button type="button" onClick={collapseAll} className="btn-ghost !py-2 !text-xs">
            Collapse all
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-4">
          {days.map((day, dayIndex) => (
            <DayCard
              key={`day-${day.day}`}
              day={day}
              dayIndex={dayIndex}
              expanded={Boolean(expandedDays[dayIndex])}
              onToggle={() => toggleDay(dayIndex)}
              onDeleteActivity={onDeleteActivity}
              onDuplicateActivity={onDuplicateActivity}
              onFavoriteActivity={onFavoriteActivity}
            />
          ))}
        </div>
      </DragDropContext>
    </section>
  );
}
