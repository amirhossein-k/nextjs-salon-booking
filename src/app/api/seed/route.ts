import { NextResponse } from 'next/server';
import { db } from '@/db';
import { services, staff } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function POST() {
  try {
    const servicesData = [
      {
        name: 'haircut',
        nameFa: 'کوتاهی مو',
        description: 'کوتاهی مو تخصصی با بهترین استایل‌های روز دنیا',
        duration: 45,
        price: 150000,
        imageUrl: '/images/haircut.jpg',
      },
      {
        name: 'haircolor',
        nameFa: 'رنگ مو',
        description: 'رنگ و لایت مو با بهترین برندهای اروپایی',
        duration: 90,
        price: 350000,
        imageUrl: '/images/haircolor.jpg',
      },
      {
        name: 'eyelashes',
        nameFa: 'مژه',
        description: 'کاشت و فرم‌دهی مژه با طبیعی‌ترین ظاهر',
        duration: 60,
        price: 250000,
        imageUrl: '/images/eyelashes.jpg',
      },
      {
        name: 'nails',
        nameFa: 'ناخن کاری',
        description: 'ناخن کاری حرفه‌ای با طراحی‌های خاص',
        duration: 60,
        price: 200000,
        imageUrl: '/images/nails.jpg',
      },
      {
        name: 'bridal',
        nameFa: 'آرایش عروس',
        description: 'آرایش و گریم تخصصی عروس با بهترین کیفیت',
        duration: 180,
        price: 800000,
        imageUrl: '/images/bridal.jpg',
      },
    ];

    for (const service of servicesData) {
      await db.insert(services).values(service).onConflictDoUpdate({
        target: services.name,
        set: service,
      });
    }

    const staffData = [
      { name: 'سارا محمدی', role: 'آرایشگر', phone: '09121111111' },
      { name: 'مریم رضایی', role: 'متخصص مژه', phone: '09122222222' },
      { name: 'زهرا کریمی', role: 'ناخن‌کار', phone: '09123333333' },
      { name: 'نگین حسینی', role: 'گریمور عروس', phone: '09124444444' },
    ];

    for (const s of staffData) {
      await db.insert(staff).values(s).onConflictDoNothing();
    }

    return NextResponse.json({
      success: true,
      message: 'داده‌های اولیه با موفقیت ایجاد شدند',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد داده‌های اولیه' },
      { status: 500 }
    );
  }
}
