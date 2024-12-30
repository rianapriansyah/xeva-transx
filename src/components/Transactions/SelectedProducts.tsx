import React, { useState } from 'react';
import ConfirmTransaction from './ConfirmTransaction';
import { createTransaction, updateTransaction } from '../../services/api';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TextField, ToggleButtonGroup, ToggleButton, tableCellClasses, TableHead, SpeedDial, SpeedDialAction, SpeedDialIcon, Snackbar } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PrinterService from '../../services/printerService';
import { styled } from '@mui/material/styles';
import PercentIcon from '@mui/icons-material/Percent';
import Typography from '@mui/material/Typography';
import PrintIcon from '@mui/icons-material/Print';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { NumericFormat } from 'react-number-format';
import NoteModal from './NoteModal';
import SaveIcon from '@mui/icons-material/Save';
import DiscountModal from './DiscountModal';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

interface ParkedTransaction {
  id: number;
  tableNo:string
  guestName:string
  paid: boolean;
  totalAmount: number;
  paymentMethodId: number;
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
  onCancelOrder: () => void;
  onUpdateTransactionNote: (note: string) => void; // Add a handler for transaction note
  note: string; // The transaction note state
  paymentMethods:any
}

const SelectedProducts: React.FC<SelectedProductsProps> = ({
  products,
  selectedTransaction,
  onUpdateQuantity,
  onCancelOrder,
  onUpdateTransactionNote,
  paymentMethods,
  note
}) => {

  const printerService = new PrinterService();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isNoteModalOpen, setIsModalNoteOpen] = useState(false); // Modal state
  const [isDiscModalOpen, setIsDiscModalOpen] = useState(false); // Modal state
  const [tableNo, setTableNo] = useState(selectedTransaction?.tableNo || ""); // Default from transaction
  const [guestName, setGuestName] = useState(selectedTransaction?.guestName || ""); // Default from transaction
  const [paymentMethodId, setPaymentMethod] = useState(selectedTransaction?.paymentMethodId || 1); // Selected payment method
  const [discount, setDiscount] = useState(""); // Modal state
  const [postMessage, setPostMessage] = useState(""); // Modal state
  

  const handlePrint = async () => {
    try {
        await printerService.connect();

        const details = {
            shopName: 'Xeva Coffee',
            guestName: "Rian",
            selectedProducts: products.map((detail:any) => ({
              name: detail.name,   // Assuming 'productName' exists in the transaction details
              quantity: detail.quantity, // Quantity of the product
              price: detail.price, // Price of the product
              total: detail.price * detail.quantity
            })),

            cashierName: 'chaotic_noobz'
        };
        await printerService.printReceipt(details);
        alert('Receipt printed successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to print the receipt.');
    }
};

  const onClearProductsAndTransactions = () => {
    onCancelOrder();
    setGuestName("");
    setTableNo("");
    onUpdateTransactionNote("")
    setDiscount("");
  };

  const getGrandTotal = (products:any) => {
    const totalAmount = products.reduce((sum: number, product: { price: number; quantity: number; }) => sum + product.price * product.quantity, 0).toFixed(2);

    const intDisc = Number(discount);
    const discountPrice = (intDisc * totalAmount)/100
    const grandTotalAmount = totalAmount - discountPrice

    return grandTotalAmount;
  };

  const getTotalPerProduct = (price:number, qty:number) => {
    return price * qty;
  };

  const triggerSnack = (msg:string) => {
    setPostMessage(msg);
    openSnackNotification();
  };

  const handleProceedTransaction = async (paid: boolean) => {
    debugger;
    const totalAmount = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const grandTotalAmount = getGrandTotal(products);

    const basePayload = {
      tableNo,
      guestName,
      userId: 1,
      paymentMethodId,
      totalAmount,
      paid,
      note,
      discount,
      grandTotalAmount,
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
          discount,
          grandTotalAmount,
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
        triggerSnack('Transaction successfully updated!');
      } else {
        // Create new transaction
        response = await createTransaction(transactionPayload);
        triggerSnack('Transaction successfully submitted!');
      }

      console.log('Transaction Response:', response.data);
      setIsModalOpen(false);
      onClearProductsAndTransactions();
      setTableNo('');
      setGuestName('');
      setPaymentMethod(1);
    } catch (error) {
      console.error('Error saving transaction:', error);
      triggerSnack('Failed to save transaction. Please try again.');
    }
    finally{
      handlePrint();
    }
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

  const isExistingTransaction = selectedTransaction !== null;

  const isTransactionCompleted = products.length !== 0 && (tableNo!==""&& guestName!=="");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseSnack = () => setOpenSnack(false);

  const actions = [
    { icon: <PrintIcon />, name: 'Print', action:"Print" },
    { icon: <EditNoteIcon />, name: 'Note', action:"Note" },
    { icon: <PercentIcon />, name: 'Disc' , action:"Disc" },
    { icon: <SaveIcon />, name: 'Save as unpaid', action:"Save"  },
    { icon: <DeleteSweepIcon />, name: 'Cancel Order',action:"Cancel"  },
  ];

  const handleActions = (param:string) => {
    switch(param) {
      case 'Print':
        return 'Print';
      case 'Note':
        return setIsModalNoteOpen(true);
      case 'Disc':
        return setIsDiscModalOpen(true);;
      case 'Save':
        return handleProceedTransaction(false);;
      case 'Cancel':
        return onClearProductsAndTransactions();
    }
  };

  const [openSnack, setOpenSnack] = React.useState(false);

  const openSnackNotification = () => {
    setOpenSnack(true);
  };


  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pesanan Baru
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="tableNo"
            name="tableNo"
            label="Table No:"
            type="text"
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
            label="Guest Name:"
            type="text"
            variant="standard"
            value={guestName}
            disabled={isExistingTransaction}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </Stack>
        <Box sx={{
            mb: 2,
            display: "flex",
            flexDirection: "column",
            height: 400
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
              {products.map((product) => (
                <StyledTableRow  key={product.id}>
                  <StyledTableCell>{product.name}</StyledTableCell>
                  <StyledTableCell align="right">{product.quantity} x 
                    <NumericFormat value={product.price} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' '}/>
                  </StyledTableCell>
                  <StyledTableCell align="right"><NumericFormat value={getTotalPerProduct(product.price, product.quantity)} displayType="text" thousandSeparator="." decimalSeparator="," prefix={'IDR '}/></StyledTableCell>
                  <StyledTableCell align="center">
                    <ToggleButtonGroup
                      size='small'
                      exclusive
                      //onChange={handleAlignment}
                      aria-label="text alignment"
                    >
                      <ToggleButton value="left" aria-label="left aligned" onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}>
                        <ArrowCircleDownIcon />
                      </ToggleButton>
                      <ToggleButton value="center" aria-label="centered" onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}>
                      <ArrowCircleUpIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </StyledTableCell>
                </StyledTableRow >
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Disc % : {discount}
          </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Total Items :{' '}
          {products.reduce((sum, product) => sum + product.quantity, 0)}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Note : {note}</Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Cashier : chaotic_noobz</Typography>
        <Stack direction="row" spacing={2} >
          <SpeedDial
            sx={{position:"right"}}
            ariaLabel="SpeedDial tooltip example"
            icon={<SpeedDialIcon  />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction='right'
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {handleClose;handleActions(action.action);}}
                tooltipPlacement='top'
              />
            ))}
          </SpeedDial>
          {/* <Button
            variant="outlined"
            color="primary"
            disabled={!isTransactionCompleted}
            onClick={() => {onClearProductsAndTransactions();}}
            startIcon={<PrintIcon />}
            sx={{textTransform:'none'}}
            >
            Print
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={products.length === 0}
            onClick={() => {setIsModalNoteOpen(true);}}
            startIcon={<EditNoteIcon />}
            sx={{textTransform:'none'}}
            >
            Note
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={products.length === 0}
            onClick={() => {setIsDiscModalOpen(true);}}
            startIcon={<PercentIcon />}
            sx={{textTransform:'none'}}
            >
            Disc
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={!isTransactionCompleted}
            onClick={() => {handleProceedTransaction(false);}}
            startIcon={<SaveIcon />}
            sx={{textTransform:'none'}}
            >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={products.length === 0}
            onClick={() => {onClearProductsAndTransactions();}}
            startIcon={<ClearAllIcon />}
            sx={{textTransform:'none'}}
            >
            Cancel
          </Button> */}
        </Stack>
        <Button
          size='large'
          variant="contained"
          color="success"
          disabled={!isTransactionCompleted}
          onClick={() => { setIsModalOpen(true);}}
          startIcon={<ShoppingCartCheckoutIcon />}>
              <NumericFormat value={getGrandTotal(products)} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' IDR '}/>
          </Button>
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

      <NoteModal
        isModalOpen={isNoteModalOpen}
        note={note}
        onCloseModal={() => setIsModalNoteOpen(false)} // Close modal handler
        onSaveNote={(updatedNote) => {
          onUpdateTransactionNote(updatedNote); // Update the note in the parent component's state
      }}
      />

      <DiscountModal
        isModalOpen={isDiscModalOpen}
        discount={discount}
        onCloseModal={() => setIsDiscModalOpen(false)} // Close modal handler
        onSaveDiscount={(updatedDiscount) => {
          setDiscount(updatedDiscount); // Update the note in the parent component's state
        }}
      />

      <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{vertical: 'top', horizontal: 'center' }}
        open={openSnack}
        onClose={handleCloseSnack}
        message={postMessage}
      />
    </Box>
  );
};

export default SelectedProducts;
