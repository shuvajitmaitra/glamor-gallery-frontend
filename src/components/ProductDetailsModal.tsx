import React, { useEffect, useRef } from "react";
import { Phone, Send, X } from "lucide-react";

// Define TypeScript interface for the product
interface Product {
  _id: string;
  productCode: string;
  available: boolean;
  availableSize: string[];
  productName: string;
  productImage: string[];
  buyPrice: number;
  sellingPrice: number;
  stock: number;
  category: string;
  description: string;
  subCategory: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailsModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedProduct: Product | null;
}

export default function ProductDetailsModal({ isVisible, onClose, selectedProduct }: ProductDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Log product for debugging
  useEffect(() => {
    if (selectedProduct) {
      console.log("selectedProduct", JSON.stringify(selectedProduct, null, 2));
    }
  }, [selectedProduct]);

  // Prevent main page scrolling when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Handle keyboard navigation (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isVisible) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose]);

  // Focus modal when it opens
  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible || !selectedProduct) return null;

  const shareCartVia = (platform: "whatsapp" | "messenger") => {
    const message = `My Order:\n${selectedProduct.productName}\n\nProductCode:${selectedProduct.productCode}\n\nTotal: $${selectedProduct.sellingPrice}`;

    if (platform === "whatsapp") {
      // WhatsApp sharing URL - phone number should be valid
      window.open(`https://wa.me/+8801982443299?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      // Messenger sharing URL - use a valid Facebook Page ID or User ID
      window.open(`https://www.messenger.com/t/481950948332658?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      ref={modalRef}
    >
      <div className="bg-white w-full max-w-[100vw] sm:mx-auto  h-[100vh] sm:h-[100vh] flex flex-col overflow-hidden">
        <div className="relative flex flex-col h-full overflow-y-auto p-4 sm:p-6">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 z-10" aria-label="Close modal">
            <X size={24} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Product Images */}
            <div className="space-y-4">
              {selectedProduct.productImage.length > 0 ? (
                <img
                  src={selectedProduct.productImage[0]}
                  alt={selectedProduct.productName}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {selectedProduct.productImage.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedProduct.productName} ${index + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-gray-800">
                {selectedProduct.productName}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                <span className="font-semibold">Category:</span> {selectedProduct.category} / {selectedProduct.subCategory}
              </p>
              <p className="text-gray-600 text-sm sm:text-base">
                <span className="font-semibold">Product Code:</span> {selectedProduct.productCode}
              </p>
              <p className="text-gray-600 text-sm sm:text-base">
                <span className="font-semibold">Price:</span> ৳{selectedProduct.sellingPrice.toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm sm:text-base">
                <span className="font-semibold">Stock:</span> {selectedProduct.stock} {selectedProduct.stock === 1 ? "unit" : "units"}
              </p>
              <p className="text-gray-600 text-sm sm:text-base">
                <span className="font-semibold">Availability:</span> {selectedProduct.available ? "In Stock" : "Out of Stock"}
              </p>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">{selectedProduct.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => shareCartVia("whatsapp")}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Order via WhatsApp
              </button>

              <button
                onClick={() => shareCartVia("messenger")}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Order via Messenger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
