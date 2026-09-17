import persianDate from 'persian-date';

export interface AvailableTimeSlot {
  time: string;
  available: boolean;
}

export const workingHours = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const serviceDurations: Record<string, number> = {
  haircut: 45,
  haircolor: 90,
  eyelashes: 60,
  nails: 60,
  bridal: 180,
};

export function toPersianDate(date: Date): string {
  const pDate = new persianDate(date);
  return pDate.format('YYYY/MM/DD');
}

export function toGregorianDate(persianDateStr: string): string {
  const [year, month, day] = persianDateStr.split('/').map(Number);
  // @ts-ignore - persian-date library
  const gDate = persianDate.toGregorian(year, month, day);
  const date = new Date(gDate.year, gDate.month - 1, gDate.day);
  return date.toISOString().split('T')[0];
}

export function getPersianMonthNames(): string[] {
  return [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
}

export function getPersianDayNames(): string[] {
  return ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 5; // Friday is weekend in Iran
}

export function isHoliday(date: Date): boolean {
  // Add your holiday logic here
  // For now, return false
  return false;
}

export function isAvailableTime(
  time: string,
  selectedDate: string,
  serviceName: string,
  existingAppointments: Array<{ date: string; time: string; status: string; serviceName?: string }>
): boolean {
  const duration = serviceDurations[serviceName] || 60;
  const [hour, minute] = time.split(':').map(Number);
  const startTime = hour * 60 + minute;
  const endTime = startTime + duration;

  // Check if time slot overlaps with existing appointments
  for (const appointment of existingAppointments) {
    if (appointment.status === 'cancelled') continue;
    
    const [appHour, appMinute] = appointment.time.split(':').map(Number);
    const appDuration = serviceDurations[appointment.serviceName || 'haircut'] || 60;
    const appStartTime = appHour * 60 + appMinute;
    const appEndTime = appStartTime + appDuration;

    // Check if same date and overlapping time
    if (appointment.date === selectedDate) {
      if (
        (startTime >= appStartTime && startTime < appEndTime) ||
        (endTime > appStartTime && endTime <= appEndTime) ||
        (startTime <= appStartTime && endTime >= appEndTime)
      ) {
        return false;
      }
    }
  }

  return true;
}

export async function fetchAvailableSlots(
  date: string,
  serviceName: string
): Promise<AvailableTimeSlot[]> {
  try {
    const response = await fetch(`/api/bookings?date=${date}&service=${serviceName}`);
    const data = await response.json();
    
    if (!data.success) {
      return workingHours.map(time => ({ time, available: true }));
    }

    return workingHours.map(time => ({
      time,
      available: isAvailableTime(time, date, serviceName, data.appointments || [])
    }));
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return workingHours.map(time => ({ time, available: true }));
  }
}
