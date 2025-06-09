import axios, { AxiosError } from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

// Define the Product type for type safety
interface Product {
  _id: string;
  productName: string;
  productImage: string[];
  sellingPrice: number;
  availableSize: string[];
  stock: number;
  description: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 3; // Maximum retry attempts

  // Memoized function to fetch products with retry logic
  const loadProducts = useCallback(async () => {
    // Check if products are cached in localStorage
    const cachedProducts = localStorage.getItem("cachedProducts");
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("https://glamor-gallery-backend.vercel.app/api/product/products", {
        timeout: 15000, // Increased timeout to 15 seconds
      });

      if (response.data.success) {
        setProducts(response.data.products);
        // Cache the products in localStorage with a timestamp
        localStorage.setItem("cachedProducts", JSON.stringify(response.data.products));
        localStorage.setItem("cacheTimestamp", Date.now().toString());
        setRetryCount(0); // Reset retry count on success
      } else {
        setError("Failed to load products: API response unsuccessful.");
      }
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
      if (error.code === "ECONNABORTED" && retryCount < maxRetries) {
        // Retry on timeout
        setRetryCount((prev) => prev + 1);
        setTimeout(() => loadProducts(), 2000 * (retryCount + 1)); // Exponential backoff
        setError(`Retrying... Attempt ${retryCount + 2} of ${maxRetries}`);
      } else {
        setError("Unable to load products. Please check your connection or try again later.");
      }
    } finally {
      if (retryCount >= maxRetries || !error) {
        setLoading(false);
      }
    }
  }, [retryCount, error]);

  // Check cache validity and fetch products
  useEffect(() => {
    const cacheTimestamp = localStorage.getItem("cacheTimestamp");
    const cacheDuration = 1000 * 60; // 1 hour cache duration
    const isCacheValid = cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration;

    if (!isCacheValid) {
      localStorage.removeItem("cachedProducts");
      localStorage.removeItem("cacheTimestamp");
    }

    loadProducts();
  }, [loadProducts]);

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg sm:text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg sm:text-xl text-red-600">{error}</p>
          <button
            onClick={() => {
              setRetryCount(0);
              loadProducts();
            }}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg sm:text-xl text-gray-600">No products available.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center min-h-screen bg-gray-100 py-4 sm:py-6">
      <div className="w-full max-w-7xl px-2 sm:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {products.map((product) => (
            <Link key={product._id} to={`/products/${product._id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <img
                  src={product.productImage[0]}
                  alt={product.productName}
                  className="w-full h-32 xs:h-36 sm:h-40 md:h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{product.productName}</h3>
                    <p className="text-gray-600 mt-1 text-xs xs:text-sm sm:text-base">৳{product.sellingPrice.toFixed(2)}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Sizes: {product.availableSize.join(", ")}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Stock: {product.stock}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 line-clamp-2">{product.description}</p>
                  </div>
                  <button className="mt-2 sm:mt-3 bg-blue-500 text-white py-1 sm:py-2 px-2 sm:px-4 rounded hover:bg-blue-600 transition text-xs sm:text-sm">
                    View product
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
