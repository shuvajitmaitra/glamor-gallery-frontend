import { Search, Heart, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMainContext } from "../../context/MainContext";

interface NavbarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({ selectedCategory, onCategoryChange, searchQuery, onSearchChange }: NavbarProps) {
  const { categories, favoriteProducts } = useMainContext();
  const allCategories = ["All", ...categories];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top row */}
        <div className="flex items-center justify-between h-14 gap-3">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo2.png" alt="Glamor Gallery" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-gray-900 hidden sm:block text-sm">Glamor Gallery</span>
          </Link>

          {/* Search input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Favorites */}
          <Link to="/favorite" className="relative p-2 flex-shrink-0" aria-label="Favorites">
            <Heart className={`w-5 h-5 transition-colors ${favoriteProducts.length > 0 ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            {favoriteProducts.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-medium leading-none">
                {favoriteProducts.length > 9 ? "9+" : favoriteProducts.length}
              </span>
            )}
          </Link>
        </div>

        {/* Category row */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex-shrink-0 px-3 py-1 text-sm rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
