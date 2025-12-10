import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../types";
import { loginUser, registerUser } from "../services/apiService"; // API 서비스 사용

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>; // 반환 타입을 Promise로 변경
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // [변경] 초기 로딩 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("세션 복원 실패", e);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  // [변경] 서버 API를 통한 로그인
  const login = async (email: string, password: string) => {
    const loggedInUser = await loginUser(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser)); // 로그인 상태 유지
      return true;
    }
    return false;
  };

  // [변경] 서버 API를 통한 회원가입
  const register = async (email: string, name: string, password: string) => {
    const registeredUser = await registerUser(email, name, password);
    if (registeredUser) {
      setUser(registeredUser);
      localStorage.setItem("currentUser", JSON.stringify(registeredUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("currentUser"); // 로그아웃 시 저장된 정보 삭제
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
