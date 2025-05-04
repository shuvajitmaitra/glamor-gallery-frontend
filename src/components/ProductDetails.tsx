import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productService } from "../services/api";

interface Product {
  _id: string;
  available: boolean;
  availableSize: string[];
  productName: string;
  productImage: string[];
  buyPrice: number;
  askingPrice: number;
  sellingPrice: number;
  stock: number;
  category: string;
  description: string;
}

const ProductDetails: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  console.log("product", JSON.stringify(product, null, 2));

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (id) {
          const fetchedProduct = await productService.getProductById(id);
          setProduct(fetchedProduct.product);
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch product details");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.productName}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.sellingPrice}</p>
      <p>Category: {product.category}</p>
      <p>Available Sizes: {product.availableSize.join(", ")}</p>
      <p>Stock: {product.stock}</p>
      {product.productImage.length > 0 && (
        <div>
          <h2>Product Images</h2>
          {product.productImage.map((image, index) => (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img
              key={index}
              src={image}
              alt={`${product.productName} - Image ${index + 1}`}
              style={{ maxWidth: "200px", margin: "10px" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
