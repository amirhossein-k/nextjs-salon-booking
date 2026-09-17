import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { appointments } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'وضعیت باید مشخص شود' },
        { status: 400 }
      );
    }

    const [updated] = await db.update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'وقت یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: updated,
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی وقت' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [deleted] = await db.delete(appointments)
      .where(eq(appointments.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: 'وقت یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'وقت با موفقیت حذف شد',
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { error: 'خطا در حذف وقت' },
      { status: 500 }
    );
  }
}
