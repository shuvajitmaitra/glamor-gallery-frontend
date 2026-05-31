import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useMainContext } from "../context/MainContext";
import Navbar from "../components/Navbar/Navbar";

export default function HomePage() {
  const { products, loading, currentPage, totalPages, setPage, favoriteProducts, addToFavorite, removeFromFavorite } = useMainContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = !searchQuery || p.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && currentPage < totalPages) {
          setPage(currentPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, currentPage, totalPages, setPage]);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-6 h-6 border-2 border-gray-700 border-t-gray-300 rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 gap-3">
            <p className="text-gray-500 text-sm">No products found</p>
            {(selectedCategory !== "All" || searchQuery) && (
              <button
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                className="text-sm text-gray-300 underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => {
                const isFavorite = favoriteProducts.some((i) => i._id === product._id);
                return (
                  <div key={product._id} className="group relative">
                    <Link to={`/products/${product._id}`}>
                      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-black/30 transition-shadow duration-200">
                        <div className="aspect-square bg-gray-800 overflow-hidden">
                          <img
                            src={product.productImage[0]}
                            alt={product.productName}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-gray-100 line-clamp-1">{product.productName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {product.maxSellingPrice > product.b2cPrice && (
                              <span className="text-xs text-gray-500 line-through">৳{product.maxSellingPrice}</span>
                            )}
                            <span className="text-sm font-semibold text-white">৳{product.b2cPrice}</span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <button
                      onClick={() => isFavorite ? removeFromFavorite(product) : addToFavorite(product)}
                      className="absolute top-2 right-2 p-1.5 bg-gray-900 rounded-full shadow-sm border border-gray-700 hover:scale-110 transition-transform"
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div ref={sentinelRef} className="h-16 flex items-center justify-center mt-2">
              {loading && products.length > 0 && (
                <div className="w-5 h-5 border-2 border-gray-700 border-t-gray-300 rounded-full animate-spin" />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
