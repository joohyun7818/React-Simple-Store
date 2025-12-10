export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
}

export interface User {
  email: string;
  name: string;
}

export type PageView = 'home' | 'cart' | 'orders' | 'login';

declare global {
  interface Window {
    initSqlJs: (config?: any) => Promise<any>;
  }
}