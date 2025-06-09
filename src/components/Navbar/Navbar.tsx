import { Menu, Search, Heart } from "lucide-react";
import { useMainContext } from "../../context/MainContext";

export default function Navbar() {
  const { categories, favoriteProducts } = useMainContext();
  return (
    <div className="sticky top-0 z-10 bg-gray-100">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between py-2 mb-4 px-4 sm:px-10">
        <img src="/src/assets/glamor-gallery.png" alt="Glamor Gallery" className="w-12" />
        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <button key={category} onClick={() => {}} className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition">
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => {}} className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition relative">
            <Heart className="w-6 h-6" />
            {favoriteProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-blue-500 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border border-blue-500">
                {favoriteProducts.length}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Header */}
      <div className="md:hidden flex-col items-center justify-between my-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/src/assets/logo2.png" alt="Glamor Gallery" className="w-12" />
            <p className="font-bold text-gray-800">Glamor Gallery</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => {}} className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition">
              <Search className="w-6 h-6" />
            </button>
            <button onClick={() => {}} className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition relative">
              <Heart className="w-6 h-6" />
              {favoriteProducts?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-blue-500 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border border-blue-500">
                  {favoriteProducts.length}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center overflow-x-auto gap-2">
          {categories.map((category) => (
            <button key={category} onClick={() => {}} className="rounded py-1 px-2 bg-white shadow-sm hover:bg-gray-50 transition">
              <p className="text-xs text-gray-800">{category}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
