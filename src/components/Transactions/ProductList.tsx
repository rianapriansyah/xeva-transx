import React, { useEffect, useState } from 'react';
import { createProduct, fetchProducts } from '../../services/api';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: ''});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      handleFetchProduct()
    };

    loadProducts();
  }, []);

  const handleFetchProduct = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      await createProduct(newProduct);
      setNewProduct({  name: '', price: '' });
      handleFetchProduct();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      <h2>Product List</h2>
      <ul>
        {products.map((product:any) => (
          <li key={product.id}>
            {product.name} - Rp{product.price}
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default ProductList;
