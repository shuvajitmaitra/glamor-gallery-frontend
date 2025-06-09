import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { productService } from "../services/api";

interface MainContextType {
  products: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  categories: string[];
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const categories = ["Men", "Women", "Children", "Accessories", "Beauty", "Winter"];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts(currentPage);
        const total = [...products, ...data.products];
        setProducts(total);
        setTotalPages(data.totalPages || Math.ceil(data.totalCount / 8));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
    return () => {};
  }, [currentPage]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <MainContext.Provider value={{ products, loading, currentPage, totalPages, setPage, categories }}>{children}</MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainContextProvider");
  }
  return context;
};

export default MainContext;
