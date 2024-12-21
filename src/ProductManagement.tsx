import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: ''});

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5101/api/Products'); // Replace with your API endpoint
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('http://localhost:5101/api/Products', newProduct); // Replace with your API endpoint
      setNewProduct({  name: '', price: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h2>Product Management</h2>

      {/* Add Product Form */}
      <div>
        <h3>Add Product</h3>
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
      </div>

      {/* User List */}
      <div>
        <h3>Product List</h3>
        <ul>
          {products.map((product: any) => (
            <li key={product.id}>
              <span>{product.name} </span>
              <span>Rp {product.price}</span>
              {/* <button onClick={() => setEditUser(product)}>Edit</button> */}
              {/* <button onClick={() => handleDeleteUser(product.id)}>Delete</button> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
