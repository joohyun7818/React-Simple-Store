import React, { useState, useEffect } from "react";
import { Search, Plus, Loader2, Tag } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { useUIConfig } from "../context/UIConfigContext";
import { fetchProductsFromServer } from "../services/apiService";

const ProductList: React.FC = () => {
  const { products, addToCart, setProducts, setCurrentPage } = useStore();
  const { user } = useAuth();
  const { uiConfig } = useUIConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // [변경점 1] 컴포넌트 마운트 시 전체 상품 목록 불러오기
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (query?: string) => {
    setIsSearching(true);
    const newProducts = await fetchProductsFromServer(query);
    setProducts(newProducts);
    setIsSearching(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
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

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Discount Banner */}
      {uiConfig.showDiscount && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg p-6 mb-6 flex items-center justify-center">
          <Tag className="w-6 h-6 mr-3" />
          <span className="text-xl font-bold">🎉 특별 할인 이벤트 진행중! 지금 바로 확인하세요!</span>
        </div>
      )}

      {/* Featured Categories */}
      {uiConfig.featuredCategories && uiConfig.featuredCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">추천 카테고리</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === null
                  ? 'text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={selectedCategory === null ? { backgroundColor: uiConfig.primaryColor } : {}}
            >
              전체
            </button>
            {uiConfig.featuredCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === category ? { backgroundColor: uiConfig.primaryColor } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

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
            className="text-white px-6 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center gap-2 min-w-[100px] justify-center"
            style={{ backgroundColor: uiConfig.primaryColor }}
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
        {selectedCategory 
          ? `${selectedCategory} 카테고리` 
          : searchQuery 
          ? `'${searchQuery}' 검색 결과` 
          : "전체 상품 목록"}
      </h3>

      {filteredProducts.length === 0 && !isSearching ? (
        <div className="text-center py-10 text-gray-500">
          {selectedCategory 
            ? `${selectedCategory} 카테고리에 상품이 없습니다.`
            : "표시할 상품이 없습니다. 서버가 실행 중인지 확인해주세요."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                <div 
                  className="text-xs font-bold mb-1"
                  style={{ color: uiConfig.primaryColor }}
                >
                  {product.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900">
                      {product.price.toLocaleString()}원
                    </span>
                    {uiConfig.showDiscount && (
                      <span className="text-xs text-red-500 font-semibold">🔥 특가!</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-white p-2 rounded-full hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: uiConfig.primaryColor }}
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
