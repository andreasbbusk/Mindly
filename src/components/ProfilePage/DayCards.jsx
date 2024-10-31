import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeltSurMedFarve from "../../assets/HeltSurMedFarve.png";
import LidtSurMedFarve from "../../assets/LidtSurMedFarve.png";
import MellemSurMedFarve from "../../assets/MellemSurMedFarve.png";
import LidtGladMedFarve from "../../assets/LidtGladMedFarve.png";
import HeltGladMedFarve from "../../assets/HeltGladMedFarve.png";

const DayCards = ({ entries, selectedWeek, onWeekChange }) => {
  const cardRefs = useRef([]);
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const getMoodIcon = (mood) => {
    const moodIcons = {
      HeltSur: HeltSurMedFarve,
      LidtSur: LidtSurMedFarve,
      MellemSur: MellemSurMedFarve,
      LidtGlad: LidtGladMedFarve,
      HeltGlad: HeltGladMedFarve,
    };
    return moodIcons[mood] || null;
  };

  const formatDate = (date) => ({
    day: date.toLocaleString("default", { weekday: "short" }),
    date: date.getDate(),
  });

  const handleCardClick = (index, entry, date) => {
    if (entry) {
      cardRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelectedDate(date);
    }
  };

  const handleDrag = (event, info) => {
    const SWIPE_THRESHOLD = 40;
    const { offset } = info;

    if (Math.abs(offset.x) > SWIPE_THRESHOLD) {
      const direction = offset.x > 0 ? -1 : 1;
      const newStart = new Date(selectedWeek.start);
      const newEnd = new Date(selectedWeek.end);
      
      newStart.setDate(newStart.getDate() + (7 * direction));
      newEnd.setDate(newEnd.getDate() + (7 * direction));
      
      onWeekChange({ start: newStart, end: newEnd });
    }
  };

  useEffect(() => {
    if (!selectedWeek?.start) return;

    const weekStart = new Date(selectedWeek.start);
    setWeekDates(Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    }));
  }, [selectedWeek?.start]);

  return (
    <div className="entries">
      <motion.div 
        className="day-cards"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDrag}
      >
        {weekDates.map((date, index) => {
          const entry = entries.find(
            (e) => new Date(e.date).toDateString() === date.toDateString()
          );
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          
          return (
            <div
              key={date.toISOString()}
              ref={el => cardRefs.current[index] = el}
              className={`${entry ? "day-card" : "blank"} ${isSelected ? "selected" : ""}`}
              onClick={() => handleCardClick(index, entry, date)}
            >
              {entry ? (
                <>
                  <img src={getMoodIcon(entry.mood)} alt={entry.mood} />
                  <p>{formatDate(date).date}</p>
                  <p>{formatDate(date).day}</p>
                </>
              ) : (
                <>
                  <div className="blank-icon"></div>
                  <p>{formatDate(date).date}</p>
                  <p>{formatDate(date).day}</p>
                </>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default DayCards;
