import React, { useState } from 'react';
import { UserPlus, Users, ShoppingCart, Clock, Plus, Minus } from 'lucide-react';
import type { Client } from '../types/client';
import type { Product, CartItem } from '../types/product';

export const ClientManagement = () => {
  const [isNewClient, setIsNewClient] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [visits, setVisits] = useState<{ 
    name: string; 
    date: Date;
    products: CartItem[];
    startTime: Date;
    endTime?: Date;
    totalAmount?: number;
  }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    job: '',
    age: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
  const [currentVisitStartTime, setCurrentVisitStartTime] = useState<Date | null>(null);
  const [newProductQuantity, setNewProductQuantity] = useState(1);

  // سعر الساعة
  const HOUR_RATE = 10;

  // منتجات للتجربة (في التطبيق الحقيقي ستأتي من قاعدة البيانات)
  const demoProducts: Product[] = [
    { id: '1', name: 'قهوة', price: 5, category: 'مشروبات' },
    { id: '2', name: 'شاي', price: 3, category: 'مشروبات' },
    { id: '3', name: 'عصير', price: 7, category: 'مشروبات' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date();
    
    if (isNewClient) {
      const clientData: Client = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        job: formData.job,
        age: Number(formData.age),
        lastVisit: currentDate,
        isNewClient: true,
      };
      setClients([...clients, clientData]);
    } else {
      setVisits([...visits, { 
        name: formData.name, 
        date: currentDate,
        products: [],
        startTime: currentDate,
      }]);
      setCurrentVisitStartTime(currentDate);
      setSelectedProducts([]);
    }
    
    setFormData({ name: '', phone: '', job: '', age: '' });
  };

  const addProductToVisit = (product: Product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p => 
        p.id === product.id ? { ...p, quantity: p.quantity + newProductQuantity } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: newProductQuantity }]);
    }
    setNewProductQuantity(1); // إعادة تعيين الكمية إلى 1 بعد الإضافة
  };

  const updateProductQuantity = (productId: string, change: number) => {
    setSelectedProducts(selectedProducts.map(p => {
      if (p.id === productId) {
        const newQuantity = Math.max(1, p.quantity + change); // لا يمكن أن تكون الكمية أقل من 1
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const calculateTotal = (products: CartItem[], startTime: Date, endTime: Date) => {
    const productTotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    const timeCharge = hours * HOUR_RATE;
    return productTotal + timeCharge;
  };

  const finishVisit = (visitIndex: number) => {
    const endTime = new Date();
    const updatedVisits = [...visits];
    const visit = updatedVisits[visitIndex];
    
    if (visit && !visit.endTime) {
      const total = calculateTotal(selectedProducts, visit.startTime, endTime);
      updatedVisits[visitIndex] = {
        ...visit,
        endTime,
        products: selectedProducts,
        totalAmount: total
      };
      setVisits(updatedVisits);
      setCurrentVisitStartTime(null);
      setSelectedProducts([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">إدارة العملاء</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setIsNewClient(true)}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  isNewClient ? 'bg-blue-600 text-white' : 'bg-white/5 text-blue-200'
                }`}
              >
                <UserPlus className="h-5 w-5" />
                عميل جديد
              </button>
              <button
                onClick={() => setIsNewClient(false)}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  !isNewClient ? 'bg-blue-600 text-white' : 'bg-white/5 text-blue-200'
                }`}
              >
                <Users className="h-5 w-5" />
                عميل حالي
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسم العميل"
                  dir="rtl"
                />
              </div>

              {isNewClient && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل رقم الهاتف"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      المهنة
                    </label>
                    <input
                      type="text"
                      value={formData.job}
                      onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل المهنة"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      العمر
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل العمر"
                      dir="rtl"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {isNewClient ? 'تسجيل عميل جديد' : 'تسجيل زيارة'}
              </button>
            </form>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">
              {isNewClient ? 'قائمة العملاء' : 'سجل الزيارات'}
            </h2>
            
            {isNewClient ? (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="pb-3 text-blue-200">الاسم</th>
                      <th className="pb-3 text-blue-200">رقم الهاتف</th>
                      <th className="pb-3 text-blue-200">المهنة</th>
                      <th className="pb-3 text-blue-200">العمر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b border-slate-800">
                        <td className="py-3 text-white">{client.name}</td>
                        <td className="py-3 text-white">{client.phone}</td>
                        <td className="py-3 text-white">{client.job}</td>
                        <td className="py-3 text-white">{client.age}</td>
                      </tr>
                    ))}
                    {clients.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-blue-200">
                          لا يوجد عملاء حالياً
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                {visits.map((visit, index) => (
                  <div key={index} className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-white font-medium">{visit.name}</h4>
                        <p className="text-sm text-blue-200">
                          {visit.date.toLocaleDateString('ar-SA')} - {visit.date.toLocaleTimeString('ar-SA')}
                        </p>
                      </div>
                      {!visit.endTime && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <select
                              onChange={(e) => {
                                const product = demoProducts.find(p => p.id === e.target.value);
                                if (product) {
                                  addProductToVisit(product);
                                }
                              }}
                              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              defaultValue=""
                            >
                              <option value="" disabled>اختر منتج</option>
                              {demoProducts.map(product => (
                                <option key={product.id} value={product.id}>
                                  {product.name} - {product.price} جنيه
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-2">
                              <button
                                type="button"
                                onClick={() => setNewProductQuantity(Math.max(1, newProductQuantity - 1))}
                                className="text-white hover:text-blue-400 transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="text-white min-w-[2rem] text-center">{newProductQuantity}</span>
                              <button
                                type="button"
                                onClick={() => setNewProductQuantity(newProductQuantity + 1)}
                                className="text-white hover:text-blue-400 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => finishVisit(index)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            إنهاء الزيارة
                          </button>
                        </div>
                      )}
                    </div>

                    {/* عرض المنتجات المحددة */}
                    {!visit.endTime && selectedProducts.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h5 className="text-blue-200 font-medium">المنتجات المحددة:</h5>
                        {selectedProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between text-white bg-slate-700/50 p-2 rounded-lg">
                            <div className="flex items-center gap-4">
                              <span>{product.name}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateProductQuantity(product.id, -1)}
                                  className="text-white hover:text-blue-400 transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[2rem] text-center">{product.quantity}</span>
                                <button
                                  onClick={() => updateProductQuantity(product.id, 1)}
                                  className="text-white hover:text-blue-400 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <span>{product.price * product.quantity} جنيه</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* عرض تفاصيل الزيارة المنتهية */}
                    {visit.endTime && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="space-y-2">
                          <div className="flex justify-between text-white">
                            <span>المنتجات:</span>
                            <span>
                              {visit.products.reduce((sum, p) => sum + (p.price * p.quantity), 0)} جنيه
                            </span>
                          </div>
                          <div className="flex justify-between text-white">
                            <span>مدة الزيارة:</span>
                            <span>
                              {Math.ceil((visit.endTime.getTime() - visit.startTime.getTime()) / (1000 * 60 * 60))} ساعة
                            </span>
                          </div>
                          <div className="flex justify-between text-white font-bold">
                            <span>الإجمالي:</span>
                            <span>{visit.totalAmount} جنيه</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {visits.length === 0 && (
                  <p className="text-center text-blue-200">لا يوجد زيارات حالياً</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};