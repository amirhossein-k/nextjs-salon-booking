'use client';

import { useState } from 'react';
import PersianDatePicker from '@/components/PersianDatePicker';
import persianDate from 'persian-date';
import { toPersianDigits } from '@/lib/utils';

const services = [
  {
    id: 'haircut',
    name: 'کوتاهی مو',
    nameEn: 'haircut',
    icon: '💇‍♀️',
    image: '/images/haircut.jpg',
    description: 'کوتاهی مو تخصصی با بهترین استایل‌های روز دنیا',
    duration: '45 دقیقه',
    price: '150,000 تومان',
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
  },
  {
    id: 'haircolor',
    name: 'رنگ مو',
    nameEn: 'haircolor',
    icon: '🎨',
    image: '/images/haircolor.jpg',
    description: 'رنگ و لایت مو با بهترین برندهای اروپایی',
    duration: '90 دقیقه',
    price: '350,000 تومان',
    color: 'from-purple-500 to-violet-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-violet-100',
  },
  {
    id: 'eyelashes',
    name: 'مژه',
    nameEn: 'eyelashes',
    icon: '👁️',
    image: '/images/eyelashes.jpg',
    description: 'کاشت و فرم‌دهی مژه با طبیعی‌ترین ظاهر',
    duration: '60 دقیقه',
    price: '250,000 تومان',
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
  },
  {
    id: 'nails',
    name: 'ناخن کاری',
    nameEn: 'nails',
    icon: '💅',
    image: '/images/nails.jpg',
    description: 'ناخن کاری حرفه‌ای با طراحی‌های خاص',
    duration: '60 دقیقه',
    price: '200,000 تومان',
    color: 'from-fuchsia-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-100',
  },
  {
    id: 'bridal',
    name: 'عروس',
    nameEn: 'bridal',
    icon: '👰',
    image: '/images/bridal.jpg',
    description: 'آرایش و گریم تخصصی عروس با بهترین کیفیت',
    duration: '180 دقیقه',
    price: '800,000 تومان',
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
  },
];

export default function Home() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: null as any,
    time: '',
    notes: '',
  });
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowBookingForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) {
      alert('لطفاً تاریخ را انتخاب کنید');
      return;
    }
    setBookingStatus('loading');

    try {
      const pDate = formData.date;
      const gDate = (persianDate as any).toGregorian(pDate.year(), pDate.month() + 1, pDate.date());
      const gregorianDate = new Date(gDate.year, gDate.month - 1, gDate.day).toISOString().split('T')[0];

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: selectedService,
          customerName: formData.name,
          customerPhone: formData.phone,
          appointmentDate: gregorianDate,
          appointmentTime: formData.time,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        setBookingStatus('success');
        setTimeout(() => {
          setShowBookingForm(false);
          setBookingStatus('idle');
          setFormData({ name: '', phone: '', date: '', time: '', notes: '' });
        }, 3000);
      } else {
        setBookingStatus('error');
      }
    } catch (error) {
      setBookingStatus('error');
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              سالن زیبایی
              <br />
              <span className="text-6xl md:text-8xl">رویای زیبا</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              تجربه زیبایی و آرامش در محیطی لوکس و حرفه‌ای
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#services"
                className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg"
              >
                رزرو وقت آنلاین
              </a>
              <a
                href="tel:02112345678"
                className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                📞 ۰۲۱-۱۲۳۴۵۶۷۸
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            خدمات ما
          </h2>
          <p className="text-xl text-gray-600">
            بهترین خدمات زیبایی با حرفه‌ای‌ترین متخصصین
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className={`service-card cursor-pointer glass-effect rounded-3xl overflow-hidden group hover:bg-white/40`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={(service as any).image} 
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {service.icon}
                </div>
              </div>
              <div className={`p-8 ${service.gradient}`}>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed h-12 overflow-hidden">{service.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {toPersianDigits(service.duration)}
                  </span>
                  <span className="font-bold text-pink-600">{toPersianDigits(service.price)}</span>
                </div>
                <button className="w-full btn-gradient text-white py-3 rounded-xl font-medium">
                  رزرو وقت
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                ⭐
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">متخصصین حرفه‌ای</h3>
              <p className="text-gray-600">تیم مجرب و آموزش‌دیده با سال‌ها تجربه</p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🌟
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">محیط لوکس</h3>
              <p className="text-gray-600">فضایی آرام و دلنشین برای استراحت شما</p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                💎
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">محصولات باکیفیت</h3>
              <p className="text-gray-600">استفاده از بهترین برندهای اروپایی</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">سالن زیبایی رویای زیبا</h3>
          <p className="text-pink-100 mb-6">تهران، سعادت‌آباد، بلوار دریا، پلاک ۱۲۳</p>
          <div className="flex justify-center gap-6 text-2xl">
            <a href="#" className="hover:scale-110 transition-transform">📷</a>
            <a href="#" className="hover:scale-110 transition-transform">📱</a>
            <a href="#" className="hover:scale-110 transition-transform">💬</a>
          </div>
          <p className="text-pink-200 mt-8">© ۱۴۰۳ تمامی حقوق محفوظ است</p>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {bookingStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">درخواست ثبت شد!</h3>
                <p className="text-gray-600">پیامک تایید برای شما ارسال خواهد شد.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">رزرو وقت</h3>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {selectedServiceData && (
                  <div className={`p-4 rounded-xl ${selectedServiceData.gradient} mb-6`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedServiceData.icon}</span>
                      <div>
                        <p className="font-bold text-gray-800">{selectedServiceData.name}</p>
                        <p className="text-sm text-gray-600">{selectedServiceData.price}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">نام و نام خانوادگی</label>
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
                    <label className="block text-gray-700 mb-2 font-medium">شماره تماس</label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">تاریخ</label>
                      <PersianDatePicker
                        value={formData.date}
                        onChange={(date) => setFormData({ ...formData, date })}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">ساعت</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">یادداشت (اختیاری)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none"
                      placeholder="هر نکته‌ای که باید بدانیم..."
                    />
                  </div>

                  {bookingStatus === 'error' && (
                    <p className="text-red-500 text-center">خطا در ثبت درخواست. لطفا دوباره تلاش کنید.</p>
                  )}

                  <button
                    type="submit"
                    disabled={bookingStatus === 'loading'}
                    className="w-full btn-gradient text-white py-4 rounded-xl font-medium text-lg disabled:opacity-50"
                  >
                    {bookingStatus === 'loading' ? 'در حال ثبت...' : 'تایید و ثبت وقت'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
