import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { productService } from "../services/api";

interface MainContextType {
  products: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  categories: string[];
  favoriteProducts: any[];
  addToFavorite: (p: any) => void;
  removeFromFavorite: (p: any) => void;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("favorite");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["Men", "Women", "Children", "Accessories", "Beauty", "Winter"];

  const addToFavorite = (p: any) => {
    const updated = [...favoriteProducts, p];
    localStorage.setItem("favorite", JSON.stringify(updated));
    setFavoriteProducts(updated);
  };

  const removeFromFavorite = (p: any) => {
    const updated = favoriteProducts.filter((i) => i._id !== p?._id);
    localStorage.setItem("favorite", JSON.stringify(updated));
    setFavoriteProducts(updated);
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllProducts(currentPage);
        setProducts((prev) => [...prev, ...data.products]);
        setTotalPages(data.totalPages || Math.ceil(data.totalCount / 8));
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [currentPage]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <MainContext.Provider
      value={{ products, loading, currentPage, totalPages, setPage, categories, favoriteProducts, addToFavorite, removeFromFavorite }}
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

export default MainContext;
