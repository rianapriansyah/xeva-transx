import React, { useEffect, useState } from 'react';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, styled, Typography } from '@mui/material';
import { axisClasses, BarChart, LineChart } from '@mui/x-charts';
import Grid from '@mui/material/Grid2'
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { fetchDashboardData, fetchIncome, fetchProductsSoldData } from '../../services';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SavingsIcon from '@mui/icons-material/Savings';
import FunctionsIcon from '@mui/icons-material/Functions';

const Dashboard: React.FC = () => {
	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
	const [dashboardData, setData] = useState<any>([]);
	const [incomeData, setIncomeData] = useState([]);
	const [productsSoldData, setProductSoldData] = useState([]);
	
	const fetchSummaryData = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
    const response = await fetchDashboardData(storeId, filter, startDate, endDate);
		const dashboardDataArray = mainInfo.map((info) => ({
			...info,
			value: response.data ? response.data[info.metric] || 0 : 0 // Update value from dashboardData
		}));

		setData(dashboardDataArray);
	};

	const fetchIncomeData = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
    const response = await fetchIncome(storeId, filter, startDate, endDate);
		setIncomeData(response.data);
	};

	const fetchProductsSold = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
    const response = await fetchProductsSoldData(storeId, filter, startDate, endDate);
		console.log(response.data);
		setProductSoldData(response.data);
	};
	
	useEffect(() => {
		fetchSummaryData(selectedStore?.id, '');
		fetchIncomeData(selectedStore?.id, 'thismonth')
		fetchProductsSold(selectedStore?.id, '')
		// fetchTransactionData();
	}, [selectedStore]);

	const xAxisData = incomeData.map((point:any) => new Date(point.date).getDate()); // Extract dates
	const seriesData = incomeData.map((point:any) => point.totalIncome); // Extract total income

	const mainInfo  = [
		{
			title: 'Total Transaksi',
			metric: "totalTransactions",
			value:0,
			icon : <ShoppingCartIcon />
		},
		{
			title: 'Pemasukkan',
			metric: "totalIncome",
			value:0,
			icon : <SavingsIcon />
		},
		{
			title: 'Penjualan Rata-rata',
			metric: "averageSalePerTransaction",
			value:0,
			icon : <FunctionsIcon />
		}
	];

const chartSetting = {
  yAxis: [
    {
      label: 'Terjual',
    },
  ],
  series: [{ dataKey: 'quantitySold', label: 'Main Dish terjual' }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

	return (
		<Grid>
			<Box sx={{borderRadius:"10px", mb: 2, display: "flex", flexDirection: "column",height: "inherit"
				// justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
				}}>
					
				<Typography variant="h6" gutterBottom>
					Dashboard
				</Typography>
				<List sx={{ bgcolor: 'background.paper' }}>
				{dashboardData.map((data: any) => (
					<ListItem
						key={data.metric}
						secondaryAction={<React.Fragment>
							<Typography variant="button" gutterBottom>
								{`IDR ${data.value.toLocaleString("id-ID")}`}
							</Typography>
						</React.Fragment>}
					>
						<ListItemAvatar>
							<Avatar>
								{data.icon}
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={data.title} />
					</ListItem>
				))}
				</List>
			</Box>
			<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey', borderRadius:"10px" }}>
				<Grid container rowSpacing={1} spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 1, md: 12 }}>
				<Typography variant="h5" gutterBottom>
					Pendapatan
				</Typography>
				<LineChart 
						margin={{
								left: 70,
								right: 10,
							}}
						grid={{ vertical: true, horizontal: true }}

					xAxis={[{ data: xAxisData, scaleType: 'point', label:'tanggal' }]}
					series={[{ data: seriesData }]}
					height={300}
				/>
				</Grid>
				<BarChart
					dataset={productsSoldData}
					xAxis={[{ scaleType: 'band', dataKey: 'productName', tickPlacement:"middle", tickInterval:'auto' }]}
					{...chartSetting}
				/>
			</Box>
			<Offset />			
		</Grid>
	);
};

export default Dashboard;
