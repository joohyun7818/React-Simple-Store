import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Product, CartItem, Order, PageView } from "../types";
import { useAuth } from "./AuthContext";
// [변경] apiService 함수들 import
import {
  fetchProductsFromServer,
  fetchCart,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
  clearCartAPI,
  fetchOrdersAPI,
  placeOrderAPI,
} from "../services/apiService";

interface StoreContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => Promise<void>; // 비동기로 변경됨
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: () => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  resetProducts: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<PageView>("home");
  const [products, setProductsState] = useState<Product[]>([]);

  // 초기 상품 로딩
  useEffect(() => {
    fetchProductsFromServer().then(setProductsState);
  }, []);

  useEffect(() => {
    if (user) {
      // 장바구니와 주문 내역을 병렬로 가져옴
      Promise.all([fetchCart(user.email), fetchOrdersAPI(user.email)]).then(
        ([serverCart, serverOrders]) => {
          setCart(serverCart);
          setOrders(serverOrders);
        }
      );
    } else {
      setCart([]);
      setOrders([]);
    }
  }, [user]);

  // 장바구니 목록 새로고침 헬퍼 함수
  const refreshCart = async () => {
    if (user) {
      const updatedCart = await fetchCart(user.email);
      setCart(updatedCart);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) return;

    // 1. 서버에 추가 요청
    await addToCartAPI(user.email, product.id);
    // 2. 장바구니 상태 최신화
    await refreshCart();
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    await removeFromCartAPI(user.email, productId);
    await refreshCart();
  };

  const updateQuantity = async (productId: string, delta: number) => {
    if (!user) return;

    const item = cart.find((i) => i.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    // 수량 변경 요청
    await updateCartItemAPI(user.email, productId, newQuantity);
    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await clearCartAPI(user.email);
    setCart([]);
  };

  const placeOrder = async () => {
    if (cart.length === 0 || !user) return;

    // 1. 서버에 주문 요청
    const success = await placeOrderAPI(user.email, user.country);

    if (success) {
      // 2. 주문 성공 시 로컬 상태 업데이트
      // 서버에서 최신 주문 목록과 빈 장바구니 상태를 다시 받아옵니다.
      const newOrders = await fetchOrdersAPI(user.email);
      setOrders(newOrders);

      setCart([]); // 로컬 장바구니 비우기
      setCurrentPage("orders"); // 주문 내역 페이지로 이동
    } else {
      alert("주문 처리에 실패했습니다.");
    }
  };

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
  };

  const resetProducts = async () => {
    const defaultProducts = await fetchProductsFromServer();
    setProductsState(defaultProducts);
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
        resetProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
