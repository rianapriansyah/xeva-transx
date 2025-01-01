import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import ProductList from './components/Transactions/ProductList';
import TransactionMain from './components/Transactions/TransactionMain';
import HistoryTransactions from './components/Transactions/HistoryTransactions';
import Dashboard from './components/Transactions/Dashboard';
import AppTheme from './theme/AppTheme';
import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from 'react-redux';
import { RootState } from '../src/services/store'; // Import the state type
import Menu from './components/common/Menu';

// Placeholder components
const PaymentMethodManagement = () => <div>Payment Method Management Screen</div>;
const Settings = () => <div>Settings Screen</div>;

interface ListItemLinkProps {
  icon?: React.ReactElement<unknown>;
  primary: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  return (
    <ListItemButton component={Link} to={to}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItemButton>
  );
}

const menus  = [
  {
    title: 'Transaction',
    element: <TransactionMain />,
    path: '/transactions',
    icon: <PointOfSaleIcon />
  },
  {
    title: 'Product',
    element: <ProductList />,
    path: '/products',
    icon: <InventoryIcon />
  },
  {
    title: 'Dashboard',
    element: <Dashboard />,
    path: '/dashboard',
    icon: <DashboardIcon />
  },
  {
    title: 'Settings',
    element: <Settings />,
    path: '/analytics',
    icon: <SettingsIcon />
  }
];

const App: React.FC = () => {
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  
  const selectedStore = useSelector((state: RootState) => state.store.selectedStore);

  return (
    <AppTheme>
      <Router>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
            disabled={selectedStore?.name===""}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {selectedStore?.name}
          </Typography>
          <Menu>

          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {menus.map((menu) => (
          <ListItem key={menu.title} disablePadding>
            <ListItemLink to={menu.path} primary={menu.title} icon={menu.icon}/>
          </ListItem>
        ))}
      </List>
        </Box>
      </Drawer>
      <Offset />
        <Routes>
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
