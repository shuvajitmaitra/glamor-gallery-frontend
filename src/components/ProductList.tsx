import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/api";
import { Heart, ShoppingCart, Search, X, ChevronDown, Filter, Menu, Send, Phone } from "lucide-react";
import ProductDetailsModal from "./ProductDetailsModal";

export interface Product {
  askingPrice: number;
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

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name" | "popularity">("name");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sidebar and drawer states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Refs for drawer click handling
  const filterDrawerRef = useRef<HTMLDivElement>(null);
  const cartDrawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productService.getAllProducts();
        setProducts(fetchedProducts.products);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();

    // Load wishlist and cart from localStorage
    const savedWishlist = localStorage.getItem("wishlist");
    const savedCart = localStorage.getItem("cart");

    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Add click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDrawerRef.current && !filterDrawerRef.current.contains(event.target as Node)) {
        setIsFilterDrawerOpen(false);
      }
      if (cartDrawerRef.current && !cartDrawerRef.current.contains(event.target as Node)) {
        setIsCartDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Check if mobile and set sidebar closed by default
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          (product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (categoryFilter === "" || product.category === categoryFilter) &&
          product.sellingPrice >= priceRange.min &&
          product.sellingPrice <= priceRange.max &&
          (!inStockOnly || product.stock > 0) &&
          (selectedSizes.length === 0 || selectedSizes.some((size) => product.availableSize.includes(size)))
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.sellingPrice - b.sellingPrice;
          case "price-desc":
            return b.sellingPrice - a.sellingPrice;
          case "popularity":
            return b.stock - a.stock; // Using stock as a proxy for popularity
          case "name":
          default:
            return a.productName.localeCompare(b.productName);
        }
      });
  }, [products, searchTerm, categoryFilter, priceRange, sortBy, selectedSizes, inStockOnly]);

  // Get unique categories
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);

  // Get unique sizes
  const allSizes = useMemo(() => {
    const sizesSet = new Set<string>();
    products.forEach((product) => {
      product.availableSize.forEach((size) => sizesSet.add(size));
    });
    return Array.from(sizesSet);
  }, [products]);

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId) ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];

    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  // Cart functions
  const addToCart = (productId: string) => {
    const existingItemIndex = cartItems.findIndex((item) => item.productId === productId);

    if (existingItemIndex !== -1) {
      // If product is already in cart, increase quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
      localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    } else {
      // Add new product to cart
      const newCartItems = [...cartItems, { productId, quantity: 1 }];
      setCartItems(newCartItems);
      localStorage.setItem("cart", JSON.stringify(newCartItems));
    }

    // Open cart drawer when adding items
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCartItems = cartItems.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item));

    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const updateCartItemSize = (productId: string, size: string) => {
    const updatedCartItems = cartItems.map((item) => (item.productId === productId ? { ...item, size } : item));

    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  // Toggle size selection
  const toggleSizeSelection = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setPriceRange({ min: 0, max: 1000 });
    setSortBy("name");
    setSelectedSizes([]);
    setInStockOnly(false);
  };

  // Function to share cart via WhatsApp or Messenger
  const shareCartVia = (platform: "whatsapp" | "messenger") => {
    const cartProductsDetails = cartItems
      .map((item) => {
        const product = products.find((p) => p._id === item.productId);
        return product
          ? `${product.productName} (${item.quantity}x) - $${(product.sellingPrice * item.quantity).toFixed(2)}${
              item.size ? ` - Size: ${item.size}` : ""
            }`
          : "";
      })
      .filter(Boolean)
      .join("\n");

    const totalAmount = cartItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId);
      return total + (product ? product.sellingPrice * item.quantity : 0);
    }, 0);

    const message = `My Order:\n${cartProductsDetails}\n\nTotal: $${totalAmount.toFixed(2)}`;

    if (platform === "whatsapp") {
      // WhatsApp sharing URL - phone number should be valid
      window.open(`https://wa.me/+8801982443299?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      // Messenger sharing URL - use a valid Facebook Page ID or User ID
      window.open(`https://www.messenger.com/t/481950948332658?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item.productId);
      return total + (product ? product.sellingPrice * item.quantity : 0);
    }, 0);
  }, [cartItems, products]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center text-red-500 p-4 text-xl">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gray-50">
      <ProductDetailsModal
        isVisible={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(!isDetailsModalOpen);
        }}
        selectedProduct={selectedProduct}
      />
      {/* Mobile Search Bar - Appears when showMobileSearch is true */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 md:hidden">
          <div className="w-full px-4 max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-4 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <button onClick={() => setShowMobileSearch(false)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {searchTerm && (
                <div className="mt-2">
                  <div className="text-sm font-medium">Quick Results:</div>
                  <div className="mt-1 max-h-60 overflow-y-auto">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="block p-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setShowMobileSearch(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={product.productImage[0] || "/placeholder-image.png"}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium line-clamp-1">{product.productName}</div>
                            <div className="text-sm text-primary-600">${product.sellingPrice.toFixed(2)}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {filteredProducts.length > 5 && (
                      <div className="p-2 text-primary-500 text-sm text-center">View all {filteredProducts.length} results</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Drawer for Mobile */}
      <div
        ref={filterDrawerRef}
        className={`fixed left-0 top-0 h-full bg-white z-40 w-80 shadow-xl transform transition-transform duration-300 overflow-y-auto ${
          isFilterDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button onClick={() => setIsFilterDrawerOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div className="space-y-2">
              <div
                className={`cursor-pointer px-3 py-2 rounded-md ${
                  categoryFilter === "" ? "bg-primary-100 text-primary-700" : "hover:bg-gray-100"
                }`}
                onClick={() => setCategoryFilter("")}
              >
                All Categories
              </div>
              {categories.map((category) => (
                <div
                  key={category}
                  className={`cursor-pointer px-3 py-2 rounded-md ${
                    categoryFilter === category ? "bg-primary-100 text-primary-700" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Price Range: ${priceRange.min} - ${priceRange.max}
            </h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>
          </div>

          {/* Size Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSizeSelection(size)}
                  className={`px-3 py-1 text-sm rounded-full border 
                    ${
                      selectedSizes.includes(size)
                        ? "bg-primary-500 text-white border-primary-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">In Stock Only</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price-asc" | "price-desc" | "name" | "popularity")}
                className="appearance-none w-full bg-gray-50 px-4 py-2 pr-8 rounded-lg border border-gray-300 focus:outline-none"
              >
                <option value="name">Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-gray-500 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {searchTerm && (
                <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryFilter && (
                <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  Category: {categoryFilter}
                  <button onClick={() => setCategoryFilter("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSizes.map((size) => (
                <span key={size} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  Size: {size}
                  <button onClick={() => toggleSizeSelection(size)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {inStockOnly && (
                <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <div
        ref={cartDrawerRef}
        className={`fixed right-0 top-0 h-full bg-white z-40 w-80 md:w-96 shadow-xl transform transition-transform duration-300 overflow-y-auto ${
          isCartDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Your Cart</h2>
              <button onClick={() => setIsCartDrawerOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const product = products.find((p) => p._id === item.productId);

                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex border-b pb-4">
                      <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={product.productImage[0] || "/placeholder-image.png"}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <Link
                            to={`/products/${product._id}`}
                            className="text-sm font-medium hover:text-primary-600"
                            onClick={() => setIsCartDrawerOpen(false)}
                          >
                            {product.productName}
                          </Link>
                          <button onClick={() => removeFromCart(product._id)} className="text-gray-400 hover:text-red-500">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-sm text-primary-600 mt-1">${product.sellingPrice.toFixed(2)}</div>

                        {/* Size Selector */}
                        {product.availableSize.length > 0 && (
                          <div className="mt-2">
                            <select
                              value={item.size || ""}
                              onChange={(e) => updateCartItemSize(product._id, e.target.value)}
                              className="text-xs border rounded p-1 w-auto"
                            >
                              <option value="">Select Size</option>
                              {product.availableSize.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateCartItemQuantity(product._id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQuantity(product._id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-100"
                            disabled={item.quantity >= product.stock}
                          >
                            +
                          </button>

                          <div className="ml-auto text-sm font-medium">${(product.sellingPrice * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
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
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-2 md:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-2 mb-4">
          <button onClick={() => setIsFilterDrawerOpen(true)} className="p-2 rounded-lg bg-white shadow-sm">
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-bold">Our Products</h1>

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

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div
            className={`hidden md:block w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 w-0"}`}
          >
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                  <div
                    className={`cursor-pointer px-3 py-2 rounded-md ${
                      categoryFilter === "" ? "bg-primary-100 text-primary-700" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCategoryFilter("")}
                  >
                    All Categories
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category}
                      className={`cursor-pointer px-3 py-2 rounded-md ${
                        categoryFilter === category ? "bg-primary-100 text-primary-700" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Price Range</h2>
                <div className="px-2">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full accent-primary-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Size</h2>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSizeSelection(size)}
                      className={`px-3 py-1 text-sm rounded-full border 
                        ${
                          selectedSizes.includes(size)
                            ? "bg-primary-500 text-white border-primary-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Options</h2>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700">In Stock Only</span>
                </label>
              </div>

              <button
                onClick={resetFilters}
                className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md text-center text-gray-500 text-xl py-16">
                <div className="mb-4">No products found</div>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                {filteredProducts.map((product) => (
                  <div
                    onClick={() => {
                      setIsDetailsModalOpen(!isDetailsModalOpen);
                      setSelectedProduct(product);
                    }}
                    key={product._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg"
                  >
                    <div className="relative">
                      <div className="aspect-w-3 aspect-h-4">
                        <img
                          src={product.productImage[0] || "/placeholder-image.png"}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Wishlist and Quick Add */}
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className={`p-2 rounded-full ${
                            wishlist.includes(product._id) ? "bg-primary-500 text-white" : "bg-white text-gray-700 shadow-md"
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
                        </button>

                        {product.stock > 0 && (
                          <button
                            onClick={() => addToCart(product._id)}
                            className="p-2 rounded-full bg-white text-gray-700 shadow-md hover:bg-primary-500 hover:text-white transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.stock === 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Out of Stock</span>}
                        {product.sellingPrice < product.askingPrice && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Sale</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                      <h2 className="text-sm md:text-base font-semibold line-clamp-2 hover:text-primary-500 transition-colors">
                        {product.productName}
                      </h2>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-primary-600 font-bold text-sm md:text-base">${product.sellingPrice.toFixed(2)}</span>
                        {product.sellingPrice < product.askingPrice && (
                          <span className="text-gray-400 text-xs line-through">${product.askingPrice.toFixed(2)}</span>
                        )}
                      </div>

                      {product.stock > 0 && <div className="mt-2 text-xs text-gray-500">{product.stock} in stock</div>}

                      {/* Available sizes */}
                      {product.availableSize.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {product.availableSize.slice(0, 3).map((size) => (
                            <span key={size} className="text-xs px-2 py-0.5 border border-gray-200 rounded-full">
                              {size}
                            </span>
                          ))}
                          {product.availableSize.length > 3 && (
                            <span className="text-xs px-2 py-0.5 border border-gray-200 rounded-full">
                              +{product.availableSize.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-4 animate-fade-in">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="aspect-w-1 aspect-h-1 sm:aspect-w-3 sm:aspect-h-4 rounded-lg overflow-hidden">
                        <img
                          src={product.productImage[0] || "/placeholder-image.png"}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 mt-4 sm:mt-0">
                        <div className="flex justify-between">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">{product.category}</div>
                            <Link to={`/products/${product._id}`}>
                              <h2 className="text-lg font-semibold hover:text-primary-500 transition-colors">{product.productName}</h2>
                            </Link>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleWishlist(product._id)}
                              className={`p-2 rounded-full ${
                                wishlist.includes(product._id) ? "bg-primary-100 text-primary-500" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <Heart className="w-5 h-5" fill={wishlist.includes(product._id) ? "currentColor" : "none"} />
                            </button>

                            {product.stock > 0 && (
                              <button
                                onClick={() => addToCart(product._id)}
                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add to Cart</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-primary-600 font-bold text-lg">${product.sellingPrice.toFixed(2)}</span>
                            {product.sellingPrice < product.askingPrice && (
                              <span className="text-gray-400 text-sm line-through">${product.askingPrice.toFixed(2)}</span>
                            )}
                          </div>

                          <div>
                            <span
                              className={`
                                text-xs px-2 py-1 rounded-full
                                ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                              `}
                            >
                              {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                            </span>
                          </div>

                          {/* Available sizes */}
                          {product.availableSize.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Sizes:</span>
                              <div className="flex flex-wrap gap-1">
                                {product.availableSize.map((size) => (
                                  <span key={size} className="text-xs px-2 py-0.5 border border-gray-200 rounded-full">
                                    {size}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700">Previous</button>
                  <button className="px-3 py-1 rounded-md bg-primary-500 text-white">1</button>
                  <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700">2</button>
                  <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700">3</button>
                  <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-700">Next</button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
