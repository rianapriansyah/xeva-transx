import React, { useState } from 'react';
import axios from 'axios';
// import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
// import Grid from '@mui/material/Grid2';
// import ColorModeIconDropdown from '../../theme/ColorModeIconDropdown';
// import AppTheme from '../../theme/AppTheme';
import AvailableProducts from './AvailableProducts';
import SelectedProducts from './SelectedProducts';
import ParkedTransactionsModal from './ParkedTransactionsModal';

interface SelectedProduct {
  id: number;
  transactionId:number;
  productId:number;
  name:string;
  price:number;
  quantity:number;
  total:number;
  note:string;
}

const TransactionMain: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parkedTransactions, setParkedTransactions] = useState<any[]>([]);
  const [selectedParkedTransaction, setSelectedParkedTransaction] = useState<any | null>(null);
  const [note, setTransactionNote] = useState("");


  // Fetch parked transactions
  const fetchParkedTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5101/api/transactions/unpaid');
      setParkedTransactions(response.data);
    } catch (error) {
      console.error('Error fetching parked transactions:', error);
    }
  };

  // Handle action when selecting a parked transaction
  const handleSelectParkedTransaction = (transaction: any) => {
    setSelectedParkedTransaction(transaction)
    setSelectedProducts(transaction.transactionDetails.map((detail: any) => ({
      id: detail.productId,
      name: detail.productName, // Ensure product name is part of the API response
      price: detail.price,
      quantity: detail.quantity,
      transactionId:transaction.id
    })));
    setIsModalOpen(false); // Close modal after selecting
    console.log(transaction.transactionDetails);
  };

  const handleAddProduct = (product: any) => {
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

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === id ? 
        { ...product, 
          productId: product.productId,
          quantity: newQuantity 
        } : product
      ).filter((product) => product.quantity > 0) // Remove products with zero quantity
    );
    //console.log(id);
  };

  const handleClearProducts = () => {
    setSelectedProducts([]);
  };

  const handleClearTransactions = () => {
    setSelectedParkedTransaction(null);
  };

  return (
    <div className="layout">
      <div className="left-section">
        <h2>Create New Transaction</h2>
        {/* Show Parked Transactions Button */}
        <button
          onClick={() => {
            fetchParkedTransactions();
            setIsModalOpen(true);
            console.log(selectedProducts);
          }}
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Show Parked Transactions
        </button>

        {/* Parked Transactions Modal */}
        <ParkedTransactionsModal
          isOpen={isModalOpen}
          parkedTransactions={parkedTransactions}
          onClose={() => setIsModalOpen(false)}
          onSelectTransaction={handleSelectParkedTransaction}
        />
        <SelectedProducts
          products={selectedProducts}
          selectedTransaction={selectedParkedTransaction} // Pass the entire transaction object
          onUpdateQuantity={handleUpdateQuantity}
          onClearProducts={handleClearProducts}
          onClearTransactions={handleClearTransactions}
          note={note} // Pass the transaction note
          onUpdateTransactionNote={setTransactionNote} // Pass the update handler
        />


      </div>
      {/* Divider */}
      <div className="divider"></div>
      {/* Right Section - Available Products */}
      <div className="right-section">
        <AvailableProducts onAddProduct={handleAddProduct} />
      </div>
    </div>
  );
};

export default TransactionMain;
