import React, { useState, useEffect } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
// import { searchProductsWithAI } from '../services/geminiService'; // 기존 AI 서비스 제거
import { fetchProductsFromServer } from "../services/apiService"; // 신규 API 서비스 추가

const ProductList: React.FC = () => {
  const { products, addToCart, setProducts, setCurrentPage } = useStore();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // [변경점 1] 컴포넌트 마운트 시 전체 상품 목록 불러오기
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (query?: string) => {
    setIsSearching(true);
    // Gemini 대신 서버 API 호출
    const newProducts = await fetchProductsFromServer(query);
    setProducts(newProducts);
    setIsSearching(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // [변경점 2] 검색어를 이용해 서버 재조회
    await loadProducts(searchQuery);
  };

  const handleAddToCart = (product: any) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      setCurrentPage("login");
      return;
    }
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 검색 헤더 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">상품 검색</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="검색어를 입력하세요 (예: '노트북', '가성비')"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[100px] justify-center"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "검색"
            )}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-2">
          * 서버 데이터베이스(SQLite)에서 상품을 검색합니다.
        </p>
      </div>

      {/* 상품 그리드 */}
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        {searchQuery ? `'${searchQuery}' 검색 결과` : "전체 상품 목록"}
      </h3>

      {products.length === 0 && !isSearching ? (
        <div className="text-center py-10 text-gray-500">
          표시할 상품이 없습니다. 서버가 실행 중인지 확인해주세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden bg-gray-100 relative group">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs font-bold text-indigo-600 mb-1">
                  {product.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-gray-900">
                    {product.price.toLocaleString()}원
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                    aria-label="Add to cart"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
