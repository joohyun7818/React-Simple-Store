import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { UIConfig } from "../types";

// Default configuration (v1)
const defaultUIConfig: UIConfig = {
  theme: "default",
  primaryColor: "#007bff",
  showDiscount: false,
  featuredCategories: ["전자제품", "의류", "도서"],
  headerMessage: "AI Store에 오신 것을 환영합니다!"
};

interface UIConfigContextType {
  uiConfig: UIConfig;
  setUIConfig: (config: UIConfig) => void;
  resetUIConfig: () => void;
}

const UIConfigContext = createContext<UIConfigContextType | undefined>(undefined);

export const UIConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uiConfig, setUIConfigState] = useState<UIConfig>(defaultUIConfig);

  const setUIConfig = useCallback((config: UIConfig) => {
    setUIConfigState(config);
  }, []);

  const resetUIConfig = useCallback(() => {
    setUIConfigState(defaultUIConfig);
  }, []);

  return (
    <UIConfigContext.Provider value={{ uiConfig, setUIConfig, resetUIConfig }}>
      {children}
    </UIConfigContext.Provider>
  );
};

export const useUIConfig = () => {
  const context = useContext(UIConfigContext);
  if (!context) {
    throw new Error("useUIConfig must be used within a UIConfigProvider");
  }
  return context;
};
