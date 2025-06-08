import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./page/ProductDetails";
import CartPage from "./components/CartPage";
import HomePage from "./page/HomePage";
import { MainProvider } from "./context/MainContext";

function App() {
  return (
    <MainProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          {/*  <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} /> */}
        </Routes>
      </Router>
    </MainProvider>
  );
}

export default App;
