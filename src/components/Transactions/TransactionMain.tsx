import React, { useEffect, useState } from 'react';
import  * as api from '../../services/api';
import AvailableProducts from './AvailableProducts';
import SelectedProducts from './SelectedProducts';
import ParkedTransactionsModal from './ParkedTransactionsModal';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReorderIcon from '@mui/icons-material/Reorder';

interface SelectedProduct {
	id: number;
	transactionId:number;
	productId:number;
	name:string;
	price:number;
	quantity:number;
	total:number;
	note:string;
}

const TransactionMain: React.FC = () => {
	const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [parkedTransactions, setParkedTransactions] = useState<any[]>([]);
	const [selectedParkedTransaction, setSelectedParkedTransaction] = useState<any | null>(null);
	const [note, setTransactionNote] = useState("");
	const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

	useEffect(() => {
		fetchPaymentMethods();
	}, []);

	// Fetch parked transactions
	const fetchParkedTransactions = async () => {
		try {
			const response = await api.fetchParkedTransactions();
			setParkedTransactions(response.data);
		} catch (error) {
			console.error('Error fetching parked transactions:', error);
		}
	};

	// Fetch parked transactions
	const fetchPaymentMethods = async () => {
		try {
			const response = await api.fetchPaymentMethods();
			setPaymentMethods(response.data);
		} catch (error) {
			console.error('Error fetching parked transactions:', error);
		}
	};

	// Handle action when selecting a parked transaction
	const handleSelectParkedTransaction = (transaction: any) => {
		setSelectedParkedTransaction(transaction)
		setSelectedProducts(transaction.transactionDetails.map((detail: any) => ({
			id: detail.productId,
			name: detail.productName, // Ensure product name is part of the API response
			price: detail.price,
			quantity: detail.quantity,
			transactionId:transaction.id
		})));
		setIsModalOpen(false); // Close modal after selecting
		console.log(transaction.transactionDetails);
	};

	const handleAddProduct = (product: any) => {
		if(product.id===99999){
			return;
		}
		const existingProduct = selectedProducts.find((p) => p.id === product.id);
		if (existingProduct) {
			setSelectedProducts(
				selectedProducts.map((p) =>
					p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
				)
			);
		} else {
			setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
		}    
	};

	const handleUpdateQuantity = (id: number, newQuantity: number) => {
		setSelectedProducts((prev) =>
			prev.map((product) =>
				product.id === id ? 
				{ ...product, 
					productId: product.productId,
					quantity: newQuantity 
				} : product
			).filter((product) => product.quantity > 0) // Remove products with zero quantity
		);
		//console.log(id);
	};

	const handleCancelOrder = () => {
		setSelectedProducts([]);
		setSelectedParkedTransaction(null);
		setPaymentMethods([]);
	};

	const onClickShowParkedTransactions = () => {
		fetchParkedTransactions();
		setIsModalOpen(true);
	};

	return (
		<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey' }}>
			<Grid container spacing={2}>
				<Grid size={6}>
					<Stack spacing={2}>
						<Stack spacing={2} direction="row" >
							<Typography variant="h4" gutterBottom>
								Create New Transaction
							</Typography>
							<Button variant="contained" onClick={() => {onClickShowParkedTransactions()}} startIcon={<ShoppingCartIcon />} endIcon={<ReorderIcon />}></Button>
						</Stack>
						<SelectedProducts
							products={selectedProducts}
							selectedTransaction={selectedParkedTransaction} // Pass the entire transaction object
							onUpdateQuantity={handleUpdateQuantity}
							onCancelOrder={handleCancelOrder}
							note={note} // Pass the transaction note
							onUpdateTransactionNote={setTransactionNote} // Pass the update handler
							paymentMethods = {paymentMethods}
						/>
					</Stack>
				</Grid>				
				{/* Parked Transactions Modal */}
				<ParkedTransactionsModal
					isOpen={isModalOpen}
					parkedTransactions={parkedTransactions}
					onClose={() => setIsModalOpen(false)}
					onSelectTransaction={handleSelectParkedTransaction}
				/>
				<Grid size={6}>
					<Typography variant="h4" gutterBottom>
						Available Products
					</Typography>
					<AvailableProducts onAddProduct={handleAddProduct} />
				</Grid>
			</Grid>  
		</Box>  
	);
};

export default TransactionMain;
