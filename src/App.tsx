import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MainProvider } from "./context/MainContext";
import HomePage from "./page/HomePage";
import ProductDetails from "./page/ProductDetails";
import FavoritePage from "./page/FavoritePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/favorite" element={<FavoritePage />} />
          </Routes>
        </Router>
      </MainProvider>
    </QueryClientProvider>
  );
}

export default App;
