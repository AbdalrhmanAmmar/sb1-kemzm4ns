import React, { useState } from 'react';
import { PlusCircle, Package, Edit2, Trash2, ShoppingCart } from 'lucide-react';
import type { Product, CartItem, Checkout } from '../types/product';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
  });

  // حساب سعر القاعة بالساعة
  const HALL_PRICE_PER_HOUR = 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, name: formData.name, price: Number(formData.price), category: formData.category }
          : p
      ));
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
      };
      setProducts([...products, newProduct]);
    }
    setFormData({ name: '', price: '', category: '' });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
    });
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const startCheckout = () => {
    const startTime = new Date();
    setCheckout({
      products: cart,
      startTime,
      endTime: null,
      hallPrice: 0,
      totalPrice: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    });
  };

  const finishCheckout = () => {
    if (checkout) {
      const endTime = new Date();
      const hours = Math.ceil((endTime.getTime() - checkout.startTime.getTime()) / (1000 * 60 * 60));
      const hallPrice = hours * HALL_PRICE_PER_HOUR;
      const productsPrice = checkout.products.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      setCheckout({
        ...checkout,
        endTime,
        hallPrice,
        totalPrice: hallPrice + productsPrice,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">إدارة المنتجات</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* نموذج إضافة/تعديل المنتج */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Package className="h-5 w-5" />
              {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل اسم المنتج"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  السعر
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل السعر"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  الفئة
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل الفئة"
                  dir="rtl"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  {editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({ name: '', price: '', category: '' });
                    }}
                    className="flex-1 bg-slate-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* قائمة المنتجات */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">قائمة المنتجات</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-blue-200 text-sm">
                      {product.category} - {product.price} ريال
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 text-green-400 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-blue-200">لا توجد منتجات حالياً</p>
              )}
            </div>
          </div>

          {/* سلة المشتريات والحساب */}
          {(cart.length > 0 || checkout) && (
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">الفاتورة</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-blue-200 text-sm">
                        {item.quantity} × {item.price} ريال = {item.quantity * item.price} ريال
                      </p>
                    </div>
                  </div>
                ))}

                {checkout && (
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="space-y-2">
                      <p className="text-white">
                        وقت البدء: {checkout.startTime.toLocaleTimeString('ar-SA')}
                      </p>
                      {checkout.endTime && (
                        <>
                          <p className="text-white">
                            وقت الانتهاء: {checkout.endTime.toLocaleTimeString('ar-SA')}
                          </p>
                          <p className="text-white">
                            تكلفة القاعة: {checkout.hallPrice} ريال
                          </p>
                          <p className="text-white font-bold">
                            المجموع الكلي: {checkout.totalPrice} ريال
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {!checkout && (
                  <button
                    onClick={startCheckout}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    بدء الحساب
                  </button>
                )}

                {checkout && !checkout.endTime && (
                  <button
                    onClick={finishCheckout}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    إنهاء الحساب
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};