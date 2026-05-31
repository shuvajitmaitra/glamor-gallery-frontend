import axios from "axios";

const api = axios.create({
  baseURL: "https://glamor-gallery-backend.vercel.app/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
  timeoutErrorMessage: "Request timed out",
});

export const productService = {
  getAllProducts: async (page: number = 1, limit: number = 8) => {
    const response = await api.get("/product/v2/products", { params: { page, limit } });
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/product/details/${id}`);
    return response.data;
  },
};
