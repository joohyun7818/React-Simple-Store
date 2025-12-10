import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order, PageView } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../services/db';

interface StoreContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: () => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  resetProducts: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [products, setProductsState] = useState<Product[]>([]);

  // Load initial products from DB
  useEffect(() => {
    const dbProducts = db.getProducts();
    if (dbProducts.length > 0) {
        setProductsState(dbProducts);
    }
  }, []);

  // Sync Cart and Orders when User changes
  useEffect(() => {
    if (user) {
      setCart(db.getCart(user.email));
      setOrders(db.getOrders(user.email));
    } else {
      setCart([]);
      setOrders([]);
    }
  }, [user]);

  // Helper to update state and DB
  const saveCartToDb = (newCart: CartItem[]) => {
    setCart(newCart);
    if (user) {
      db.saveCart(user.email, newCart);
    }
  };

  const addToCart = (product: Product) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      newCart[existingIndex] = { 
        ...newCart[existingIndex], 
        quantity: newCart[existingIndex].quantity + 1 
      };
    } else {
      newCart.push({ ...product, quantity: 1 });
    }
    
    saveCartToDb(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId);
    saveCartToDb(newCart);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveCartToDb(newCart);
  };

  const clearCart = () => {
    saveCartToDb([]);
  };

  const placeOrder = () => {
    if (cart.length === 0 || !user) return;
    
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'processing'
    };
    
    // Update Orders State
    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    
    // Save Order to DB
    db.addOrder(user.email, newOrder);
    
    // Clear Cart
    clearCart();
    setCurrentPage('orders');
  };

  const setProducts = (newProducts: Product[]) => {
      setProductsState(newProducts);
  };

  const resetProducts = () => {
      setProductsState(db.getProducts());
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
        currentPage,
        setCurrentPage,
        products,
        setProducts,
        resetProducts
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};