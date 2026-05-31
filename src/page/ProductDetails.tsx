import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Tag, Hash, CheckCircle, XCircle, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/api";
import { useMainContext } from "../context/MainContext";

interface Product {
  _id: string;
  productCode: string;
  available: boolean;
  availableSize: string[];
  productName: string;
  productImage: string[];
  ownerBuyPrice: number;
  maxSellingPrice: number;
  b2cPrice: number;
  b2bPrice: number;
  stock: number;
  category: string;
  subCategory: string;
  description: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { favoriteProducts, addToFavorite, removeFromFavorite } = useMainContext();

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const { data, isLoading: loading, error: queryError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  const product: Product | null = data?.product ?? null;

  const error = queryError
    ? (queryError as any).message === "Network Error"
      ? "Unable to connect. Please check your internet connection."
      : "Failed to load product details."
    : null;

  useEffect(() => {
    if (product) {
      setSelectedImage(product.productImage[0] || "");
      setSelectedSize(product.availableSize[0] || "");
    }
  }, [product]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <div className="w-6 h-6 border-2 border-gray-700 border-t-gray-300 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-950 gap-3">
        <p className="text-gray-500 text-sm">{error || "Product not found"}</p>
        <Link to="/" className="text-sm text-gray-300 underline underline-offset-2">Go back home</Link>
      </div>
    );
  }

  const isFavorite = favoriteProducts.some((i) => i._id === product._id);
  const discount = product.maxSellingPrice > product.b2cPrice
    ? Math.round(((product.maxSellingPrice - product.b2cPrice) / product.maxSellingPrice) * 100)
    : 0;

  const sizeText = selectedSize ? `Size: ${selectedSize}` : "No size selected";
  const whatsappLink = `https://wa.me/+8801518946406?text=${encodeURIComponent(
    `Product Name: ${product.productName}\nProduct Code: ${product.productCode}\nPrice: ৳${product.b2cPrice}\n${sizeText}`
  )}`;

  const handleMessengerClick = () => {
    const message = `I'm interested in ${product.productName} — Price: ৳${product.b2cPrice}, ${sizeText}`;
    navigator.clipboard.writeText(message).catch(() => {});
    setCopySuccess("Message copied! Paste it into Messenger.");
    setTimeout(() => setCopySuccess(""), 3000);
    window.open("https://m.me/481950948332658", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-950 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="flex-shrink-0 p-1.5 -ml-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </Link>
            <span className="text-sm font-medium text-gray-100 truncate">{product.productName}</span>
          </div>

          <button
            onClick={() => isFavorite ? removeFromFavorite(product) : addToFavorite(product)}
            className="flex-shrink-0 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image gallery */}
          <div className="min-w-0 w-full">
            <div className="aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
              <img
                src={selectedImage}
                alt={product.productName}
                className="w-full h-full object-contain"
              />
            </div>

            {product.productImage.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar w-full" style={{ WebkitOverflowScrolling: "touch" }}>
                {product.productImage.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-16 h-16 bg-gray-900 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === img ? "border-gray-300" : "border-transparent hover:border-gray-600"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-5">
            {/* Category + name */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">{product.category}</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-white mt-1 leading-snug">{product.productName}</h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">৳{product.b2cPrice.toFixed(2)}</span>
              {product.maxSellingPrice > product.b2cPrice && (
                <>
                  <span className="text-sm text-gray-500 line-through">৳{product.maxSellingPrice.toFixed(2)}</span>
                  <span className="text-xs font-medium text-green-400 bg-green-950 px-1.5 py-0.5 rounded">{discount}% off</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{product.description}</p>
            )}

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-800">
              <div className="flex items-start gap-2.5">
                <Hash className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Product Code</p>
                  <p className="text-sm font-medium text-gray-100">{product.productCode}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Package className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Stock</p>
                  <p className="text-sm font-medium text-gray-100">{product.stock} units</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Category</p>
                  <p className="text-sm font-medium text-gray-100">{product.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                {product.available ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Availability</p>
                  <p className={`text-sm font-medium ${product.available ? "text-green-400" : "text-red-400"}`}>
                    {product.available ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            </div>

            {/* Size selector */}
            {product.availableSize.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-100 mb-2">
                  Size
                  {selectedSize && <span className="text-gray-500 font-normal ml-1">— {selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.availableSize.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedSize === size
                          ? "bg-white text-gray-900 border-white"
                          : "bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500"
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Order CTAs */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center py-3 px-4 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
              >
                Order via WhatsApp
              </a>
              <button
                onClick={handleMessengerClick}
                className="flex-1 flex items-center justify-center py-3 px-4 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Order via Messenger
              </button>
            </div>

            {copySuccess && (
              <p className="text-xs text-green-400 text-center">{copySuccess}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
