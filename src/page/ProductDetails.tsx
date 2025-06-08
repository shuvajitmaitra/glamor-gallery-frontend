import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/api";

interface Product {
  _id: string;
  available: boolean;
  availableSize: string[];
  productName: string;
  productImage: string[];
  buyPrice: number;
  askingPrice: number;
  sellingPrice: number;
  stock: number;
  category: string;
  description: string;
}

const ProductDetails: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (id) {
          const fetchedProduct = await productService.getProductById(id);
          setProduct(fetchedProduct.product);
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch product details");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg xs:text-xl text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg xs:text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg xs:text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  // WhatsApp and Messenger links (customize with your phone number or page ID)
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    `I'm interested in ${product.productName} (Price: $${product.sellingPrice.toFixed(2)}, Sizes: ${product.availableSize.join(", ")})`
  )}`;
  const messengerLink = `https://m.me/?text=${encodeURIComponent(
    `I'm interested in ${product.productName} (Price: $${product.sellingPrice.toFixed(2)}, Sizes: ${product.availableSize.join(", ")})`
  )}`;

  return (
    <div className="flex-1 flex justify-center min-h-screen bg-gray-100 py-4 xs:py-6">
      <div className="w-full max-w-4xl px-2 xs:px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 xs:p-6">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{product.productName}</h1>
          <div className="flex flex-col sm:flex-row sm:gap-6">
            {/* Images */}
            <div className="w-full sm:w-1/2">
              {product.productImage.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {product.productImage.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.productName} - Image ${index + 1}`}
                      className="w-full h-48 xs:h-56 sm:h-64 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm xs:text-base text-gray-500">No images available</p>
              )}
            </div>
            {/* Details */}
            <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
              <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-4">{product.description}</p>
              <p className="text-base xs:text-lg font-semibold text-gray-800 mb-2">Price: ${product.sellingPrice.toFixed(2)}</p>
              <p className="text-sm xs:text-base text-gray-600 mb-2">Category: {product.category}</p>
              <p className="text-sm xs:text-base text-gray-600 mb-2">Available Sizes: {product.availableSize.join(", ")}</p>
              <p className="text-sm xs:text-base text-gray-600 mb-4">Stock: {product.stock}</p>
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition text-sm xs:text-base text-center"
                >
                  Order via WhatsApp
                </a>
                <a
                  href={messengerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm xs:text-base text-center"
                >
                  Order via Messenger
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
