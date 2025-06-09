import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { productService } from "../services/api";

interface MainContextType {
  products: any[];
  loading: boolean;
  loadProducts: () => void;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadProducts = async () => {
    const data = await productService.getAllProducts();
    console.log("data", JSON.stringify(data.products.length, null, 2));
    setProducts(data.products);
  };
  // useEffect(() => {
  //   loadProducts();
  //   return () => {};
  // }, []);

  return <MainContext.Provider value={{ products, loading, loadProducts }}>{children}</MainContext.Provider>;
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainContextProvider");
  }
  return context;
};

export default MainContext;
