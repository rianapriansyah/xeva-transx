import React, { useState } from 'react';
import ConfirmTransaction from './ConfirmTransaction';
import { createTransaction, updateTransaction } from '../../services/api';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TextField } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

interface ParkedTransaction {
  id: number;
  tableNo:string
  guestName:string
  paid: boolean;
  totalAmount: number;
  paymentMethodId: string;
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
  const [paymentMethodId, setPaymentMethod] = useState(selectedTransaction?.paymentMethodId || "1"); // Selected payment method
  const [paymentMethods, setPaymentMethods] = useState([
    { id: "1", name: 'Cash' },
    { id: "2", name: 'Credit Card' },
    { id: "3", name: 'Digital Wallet' },
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
      setPaymentMethod("1");
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction. Please try again.');
    }
  };
  
  return (
    <Box >
			<Stack spacing={2}>
				<Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
					<Button 
						variant="contained" 
						color="success"
						disabled={products.length === 0}
						onClick={() => {setIsModalOpen(true)}}
						startIcon={<ShoppingCartCheckoutIcon />}>
						Total Items:{' '}
								{products.reduce((sum, product) => sum + product.quantity, 0)}
								{` - Rp ${products
									.reduce((sum, product) => sum + product.price * product.quantity, 0)
									.toFixed(2)}`}
					</Button>
					<Button 
						variant="contained" 
						color="error"
						disabled={products.length === 0}
						onClick={() => {onClearProductsAndTransactions()}}
						startIcon={<ClearAllIcon />}>
						Cancel Order
					</Button>
				</Stack>
        <Box sx={{
      mb: 2,
      display: "flex",
      flexDirection: "column",
      height: 500
     // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
    }}>
    <TableContainer component={Paper}>
						<Table>
							<TableBody>
							{products.map((product) => (
								<TableRow key={product.id}>
									<TableCell>{product.name}</TableCell>
									<TableCell>{product.quantity}</TableCell>
									<TableCell>{product.price * product.quantity}</TableCell>
									<TableCell>
										<IconButton aria-label="substract" onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}>
											<ArrowCircleDownIcon />
										</IconButton>
										<IconButton aria-label="add" onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}>
											<ArrowCircleUpIcon />
										</IconButton>
										
									</TableCell>
									
								</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
        </Box>
				
					<TextField
						id="transactionNote"
						label="Order Note"
						multiline
						maxRows={4}
						onChange={(e) => onUpdateTransactionNote(e.target.value)}
						value={note}
						disabled={products.length <= 0}
					/>
			</Stack>
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
    </Box>
  );
};

export default SelectedProducts;
