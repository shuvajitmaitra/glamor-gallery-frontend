import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useMainContext } from "../context/MainContext";

export default function FavoritePage() {
  const { favoriteProducts, removeFromFavorite } = useMainContext();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <span className="font-medium text-gray-900 text-sm">Favorites</span>
          {favoriteProducts.length > 0 && (
            <span className="text-sm text-gray-400">({favoriteProducts.length})</span>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Heart className="w-10 h-10 text-gray-200" />
            <p className="text-gray-500 text-sm">No favorites yet</p>
            <Link to="/" className="text-sm text-gray-900 underline underline-offset-2">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {favoriteProducts.map((product) => (
              <div key={product._id} className="group relative">
                <Link to={`/products/${product._id}`}>
                  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={product.productImage[0]}
                        alt={product.productName}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.productName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {product.maxSellingPrice > product.b2cPrice && (
                          <span className="text-xs text-gray-400 line-through">৳{product.maxSellingPrice}</span>
                        )}
                        <span className="text-sm font-semibold text-gray-900">৳{product.b2cPrice}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => removeFromFavorite(product)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm border border-gray-100 hover:scale-110 transition-transform"
                  aria-label="Remove from favorites"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
