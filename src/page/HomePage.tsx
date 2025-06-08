import React from "react";
import { useMainContext } from "../context/MainContext";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { products, loading } = useMainContext();

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg sm:text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }

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
            <Link key={product?._id} to={`/products/${product._id}`}>
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <img src={product.productImage[0]} alt={product.productName} className="w-full h-32 xs:h-36 sm:h-40 md:h-48 object-cover" />
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
