import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments } from '@/db/schema';
import { eq, and, gte, lt, sql } from 'drizzle-orm';
import persianDate from 'persian-date';
import { toPersianDigits } from '@/lib/utils';

const serviceDetails: Record<string, { price: number; duration: number }> = {
  haircut: { price: 150000, duration: 45 },
  haircolor: { price: 350000, duration: 90 },
  eyelashes: { price: 250000, duration: 60 },
  nails: { price: 200000, duration: 60 },
  bridal: { price: 800000, duration: 180 },
};

const serviceNames: Record<string, string> = {
  haircut: 'کوتاهی مو',
  haircolor: 'رنگ مو',
  eyelashes: 'مژه',
  nails: 'ناخن کاری',
  bridal: 'آرایش عروس',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceName, customerName, customerPhone, appointmentDate, appointmentTime, notes } = body;

    if (!serviceName || !customerName || !customerPhone || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'تمامی فیلدهای ضروری باید پر شوند' },
        { status: 400 }
      );
    }

    if (!serviceDetails[serviceName]) {
      return NextResponse.json(
        { error: 'سرویس انتخابی نامعتبر است' },
        { status: 400 }
      );
    }

    const appDate = new Date(appointmentDate);
    const startOfDay = new Date(appDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(appDate.setHours(23, 59, 59, 999));

    // Check for duplicate appointment
    const existing = await db.select().from(appointments).where(
      and(
        eq(appointments.serviceName, serviceName),
        gte(appointments.appointmentDate, startOfDay),
        lt(appointments.appointmentDate, endOfDay),
        eq(appointments.appointmentTime, appointmentTime),
        sql`${appointments.status} IN ('pending', 'confirmed')`
      )
    ).limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'این زمان قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید.' },
        { status: 409 }
      );
    }

    const service = serviceDetails[serviceName];
    
    const [newAppointment] = await db.insert(appointments).values({
      serviceName,
      customerName,
      customerPhone,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      notes,
      totalPrice: service.price,
      status: 'pending',
      smsSent: false,
    }).returning();

    // Send SMS
    await sendSMS(customerPhone, serviceName, appointmentDate, appointmentTime);

    return NextResponse.json({
      success: true,
      appointment: {
        id: newAppointment.id,
        serviceName: serviceNames[serviceName],
        customerName,
        appointmentDate,
        appointmentTime,
        totalPrice: service.price,
      },
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const limit = parseInt(searchParams.get('limit') || '50');
    const dateStr = searchParams.get('date');
    const service = searchParams.get('service');

    let conditions = [];
    if (status && status !== 'all') {
      conditions.push(eq(appointments.status, status));
    }
    if (dateStr) {
      const date = new Date(dateStr);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      conditions.push(and(gte(appointments.appointmentDate, start), lt(appointments.appointmentDate, end)));
    }
    if (service) {
      conditions.push(eq(appointments.serviceName, service));
    }

    const results = await db.select().from(appointments)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(appointments.createdAt);

    return NextResponse.json({
      success: true,
      appointments: results.map((app) => ({
        id: app.id,
        serviceName: app.serviceName,
        serviceNameFa: serviceNames[app.serviceName] || app.serviceName,
        customerName: app.customerName,
        customerPhone: app.customerPhone,
        date: app.appointmentDate.toISOString().split('T')[0],
        time: app.appointmentTime,
        status: app.status,
        totalPrice: app.totalPrice,
        createdAt: app.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات' },
      { status: 500 }
    );
  }
}

async function sendSMS(phone: string, serviceName: string, date: string, time: string) {
  const apiKey = process.env.SMS_API_KEY || process.env.NEXT_PUBLIC_SMS_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_SMS_IR_API_KEY_HERE' || !apiKey) {
    console.log('SMS API key not configured. Skipping SMS.');
    return;
  }

  const serviceNamesMap: Record<string, string> = {
    haircut: 'کوتاهی مو',
    haircolor: 'رنگ مو',
    eyelashes: 'مژه',
    nails: 'ناخن کاری',
    bridal: 'آرایش عروس',
  };

  const pDate = new persianDate(new Date(date));
  const persianDateStr = toPersianDigits(pDate.format('DD MMMM YYYY'));
  const persianTime = toPersianDigits(time);

  const message = `سلام، وقت شما برای ${serviceNamesMap[serviceName] || serviceName} در تاریخ ${persianDateStr} ساعت ${persianTime} در سالن زیبایی رویای زیبا ثبت شد. منتظر دیدار شما هستیم!`;

  try {
    const response = await fetch('https://api.sms.ir/v1/send/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        lineNumber: process.env.SMS_LINE_NUMBER || null,
        messageText: message,
        mobiles: [phone],
        sendDateTime: null,
      }),
    });

    const result = await response.json();
    if (response.ok && result.status === 1) {
      console.log('SMS sent successfully');
    }
  } catch (error) {
    console.log('SMS sending error:', error);
  }
}
