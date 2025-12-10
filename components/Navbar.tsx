import React from 'react';
import { ShoppingCart, Package, LogOut, User as UserIcon, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart, setCurrentPage, currentPage, resetProducts } = useStore();

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navClass = (page: string) => 
    `flex items-center space-x-1 cursor-pointer hover:text-indigo-200 transition-colors ${currentPage === page ? 'text-white font-bold' : 'text-indigo-100'}`;

  const handleHomeClick = () => {
      resetProducts(); // Reset AI search results if any
      setCurrentPage('home');
  };

  return (
    <nav className="bg-indigo-600 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div 
            className="flex items-center space-x-2 text-white text-xl font-bold cursor-pointer"
            onClick={handleHomeClick}
        >
          <Store className="w-8 h-8" />
          <span>AI Smart Store</span>
        </div>

        <div className="flex items-center space-x-6">
          <div onClick={handleHomeClick} className={navClass('home')}>
            <span>상품 목록</span>
          </div>

          {user && (
            <>
              <div onClick={() => setCurrentPage('orders')} className={navClass('orders')}>
                <Package className="w-5 h-5" />
                <span>주문 내역</span>
              </div>
              
              <div onClick={() => setCurrentPage('cart')} className={`relative ${navClass('cart')}`}>
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-indigo-100 pl-4 border-l border-indigo-500">
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">{user.name}님</span>
                <button 
                  onClick={() => {
                      logout();
                      setCurrentPage('login');
                  }}
                  className="text-xs bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded ml-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {!user && (
            <button 
              onClick={() => setCurrentPage('login')}
              className="text-white bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;