import React, { useEffect, useState } from 'react';
import  * as api from '../../services/api';
import SelectedProducts from './SelectedProducts';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TransactionMainRight from './TransactionMainRight';
import { Transaction, Product, Category, TransactionDetailProduct } from '../../types/interfaceModel';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

const newTransactionObj:Transaction={
	id: 0,
	userId: "",
	paymentMethodId: 1,
	totalAmount: 0,
	paid: false,
	tableNo: "",
	guestName: "",
	note: '',
	grandTotalAmount: 0,
	discount: '',
	transactionDetails: [],
	createdAt: ''
}

const TransactionMain: React.FC = () => {
	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const [selectedProducts, setSelectedProducts] = useState<TransactionDetailProduct[]>([]);
	const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [unpaidTransactions, setUnpaidTransactions] = useState<Transaction[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [selectedTransaction, setTransaction] = useState<Transaction>({
		id: 0,
		userId: "",
		paymentMethodId: 1,
		totalAmount: 0,
		paid: false,
		tableNo: "",
		guestName: "",
		note: '',
		grandTotalAmount: 0,
		discount: '',
		transactionDetails: [],
		createdAt: ''
	});
	
	const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

	useEffect(() => {
		fetchStaticData();
		fetchTransactionData();
	}, [selectedStore]);

	// Fetch static data
	const fetchStaticData = async () => {
		fetchPaymentMethods();
		fetchAvailableProducts();
		fetchCategories();
	};

	// Fetch transaction data
	const fetchTransactionData = async () => {
		fetchUnpaidTransaction();
		fetchTodayPaidTransactions();
	};

	// Fetch categories
	const fetchCategories = async () => {
		try {
			const response = await api.fetchCategories();
			setCategories(response.data);
			setCategories((categories) => [{id:999, name:"Clear", description:""}, ...categories ]);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	// Fetch available transaction
	const fetchAvailableProducts = async () => {
		try {
			const response = await api.fetchProducts(selectedStore?.id);
			setAvailableProducts(response.data);
		} catch (error) {
			console.error('Error fetching available product:', error);
		}
	};

	// Fetch parked transactions
	const fetchUnpaidTransaction = async () => {
		try {
			const response = await api.fetchUnpaidTransaction(selectedStore?.id);
			const fetchedTransactions = response.data;
			setUnpaidTransactions(fetchedTransactions);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		}
	};

		// Fetch Paid transactions by todat
		const fetchTodayPaidTransactions = async () => {
			try {
				const today = new Date().toISOString().split('T')[0];
				const response = await api.fetchTransactionByDate(selectedStore?.id, today);
				setTransactions(response.data);
			} catch (error) {
				console.error('Error fetching transactions:', error);
			}
		};

	// Fetch payment methods
	const fetchPaymentMethods = async () => {
		try {
			const response = await api.fetchPaymentMethods();
			setPaymentMethods(response.data);
		} catch (error) {
			console.error('Error fetching payment methods:', error);
		}
	};

	// Handle action when selecting a parked transaction
	const handleSelectTransaction = (transaction: any) => {
		setTransaction(transaction)
		setSelectedProducts(transaction.transactionDetails.map((detail: any) => ({
			id: detail.productId,
			name: detail.productName, // Ensure product name is part of the API response
			price: detail.price,
			quantity: detail.quantity,
			transactionId:transaction.id
		})));
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
	};

	const handleCancelOrder = () => {
		setSelectedProducts([]);
		setTransaction(newTransactionObj);
		console.log(transactions);
		// setPaymentMethods([]);
	};

	return (
		<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey', borderRadius:"10px" }}>
			<Grid container spacing={2}>
				<Grid size={6}>
					<Stack spacing={2}>
						<SelectedProducts
							products={selectedProducts}
							selectedTransaction={selectedTransaction} // Pass the entire transaction object
							onUpdateQuantity={handleUpdateQuantity}
							onCancelOrder={handleCancelOrder}
							paymentMethods = {paymentMethods}
							refreshTransactions={fetchTransactionData} // Pass the function as a prop
						/>
					</Stack>
				</Grid>
				<Grid size={6}>
					<TransactionMainRight 
						onAddProduct={handleAddProduct} 
						availableProducts={availableProducts}
						categories={categories}
						transactions={transactions}
						unpaidTransactions={unpaidTransactions}
						onSelectTransaction={handleSelectTransaction}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default TransactionMain;
