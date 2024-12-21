import React, { useEffect, useState } from 'react';
import { fetchTransaction } from '../../services/api';

const HistoryTransaction: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetchTransaction();
        setTransactions(response.data); // Assuming the API returns an array of transactions
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transaction History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Table No</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Guest Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Total</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Created At</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.tableNo}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.guestName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.totalAmount}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(transaction.createdAt).toLocaleString()}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.paymentMethodId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTransaction;
