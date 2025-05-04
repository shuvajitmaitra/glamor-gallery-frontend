import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Layout from "./components/Layout/Layout";
import { MainContextProvider } from "./context/MainContext";

function App() {
  return (
    <Router>
      <MainContextProvider>
        <Routes>
          <Route path="/" element={<Layout children={<ProductList />} />} />
          <Route path="/products" element={<Layout children={<ProductList />} />} />
          <Route path="/products/:id" element={<Layout children={<ProductDetails />} />} />
        </Routes>
      </MainContextProvider>
    </Router>
  );
}

export default App;
