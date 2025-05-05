import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { MainProvider } from "./context/MainContext.js";
import Layout from "./components/Layout/Layout.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainProvider>
      <Layout>
        <App />
      </Layout>
    </MainProvider>
  </StrictMode>
);
