'use client';

import { useState } from 'react';
import persianDate from 'persian-date';
import { toPersianDigits } from '@/lib/utils';

interface PersianDatePickerProps {
  value: any;
  onChange: (date: any) => void;
  minDate?: any;
}

export default function PersianDatePicker({ value, onChange, minDate }: PersianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? value : new persianDate());

  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const days = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const getDaysInMonth = (month: number, year: number) => {
    const date: any = new persianDate([year, month, 1]);
    const daysInMonth = date.daysInMonth();
    // In persian-date: 1 is Saturday, 7 is Friday
    let firstDay = date.day();
    const firstDayOfWeek = firstDay - 1;
    return { daysInMonth, firstDayOfWeek };
  };

  const handleDateSelect = (day: number) => {
    const date = new persianDate([currentMonth.year(), currentMonth.month() + 1, day]);
    onChange(date);
    setIsOpen(false);
  };

  const { daysInMonth, firstDayOfWeek } = getDaysInMonth(currentMonth.month() + 1, currentMonth.year());

  const isPast = (day: number) => {
    const date: any = new persianDate([currentMonth.year(), currentMonth.month() + 1, day]);
    const today: any = new persianDate();
    // Compare dates by resetting time
    const dateClone = new Date(date.toDate().setHours(0, 0, 0, 0));
    const todayClone = new Date(new Date().setHours(0, 0, 0, 0));
    return dateClone.getTime() < todayClone.getTime();
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    return toPersianDigits(date.format('YYYY/MM/DD'));
  };

  const isWeekend = (day: number) => {
    const date: any = new persianDate([currentMonth.year(), currentMonth.month() + 1, day]);
    return date.day() === 6; // Friday
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={formatDate(value)}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all cursor-pointer"
        placeholder="تاریخ را انتخاب کنید"
      />
      
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100" dir="rtl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new persianDate([currentMonth.year(), currentMonth.month() - 1, 1]))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ‹
            </button>
            <span className="font-bold text-gray-800">
              {months[currentMonth.month()]} {toPersianDigits(currentMonth.year())}
            </span>
            <button
              onClick={() => setCurrentMonth(new persianDate([currentMonth.year(), currentMonth.month() + 1, 1]))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-3" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const weekend = isWeekend(day);
              const past = isPast(day);
              const disabled = weekend || past;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(day)}
                  disabled={disabled}
                  className={`p-3 rounded-lg text-center font-medium transition-all ${
                    disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : value && value.date() === day && value.month() === currentMonth.month() && value.year() === currentMonth.year()
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'hover:bg-pink-50 text-gray-700'
                  }`}
                >
                  {toPersianDigits(day)}
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-center text-sm text-red-500">
            جمعه‌ها تعطیل است
          </div>
        </div>
      )}
    </div>
  );
}
