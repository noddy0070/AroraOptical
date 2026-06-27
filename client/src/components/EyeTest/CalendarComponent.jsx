import React, { useState, useEffect } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, format, isBefore, isAfter, isSameDay
} from 'date-fns';

export default function CalendarComponent({formData, setFormData}) {
  const today = new Date();
  const maxDate = addMonths(today, 3);

  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(formData?.testDate || today);

  // Sync selectedDate with formData.testDate
  useEffect(() => {
    if (formData?.testDate) {
      const newDate = new Date(formData.testDate);
     
      setSelectedDate(newDate);
      // Also update currentMonth to show the month of the selected date
      setCurrentMonth(newDate);
    }
  }, [formData?.testDate]);

  // Calculate if buttons should be disabled
  const isBackButtonDisabled = () => {
    const previousMonth = subMonths(currentMonth, 1);
    return isBefore(previousMonth, startOfMonth(today));
  };

  const isNextButtonDisabled = () => {
    const nextMonth = addMonths(currentMonth, 1);
    return isAfter(nextMonth, endOfMonth(maxDate));
  };

  const renderHeader = () => (
    <div className="flex justify-center gap-4 items-center mb-2">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        disabled={isBackButtonDisabled()}
        className={`transition-colors duration-300 pr-[3px] w-8 h-8 rounded-full flex items-center justify-center ${
          isBackButtonDisabled()
            ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
            : 'text-gray-500 bg-[rgba(04,43,43,0.09)] hover:bg-[rgba(04,43,43,1)]'
        }`}
      >
        <svg width="8" height="14" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.5654 20.312L1.71892 10.7847L10.5654 1.25733"
            stroke={isBackButtonDisabled() ? "#D1D5DB" : "#BDC6C6"}
            strokeWidth="1.95493"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <h4 className="text-sm font-semibold text-[#263238] text-center leading-none">
        {format(currentMonth, 'MMMM yyyy')}
      </h4>

      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        disabled={isNextButtonDisabled()}
        className={`transition-colors duration-300 pl-[3px] w-8 h-8 rounded-full flex items-center justify-center ${
          isNextButtonDisabled()
            ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
            : 'text-gray-500 bg-[rgba(04,43,43,0.09)] hover:bg-[rgba(04,43,43,1)]'
        }`}
      >
        <svg className='rotate-180' width="8" height="14" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.5654 20.312L1.71892 10.7847L10.5654 1.25733"
            stroke={isNextButtonDisabled() ? "#D1D5DB" : "#BDC6C6"}
            strokeWidth="1.95493"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return (
      <div className="grid grid-cols-7 text-center text-[10px] font-medium text-[#3C413F] gap-1 pb-1">
        {days.map(day => (
          <div key={day} className="py-0.5">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        // Create a copy of the day to avoid mutation issues
        const currentDay = new Date(day);
        const isDisabled = isBefore(currentDay, today) || isAfter(currentDay, maxDate);
        const isNotCurrentMonth = currentDay.getMonth() !== currentMonth.getMonth();
        const isSelected = selectedDate && format(currentDay, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        const isToday = isSameDay(currentDay, today);
        const isAvailableDay = !isDisabled && !isNotCurrentMonth;

        days.push(
          <div
            key={currentDay.getTime()}
            className={`text-center size-6 text-[11px] cursor-pointer flex items-center justify-center rounded-full mb-1
              transition-all duration-200
              ${isDisabled || isNotCurrentMonth ? 'text-gray-300 cursor-not-allowed' : 'text-[#263238]'}
              ${isAvailableDay && !isSelected ? 'bg-[rgba(04,43,43,0.08)] ring-1 ring-[rgba(04,43,43,0.25)] hover:bg-[rgba(04,43,43,0.14)]' : ''}
              ${isToday && !isSelected ? 'ring-2 ring-[rgba(04,43,43,0.85)]' : ''}
              ${isSelected ? 'bg-[rgba(04,43,43,1)] text-white font-bold ring-2 ring-[rgba(04,43,43,1)]' : ''}
            `}
            onClick={() => {
              if (!isDisabled && !isNotCurrentMonth) {
                const selectedDay = new Date(currentDay);
                setSelectedDate(selectedDay);
                setFormData(prev => {
                  return { ...prev, testDate: selectedDay };
                });
              }
            }}
          >
            {format(currentDay, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day.getTime()} className="grid grid-cols-7 gap-1 justify-items-center">{days}</div>);
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="w-full p-2">
      <div className="flex items-center gap-3 mb-2 text-[10px] text-[#263238]">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[rgba(04,43,43,0.08)] ring-1 ring-[rgba(04,43,43,0.25)]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-transparent ring-2 ring-[rgba(04,43,43,0.85)]" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[rgba(04,43,43,1)]" />
          <span>Selected</span>
        </div>
      </div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
