import { Product, User, CartItem, Order } from "../types";

const API_BASE_URL = "http://localhost:3000/api";

// 상품 목록 조회 호출
export const fetchProductsFromServer = async (
  query: string = ""
): Promise<Product[]> => {
  try {
    // 검색어가 있으면 쿼리 파라미터 추가
    const url = query
      ? `${API_BASE_URL}/products?q=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/products`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("서버 통신 오류");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("상품 조회 실패:", error);
    return [];
  }
};

// 로그인 API 호출
export const loginUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    return null;
  }
};

// 회원가입 API 호출
export const registerUser = async (
  email: string,
  name: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("회원가입 요청 실패:", error);
    return null;
  }
};

// [추가] 장바구니 목록 가져오기
export const fetchCart = async (email: string): Promise<CartItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart?email=${email}`);
    if (!response.ok) throw new Error("장바구니 조회 실패");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// [추가] 장바구니에 담기
export const addToCartAPI = async (email: string, productId: string) => {
  await fetch(`${API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, productId }),
  });
};

// [추가] 수량 업데이트
export const updateCartItemAPI = async (
  email: string,
  productId: string,
  quantity: number
) => {
  await fetch(`${API_BASE_URL}/cart/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, productId, quantity }),
  });
};

// [추가] 장바구니 아이템 삭제
export const removeFromCartAPI = async (email: string, productId: string) => {
  await fetch(`${API_BASE_URL}/cart/${email}/${productId}`, {
    method: "DELETE",
  });
};

// [추가] 장바구니 비우기
export const clearCartAPI = async (email: string) => {
  await fetch(`${API_BASE_URL}/cart/${email}`, {
    method: "DELETE",
  });
};

// [추가] 주문 내역 가져오기
export const fetchOrdersAPI = async (email: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders?email=${email}`);
    if (!response.ok) throw new Error("주문 내역 조회 실패");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// [추가] 주문 생성하기 (Checkout)
export const placeOrderAPI = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("주문 처리 실패");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
