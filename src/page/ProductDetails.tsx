import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/api";

interface Product {
  _id: string;
  productCode: string;
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
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (id) {
          const fetchedProduct = await productService.getProductById(id);
          setProduct(fetchedProduct.product);
          setSelectedImage(fetchedProduct.product.productImage[0] || "https://via.placeholder.com/150");
          setSelectedSize(fetchedProduct.product.availableSize[0] || ""); // Default to first size
          setLoading(false);
        }
      } catch (err: any) {
        setError(
          err.message === "Network Error"
            ? "Unable to connect to the server. Please check your internet or try again later."
            : "Failed to fetch product details"
        );
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleMessengerClick = () => {
    if (!product) return;
    const sizeText = selectedSize ? `Size: ${selectedSize}` : "No size selected";
    const message = `I'm interested in ${product.productName} Price: ৳${product.sellingPrice.toFixed(2)}, ${sizeText}`;
    navigator.clipboard
      .writeText(message)
      .then(() => {
        setCopySuccess("Message copied! Paste it into Messenger.");
        setTimeout(() => setCopySuccess(""), 3000);
        window.open("https://m.me/481950948332658", "_blank", "noopener,noreferrer");
      })
      .catch(() => {
        setCopySuccess("Failed to copy message.");
        setTimeout(() => setCopySuccess(""), 3000);
        window.open("https://m.me/481950948332658", "_blank", "noopener,noreferrer");
      });
  };

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

  // WhatsApp link with specific phone number
  const sizeText = selectedSize ? `Size: ${selectedSize}` : "No size selected";
  const whatsappLink = `https://wa.me/+8801518946406?text=${encodeURIComponent(
    `Product Name: ${product.productName}\nProduct Code: ${product.productCode}\nPrice: ৳${product.sellingPrice}\n${sizeText}`
  )}`;

  return (
    <div className="flex-1 flex justify-center min-h-screen bg-gray-100 pt-16 sm:pt-20">
      <div className="w-full max-w-4xl px-2 sm:px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-2 sm:p-4">
          {/* Primary Image */}
          <div className="w-full flex justify-center">
            <img src={selectedImage} alt={product.productName} className="w-96 h-96 object-cover rounded-md" />
          </div>

          {/* Horizontal Scrollable Images */}
          {product.productImage.length > 1 && (
            <div className="flex overflow-x-auto gap-2 mt-4 snap-x snap-mandatory">
              {product.productImage.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.productName} - Image ${index + 1}`}
                  className={`w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 object-cover rounded-md cursor-pointer snap-start ${
                    selectedImage === image ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          )}

          {/* Product Title */}
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 mt-4">{product.productName}</h1>

          {/* Product Details */}
          <div className="mt-4">
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-4 whitespace-pre-line">{product.description}</p>
            <p className="text-base xs:text-lg font-semibold text-gray-800 mb-2">Price: ৳{product.sellingPrice.toFixed(2)}</p>
            <p className="text-sm xs:text-base text-gray-600 mb-2">Category: {product.category}</p>
            <p className="text-sm xs:text-base text-gray-600 mb-2">Code: ${product.productCode}</p>
            <div className="mb-4">
              <label className="text-sm xs:text-base text-gray-600 mb-1 block">Select Size:</label>
              <div className="flex overflow-x-auto gap-2">
                {product.availableSize.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-md border text-sm xs:text-base ${
                      selectedSize === size
                        ? "border-2 border-blue-500 bg-blue-50 text-blue-700"
                        : "border border-gray-300 bg-white text-gray-700"
                    } hover:bg-blue-100 transition`}
                    aria-selected={selectedSize === size}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
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
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleMessengerClick}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm xs:text-base text-center"
                >
                  Order via Messenger
                </button>
                {copySuccess && <p className="text-xs xs:text-sm text-green-600">{copySuccess}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
