import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../services/api';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { ImageListItemBar } from '@mui/material';


interface AvailableProductsProps {
	onAddProduct: (product: any) => void;
}

const AvailableProducts: React.FC<AvailableProductsProps> = ({ onAddProduct }) => {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const newProduct = {
			name: 'Add New Product',
			id:99999
		};

		const loadProducts = async () => {
			setLoading(true);
			try {
				const data = await fetchProducts();
				setProducts(data.data);
				setProducts((products) => [...products, newProduct]);
			} catch (error) {
				console.error('Error fetching products:', error);
			} finally {
				setLoading(false);
			}
		};
		loadProducts();
	}, []);

	if (loading) return <p>Loading...</p>;	

	const ImageButton = styled(ButtonBase)(({ theme }) => ({
		position: 'relative',
		height: 200,
		[theme.breakpoints.down('sm')]: {
			width: '100% !important', // Overrides inline-style
			height: 100,
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
	
	const ImageMarked = styled('span')(({ theme }) => ({
		height: 3,
		width: 18,
		backgroundColor: theme.palette.common.white,
		position: 'absolute',
		bottom: -2,
		left: 'calc(50% - 9px)',
		transition: theme.transitions.create('opacity'),
	}));

	return (
		<Box>
			<Stack spacing={2}>
				<TextField id="outlined-basic" label="Search products..." variant="outlined" onChange={(e) => setSearchQuery(e.target.value)}/>
				<Box sx={{
          mb: 2,
          display: "flex",
          flexDirection: "column",
          height: 500
         // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
        }}>
					<ImageList cols={3} rowHeight={164}>
					{products.filter((product) =>
								product.name.toLowerCase().includes(searchQuery.toLowerCase())
							).map((product) => (
							<ImageListItem key={product.id}>
								<ImageButton focusRipple>
									<ImageBackdrop className="MuiImageBackdrop-root" />
									<Image onClick={() => onAddProduct(product)}>
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
											{product.name}
											<ImageMarked className="MuiImageMarked-root" />
										</Typography>
									</Image>
									<ImageListItemBar subtitle={product.price}/>
								</ImageButton>
							</ImageListItem>
						))}
					</ImageList>	
				</Box>			
			</Stack>
		</Box>
	);
};

export default AvailableProducts;
