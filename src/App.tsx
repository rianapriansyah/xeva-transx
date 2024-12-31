import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserManagement from './UserManagement';
import ProductList from './components/Transactions/ProductList';
import TransactionMain from './components/Transactions/TransactionMain';
import HistoryTransactions from './components/Transactions/HistoryTransactions';
import AppTheme from './theme/AppTheme';
import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InboxIcon from '@mui/icons-material/MoveToInbox';

// Placeholder components
const Analytics = () => <div>Transaction History Management Screen</div>;
const PaymentMethodManagement = () => <div>Payment Method Management Screen</div>;

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

const App: React.FC = () => {
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const menus  = [
    {
      title: 'Transaction',
      element: <TransactionMain />,
      path: '/transactions'
    },
    {
      title: 'Product',
      element: <ProductList />,
      path: '/products'
    }
  ];
  
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
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Xeva
          </Typography>
          <Button>Select Store</Button>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {menus.map((menu) => (
          <ListItem key={menu.title} disablePadding>
            <ListItemLink to={menu.path} primary={menu.title} icon={<InboxIcon />} />
          </ListItem>
        ))}
      </List>
        </Box>
      </Drawer>
      <Offset />
        <Routes>
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/products" element={<ProductList />} />
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
