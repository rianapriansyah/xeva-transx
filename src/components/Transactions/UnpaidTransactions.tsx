import React from 'react';
import Box from '@mui/material/Box';
import { Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Transaction } from '../../types/interfaceModel';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

interface UnpaidTransactionsProps {
  unpaidTransactions:Transaction[];
	onSelectTransaction: (transaction: Transaction) => void;
}

const UnpaidTransactions: React.FC<UnpaidTransactionsProps> = ({ 
  unpaidTransactions,
	onSelectTransaction
}) => {

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
			<Typography variant="h5" gutterBottom>
				Transaksi Belum Terbayar
				<RefreshIcon/>
			</Typography>
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
								<StyledTableCell>Nominal Pesanan</StyledTableCell>
								<StyledTableCell>Waktu Pesanan</StyledTableCell>
								<StyledTableCell>Yang Melayani</StyledTableCell>
								<StyledTableCell align="right">Aksi</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{unpaidTransactions.map((transaction) => (
							<StyledTableRow  key={transaction.id}>
								<StyledTableCell>
									{transaction.guestName}
								<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Meja : {transaction.tableNo}</Typography>
								</StyledTableCell>
								<StyledTableCell>
									{transaction.totalAmount}
								</StyledTableCell>
								<StyledTableCell>
									{transaction.createdAt}
								</StyledTableCell>
								<StyledTableCell>
									{transaction.userId}
								</StyledTableCell>
								<StyledTableCell align="right">
									<ToggleButtonGroup
									color="primary"
										size='small'
										exclusive
										aria-label="action button"
									>
										<ToggleButton value="down" onClick={() => onSelectTransaction(transaction)}>
											Masukkan ke pesanan
										</ToggleButton>                      
										<ToggleButton value="delete" onClick={() => alert(transaction.guestName)}>
											<DeleteOutlineIcon color='error' />
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

export default UnpaidTransactions;
