import axios from "axios";

const BASE_URL = "https://glamor-gallery-backend.vercel.app/api"; // Replace with actual base URL

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  timeoutErrorMessage: "Request timed out",
});

// Product Services
export const productService = {
  getAllProducts: async (page: number = 1, limit: number = 8) => {
    try {
      const response = await api.get("/product/v2/products", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await api.get(`/product/details/${id}`);
      console.log("response.data", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
