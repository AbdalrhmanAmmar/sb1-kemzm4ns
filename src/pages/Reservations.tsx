import React, { useState } from 'react';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import type { Reservation } from '../types/client';

export const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [formData, setFormData] = useState({
    clientName: '',
    date: '',
    time: '',
    hallName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReservation: Reservation = {
      id: Date.now().toString(),
      ...formData,
    };
    setReservations([...reservations, newReservation]);
    setFormData({ clientName: '', date: '', time: '', hallName: '' });
  };

  const handleDelete = (id: string) => {
    setReservations(reservations.filter(res => res.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">الحجوزات</h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">حجز جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                اسم العميل
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم العميل"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                اسم القاعة
              </label>
              <input
                type="text"
                value={formData.hallName}
                onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسم القاعة"
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  التاريخ
                </label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 h-5 w-5 text-blue-200" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  الوقت
                </label>
                <div className="relative">
                  <Clock className="absolute right-3 top-3 h-5 w-5 text-blue-200" />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              تأكيد الحجز
            </button>
          </form>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">قائمة الحجوزات</h2>
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-white font-medium">{reservation.clientName}</p>
                  <p className="text-blue-200 text-sm">
                    {reservation.hallName} - {reservation.date} - {reservation.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {/* Handle edit */}}
                    className="p-2 text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            {reservations.length === 0 && (
              <p className="text-center text-blue-200">لا توجد حجوزات حالياً</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};