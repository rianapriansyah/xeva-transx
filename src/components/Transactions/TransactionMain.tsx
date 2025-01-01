import React, { useEffect, useState } from 'react';
import  * as api from '../../services/api';
import SelectedProducts from './SelectedProducts';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import ReorderIcon from '@mui/icons-material/Reorder';
import TransactionMainRight from './TransactionMainRight';
import { Transaction, Product, Category, SelectedProduct } from '../../types/interfaceModel';
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

const newProduct: Product = {
	id: 99999,
	name: 'Add New Product',
	category: "",
	transactionId: 0,
	productId: 0,
	price: 0,
	quantity: 0,
	total: 0,
	kitchen: ''
};

const TransactionMain: React.FC = () => {
	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
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
	const [note, setTransactionNote] = useState("");
	const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

	useEffect(() => {
		fetchPaymentMethods();
		fetchAvailableProducts();
		fetchTransaction();
		fetchCategories();
	}, [selectedStore]);

	// Fetch categories
	const fetchCategories = async () => {
		try {
			const response = await api.fetchCategories();
			setCategories(response.data);
			setCategories((categories) => [{id:999, name:"Clear"}, ...categories ]);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	// Fetch available transaction
	const fetchAvailableProducts = async () => {
		try {
			const response = await api.fetchProducts(selectedStore?.id);
			setAvailableProducts(response.data);
			setAvailableProducts((availableProducts) => [...availableProducts, newProduct]);
		} catch (error) {
			console.error('Error fetching available product:', error);
		}
	};

	// Fetch parked transactions
	const fetchTransaction = async () => {
		try {
			const response = await api.fetchTransaction(selectedStore?.id);
			const fetchedTransactions = response.data;

			setTransactions(fetchedTransactions);
			const unpaidTransactions = fetchedTransactions.filter((transaction:Transaction)=>!transaction.paid);
			setUnpaidTransactions(unpaidTransactions);
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
	const handleSelectParkedTransaction = (transaction: any) => {
		setTransaction(transaction)
		setSelectedProducts(transaction.transactionDetails.map((detail: any) => ({
			id: detail.productId,
			name: detail.productName, // Ensure product name is part of the API response
			price: detail.price,
			quantity: detail.quantity,
			transactionId:transaction.id
		})));
		setIsModalOpen(false); // Close modal after selecting
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
		setTransaction(newTransactionObj);
		// setPaymentMethods([]);
	};

const handleUpdateTransactionNote = (newNote: string) => {
    setTransactionNote(newNote);
};

	return (
		<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey', borderRadius:"10px" }}>
			<Grid container spacing={2}>
				<Grid size={4}>
					<Stack spacing={2}>
						<SelectedProducts
							products={selectedProducts}
							selectedTransaction={selectedTransaction} // Pass the entire transaction object
							onUpdateQuantity={handleUpdateQuantity}
							onCancelOrder={handleCancelOrder}
							note={note} // Pass the transaction note
							onUpdateTransactionNote={setTransactionNote} // Pass the update handler
							paymentMethods = {paymentMethods}
						/>
					</Stack>
				</Grid>
				<Grid size={8}>
					<TransactionMainRight 
						onAddProduct={handleAddProduct} 
						availableProducts={availableProducts}
						categories={categories}
						transactions={unpaidTransactions}
						onSelectTransaction={handleSelectParkedTransaction}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default TransactionMain;
