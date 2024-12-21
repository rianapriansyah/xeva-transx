import React from 'react';

interface ParkedTransaction {
  id: number;
  tableNo: string;
  guestName: string;
  totalAmount: number;
  transactionDetails: SelectedProduct[];
}

interface SelectedProduct {
  id: number;
  transactionId:number;
  productId:number;
  name:string;
  price:number;
  quantity:number;
  total:number;
}

interface ParkedTransactionsModalProps {
  isOpen: boolean;
  parkedTransactions: ParkedTransaction[];
  onClose: () => void;
  onSelectTransaction: (transaction: ParkedTransaction) => void;
}

const ParkedTransactionsModal: React.FC<ParkedTransactionsModalProps> = ({
  isOpen,
  parkedTransactions,
  onClose,
  onSelectTransaction,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{position: 'fixed',top: 0,left: 0,right: 0,bottom: 0,background: 'rgba(0,0,0,0.4)',display: 'flex',justifyContent: 'center',alignItems: 'center',zIndex: 1000}}
    onClick={onClose} // Close modal on clicking the backdrop
    >
      <div style={{background: '#f5f7fa', padding: '20px',borderRadius: '10px',boxShadow: '0 4px 10px rgba(0, 0, 0, 4)',
          minWidth: '600px',maxHeight: '80%',overflowY: 'auto',color: '#333'}}
        onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
      >
        <h3>Parked Transactions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Table No</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Guest Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {parkedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.tableNo}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.guestName}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                  {`Rp ${transaction.totalAmount}`}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  <button
                    onClick={() => onSelectTransaction(transaction)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParkedTransactionsModal;
