import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    TableFooter,
    Typography,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
		SelectChangeEvent,
		Chip,
		styled,
		ButtonBase,
		ImageList,
		ImageListItem,
		List,
} from '@mui/material';

interface ParkedTransaction {
	id: number;
	tableNo:string
	guestName:string
	paid: boolean;
	totalAmount: number;
	paymentMethodId: number;
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
	paymentMethodId: number;
	onCloseModal: () => void;
	setTableNo: (value: string) => void;
	setGuestName: (value: string) => void;
	handlePaymentMethodChange: (id: number) => void;
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

	const [cashAmount, setCashAmount] = useState<String | ''>(''); // State for cash input
	const groupOfNumbers = [
		{label:"first", numbers:["1","2","3"]},
		{label:"second", numbers:["4","5","6"]},
		{label:"third", numbers:["7","8","9"]},
		{label:"last", numbers:["0", "000", "Clear"]},
	];

	const handlePaymentChange = (event: SelectChangeEvent) => {
			const selectedMethod = Number(event.target.value);
			handlePaymentMethodChange(selectedMethod);
			console.log(selectedMethod);
			console.log(paymentMethods);
			// Reset cash input if payment method is not "Cash"
			if (selectedMethod !== paymentMethodId) {
					setCashAmount('');
			}
	};

	const handleNumberPadClick = (value: string) => {
		if(value==="Clear"){
			handleClearCash();
			return;
		}

		if((value==="000"||value==="0") && cashAmount===""){
			return;
		}

		setCashAmount((prev) => (prev === '' ? value : `${prev}${value}`));
	};

	const handleMoneyChipClick = (value: string) => {
		setCashAmount("");
		setCashAmount((prev) => (prev === '' ? value : `${prev}${value}`));
};

	const handleClearCash = () => {
			setCashAmount('');
	};

	const ImageButton = styled(ButtonBase)(({ theme }) => ({
		position: 'relative',
		height: 70,
		[theme.breakpoints.down('sm')]: {
			width: '100% !important', // Overrides inline-style
			height: 60,
		},
		'&:hover, &.Mui-focusVisible': {
			zIndex: 1,
			'& .MuiImageBackdrop-root': {
				opacity: 0.15,
			},
			'& .MuiImageMarked-root': {
				opacity: 0,
			},
			'& .MuiTypography-root': {
				border: '4px solid currentColor',
			},
		},
	}));

	const Image = styled('span')(({ theme }) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: theme.palette.common.white,
	}));

	const ImageBackdrop = styled('span')(({ theme }) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: theme.palette.common.black,
		opacity: 0.4,
		transition: theme.transitions.create('opacity'),
	}));

	// const connect = async () => {
	// 	try {
	// 		const device = await navigator.bluetooth.requestDevice({
	// 			acceptAllDevices: true,
	// 			optionalServices: ['printer'], // Replace with your printer's service UUID
	// 		});

	// 		const server = await device.gatt?.connect();
	// 		const service = await server?.getPrimaryService('printer'); // Replace with your printer's service UUID
	// 		const characteristic = await service?.getCharacteristic('write'); // Replace with your printer's characteristic UUID

	// 		const encoder = new TextEncoder();
	// 		const recipe = `
	// 				Your Coffee Shop
	// 				----------------
	// 				Item       Qty   Price
	// 				Coffee      1     $3.00
	// 				Total:            $3.00
	// 		`;
	// 		const command = encoder.encode(recipe);

	// 		await characteristic?.writeValue(command);
	// 		alert('Recipe printed successfully!');
	// 		} catch (error) {
	// 			console.error('Error:', error);
	// 			alert('Failed to print recipe. See console for details.');
	// 	}
	// };

	return (
		<Dialog open={isModalOpen} onClose={onCloseModal}>
			<DialogTitle>Confirm Transaction</DialogTitle>
			<DialogContent>
				<Box sx={{ flexGrow: 1 }}>
					<Stack spacing={2}>
						<DialogContentText>Confirm the transaction details below.</DialogContentText>
						<Stack spacing={2} direction="row">
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
										value={selectedTransaction?.tableNo || tableNo}
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
										value={selectedTransaction?.guestName || guestName}
										disabled={isExistingTransaction}
										onChange={(e) => setGuestName(e.target.value)}
								/>
						</Stack>
						<TableContainer component={Paper}>
							<Table aria-label="simple table">
								<TableBody>
									{selectedProducts.map((product) => (
										<TableRow key={product.id}>
											<TableCell component="th" scope="row">{product.name}</TableCell>
											<TableCell>{product.quantity}</TableCell>
											<TableCell>{product.price * product.quantity}</TableCell>
										</TableRow>
									))}
								</TableBody>
								<TableFooter>
									<TableRow>
										<TableCell>Total Item</TableCell>
										<TableCell>
												{selectedProducts.reduce((sum, product) => sum + product.quantity, 0)}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Total Price</TableCell>
										<TableCell>
												{`Rp ${selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)}`}
										</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</TableContainer>
						<Box component="section" sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
							<Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 12, fontStyle: 'italic' }}>
									Note
							</Typography>
							<Typography variant="body2">{note}</Typography>
						</Box>
						<Box>
							<FormControl fullWidth>
								<InputLabel id="payment-method-label" variant="standard">Payment Method</InputLabel>
									<Select
										variant="standard"
										labelId="payment-method-label"
										id="payment-method-select"
										value={String(paymentMethodId)}
										onChange={handlePaymentChange}>
										{paymentMethods.map((method) => (
												<MenuItem key={method.id} value={method.id}>{method.name}</MenuItem>
										))}
								</Select>
							</FormControl>
						</Box>
						{paymentMethodId === 1 && (
						<Box>
							<TextField
									label="Cash Amount"
									variant="outlined"
									fullWidth
									margin="normal"
									value={cashAmount}
									disabled />
							<Stack spacing={1} direction="row">
								<Chip label="20.000" onClick={() => handleMoneyChipClick("20000")} color="success" />
								<Chip label="50.000" onClick={() => handleMoneyChipClick("50000")} color="primary"/>
								<Chip label="100.000" onClick={() => handleMoneyChipClick("100000")} color="error"/>
							</Stack>
							<List>
								{groupOfNumbers.map((numbers) => (
									<ImageList cols={3} key={numbers.label}>
										{numbers.numbers.map((number) => (
										<ImageListItem key={number}>
											<ImageButton focusRipple>
												<ImageBackdrop className="MuiImageBackdrop-root" />
												<Image onClick={() => handleNumberPadClick(number)}>
													<Typography
														component="span"
														variant="subtitle1"
														color="inherit"
														sx={(theme) => ({
															position: 'relative',
															p: 4,
															pt: 2,
															pb: `calc(${theme.spacing(1)} + 6px)`,
														})}
													>
														{number}
													</Typography>
												</Image>
											</ImageButton>
									</ImageListItem>
								))}
									</ImageList>
								))}
							</List>
						</Box>
						)}
					</Stack>
				</Box>
				<DialogActions>
					<Button onClick={onCloseModal}>Cancel</Button>
					<Button onClick={() => handleProceedTransaction(false)} disabled={isExistingTransaction}>Park</Button>
					<Button type="submit" onClick={() => {handleProceedTransaction(true);
						// connect()
						}}>Accept Payment</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmTransaction;
