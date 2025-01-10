import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Actions, Transaction } from '../../types/interfaceModel';
import { NumericFormat } from 'react-number-format';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


interface TransactionDetailModalProps {
	transaction:Transaction;
	isModalOpen: boolean;
	action: Actions;
	onCloseModal: () => void;
	// onSaveCategory: (category: Category) => void; // Callback for saving the category
	// onDeleteCategory: (category: Category) => void; // Callback for saving the category
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
	transaction,
	isModalOpen,
	action,
	onCloseModal,
	// onSaveCategory,
	// onDeleteCategory
}) => {

  const [localTransaction, setLocalTransaction] = useState<Transaction>(transaction); // Local state for the note

	useEffect(() => {
		setLocalTransaction(transaction); // Update localCategory when the modal opens
	}, [transaction]);

	const handleAction = async () => {
		setLocalTransaction(localTransaction);

		// if(action==Actions.Delete){
		// 	onDeleteCategory(localCategory); // Call the save function passed from the parent
		// }else{
		// 	onSaveCategory(localCategory); // Call the save function passed from the parent
		// }		
	};

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

	const onUpdateQuantity = (productId: number, newQuantity: number) => {
    const updatedTransactionDetails = localTransaction.transactionDetails.map((detail) =>
        detail.id === productId ? { ...detail, quantity: newQuantity } : detail
    ).filter((product) => product.quantity > 0) // Remove products with zero quantity;

    setLocalTransaction({ ...localTransaction, transactionDetails: updatedTransactionDetails });
};

return (
    <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
        <DialogTitle>{`${action.toString()} Detail Transaksi`}</DialogTitle>
        <DialogContent>
				<Stack spacing={2}>
					<Stack>
						<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 13, fontStyle: 'italic' }}>Nomor Meja : {localTransaction.tableNo}</Typography>
						<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 13, fontStyle: 'italic' }}>Nama Tamu : {localTransaction.guestName}</Typography>
					</Stack>
					<Box sx={{
            mb: 2,
            display: "flex",
            flexDirection: "column",
            height: 500
          // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
          }}>
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Product Name</StyledTableCell>
                  <StyledTableCell align="right">Qtx x Price</StyledTableCell>
                  <StyledTableCell align="right">Total Price</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {localTransaction.transactionDetails.map((detail) => (
                <StyledTableRow  key={detail.id}>
                  <StyledTableCell>
                    {detail.productName}
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>food</Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">{detail.quantity} x 
                    <NumericFormat value={detail.price} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' '}/>
                  </StyledTableCell>
                  <StyledTableCell align="right"></StyledTableCell>
                  <StyledTableCell align="center">
                    <ToggleButtonGroup
                    color="primary"
                      size='small'
                      exclusive
                      aria-label="action button"
                    >
                      <ToggleButton value="up" onClick={() => onUpdateQuantity(detail.id, detail.quantity + 1)}>
                        <ArrowCircleUpIcon />
                      </ToggleButton>
                      <ToggleButton value="down" onClick={() => onUpdateQuantity(detail.id, detail.quantity - 1)}>
                        <ArrowCircleDownIcon />
                      </ToggleButton>                      
                      <ToggleButton value="delete" onClick={() => onUpdateQuantity(detail.id, detail.quantity = 0)}>
                        <DeleteOutlineIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </StyledTableCell>
                </StyledTableRow >
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
				</Stack>
        </DialogContent>
        <DialogActions>
				<Button onClick={onCloseModal}>Batal</Button>
				<Button onClick={()=>handleAction()}>{`${action.toString()} Detail Transaksi`}</Button>
        </DialogActions>
    </Dialog>
	);
};

export default TransactionDetailModal;
