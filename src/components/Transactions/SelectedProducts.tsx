import React, { useState } from 'react';
import ConfirmTransaction from './ConfirmTransaction';
import { createTransaction, updateTransaction } from '../../services/api';

interface ParkedTransaction {
  id: number;
  tableNo:string
  guestName:string
  paid: boolean;
  totalAmount: number;
  paymentMethodId: number;
  transactionDetails: SelectedProduct[];
}

interface SelectedProduct {
  id: number;
  transactionId:number;
  productId:number;
  name:string;
  price:number;
  quantity:number;
  total:number
}

interface SelectedProductsProps {
  products: SelectedProduct[];
  selectedTransaction:ParkedTransaction;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onClearProducts: () => void;
  onClearTransactions: () => void;
  onUpdateTransactionNote: (note: string) => void; // Add a handler for transaction note
  note: string; // The transaction note state
}

const SelectedProducts: React.FC<SelectedProductsProps> = ({
  products,
  selectedTransaction,
  onUpdateQuantity,
  onClearProducts,
  onClearTransactions,
  onUpdateTransactionNote,
  note,
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [tableNo, setTableNo] = useState(selectedTransaction?.tableNo || ""); // Default from transaction
  const [guestName, setGuestName] = useState(selectedTransaction?.guestName || ""); // Default from transaction
  const [paymentMethodId, setPaymentMethod] = useState(selectedTransaction?.paymentMethodId || 1); // Selected payment method
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' },
    { id: 3, name: 'Digital Wallet' },
  ]); // Example payment methods

  // const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const onClearProductsAndTransactions = () => {
    onClearProducts();
    onClearTransactions();
    onUpdateTransactionNote("");
  };

  const handleProceedTransaction = async (paid: boolean) => {
    const totalAmount = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    // console.log(products);

    const basePayload = {
      tableNo,
      guestName,
      userId: 1,
      paymentMethodId,
      totalAmount,
      paid,
      note,
      transactionDetails: products.map((product) => ({
        transactionId:selectedTransaction?.id,
        productId:product.id,
        quantity: product.quantity,
        price: product.price,
        total: product.price * product.quantity
      })),
    };

    const transactionPayload = selectedTransaction
      ? {
          ...selectedTransaction, // Keep existing fields from the selected transaction
          paymentMethodId: 1, // Overwrite only these fields
          totalAmount,
          paid,
          note,
          transactionDetails: products.map((product) => ({
            transactionId:selectedTransaction.id,
            productId:product.id,
            quantity: product.quantity,
            price: product.price,
            total: product.price * product.quantity
          })),
        }
      : basePayload;

      console.log(basePayload);
      console.log(transactionPayload);
  
    try {
      let response;
      if (selectedTransaction?.id) {
        // Update existing transaction
        response = await updateTransaction(selectedTransaction.id, transactionPayload);
        alert('Transaction successfully updated!');
      } else {
        // Create new transaction
        response = await createTransaction(transactionPayload);
        alert('Transaction successfully submitted!');
      }

      console.log('Transaction Response:', response.data);
      setIsModalOpen(false);
      onClearProductsAndTransactions();
      setTableNo('');
      setGuestName('');
      setPaymentMethod(1);
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };
  
  return (
    <React.Fragment>
       {/* Button Container */}
       <div style={{ display: 'flex', gap: '10px'}}>
            {/* Proceed Button */}
            <button
              disabled={products.length === 0} // Disable if no product is selected
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: '10px',
                cursor: products.length === 0 ? 'not-allowed' : 'pointer',
                width: '75%', // Adjusted width for Proceed button
                backgroundColor: products.length === 0 ? '#b7bdb5' : '#74c45e', // Pastel red for enabled state, lighter for disabled
                color: products.length === 0 ? '#aaa' : 'white', // Adjust text color based on state
              }}
            >
              <strong>Total Items:</strong>{' '}
              {products.reduce((sum, product) => sum + product.quantity, 0)}
              {` - Rp ${products
                .reduce((sum, product) => sum + product.price * product.quantity, 0)
                .toFixed(2)}`}
            </button>

            {/* Batal Pesanan Button */}
            <button
              onClick={onClearProductsAndTransactions} // Clear selected products
              disabled={products.length === 0} // Disable if no product is selected
              style={{
                cursor: products.length === 0 ? 'not-allowed' : 'pointer',
                width: '25%', // Smaller width for Batal Pesanan button
                backgroundColor: products.length === 0 ? '#f4d4d4' : '#ff6b6b', // Pastel red for enabled state, lighter for disabled
                color: products.length === 0 ? '#aaa' : 'white', // Adjust text color based on state
                border: 'none',
                opacity: products.length === 0 ? 0.6 : 1, // Optional: for visual feedback
              }}
            >
              Batal Pesanan
            </button>
          </div>
            <table style={{ width: '100%', textAlign: 'left', overflowY: 'scroll'}}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.price * product.quantity}</td>
                    <td>
                    <button onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}>-</button>
                    <button onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}>+</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Transaction Note Field */}
              {products.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <label
                    htmlFor="transactionNote"
                    style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                  >
                    Transaction Note:
                  </label>
                  <textarea
                    id="transactionNote"
                    value={note}
                    onChange={(e) => onUpdateTransactionNote(e.target.value)}
                    style={{
                      width: '100%',
                      height: '80px',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                    }}
                  ></textarea>
                </div>
              )}

        {/* ConfirmTransaction Modal */}
        <ConfirmTransaction
          note={note} // Pass the transaction note
          isModalOpen={isModalOpen}
          selectedProducts={products}
          selectedTransaction={selectedTransaction}
          tableNo={tableNo}
          guestName={guestName}
          paymentMethods={paymentMethods}
          paymentMethodId={paymentMethodId}
          onCloseModal={() => setIsModalOpen(false)} // Close modal handler
          setTableNo={setTableNo}
          setGuestName={setGuestName}
          handlePaymentMethodChange={setPaymentMethod}
          handleProceedTransaction={handleProceedTransaction}
        />
    </React.Fragment>
  );
};

export default SelectedProducts;
