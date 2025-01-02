import { useMemo, useState } from 'react';
import {
  eachDayOfInterval,
  format,
  startOfDay,
  endOfDay,
  startOfYear,
  endOfYear,
  eachWeekOfInterval,
  endOfWeek,
} from 'date-fns';
import './Heatmap.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Heatmap = ({ boardId, inMemoryState }) => {
  const board = inMemoryState.boards[boardId];
  const [selectedYear] = useState(new Date());

  const dateRange = useMemo(() => {
    return {
      startDate: startOfYear(selectedYear),
      endDate: endOfYear(selectedYear)
    };
  }, [selectedYear]);

    const weeks = useMemo(() => {
    const { startDate, endDate } = dateRange;

    const weekIntervals = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 0 }
    );

    return weekIntervals.map(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    });
  }, [dateRange]);

    const activityMap = useMemo(() => {
    const map = new Map();
    const { startDate, endDate } = dateRange;
    
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    allDates.forEach(date => {
      const start = startOfDay(date);
      const end = endOfDay(date);

      const events = board.log.filter(event =>
        event.timestamp >= start.getTime() &&
        event.timestamp <= end.getTime()
      );

      map.set(format(date, 'yyyy-MM-dd'), events.length);
    });

    return map;
  }, [dateRange, board.log]);

  const getColorClass = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-emerald-200';
    if (count === 2) return 'bg-emerald-300';
    if (count === 3) return 'bg-emerald-400';
    return 'bg-emerald-500';
  };

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <div className="heatmap-title-row">
          <h3 className="heatmap-title">{board.name} Activity</h3>
          <div className="year-navigation">

            <span className="year-display">
              {format(selectedYear, 'yyyy')}
            </span>
          </div>
        </div>
        <div className="heatmap-subtitle">
          {board.description && <p>{board.description}</p>}
          <p>
            {activityMap.size > 0
              ? `${Array.from(activityMap.values()).reduce((a, b) => a + b, 0)} activities in ${format(selectedYear, 'yyyy')}`
              : 'No activities recorded yet'}
          </p>
        </div>
      </div>

      <div className="heatmap-grid-container">
        <div className="heatmap-weekdays">
          {WEEKDAYS.map((day, index) => (
            <span key={index} className="heatmap-weekday">
              {day}
            </span>
          ))}
        </div>

        <div className="heatmap-grid">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap-week">
              {week.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const count = activityMap.get(dateStr) || 0;
                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                return (
                  <div
                    key={dateStr}
                    className={`heatmap-cell ${getColorClass(count)} ${isToday ? 'heatmap-cell-today' : ''}`}
                    title={`${format(date, 'MMMM d, yyyy')}: ${count} ${count === 1 ? 'activity' : 'activities'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-legend">
        <div className="heatmap-legend-scale">
          <span className="heatmap-legend-label">Less</span>
          <div className="heatmap-cell bg-gray-100" title="0 activities" />
          <div className="heatmap-cell bg-emerald-200" title="1 activity" />
          <div className="heatmap-cell bg-emerald-300" title="2 activities" />
          <div className="heatmap-cell bg-emerald-400" title="3 activities" />
          <div className="heatmap-cell bg-emerald-500" title="4+ activities" />
          <span className="heatmap-legend-label">More</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;