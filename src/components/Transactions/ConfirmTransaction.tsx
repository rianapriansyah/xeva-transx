import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

interface ParkedTransaction {
	id: number;
	tableNo:string
	guestName:string
	paid: boolean;
	totalAmount: number;
	paymentMethodId: string;
	transactionDetails: any[];
}

interface ConfirmTransactionProps {
	note:string;
	isModalOpen: boolean;
	selectedProducts: any[];
	selectedTransaction: ParkedTransaction | null; // Accept the entire transaction
	tableNo: string;
	guestName: string;
	paymentMethods: any[];
	paymentMethodId: string;
	onCloseModal: () => void;
	setTableNo: (value: string) => void;
	setGuestName: (value: string) => void;
	handlePaymentMethodChange: (id: string) => void;
	handleProceedTransaction: (isPaid: boolean) => void;
}


const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({
	note,
	isModalOpen,
	selectedProducts,
	selectedTransaction,
	tableNo,
	guestName,
	paymentMethods,
	paymentMethodId,
	onCloseModal,
	setTableNo,
	setGuestName,
	handlePaymentMethodChange,
	handleProceedTransaction,
}) => {
	if (!isModalOpen) return null;
	const isExistingTransaction = selectedTransaction !== null;

	const handleChange = (event: SelectChangeEvent) => {
		// alert(event.target.value);
		handlePaymentMethodChange(event.target.value as string)
	};

	return (
		<Dialog open={isModalOpen} onClose={onCloseModal}>
					<DialogTitle>Confirm Transaction</DialogTitle>
					<DialogContent>
						<Box sx={{ flexGrow: 1 }}>
							<Stack spacing={2}>
								<DialogContentText>
									Confirm the transaction details below.
								</DialogContentText>
								<Stack spacing={2} direction="row" >
									<TextField
											autoFocus
											required
											margin="dense"
											id="tableNo"
											name="tableNo"
											label="Enter Table No:"
											type="text"
											fullWidth
											variant="standard"
											value={selectedTransaction?.tableNo ||tableNo}
											disabled={isExistingTransaction}
											onChange={(e) => setTableNo(e.target.value)}
										/>
										<TextField
											autoFocus
											margin="dense"
											id="guestName"
											name="guestName"
											label="Enter Guest Name:"
											type="text"
											fullWidth
											variant="standard"
											value={selectedTransaction?.guestName||guestName}
											disabled={isExistingTransaction}
											onChange={(e) => setGuestName(e.target.value)}
										/>
								</Stack>
								<TableContainer component={Paper}>
									<Table aria-label="simple table">
										<TableBody>
											{selectedProducts.map((product) => (
												<TableRow key={product.id}>
													<TableCell component="th" scope="row">
														{product.name}
													</TableCell>
													<TableCell>{product.quantity}</TableCell>
													<TableCell>{product.price * product.quantity}</TableCell>
													</TableRow>
												))}
										</TableBody>
										<TableFooter>
											<TableRow>
												<TableCell>
													<Typography variant="button" gutterBottom>
														Total Item
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="button" gutterBottom>
														{selectedProducts.reduce((sum, product) => sum + product.quantity, 0)}
													</Typography>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<Typography variant="button" gutterBottom>
														Total Price
													</Typography>
												</TableCell>
												<TableCell>
													<Typography variant="button" gutterBottom>
													{`Rp ${selectedProducts.reduce(
														(sum, product) => sum + product.price * product.quantity,
														0
													)}`}
													</Typography>
												</TableCell>
											</TableRow>
										</TableFooter>
									</Table>
								</TableContainer>
								<Box component="section" sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
									<Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12, fontStyle:'italic' }}>
											Note
										</Typography>
										<Typography variant="body2">
											{note}
										</Typography>
								</Box>
								<Box>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-label" variant="standard" autoFocus>Payment Method</InputLabel>
											<Select
												variant="standard"
												labelId="demo-simple-select-label"
												id="demo-simple-select-label"
												value={paymentMethodId as string}
												onChange={handleChange}
												>
											{paymentMethods.map((method) => (
												<MenuItem key={method.id} value={method.id}>{method.name}</MenuItem>
											))}
											</Select>
									</FormControl>
								</Box>
							</Stack>
						</Box>
						<DialogActions>
							<Button onClick={() => onCloseModal()}>
								Cancel
							</Button>
							<Button onClick={() => handleProceedTransaction(false)} disabled={isExistingTransaction}>
								Park
							</Button>
							<Button type="submit" onClick={() => handleProceedTransaction(true)}>
								Accept Payment
							</Button>
						</DialogActions>
					</DialogContent>
				</Dialog>
		// <div style={{position: 'fixed',top: 0,left: 0,right: 0,bottom: 0,background: 'rgba(0,0,0,0.4)',display: 'flex',justifyContent: 'center',alignItems: 'center',}}
		// onClick={onCloseModal} // Close modal on clicking the backdrop
		// >
		// 	<div style={{background: '#f5f7fa',padding: '20px',borderRadius: '10px',textAlign: 'center',minWidth: '400px',boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',color: '#333'}}
		// 		onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
		// 	>
				
				

		// 		{/* Payment Method */}
		// 		{/* <div style={{ marginBottom: '20px', textAlign: 'left' }}>
		// 			<h4 style={{ marginBottom: '10px', color: '#007bff' }}>Payment Method</h4>
		// 			{paymentMethods.length > 0 ? (
		// 				paymentMethods.map((method) => (
		// 					<label key={method.id} style={{ marginRight: '15px', display: 'inline-block' }}>
		// 						<input
		// 							type="radio"
		// 							value={method.name}
		// 							checked={paymentMethodId === method.id}
		// 							onChange={() => handlePaymentMethodChange(method.id)}
		// 							style={{ marginRight: '5px' }}
		// 						/>
		// 						{method.name}
		// 					</label>
		// 				))
		// 			) : (
		// 				<p>Loading payment methods...</p>
		// 			)}
		// 		</div>

		// 		<div
		// 			style={{
		// 				marginBottom: '20px',
		// 				padding: '10px',
		// 				backgroundColor: '#f5f7fa',
		// 				border: '1px solid #ccc',
		// 				borderRadius: '5px',
		// 				fontStyle: 'italic',
		// 				display: note ? 'block' : 'none', // Show only if the note exists
		// 			}}
		// 		>
		// 			<strong>Transaction Note:</strong>
		// 			<p>{note}</p>
		// 		</div> */}

		// 		{/* Buttons */}
		// 		<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
		// 			<button
		// 				onClick={() => handleProceedTransaction(false)}
		// 				disabled={isExistingTransaction}
		// 				style={{
		// 					flex: 1,
		// 					marginRight: '10px',
		// 					padding: '10px 20px',
		// 					backgroundColor: '#6c757d',
		// 					color: 'white',
		// 					border: 'none',
		// 					borderRadius: '5px',
		// 					cursor: 'pointer',
		// 				}}
		// 			>
		// 				Park
		// 			</button>
		// 			<button
		// 				onClick={() => handleProceedTransaction(true)}
		// 				style={{
		// 					flex: 1,
		// 					padding: '10px 20px',
		// 					backgroundColor: '#007bff',
		// 					color: 'white',
		// 					border: 'none',
		// 					borderRadius: '5px',
		// 					cursor: 'pointer',
		// 				}}
		// 			>
		// 				Paid
		// 			</button>
		// 		</div>
		// 	</div>
		// </div>
	);
};

export default ConfirmTransaction;
