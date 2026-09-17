'use client';

import Link from 'next/link';
import { toPersianDigits } from '@/lib/utils';

const services = [
  {
    id: 'haircut',
    name: 'کوتاهی مو',
    icon: '💇‍♀️',
    image: '/images/haircut.jpg',
    description: 'کوتاهی مو تخصصی با بهترین استایل‌های روز دنیا',
    fullDescription: 'تیم متخصصین ما با به‌روزترین تکنیک‌های کوتاهی مو، استایلی متناسب با صورت و شخصیت شما ایجاد می‌کنند. از کوتاهی‌های کلاسیک تا مدرن، همه چیز در دسترس شماست.',
    duration: '45 دقیقه',
    price: '150,000 تومان',
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
    features: ['مشاوره رایگان قبل از کوتاهی', 'استایل متناسب با فرم صورت', 'استفاده از قیچی‌های حرفه‌ای', 'شستشو و حالت‌دهی رایگان'],
  },
  {
    id: 'haircolor',
    name: 'رنگ مو',
    icon: '🎨',
    image: '/images/haircolor.jpg',
    description: 'رنگ و لایت مو با بهترین برندهای اروپایی',
    fullDescription: 'با استفاده از بهترین برندهای رنگ موی اروپایی و تکنیک‌های مدرن لایت و هایلایت، ظاهری تازه و جذاب به موهای خود ببخشید.',
    duration: '90 دقیقه',
    price: '350,000 تومان',
    color: 'from-purple-500 to-violet-500',
    gradient: 'bg-gradient-to-br from-purple-50 to-violet-50',
    features: ['رنگ‌های بدون آمونیاک', 'تکنیک‌های بالیاژ و آمبره', 'محافظت از سلامت مو', 'مشاوره رنگ متناسب با پوست'],
  },
  {
    id: 'eyelashes',
    name: 'مژه',
    icon: '👁️',
    image: '/images/eyelashes.jpg',
    description: 'کاشت و فرم‌دهی مژه با طبیعی‌ترین ظاهر',
    fullDescription: 'کاشت مژه با طبیعی‌ترین روش‌ها و با استفاده از مژه‌های باکیفیت. همچنین خدمات فرم‌دهی و لیفت مژه را ارائه می‌دهیم.',
    duration: '60 دقیقه',
    price: '250,000 تومان',
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-50 to-pink-50',
    features: ['کاشت تک‌تک طبیعی', 'انواع مدل‌های نچرال و حجم‌دار', 'لیفت و لمینت مژه', 'تضمین کیفیت چسب و مژه'],
  },
  {
    id: 'nails',
    name: 'ناخن کاری',
    icon: '💅',
    image: '/images/nails.jpg',
    description: 'ناخن کاری حرفه‌ای با طراحی‌های خاص',
    fullDescription: 'خدمات کامل ناخن شامل مانیکور، پدیکور، کاشت، ژلیش و طراحی‌های خاص با بهترین مواد و ابزارها.',
    duration: '60 دقیقه',
    price: '200,000 تومان',
    color: 'from-fuchsia-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-50 to-pink-50',
    features: ['مانیکور و پدیکور کامل', 'کاشت پودر و ژل', 'ژلیش با برندهای اصل', 'طراحی‌های خاص و مینیمال'],
  },
  {
    id: 'bridal',
    name: 'عروس',
    icon: '👰',
    image: '/images/bridal.jpg',
    description: 'آرایش و گریم تخصصی عروس با بهترین کیفیت',
    fullDescription: 'در روز خاص زندگی‌تان، زیباترین باشید! تیم متخصصین ما با تجربه در آرایش عروس، ظاهری رویایی و ماندگار برای شما ایجاد می‌کنند.',
    duration: '180 دقیقه',
    price: '800,000 تومان',
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    features: ['مشاوره رایگان قبل از عروسی', 'تست آرایش قبل از مراسم', 'استفاده از برندهای لوکس', 'همراهی در تمام مراسم'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">خدمات ما</h1>
          <p className="text-xl text-pink-100">بهترین خدمات زیبایی با حرفه‌ای‌ترین متخصصین</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} className={`rounded-3xl overflow-hidden glass-effect flex flex-col`}>
              <div className="relative h-64">
                <img 
                  src={(service as any).image} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-6 right-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {service.icon}
                </div>
              </div>
              <div className={`p-8 ${service.gradient} flex-1`}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.name}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">{service.fullDescription}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-pink-500 font-bold">✦</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                  <div>
                    <p className="text-sm text-gray-500">مدت زمان</p>
                    <p className="font-bold text-gray-800">{toPersianDigits(service.duration)}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">قیمت</p>
                    <p className="font-bold text-2xl text-pink-600">{toPersianDigits(service.price)}</p>
                  </div>
                </div>

                <Link
                  href={`/booking?service=${service.id}`}
                  className="block mt-6 btn-gradient text-white text-center py-4 rounded-xl font-medium"
                >
                  رزرو وقت برای {service.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">هنوز مطمئن نیستید؟</h2>
          <p className="text-xl text-pink-100 mb-8">
            با متخصصین ما تماس بگیرید و مشاوره رایگان دریافت کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:02112345678"
              className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              📞 ۰۲۱-۱۲۳۴۵۶۷۸
            </a>
            <a
              href="https://wa.me/989121234567"
              className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              💬 واتساپ
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">سالن زیبایی رویای زیبا</h3>
          <p className="text-gray-400 mb-6">تهران، سعادت‌آباد، بلوار دریا، پلاک ۱۲۳</p>
          <p className="text-gray-500">© ۱۴۰۳ تمامی حقوق محفوظ است</p>
        </div>
      </footer>
    </div>
  );
}
