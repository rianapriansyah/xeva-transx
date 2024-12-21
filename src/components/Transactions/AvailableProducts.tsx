import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../services/api';

interface AvailableProductsProps {
  onAddProduct: (product: any) => void;
}

const AvailableProducts: React.FC<AvailableProductsProps> = ({ onAddProduct }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '45%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />
      </div>
      <div style={{ maxHeight: '100%', overflowY: 'scroll' }}>
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    <button onClick={() => onAddProduct(product)}>Add</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailableProducts;
