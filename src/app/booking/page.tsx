'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import persianDate from 'persian-date';
import PersianDatePicker from '@/components/PersianDatePicker';
import { toPersianDigits } from '@/lib/utils';

const services = [
  {
    id: 'haircut',
    name: 'کوتاهی مو',
    icon: '💇‍♀️',
    image: '/images/haircut.jpg',
    description: 'کوتاهی مو تخصصی با بهترین استایل‌های روز دنیا',
    duration: '45 دقیقه',
    price: '150,000 تومان',
    durationMinutes: 45,
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
  },
  {
    id: 'haircolor',
    name: 'رنگ مو',
    icon: '🎨',
    image: '/images/haircolor.jpg',
    description: 'رنگ و لایت مو با بهترین برندهای اروپایی',
    duration: '90 دقیقه',
    price: '350,000 تومان',
    durationMinutes: 90,
    color: 'from-purple-500 to-violet-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-violet-100',
  },
  {
    id: 'eyelashes',
    name: 'مژه',
    icon: '👁️',
    image: '/images/eyelashes.jpg',
    description: 'کاشت و فرم‌دهی مژه با طبیعی‌ترین ظاهر',
    duration: '60 دقیقه',
    price: '250,000 تومان',
    durationMinutes: 60,
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
  },
  {
    id: 'nails',
    name: 'ناخن کاری',
    icon: '💅',
    image: '/images/nails.jpg',
    description: 'ناخن کاری حرفه‌ای با طراحی‌های خاص',
    duration: '60 دقیقه',
    price: '200,000 تومان',
    durationMinutes: 60,
    color: 'from-fuchsia-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-100',
  },
  {
    id: 'bridal',
    name: 'عروس',
    icon: '👰',
    image: '/images/bridal.jpg',
    description: 'آرایش و گریم تخصصی عروس با بهترین کیفیت',
    duration: '180 دقیقه',
    price: '800,000 تومان',
    durationMinutes: 180,
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
  },
];

const workingHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

interface TimeSlot {
  time: string;
  available: boolean;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service');
  
  const [selectedService, setSelectedService] = useState<string | null>(initialService);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  // Fetch available time slots when date or service changes
  useEffect(() => {
    if (!selectedDate || !selectedService) {
      setTimeSlots(workingHours.map(time => ({ time, available: true })));
      return;
    }

    const fetchSlots = async () => {
      try {
        const persianDateStr = selectedDate.format('YYYY/MM/DD');
        const [year, month, day] = persianDateStr.split('/').map(Number);
        // @ts-ignore
        const gDate = persianDate.toGregorian(year, month, day);
        const gregorianDate = new Date(gDate.year, gDate.month - 1, gDate.day).toISOString().split('T')[0];

        const response = await fetch(`/api/bookings?date=${gregorianDate}&service=${selectedService}`);
        const data = await response.json();

        if (data.success && data.appointments) {
          const slots = workingHours.map(time => {
            const [hour, minute] = time.split(':').map(Number);
            const startTime = hour * 60 + minute;
            const duration = services.find(s => s.id === selectedService)?.durationMinutes || 60;
            const endTime = startTime + duration;

            let available = true;
            for (const appointment of data.appointments) {
              if (appointment.status === 'cancelled') continue;
              
              const [appHour, appMinute] = appointment.time.split(':').map(Number);
              const appDuration = services.find(s => s.id === appointment.serviceName)?.durationMinutes || 60;
              const appStartTime = appHour * 60 + appMinute;
              const appEndTime = appStartTime + appDuration;

              if (
                (startTime >= appStartTime && startTime < appEndTime) ||
                (endTime > appStartTime && endTime <= appEndTime) ||
                (startTime <= appStartTime && endTime >= appEndTime)
              ) {
                available = false;
                break;
              }
            }
            return { time, available };
          });
          setTimeSlots(slots);
        } else {
          setTimeSlots(workingHours.map(time => ({ time, available: true })));
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setTimeSlots(workingHours.map(time => ({ time, available: true })));
      }
    };

    fetchSlots();
  }, [selectedDate, selectedService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedService) {
      alert('لطفاً تاریخ و سرویس را انتخاب کنید');
      return;
    }

    setBookingStatus('loading');

    try {
      const persianDateStr = selectedDate.format('YYYY/MM/DD');
      const [year, month, day] = persianDateStr.split('/').map(Number);
      // @ts-ignore
      const gDate = persianDate.toGregorian(year, month, day);
      const gregorianDate = new Date(gDate.year, gDate.month - 1, gDate.day).toISOString().split('T')[0];

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: selectedService,
          customerName: formData.name,
          customerPhone: formData.phone,
          appointmentDate: gregorianDate,
          appointmentTime: selectedTime,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        setBookingStatus('success');
        setTimeout(() => {
          setBookingStatus('idle');
          setFormData({ name: '', phone: '', notes: '' });
          setSelectedDate(null);
          setSelectedTime('');
          setSelectedService(null);
        }, 3000);
      } else {
        const error = await response.json();
        alert(error.error || 'خطا در ثبت درخواست');
        setBookingStatus('error');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingStatus('error');
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Service Selection */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">انتخاب سرویس</h2>
        <div className="space-y-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`w-full rounded-2xl text-right transition-all overflow-hidden border border-transparent ${
                selectedService === service.id
                  ? 'ring-2 ring-pink-500 shadow-lg border-pink-500'
                  : 'hover:shadow-md hover:border-pink-200'
              } ${service.gradient} glass-effect`}
            >
              <div className="flex items-center">
                <img 
                  src={(service as any).image} 
                  alt={service.name}
                  className="w-16 h-16 object-cover"
                />
                <div className="px-4 py-2">
                  <p className="font-bold text-gray-800 text-sm">{service.name}</p>
                  <p className="text-xs text-gray-600">{toPersianDigits(service.price)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">فرم رزرو وقت</h2>

          {selectedServiceData && (
            <div className={`rounded-xl overflow-hidden mb-6 border border-pink-100 shadow-sm`}>
              <div className="flex flex-col md:flex-row">
                <img 
                  src={(selectedServiceData as any).image} 
                  alt={selectedServiceData.name}
                  className="w-full md:w-32 h-32 object-cover"
                />
                <div className={`flex-1 p-4 ${selectedServiceData.gradient}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedServiceData.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">{selectedServiceData.name}</p>
                      <p className="text-gray-600 text-sm">{selectedServiceData.description}</p>
                      <div className="flex gap-4 mt-1 text-xs">
                        <span>⏱️ {toPersianDigits(selectedServiceData.duration)}</span>
                        <span className="font-bold text-pink-600">{toPersianDigits(selectedServiceData.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedService && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800">لطفاً ابتدا یک سرویس را انتخاب کنید.</p>
            </div>
          )}

          {bookingStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">درخواست ثبت شد!</h2>
              <p className="text-gray-600">
                پیامک تایید برای شماره {formData.phone} ارسال خواهد شد.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Picker */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">تاریخ مورد نظر *</label>
                <PersianDatePicker
                  value={selectedDate}
                  onChange={(date: any) => {
                    setSelectedDate(date);
                    setSelectedTime('');
                  }}
                />
                {selectedDate && selectedDate.day() === 6 && (
                  <span className="text-red-500 text-sm mt-2 block">جمعه‌ها تعطیل است</span>
                )}
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">ساعت مورد نظر *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`py-3 px-4 rounded-xl font-medium transition-all ${
                          !slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : selectedTime === slot.time
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200'
                        }`}
                      >
                        {toPersianDigits(slot.time)}
                      </button>
                    ))}
                  </div>
                  {!selectedTime && (
                    <p className="text-gray-500 text-sm mt-2">لطفاً یک ساعت انتخاب کنید</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="مثال: مریم احمدی"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">شماره تماس *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    placeholder="مثال: 09123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">یادداشت (اختیاری)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none"
                  placeholder="هر نکته‌ای که باید بدانیم..."
                />
              </div>

              {bookingStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800">خطا در ثبت درخواست. لطفا دوباره تلاش کنید.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingStatus === 'loading' || !selectedService || !selectedDate || !selectedTime}
                className="w-full btn-gradient text-white py-4 rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingStatus === 'loading' ? 'در حال ثبت...' : 'تایید و ثبت وقت'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-pink-100 hover:text-white transition-colors">
            <span>← بازگشت به صفحه اصلی</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        }>
          <BookingContent />
        </Suspense>
      </div>
    </div>
  );
}
