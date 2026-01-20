import React from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import CartPage from "./pages/CartPage";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider, useStore } from "./context/StoreContext";
import { useAuth } from "./context/AuthContext";
import { UIConfigProvider } from "./context/UIConfigContext";

declare global {
  interface Window {
    customDataLayer?: Array<Record<string, unknown>>;
    __lastGtmPageView?: {
      page: string;
      ts: number;
    };
  }
}

const pathFromPage = (page: string) => {
  switch (page) {
    case "home":
      return "/";
    case "cart":
      return "/cart";
    case "orders":
      return "/orders";
    case "login":
      return "/login";
    default:
      return "/";
  }
};

const pageFromPath = (pathname: string) => {
  const normalized = (pathname || "/").replace(/\/+$/, "") || "/";
  switch (normalized) {
    case "/":
      return "home";
    case "/cart":
      return "cart";
    case "/orders":
      return "orders";
    case "/login":
      return "login";
    default:
      return "home";
  }
};

// Router Component to switch views based on state
const AppContent: React.FC = () => {
  const { currentPage, setCurrentPage } = useStore();
  const { user } = useAuth();

  // 초기 URL → 상태 동기화
  React.useEffect(() => {
    const initialPage = pageFromPath(window.location.pathname);
    if (initialPage !== currentPage) {
      setCurrentPage(initialPage as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 뒤로가기/앞으로가기(popstate) → 상태 동기화
  React.useEffect(() => {
    const onPopState = () => {
      const nextPage = pageFromPath(window.location.pathname);
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage as any);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [currentPage, setCurrentPage]);

  // Basic route protection
  React.useEffect(() => {
    if ((currentPage === "cart" || currentPage === "orders") && !user) {
      setCurrentPage("login");
    }
  }, [currentPage, user, setCurrentPage]);

  // 상태 → URL 동기화 (GTM History Change가 페이지별로 구분되도록)
  React.useEffect(() => {
    const targetPath = pathFromPage(currentPage);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: currentPage }, "", targetPath);
    }
  }, [currentPage]);

  // SPA 뷰 전환을 GTM에 custom_page_view로 기록
  React.useEffect(() => {
    if (!window.customDataLayer) window.customDataLayer = [];

    // React 18 StrictMode(dev)에서 effect가 2번 실행될 수 있어 중복 전송 방지
    const now = Date.now();
    const last = window.__lastGtmPageView;
    if (last && last.page === currentPage && now - last.ts < 1000) {
      return;
    }
    window.__lastGtmPageView = { page: currentPage, ts: now };

    window.customDataLayer.push({
      event: "custom_page_view",
      page_path: pathFromPage(currentPage),
      page_title: currentPage,
    });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <Navbar />
      <main className="container mx-auto pt-6">
        {currentPage === "home" && <ProductList />}
        {currentPage === "cart" && <CartPage />}
        {currentPage === "orders" && <OrderHistory />}
        {currentPage === "login" && <Login />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2024 AI Smart Store. All rights reserved.</p>
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
