import React, { useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { searchProductsWithAI } from '../services/geminiService';

const ProductList: React.FC = () => {
  const { products, addToCart, setProducts, setCurrentPage } = useStore();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Use Gemini to get products
    const newProducts = await searchProductsWithAI(searchQuery);
    if (newProducts.length > 0) {
      setProducts(newProducts);
    } else {
        alert("관련 상품을 찾을 수 없습니다.");
    }
    setIsSearching(false);
  };

  const handleAddToCart = (product: any) => {
      if (!user) {
          alert('로그인이 필요합니다.');
          setCurrentPage('login');
          return;
      }
      addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI 상품 검색</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="찾고 싶은 상품을 입력하세요 (예: '전문가용 등산 장비 추천해줘')"
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
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : '검색'}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-2">
            * Gemini AI가 입력하신 내용을 바탕으로 가상의 상품 목록을 생성합니다.
        </p>
      </div>

      {/* Product Grid */}
      <h3 className="text-xl font-bold text-gray-800 mb-6">상품 목록</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="h-48 overflow-hidden bg-gray-100 relative group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="text-xs font-bold text-indigo-600 mb-1">{product.category}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
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
    </div>
  );
};

export default ProductList;