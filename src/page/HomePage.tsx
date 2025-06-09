import { Link } from "react-router-dom";
import { useMainContext } from "../context/MainContext";
import Navbar from "../components/Navbar/Navbar";

export default function HomePage() {
  const { products, loading, currentPage, totalPages, setPage } = useMainContext();

  if (loading && products.length === 0) {
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
    <div className="flex-1 flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl px-2 sm:px-4 relative">
        <Navbar />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {products.map((product) => (
            <Link key={product._id} to={`/products/${product._id}`}>
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
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                setPage(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
