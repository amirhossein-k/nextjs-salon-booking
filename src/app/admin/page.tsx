'use client';

import { useState, useEffect } from 'react';
import persianDate from 'persian-date';
import { toPersianDigits } from '@/lib/utils';

interface Appointment {
  id: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

const serviceColors: Record<string, string> = {
  'کوتاهی مو': 'bg-pink-100 text-pink-800',
  'رنگ مو': 'bg-purple-100 text-purple-800',
  'مژه': 'bg-rose-100 text-rose-800',
  'ناخن کاری': 'bg-fuchsia-100 text-fuchsia-800',
  'آرایش عروس': 'bg-amber-100 text-amber-800',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const statusParam = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/bookings${statusParam}`);
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('آیا از حذف این وقت مطمئن هستید؟')) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(app =>
    app.customerName.includes(searchTerm) ||
    app.customerPhone.includes(searchTerm) ||
    app.serviceName.includes(searchTerm) ||
    (app as any).serviceNameFa?.includes(searchTerm)
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    today: appointments.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      return a.appointmentDate.startsWith(today);
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">پنل مدیریت سالن زیبایی</h1>
          <p className="text-pink-100">مدیریت وقت‌های رزرو شده</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">کل وقت‌ها</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                📅
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">در انتظار</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                ⏳
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">تایید شده</p>
                <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                ✓
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">امروز</p>
                <p className="text-3xl font-bold text-pink-600">{stats.today}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-2xl">
                📆
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="جستجو بر اساس نام، شماره یا سرویس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filter === status
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'همه' :
                   status === 'pending' ? 'در انتظار' :
                   status === 'confirmed' ? 'تایید شده' :
                   status === 'cancelled' ? 'لغو شده' : 'تکمیل شده'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">وقت رزرو شده‌ای یافت نشد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${serviceColors[(appointment as any).serviceNameFa] || 'bg-gray-100 text-gray-800'}`}>
                          {(appointment as any).serviceNameFa}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[appointment.status] || 'bg-gray-100 text-gray-800'}`}>
                          {appointment.status === 'pending' ? 'در انتظار' :
                           appointment.status === 'confirmed' ? 'تایید شده' :
                           appointment.status === 'cancelled' ? 'لغو شده' : 'تکمیل شده'}
                        </span>
                      </div>
                      <p className="font-bold text-gray-800 mb-1">{appointment.customerName}</p>
                      <p className="text-gray-600 text-sm mb-2">📞 {appointment.customerPhone}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>📅 {toPersianDigits(new persianDate(new Date(appointment.appointmentDate)).format('YYYY/MM/DD'))}</span>
                        <span>⏰ {toPersianDigits(appointment.appointmentTime)}</span>
                        <span className="font-bold text-pink-600">{toPersianDigits(appointment.totalPrice.toLocaleString())} تومان</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(appointment.id, 'confirmed')}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium"
                          >
                            تایید
                          </button>
                          <button
                            onClick={() => updateStatus(appointment.id, 'cancelled')}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium"
                          >
                            لغو
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(appointment.id, 'completed')}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
                        >
                          تکمیل
                        </button>
                      )}
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
