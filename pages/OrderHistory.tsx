import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Clock, ArrowRight } from 'lucide-react';

const OrderHistory: React.FC = () => {
  const { orders, setCurrentPage } = useStore();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">주문 내역이 없습니다</h2>
        <p className="text-gray-500 mb-6">아직 주문하신 상품이 없습니다.</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="text-indigo-600 font-medium hover:underline"
        >
          쇼핑하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
        <Clock className="w-6 h-6 mr-2 text-indigo-600" />
        주문 내역
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">주문 날짜</span>
                <p className="font-medium text-gray-900">
                    {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">주문 번호</span>
                <p className="font-medium text-gray-900">#{order.id}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">총 결제금액</span>
                <p className="font-bold text-indigo-600">{order.total.toLocaleString()}원</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                {order.status === 'processing' ? '배송 준비중' : order.status}
              </div>
            </div>

            <div className="p-4">
              <ul className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <li key={idx} className="py-3 flex items-center gap-4">
                    <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-16 h-16 rounded object-cover bg-gray-100" 
                    />
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-gray-900">{item.price.toLocaleString()}원</p>
                        <p className="text-sm text-gray-500">{item.quantity}개</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;