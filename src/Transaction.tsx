import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [guestName, setCustomerName] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]); // Stores payment methods from API
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Selected payment method
  const [isModalOpen, setIsModalOpen] = useState(false); // State for confirm transaction modal
  const [isParkedModalOpen, setIsParkedModalOpen] = useState(false); // State for parked transactions modal
  const [parkedTransactions, setParkedTransactions] = useState<any[]>([]); // Parked transactions
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null); // Selected transaction for confirmation


  useEffect(() => {
    fetchProducts();
    //fetchTransactions();
    fetchPaymentMethods();
    setPaymentMethod('cash'); // Default payment method on load
  }, []);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  // Fetch parked transactions
  const fetchParkedTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5101/api/transactions'); // Replace with actual endpoint
      setParkedTransactions(response.data);
    } catch (error) {
      console.error('Error fetching parked transactions:', error);
    }
  };

  const handleOpenParkedTransaction = (transaction: any) => {
    setSelectedTransaction(transaction); // Set the selected transaction
    setIsModalOpen(true); // Open confirm transaction modal
    setIsParkedModalOpen(false); // Close parked transactions modal
  };

  // Fetch payment methods from the API
  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('http://localhost:5101/api/paymentmethods'); // Replace with your API endpoint
      const data = await response.json();
      setPaymentMethods(data);
      if (data.length > 0) setPaymentMethod(data[0].id); // Default to the first method
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5101/api/products'); // Replace with your API endpoint
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5101/api/transactions'); // Replace with your API endpoint
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleAddProductToState = (product: any) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleUpdateSelectedProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setSelectedProducts(selectedProducts.filter((product) => product.id !== productId));
    } else {
      setSelectedProducts(
        selectedProducts.map((product) =>
          product.id === productId ? { ...product, quantity: newQuantity } : product
        )
      );
    }
  };

  const handleProceedTransaction = async (paid: boolean) => {
    try {
      const totalAmount = selectedProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
  
      const newTransaction = {
        tableNo, // Add Table No
        guestName, // Add Customer Name
        userId: 1, // Replace with the actual user ID
        paymentMethodId: paymentMethod, // Replace with the actual payment method ID
        totalAmount: totalAmount,
        paid: paid,
        transactionDetails: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
          total: product.price * product.quantity,
        })),
      };
  
      await axios.post('http://localhost:5101/api/transactions', newTransaction); // Replace with your API endpoint
      setSelectedProducts([]);
      setTableNo(''); // Clear Table No
      setCustomerName(''); // Clear Customer Name
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setIsModalOpen(false); // Close the modal
    }
  };
  

  return (
    <div>
      <h2>Create New Transaction
      <button
          onClick={() => {
            setIsParkedModalOpen(true);
            fetchParkedTransactions();
          }}
          style={{
            marginLeft: '20px',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Open Parked Transaction
        </button>
      </h2>
      {/* Search Input for Products */}
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
      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* Product List */}
        <div style={{ flex: 1, maxHeight: '300px', overflowY: 'scroll' }}>
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
                )
                .slice(0, 7)
                .map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      <button onClick={() => handleAddProductToState(product)}>Add</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Selected Products */}
        <div style={{ flex: 1, maxHeight: '300px'}}>
          {/* Button Container */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {/* Proceed Button */}
            <button
              disabled={selectedProducts.length === 0} // Disable if no product is selected
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '10px',
                cursor: selectedProducts.length === 0 ? 'not-allowed' : 'pointer',
                width: '75%', // Adjusted width for Proceed button
                backgroundColor: selectedProducts.length === 0 ? '#b7bdb5' : '#74c45e', // Pastel red for enabled state, lighter for disabled
                color: selectedProducts.length === 0 ? '#aaa' : 'white', // Adjust text color based on state
              }}
            >
              <strong>Total Items:</strong>{' '}
              {selectedProducts.reduce((sum, product) => sum + product.quantity, 0)}
              <br />
              {`Rp ${selectedProducts
                .reduce((sum, product) => sum + product.price * product.quantity, 0)
                .toFixed(2)}`}
            </button>

            {/* Batal Pesanan Button */}
            <button
              onClick={() => setSelectedProducts([])} // Clear selected products
              disabled={selectedProducts.length === 0} // Disable if no product is selected
              style={{
                padding: '10px',
                cursor: selectedProducts.length === 0 ? 'not-allowed' : 'pointer',
                width: '25%', // Smaller width for Batal Pesanan button
                backgroundColor: selectedProducts.length === 0 ? '#f4d4d4' : '#ff6b6b', // Pastel red for enabled state, lighter for disabled
                color: selectedProducts.length === 0 ? '#aaa' : 'white', // Adjust text color based on state
                border: 'none',
                borderRadius: '5px', // Optional: for rounded edges
                opacity: selectedProducts.length === 0 ? 0.6 : 1, // Optional: for visual feedback
              }}
            >
              Batal Pesanan
            </button>
          </div>
          <h3>Pesanan Baru</h3>
          <table style={{ width: '100%', textAlign: 'left', overflowY: 'scroll'}}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.slice(0, 7).map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleUpdateSelectedProductQuantity(product.id, product.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateSelectedProductQuantity(product.id, product.quantity + 1)
                      }
                      style={{ marginLeft: '10px' }}
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     {/* Popup Modal */}
     {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setIsModalOpen(false)} // Close modal on clicking the backdrop
        >
          <div
            style={{
              background: '#f5f7fa',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              minWidth: '400px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              color: '#333',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
          >
            <h3>Confirm Transaction</h3>
            <p><strong>Table No:</strong> {selectedTransaction?.tableNo}</p>
            <p><strong>Guest Name:</strong> {selectedTransaction?.guestName}</p>

            {/* Input for Table No and Customer Name */}
            <div style={{ display: 'flex', gap: '25px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label
                  htmlFor="tableNo"
                  style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}
                >
                  Table No:
                </label>
                <input
                  type="text"
                  id="tableNo"
                  placeholder="Enter Table No"
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #007bff',
                    borderRadius: '5px',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ flex: 2 }}>
                <label
                  htmlFor="guestName"
                  style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}
                >
                  Customer Name:
                </label>
                <input
                  type="text"
                  id="guestName"
                  placeholder="Enter Customer Name"
                  value={guestName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #007bff',
                    borderRadius: '5px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Transaction Details */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <h4 style={{ marginBottom: '10px', color: '#007bff' }}>Transaction Details</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Product</th>
                    <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => (
                    <tr key={product.id}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{product.name}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {product.quantity}
                      </td>
                      <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {`Rp ${product.price * product.quantity}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: 'bold', textAlign: 'left' }}>Total:</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}></td>
                    <td style={{ padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>
                      {`Rp ${selectedProducts.reduce(
                        (sum, product) => sum + product.price * product.quantity,
                        0
                      )}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

             {/* Dynamic Payment Method Radio Buttons */}
             <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <h4 style={{ marginBottom: '10px', color: '#007bff' }}>Payment Method</h4>
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <label key={method.id} style={{ marginRight: '15px', display: 'inline-block' }}>
                    <input
                      type="radio"
                      value={method.name}
                      checked={paymentMethod === method.id}
                      onChange={() => handlePaymentMethodChange(method.id)}
                      style={{ marginRight: '5px' }}
                    />
                    {method.name}
                  </label>
                ))
              ) : (
                <p>Loading payment methods...</p>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button
                onClick={() => handleProceedTransaction(false)}
                style={{
                  flex: 1,
                  marginRight: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Park
              </button>
              <button
                onClick={() => handleProceedTransaction(true)}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parked Transactions Modal */}
      {isParkedModalOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => setIsParkedModalOpen(false)} // Close modal on backdrop click
              >
                <div
                  style={{
                    background: '#f5f7fa',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '400px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    color: '#333',
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
                >
                  <h3>Parked Transactions</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Table No</th>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Guest Name</th>
                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parkedTransactions.map((trx) => (
                        <tr key={trx.id}>
                          <td style={{ padding: '8px' }}>{trx.tableNo}</td>
                          <td style={{ padding: '8px' }}>{trx.guestName}</td>
                          <td style={{ padding: '8px' }}>
                            <button
                              onClick={() => handleOpenParkedTransaction(trx)}
                              style={{
                                padding: '5px 10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                              }}
                            >
                              Open
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

    </div>
  );
};

export default Transactions;
