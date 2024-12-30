// import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet } from 'react-router-dom';
import type { Navigation } from '@toolpad/core';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
];

const BRANDING = {
  title: 'XEVA',
};

export default function App() {
  return (
    <AppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </AppProvider>
  );
}

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
// import UserManagement from './UserManagement';
// import ProductList from './components/Transactions/ProductList';
// import TransactionMain from './components/Transactions/TransactionMain';
// import HistoryTransactions from './components/Transactions/HistoryTransactions';
// import ButtonAppBar from './components/Transactions/ButtonAppBar';
// import AppTheme from './theme/AppTheme';
// import { AppProvider, Navigation } from '@toolpad/core';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// const App: React.FC = () => {
//   return (
//     <AppTheme>      
//       <Router>
//         <ButtonAppBar>
        
//         </ButtonAppBar>
//           <h1></h1>
//           {/* Navigation Buttons */}
//             <div style={{ marginBottom: '20px' }}>
//               <Link to="/products" style={{ marginRight: '10px' }}><button>Products</button></Link>
//               <Link to="/user-management" style={{ marginRight: '10px' }}><button>Users</button></Link>
//               <Link to="/transactions" style={{ marginRight: '10px' }}><button>Transactions</button></Link>
//               <Link to="/history-transactions" style={{ marginRight: '10px' }}><button>History Transactions</button></Link>
//               <Link to="/analytics" style={{ marginRight: '10px' }}><button>Analytics</button></Link>
//               <Link to="/paymentmet"><button>Settings</button></Link>
//             </div>
//           <Routes>
//             <Route path="/user-management" element={<UserManagement />} />
//             <Route path="/products" element={<ProductList />} />
//             <Route path="/analytics" element={<Analytics />} />
//             <Route path="/payment-method-management" element={<PaymentMethodManagement />} />
//             <Route path="/transactions" element={<TransactionMain />} />
//             <Route path="/history-transactions" element={<HistoryTransactions />} />
//             <Route path="/" element={<div>Welcome to the Coffee Shop Management App</div>} />
//           </Routes>
//       </Router>
//     </AppTheme>
//   );
// };

// export default App;
