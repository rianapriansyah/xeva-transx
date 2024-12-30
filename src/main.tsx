import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages';
import OrdersPage from './pages/orders';
import Layout from '../src/components/Transactions/Dashboard';
import TransactionMain from './components/Transactions/TransactionMain';
// import { AppProvider } from '@toolpad/core/AppProvider';
// import { StyledEngineProvider } from '@mui/material/styles';

// import { ThemeProvider } from '@mui/material/styles';
// import { CssBaseline } from '@mui/material';

// ReactDOM.createRoot(document.querySelector("#root")!).render(
//   <React.StrictMode>
//     <StyledEngineProvider injectFirst>
//       <App />
//     </StyledEngineProvider>
//   </React.StrictMode>
// );

const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: 'transaction',
            Component: DashboardPage,
          },
          {
            path: 'orders',
            Component: TransactionMain,
          },
        ],
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
