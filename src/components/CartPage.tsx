// import React from "react";
// import { useMainContext } from "../context/MainContext";
// import { Heart, ShoppingCart, Search, X, ChevronDown, Filter, Menu, Send, Phone } from "lucide-react";

// export default function CartPage() {
//   const { isCartDrawerOpen } = useMainContext();
//   return (
//     <div>
//       <p>Cart screen</p>
//     </div>
//     // <div
//     //   className={`fixed right-0 top-0 h-full bg-white z-40 w-80 md:w-96 shadow-xl transform transition-transform duration-300 overflow-y-auto ${
//     //     isCartDrawerOpen ? "translate-x-0" : "translate-x-full"
//     //   }`}
//     // >
//     //   <div className="flex flex-col h-full">
//     //     <div className="p-4 border-b">
//     //       <div className="flex justify-between items-center">
//     //         <h2 className="text-lg font-bold">Your Cart</h2>
//     //         <button onClick={() => {}} className="p-1 rounded-full hover:bg-gray-100">
//     //           <X className="w-6 h-6" />
//     //         </button>
//     //       </div>
//     //     </div>

//     //     <div className="flex-grow overflow-y-auto p-4">
//     //       {cartItems.length === 0 ? (
//     //         <div className="text-center py-8">
//     //           <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//     //           <p className="text-gray-500">Your cart is empty</p>
//     //           <button
//     //             onClick={() => setIsCartDrawerOpen(false)}
//     //             className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
//     //           >
//     //             Continue Shopping
//     //           </button>
//     //         </div>
//     //       ) : (
//     //         <div className="space-y-4">
//     //           {cartItems.map((item) => {
//     //             const product = products.find((p) => p._id === item.productId);

//     //             if (!product) return null;

//     //             return (
//     //               <div key={item.productId} className="flex border-b pb-4">
//     //                 <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
//     //                   <img
//     //                     src={product.productImage[0] || "/placeholder-image.png"}
//     //                     alt={product.productName}
//     //                     className="w-full h-full object-cover"
//     //                   />
//     //                 </div>
//     //                 <div className="ml-4 flex-1">
//     //                   <div className="flex justify-between">
//     //                     <Link
//     //                       to={`/products/${product._id}`}
//     //                       className="text-sm font-medium hover:text-primary-600"
//     //                       onClick={() => setIsCartDrawerOpen(false)}
//     //                     >
//     //                       {product.productName}
//     //                     </Link>
//     //                     <button onClick={() => removeFromCart(product._id)} className="text-gray-400 hover:text-red-500">
//     //                       <X className="w-4 h-4" />
//     //                     </button>
//     //                   </div>

//     //                   <div className="text-sm text-primary-600 mt-1">${product.sellingPrice.toFixed(2)}</div>

//     //                   {/* Size Selector */}
//     //                   {product.availableSize.length > 0 && (
//     //                     <div className="mt-2">
//     //                       <select
//     //                         value={item.size || ""}
//     //                         onChange={(e) => updateCartItemSize(product._id, e.target.value)}
//     //                         className="text-xs border rounded p-1 w-auto"
//     //                       >
//     //                         <option value="">Select Size</option>
//     //                         {product.availableSize.map((size) => (
//     //                           <option key={size} value={size}>
//     //                             {size}
//     //                           </option>
//     //                         ))}
//     //                       </select>
//     //                     </div>
//     //                   )}

//     //                   {/* Quantity */}
//     //                   <div className="flex items-center mt-2">
//     //                     <button
//     //                       onClick={() => updateCartItemQuantity(product._id, item.quantity - 1)}
//     //                       className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-100"
//     //                       disabled={item.quantity <= 1}
//     //                     >
//     //                       -
//     //                     </button>
//     //                     <span className="mx-2 text-sm">{item.quantity}</span>
//     //                     <button
//     //                       onClick={() => updateCartItemQuantity(product._id, item.quantity + 1)}
//     //                       className="w-6 h-6 flex items-center justify-center border rounded-full text-gray-500 hover:bg-gray-100"
//     //                       disabled={item.quantity >= product.stock}
//     //                     >
//     //                       +
//     //                     </button>

//     //                     <div className="ml-auto text-sm font-medium">${(product.sellingPrice * item.quantity).toFixed(2)}</div>
//     //                   </div>
//     //                 </div>
//     //               </div>
//     //             );
//     //           })}
//     //         </div>
//     //       )}
//     //     </div>

//     //     {/* {cartItems.length > 0 && (
//     //       <div className="p-4 border-t">
//     //         <div className="flex justify-between mb-4">
//     //           <span className="font-medium">Total:</span>
//     //           <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
//     //         </div>

//     //         <div className="space-y-2">
//     //           <button
//     //             onClick={() => shareCartVia("whatsapp")}
//     //             className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
//     //           >
//     //             <Phone className="w-5 h-5" />
//     //             Order via WhatsApp
//     //           </button>

//     //           <button
//     //             onClick={() => shareCartVia("messenger")}
//     //             className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
//     //           >
//     //             <Send className="w-5 h-5" />
//     //             Order via Messenger
//     //           </button>
//     //         </div>
//     //       </div>
//     //     )} */}
//     //   </div>
//     // </div>
//   );
// }

import React from "react";

export default function CartPage() {
  return <div>CartPage</div>;
}
