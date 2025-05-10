import React, { createContext, useEffect, useState, useCallback } from "react";
import { productService } from "../src/services/api";

// Create the context with undefined as the default value
const MainContext = createContext(undefined);

// Utility to update localStorage
const updateLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to update ${key} in localStorage:`, error);
  }
};

// Utility to load from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const MainContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(loadFromLocalStorage("wishlist", []));
  const [cart, setCart] = useState(loadFromLocalStorage("cart", []));

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAllProducts();
      if (response.success) {
        setProducts(response.products || []);
      } else {
        throw new Error("Failed to fetch products");
      }
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch products";
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProductById(id);
      if (response.success) {
        setLoading(false);
        return response.product;
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch product";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);

  const addProductToWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) return prev; // Prevent duplicates
      const newWishlist = [...prev, productId];
      updateLocalStorage("wishlist", newWishlist);
      return newWishlist;
    });
  }, []);

  const removeProductFromWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      const newWishlist = prev.filter((id) => id !== productId);
      updateLocalStorage("wishlist", newWishlist);
      return newWishlist;
    });
  }, []);

  const addToCart = useCallback((productId) => {
    setCart((prev) => {
      if (prev.includes(productId)) return prev; // Prevent duplicates
      const newCart = [...prev, productId];
      updateLocalStorage("cart", newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => {
      const newCart = prev.filter((id) => id !== productId);
      updateLocalStorage("cart", newCart);
      return newCart;
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <MainContext.Provider
      value={{
        products,
        loading,
        error,
        wishlist,
        cart,
        fetchProducts,
        fetchProductById,
        addProductToWishlist,
        removeProductFromWishlist,
        addToCart,
        removeFromCart,
        clearError,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

// Custom hook to consume the context
const useMainContext = () => {
  const context = React.useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainContextProvider");
  }
  return context;
};

export { MainContext, MainContextProvider, useMainContext };
