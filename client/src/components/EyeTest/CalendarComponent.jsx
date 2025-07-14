import React, { useState, useEffect } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, format, isBefore, isAfter
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
    <div className="flex justify-center gap-[24px] items-center mb-[12px]">
      <button 
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        disabled={isBackButtonDisabled()}
        className={`transition-colors duration-300 pr-[3px] w-[45px] h-[45px] rounded-full flex items-center justify-center ${
          isBackButtonDisabled() 
            ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
            : 'text-gray-500 bg-[rgba(04,43,43,0.09)] hover:bg-[rgba(04,43,43,1)]'
        }`}
      >
        <svg width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M10.5654 20.312L1.71892 10.7847L10.5654 1.25733" 
            stroke={isBackButtonDisabled() ? "#D1D5DB" : "#BDC6C6"} 
            strokeWidth="1.95493" 
            strokeLinecap="round"
          />
        </svg>
      </button>
      
      <h4 className="text-h5Text text-[#263238] text-center leading-[100%] font-normal">
        {format(currentMonth, 'MMMM yyyy')}
      </h4>
      
      <button 
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        disabled={isNextButtonDisabled()}
        className={`transition-colors duration-300 pl-[3px] w-[45px] h-[45px] rounded-full flex items-center justify-center ${
          isNextButtonDisabled() 
            ? 'text-gray-300 bg-gray-100 cursor-not-allowed' 
            : 'text-gray-500 bg-[rgba(04,43,43,0.09)] hover:bg-[rgba(04,43,43,1)]'
        }`}
      >
        <svg className='rotate-180' width="12" height="22" viewBox="0 0 12 22" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];
    return (
      <div className="grid grid-cols-7  text-center text-mediumText font-medium text-[#3C413F] gap-[12px] pb-[12px]">
        {days.map(day => (
          <div key={day} className="py-1 ">{day}</div>
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

        days.push(
          <div
            key={currentDay.getTime()}
            className={`text-center w-[70px] h-[70px] text-h6Text cursor-pointer flex items-center justify-center rounded-full mb-[12px] 
                transition-colors duration-300
              ${isDisabled || isNotCurrentMonth ? 'text-gray-300' : 'text-[#BFC9C9]'}
              ${isSelected ? 'bg-[rgba(04,43,43,0.09)] font-bold  text-[#263238]' : ''}
              
              ${!isDisabled && !isNotCurrentMonth ? 'hover:bg-[rgba(04,43,43,0.09)]   text-[#263238]' : ''}
            `}
            onClick={() => {
              if (!isDisabled && !isNotCurrentMonth) {
                // console.log('Date clicked:', currentDay);
                // console.log('Date formatted:', format(currentDay, 'yyyy-MM-dd'));
                // console.log('Date value:', currentDay);
                
                // Create a new date object to avoid reference issues
                const selectedDay = new Date(currentDay);
                // console.log('Selected day:', selectedDay);
                // console.log('Selected day formatted:', format(selectedDay, 'yyyy-MM-dd'));
                
                setSelectedDate(selectedDay);
                setFormData(prev => {
                  console.log('Previous formData:', prev);
                  console.log('Updating formData with date:', selectedDay);
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
      rows.push(<div key={day.getTime()} className="grid grid-cols-7 gap-[12px] ">{days}</div>);
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="w-full p-[1.5vw]">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
