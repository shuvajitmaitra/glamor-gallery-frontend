import { createContext, useContext, ReactNode, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("favorite");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories = ["Men", "Women", "Children", "Accessories", "Beauty", "Winter"];

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam }) => productService.getAllProducts(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.totalPages || Math.ceil(lastPage.totalCount / 8);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const currentPage = data?.pages.length ?? 0;
  const lastPage = data?.pages[data.pages.length - 1];
  const totalPages = lastPage ? (lastPage.totalPages || Math.ceil(lastPage.totalCount / 8)) : 1;
  const loading = isLoading || isFetchingNextPage;

  const setPage = (page: number) => {
    if (page > currentPage && hasNextPage) {
      fetchNextPage();
    }
  };

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
