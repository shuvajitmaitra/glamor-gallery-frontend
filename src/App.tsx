import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainProvider } from "./context/MainContext";
import HomePage from "./page/HomePage";
import ProductDetails from "./page/ProductDetails";
import FavoritePage from "./page/FavoritePage";

function App() {
  return (
    <MainProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/favorite" element={<FavoritePage />} />
        </Routes>
      </Router>
    </MainProvider>
  );
}

export default App;
