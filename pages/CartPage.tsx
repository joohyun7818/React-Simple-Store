import React from 'react';
import { Trash2, Plus, Minus, CreditCard, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, placeOrder, setCurrentPage } = useStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
            <CreditCard className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">장바구니가 비어있습니다</h2>
        <p className="mb-6">원하는 상품을 담아보세요.</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          쇼핑 계속하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => setCurrentPage('home')}
        className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        쇼핑 계속하기
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-8">장바구니</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <div className="font-bold text-indigo-600 mt-1">
                  {item.price.toLocaleString()}원
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">결제 정보</h3>
            
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>총 상품금액</span>
                <span>{total.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span>무료</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-bold text-gray-900">총 결제금액</span>
                <span className="text-2xl font-bold text-indigo-600">{total.toLocaleString()}원</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:translate-y-[-1px]"
            >
              주문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;