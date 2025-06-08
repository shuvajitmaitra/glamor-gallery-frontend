import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { productService } from "../services/api";

interface MainContextType {
  products: any[];
  loading: boolean;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await productService.getAllProducts();
      console.log("data", JSON.stringify(data.products.length, null, 2));
      setProducts(data.products);
      setLoading(false);
    };
    loadProducts();
    return () => {};
  }, []);

  return <MainContext.Provider value={{ products, loading }}>{children}</MainContext.Provider>;
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainContextProvider");
  }
  return context;
};

export default MainContext;
