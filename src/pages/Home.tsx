import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Rocket, Users, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Rocket className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">X Space</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">مرحباً, {user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-5 w-5 ml-2" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">مرحباً بك في الفضاء العربي</h1>
          <p className="text-xl text-blue-200">اكتشف عجائب الكون معنا</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/clients"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors group"
          >
            <Users className="h-12 w-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2">إدارة العملاء</h2>
            <p className="text-blue-200">إضافة وإدارة العملاء الجدد والحاليين</p>
          </Link>

          <Link
            to="/reservations"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors group"
          >
            <Calendar className="h-12 w-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2">الحجوزات</h2>
            <p className="text-blue-200">إدارة حجوزات القاعات والمواعيد</p>
          </Link>

          <Link
            to="/products"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors group"
          >
            <Package className="h-12 w-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2">المنتجات</h2>
            <p className="text-blue-200">إدارة المنتجات والمبيعات</p>
          </Link>
        </div>
      </main>
    </div>
  );
};