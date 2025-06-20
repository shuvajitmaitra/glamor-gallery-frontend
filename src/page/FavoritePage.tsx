import React from "react";
import { useMainContext } from "../context/MainContext";
import { Link, useLocation } from "react-router-dom";
import { ArrowBigLeft, ArrowLeft, Heart } from "lucide-react";

export default function FavoritePage() {
  const { favoriteProducts, removeFromFavorite } = useMainContext();

  if (!favoriteProducts || favoriteProducts.length === 0) {
    return (
      <div className="flex-1 relative flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg sm:text-xl text-gray-600">No favorite products available.</p>
        <div className="flex absolute top-2 left-2  items-center justify-start gap-2 mb-3">
          <Link to={"/"}>
            <ArrowLeft />
          </Link>
          <p className="font-bold">Favorite Products</p>
        </div>
      </div>
    );
  }
  return (
    <div className="justify-center items-center p-2">
      <div className="flex items-center justify-start gap-2 mb-3">
        <Link to={"/"}>
          <ArrowLeft />
        </Link>
        <p className="font-bold">Favorite Products</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {favoriteProducts.map((product) => (
          <div key={product._id} className="relative">
            <Link to={`/products/${product._id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-52 xl:h-[430px]">
                <img
                  src={product.productImage[0]}
                  alt={product.productName}
                  className="w-full h-32 xs:h-36 sm:h-40 md:h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{product.productName}</h3>
                    <p className="text-blue-400 mt-1 text-xs xs:text-sm sm:text-base font-bold">৳{product.sellingPrice}</p>
                  </div>
                </div>
              </div>
            </Link>
            <button
              onClick={() => {
                removeFromFavorite(product);
              }}
              className={`absolute bottom-2 right-2 p-2 shadow rounded-lg ${
                favoriteProducts.find((i) => i?._id === product?._id) ? "bg-red-300" : "bg-red-50"
              } hover:bg-red-100 transition`}
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
