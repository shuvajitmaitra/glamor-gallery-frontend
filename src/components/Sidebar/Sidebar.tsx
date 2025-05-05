// import React from "react";
// import { useMainContext } from "../../context/MainContext";

// export default function Sidebar() {
//   const {isSidebarOpen,categoryFilter,setCategoryFilter}=useMainContext()
//  {/* Desktop Sidebar */}
//  <div
//  className={`hidden md:block w-64 flex-shrink-0 transition-all duration-300 ${
//    isSidebarOpen ? "opacity-100" : "opacity-0 w-0"
//  }`}
// >
//  <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
//    <div className="mb-6">
//      <h2 className="text-lg font-semibold mb-4">Categories</h2>
//      <div className="space-y-2">
//        <div
//          className={`cursor-pointer px-3 py-2 rounded-md ${
//            categoryFilter === ""
//              ? "bg-primary-100 text-primary-700"
//              : "hover:bg-gray-100"
//          }`}
//          onClick={() => setCategoryFilter("")}
//        >
//          All Categories
//        </div>
//        {categories?.map((category) => (
//          <div
//            key={category}
//            className={`cursor-pointer px-3 py-2 rounded-md ${
//              categoryFilter === category
//                ? "bg-primary-100 text-primary-700"
//                : "hover:bg-gray-100"
//            }`}
//            onClick={() => setCategoryFilter(category)}
//          >
//            {category}
//          </div>
//        ))}
//      </div>
//    </div>

//    <div className="mb-6">
//      <h2 className="text-lg font-semibold mb-4">Price Range</h2>
//      <div className="px-2">
//        <div className="flex justify-between mb-2 text-sm">
//          <span>${priceRange.min}</span>
//          <span>${priceRange.max}</span>
//        </div>
//        <input
//          type="range"
//          min="0"
//          max="1000"
//          step="10"
//          value={priceRange.max}
//          onChange={(e) =>
//            setPriceRange({
//              ...priceRange,
//              max: Number(e.target.value),
//            })
//          }
//          className="w-full accent-primary-500"
//        />
//      </div>
//    </div>

//    <div className="mb-6">
//      <h2 className="text-lg font-semibold mb-4">Size</h2>
//      <div className="flex flex-wrap gap-2">
//        {allSizes.map((size) => (
//          <button
//            key={size}
//            onClick={() => toggleSizeSelection(size)}
//            className={`px-3 py-1 text-sm rounded-full border 
//              ${
//                selectedSizes.includes(size)
//                  ? "bg-primary-500 text-white border-primary-500"
//                  : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
//              }`}
//          >
//            {size}
//          </button>
//        ))}
//      </div>
//    </div>

//    <div className="mb-6">
//      <h2 className="text-lg font-semibold mb-4">Options</h2>
//      <label className="inline-flex items-center cursor-pointer">
//        <input
//          type="checkbox"
//          checked={inStockOnly}
//          onChange={() => setInStockOnly(!inStockOnly)}
//          className="sr-only peer"
//        />
//        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
//        <span className="ms-3 text-sm font-medium text-gray-700">
//          In Stock Only
//        </span>
//      </label>
//    </div>

//    <button
//      onClick={resetFilters}
//      className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
//    >
//      Reset Filters
//    </button>
//  </div>
// </div>
// }


import React from 'react'

function Sidebar() {
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar