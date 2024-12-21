import React from 'react';

interface ParkedTransaction {
  id: number;
  tableNo:string
  guestName:string
  paid: boolean;
  totalAmount: number;
  paymentMethodId: number;
  transactionDetails: any[];
}

interface ConfirmTransactionProps {
  note:string;
  isModalOpen: boolean;
  selectedProducts: any[];
  selectedTransaction: ParkedTransaction | null; // Accept the entire transaction
  tableNo: string;
  guestName: string;
  paymentMethods: any[];
  paymentMethodId: number;
  onCloseModal: () => void;
  setTableNo: (value: string) => void;
  setGuestName: (value: string) => void;
  handlePaymentMethodChange: (id: number) => void;
  handleProceedTransaction: (isPaid: boolean) => void;
}


const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({
  note,
  isModalOpen,
  selectedProducts,
  selectedTransaction,
  tableNo,
  guestName,
  paymentMethods,
  paymentMethodId,
  onCloseModal,
  setTableNo,
  setGuestName,
  handlePaymentMethodChange,
  handleProceedTransaction,
}) => {
  if (!isModalOpen) return null;
  const isExistingTransaction = selectedTransaction !== null;

  return (
    <div style={{position: 'fixed',top: 0,left: 0,right: 0,bottom: 0,background: 'rgba(0,0,0,0.4)',display: 'flex',justifyContent: 'center',alignItems: 'center',}}
    onClick={onCloseModal} // Close modal on clicking the backdrop
    >
      <div style={{background: '#f5f7fa',padding: '20px',borderRadius: '10px',textAlign: 'center',minWidth: '400px',boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',color: '#333'}}
        onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
      >
        <h3>Confirm Transaction</h3>
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
              value={selectedTransaction?.tableNo ||tableNo}
              readOnly={isExistingTransaction}
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
              value={selectedTransaction?.guestName||guestName}
              onChange={(e) => setGuestName(e.target.value)}
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

        {/* Payment Method */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <h4 style={{ marginBottom: '10px', color: '#007bff' }}>Payment Method</h4>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <label key={method.id} style={{ marginRight: '15px', display: 'inline-block' }}>
                <input
                  type="radio"
                  value={method.name}
                  checked={paymentMethodId === method.id}
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

        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f5f7fa',
            border: '1px solid #ccc',
            borderRadius: '5px',
            fontStyle: 'italic',
            display: note ? 'block' : 'none', // Show only if the note exists
          }}
        >
          <strong>Transaction Note:</strong>
          <p>{note}</p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            onClick={() => handleProceedTransaction(false)}
            disabled={isExistingTransaction}
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
  );
};

export default ConfirmTransaction;
