import React from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartPage from './pages/CartPage';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { useAuth } from './context/AuthContext';
import { UIConfigProvider } from './context/UIConfigContext';

// Router Component to switch views based on state
const AppContent: React.FC = () => {
  const { currentPage, setCurrentPage } = useStore();
  const { user } = useAuth();

  // Basic route protection
  React.useEffect(() => {
      if ((currentPage === 'cart' || currentPage === 'orders') && !user) {
          setCurrentPage('login');
      }
  }, [currentPage, user, setCurrentPage]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <Navbar />
      <main className="container mx-auto pt-6">
        {currentPage === 'home' && <ProductList />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'orders' && <OrderHistory />}
        {currentPage === 'login' && <Login />}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; 2024 AI Smart Store. All rights reserved.</p>
            <p className="mt-2">Powered by Google Gemini</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UIConfigProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </UIConfigProvider>
  );
};

export default App;