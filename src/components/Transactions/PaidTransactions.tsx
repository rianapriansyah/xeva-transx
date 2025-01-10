﻿import React from 'react';
import Box from '@mui/material/Box';
import { Button, Paper, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Transaction } from '../../types/interfaceModel';
import RefreshIcon from '@mui/icons-material/Refresh';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

interface PaidTransactionsProps {
  paidTransactions:Transaction[];
	onSelectTransaction: (transaction: Transaction) => void;
}

const PaidTransactions: React.FC<PaidTransactionsProps> = ({ 
  paidTransactions,
	onSelectTransaction
}) => {

	const userRole = useSelector((state: RootState) => state.user.role); // Get the user's role from Redux
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

	return (
		<React.Fragment>
			<Stack direction={"row"}>
			<Typography variant="h5" gutterBottom>
				Transaksi Hari Ini
			</Typography>
			<Button >
				<RefreshIcon/>
			</Button>
			</Stack>
			<Box sx={{
					mb: 2,
					display: "flex",
					flexDirection: "column",
					height: "inherit"
				// justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
				}}>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<StyledTableCell>Nama Pemesan</StyledTableCell>
								<StyledTableCell>Nominal</StyledTableCell>
								<StyledTableCell>Waktu Pesanan</StyledTableCell>
								<StyledTableCell>Yang Melayani</StyledTableCell>
								<StyledTableCell align="center">Aksi</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{paidTransactions.map((transaction) => (
							<StyledTableRow  key={transaction.id}>
								<StyledTableCell>
									{transaction.guestName}
								<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Meja : {transaction.tableNo}</Typography>
								</StyledTableCell>
								<StyledTableCell>
									<NumericFormat value={transaction.totalAmount} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' IDR '}/>
								</StyledTableCell>
								<StyledTableCell>
									{new Date(transaction.createdAt).toLocaleString()}
								</StyledTableCell>
								<StyledTableCell>
									{userRole}
								</StyledTableCell>
								<StyledTableCell align="center">
									<ToggleButtonGroup
									color="primary"
										size='small'
										exclusive
										aria-label="action button"
									>
										<ToggleButton value="down" onClick={() => onSelectTransaction(transaction)}>
											Lihat Detail
										</ToggleButton>       
									</ToggleButtonGroup>
								</StyledTableCell>
							</StyledTableRow >
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</React.Fragment>
	);
};

export default PaidTransactions;