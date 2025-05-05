import React, { createContext, useContext, useState } from "react";
export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
}

type MainContextType = {
  showMobileSearch: boolean;
  setShowMobileSearch: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCartDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCartDrawerOpen: boolean;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartItems: CartItem[];
  isSidebarOpen:boolean;
  setIsSidebarOpen:React.Dispatch<React.SetStateAction<boolean>>;
  categoryFilter:string;
  setCategoryFilter:React.Dispatch<React.SetStateAction<string>>;
  
};

 const MainContext = createContext<MainContextType | undefined>(
  undefined
);

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("");



  return (
    <MainContext.Provider
      value={{
        showMobileSearch,
        setShowMobileSearch,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartItems,
        setCartItems,
        setIsSidebarOpen,
        isSidebarOpen,categoryFilter,setCategoryFilter
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainProvider");
  }
  return context;
};
