import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import TransactionMain from './components/Transactions/TransactionMain';
import HistoryTransactions from './components/Transactions/HistoryTransactions';
import AppTheme from './theme/AppTheme';

// Placeholder components
const Analytics = () => <div>Transaction History Management Screen</div>;
const PaymentMethodManagement = () => <div>Payment Method Management Screen</div>;

const App: React.FC = () => {
  return (
    <AppTheme>
      <Router>
          <h1>Coffee Shop Management App</h1>
          {/* Navigation Buttons */}
            <div style={{ marginBottom: '20px' }}>
              <Link to="/product-management" style={{ marginRight: '10px' }}><button>Products</button></Link>
              <Link to="/user-management" style={{ marginRight: '10px' }}><button>Users</button></Link>
              <Link to="/transactions" style={{ marginRight: '10px' }}><button>Transactions</button></Link>
              <Link to="/history-transactions" style={{ marginRight: '10px' }}><button>History Transactions</button></Link>
              <Link to="/analytics" style={{ marginRight: '10px' }}><button>Analytics</button></Link>
              <Link to="/paymentmet"><button>Settings</button></Link>
            </div>
          <Routes>
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/payment-method-management" element={<PaymentMethodManagement />} />
            <Route path="/transactions" element={<TransactionMain />} />
            <Route path="/history-transactions" element={<HistoryTransactions />} />
            <Route path="/" element={<div>Welcome to the Coffee Shop Management App</div>} />
          </Routes>
          
        
      </Router>
    </AppTheme>
  );
};

export default App;
