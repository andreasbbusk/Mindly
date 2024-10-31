import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const Calendar = ({ onClose, onWeekSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(null);

  // Initialize selected week to current week on component mount
  useEffect(() => {
    const today = new Date();
    const mondayOfWeek = new Date(today);
    mondayOfWeek.setDate(today.getDate() - today.getDay() + 1);
    setSelectedWeek({
      start: new Date(mondayOfWeek),
      end: new Date(mondayOfWeek.setDate(mondayOfWeek.getDate() + 6))
    });
  }, []);

  // Memoize date formatting function
  const formatDate = useMemo(() => (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }, []);

  // Optimize month change function
  const changeMonth = useCallback((direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  }, []);

  // Memoize helper functions
  const getDaysInMonth = useMemo(() => (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useMemo(() => (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  }, []);

  // Optimize day click handler
  const handleDayClick = useCallback((day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const mondayOfWeek = new Date(clickedDate);
    mondayOfWeek.setDate(clickedDate.getDate() - clickedDate.getDay() + 1);
    const sundayOfWeek = new Date(mondayOfWeek);
    sundayOfWeek.setDate(mondayOfWeek.getDate() + 6);

    setSelectedWeek({
      start: mondayOfWeek,
      end: sundayOfWeek
    });
  }, [currentDate]);

  // Memoize calendar data
  const calendarData = useMemo(() => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = (getFirstDayOfMonth(currentDate) + 6) % 7;

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const currentMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isSelected = selectedWeek && currentMonthDate >= selectedWeek.start && currentMonthDate <= selectedWeek.end;
      const isWeekStart = selectedWeek && currentMonthDate.getTime() === selectedWeek.start.getTime();
      const isWeekEnd = selectedWeek && currentMonthDate.getTime() === selectedWeek.end.getTime();
      days.push(
        <div 
          key={i} 
          className={`calendar-day ${isSelected ? 'current-week' : ''} ${isWeekStart ? 'week-start' : ''} ${isWeekEnd ? 'week-end' : ''}`}
          onClick={() => handleDayClick(i)}
        >
          <div>{i}</div>
        </div>
      );
    }

    return { daysOfWeek, days };
  }, [currentDate, selectedWeek, getDaysInMonth, getFirstDayOfMonth, handleDayClick]);

  // Optimize confirm handler
  const handleConfirm = useCallback(() => {
    if (selectedWeek) {
      onWeekSelect({ start: selectedWeek.start, end: selectedWeek.end });
    }
    onClose();
  }, [selectedWeek, onWeekSelect, onClose]);

  return (
    <div className="calendar-wrapper">
      <h3>Calendar</h3>
      <p>Select your preferred week:</p>

      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>&lt;</button>
          <div className="calendar-current-date">
            <p>{formatDate(currentDate)}</p>
          </div>
          <button onClick={() => changeMonth(1)}>&gt;</button>
        </div>

        <div className="calendar-weekdays">
          {calendarData.daysOfWeek.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {calendarData.days}
        </div>
      </div>

      <div className="calendar-actions">
        <button className="cancel-button cta_red" onClick={onClose}>Cancel</button>
        <button className="confirm-button cta_red" onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  onClose: PropTypes.func.isRequired,
  onWeekSelect: PropTypes.func.isRequired,
};

export default Calendar;
