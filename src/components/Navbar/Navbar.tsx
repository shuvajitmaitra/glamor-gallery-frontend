import React, { useContext, useState } from "react";
import { useMainContext } from "../../context/MainContext";
import { Menu, Search, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { setIsFilterDrawerOpen, setShowMobileSearch, setIsCartDrawerOpen, cartItems, categories, handleSearchProducts } = useMainContext();
  return (
    <div>
      {/* desktop header */}
      <div className="hidden md:flex  items-center justify-between py-2 mb-4 px-10">
        <img src={"/src/assets/glamor-gallery.png"} alt="" className="w-12" />
        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <button key={category} onClick={() => setIsFilterDrawerOpen(true)} className="p-2 rounded-lg bg-white shadow-sm">
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            onChange={(e) => handleSearchProducts(e.target.value)}
            type="text"
            placeholder="Search products..."
            className="p-2 rounded-lg bg-white shadow-sm w-64"
          />

          <button onClick={() => setIsCartDrawerOpen(true)} className="p-2 rounded-lg bg-white shadow-sm relative">
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-primary-500 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border border-primary-500">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between py-2 mb-4">
        <button onClick={() => setIsFilterDrawerOpen(true)} className="p-2 rounded-lg bg-white shadow-sm">
          <Menu className="w-6 h-6" />
        </button>

        <img src={"/src/assets/glamor-gallery.png"} alt="" className="w-12" />

        <div className="flex items-center space-x-2">
          <button onClick={() => setShowMobileSearch(true)} className="p-2 rounded-lg bg-white shadow-sm">
            <Search className="w-6 h-6" />
          </button>

          <button onClick={() => setIsCartDrawerOpen(true)} className="p-2 rounded-lg bg-white shadow-sm relative">
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-primary-500 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border border-primary-500">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
