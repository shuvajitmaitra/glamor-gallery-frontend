import React, { createContext, useContext, useEffect, useState } from "react";
import { productService } from "../services/api";
export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
}

export interface Product {
  _id: string;
  available: boolean;
  availableSize: string[];
  productName: string;
  productImage: string[];
  buyPrice: number;
  askingPrice: number;
  sellingPrice: number;
  stock: number;
  category: string;
  description: string;
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
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  categories: string[];
  products: Product[];
  loadProducts: () => Promise<void>;
  handleSearchProducts: (searchTerm: string) => void;
  filterProducts: (searchTerm: string) => void;
};

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainProvider = ({ children }: { children: React.ReactNode }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const categories = ["All", "Category 1", "Category 2", "Category 3"];

  const loadProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setAllProducts(response.products);
      setProducts(response.products);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleSearchProducts = (searchTerm: string) => {
    const filtered = allProducts.filter((product) => {
      return (
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setProducts(filtered);
  };

  const filterProducts = (searchTerm: string) => {
    const filtered = allProducts.filter((product) => {
      return (
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setProducts(filtered);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <MainContext.Provider
      value={{
        categories,
        showMobileSearch,
        setShowMobileSearch,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartItems,
        setCartItems,
        setIsSidebarOpen,
        isSidebarOpen,
        categoryFilter,
        setCategoryFilter,
        products,
        loadProducts,
        handleSearchProducts,
        filterProducts,
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
