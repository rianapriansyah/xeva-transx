import { Button, ButtonBase, Chip, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem, List, Stack, TextField, Typography, styled  } from '@mui/material';
import React, { useState } from 'react';

interface DiscountProps {
	discount: string;
	isModalOpen: boolean;
	onCloseModal: () => void;
	onSaveDiscount: (discount: string) => void; // Callback for saving the note
}

const DiscountModal: React.FC<DiscountProps> = ({
	discount,
	isModalOpen,
	onCloseModal,
	onSaveDiscount
}) => {

	const [localDiscount, setDiscount] = useState(discount); // Local state for the note

	const handleSave = () => {
		onSaveDiscount(localDiscount); // Call the callback with the updated note
		onCloseModal(); // Close the modal
	};

	const ImageButton = styled(ButtonBase)(({ theme }) => ({
		position: 'relative',
		height: 100,
		[theme.breakpoints.down('sm')]: {
			width: '100% !important', // Overrides inline-style
			height: 100,
		},
		'&.Mui-focusVisible': {
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
		left: 1,
		right: 1,
		top: 3,
		bottom: 3,
		borderRadius:2,
		backgroundColor: theme.palette.common.black,
		opacity: 0.4,
		transition: theme.transitions.create('opacity'),
	}));

	const groupOfNumbers = [
		{label:"first", numbers:["1","2","3"]},
		{label:"second", numbers:["4","5","6"]},
		{label:"third", numbers:["7","8","9"]},
		{label:"last", numbers:["*", "0", "00"]},
	];

	const handleNumberPadClick = (value: string) => {
		if(value==="*" || value==="00"){
			//handleClearCash();
			return;
		}
		setDiscount(
			(prev) => (prev === '' || prev.length>1 ? value : `${prev}${value}`)
		);
	};

return (
		<Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
				<DialogTitle>Diskon</DialogTitle>
				<DialogContent>
				<TextField
					variant="outlined"
					fullWidth
					margin="normal"
					disabled
					autoFocus
					id="disc"
					name="disc"
					label="Diskon"
					type="text"
					value={localDiscount}
					onChange={(e) => setDiscount(e.target.value)}
					/>
					<Stack spacing={1} direction="row">
						<Chip label="5%" onClick={() => setDiscount("5")} color="primary" />
						<Chip label="10%" onClick={() => setDiscount("10")} color="primary"/>
						<Chip label="15%" onClick={() => setDiscount("15")} color="primary"/>
					</Stack>
					<List>
					{groupOfNumbers.map((numbers) => (
						<ImageList cols={3} key={numbers.label}>
							{numbers.numbers.map((number) => (
							<ImageListItem key={number}>
								<ImageButton disabled={number===""}>
									<ImageBackdrop />
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
				</DialogContent>
				<DialogActions>
					<Button onClick={onCloseModal}>Cancel</Button>
					<Button onClick={handleSave}>Tambah</Button>
				</DialogActions>
		</Dialog>
	);
};

export default DiscountModal;
