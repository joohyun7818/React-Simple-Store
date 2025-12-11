import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useUIConfig } from "../context/UIConfigContext";
import { Lock, Mail, User, ArrowRight } from "lucide-react";

const Login: React.FC = () => {
  const { login, register } = useAuth();
  const { setCurrentPage } = useStore();
  const { uiConfig } = useUIConfig();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLoginMode && !name)) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      if (isLoginMode) {
        // [수정] await 키워드 추가
        const success = await login(email, password);
        if (success) {
          setCurrentPage("home");
        } else {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
      } else {
        // [수정] await 키워드 추가
        const success = await register(email, name, password);
        if (success) {
          setCurrentPage("home");
        } else {
          setError("이미 존재하는 이메일이거나 오류가 발생했습니다.");
        }
      }
    } catch (e) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${uiConfig.primaryColor}20` }}
          >
            <Lock className="w-8 h-8" style={{ color: uiConfig.primaryColor }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLoginMode ? "로그인" : "회원가입"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLoginMode
              ? "서비스 이용을 위해 로그인해주세요"
              : "새로운 계정을 생성하세요"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                  style={{ 
                    borderColor: name ? uiConfig.primaryColor : undefined
                  }}
                  placeholder="홍길동"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  borderColor: email ? uiConfig.primaryColor : undefined
                }}
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  borderColor: password ? uiConfig.primaryColor : undefined
                }}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 transition-opacity mt-6"
            style={{ 
              backgroundColor: uiConfig.primaryColor
            }}
          >
            {isLoading ? "처리 중..." : isLoginMode ? "로그인" : "가입하기"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError("");
              setEmail("");
              setPassword("");
              setName("");
            }}
            className="text-sm font-medium flex items-center justify-center mx-auto hover:opacity-80"
            style={{ color: uiConfig.primaryColor }}
          >
            {isLoginMode
              ? "계정이 없으신가요? 회원가입"
              : "이미 계정이 있으신가요? 로그인"}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
