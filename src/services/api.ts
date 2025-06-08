//services/api.ts

import axios from "axios";

const BASE_URL = "https://glamor-gallery-backend.vercel.app/api"; // Replace with actual base URL

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
  timeoutErrorMessage: "Request timed out",
});

// Product Services
export const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get("/product/products");
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
