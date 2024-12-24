import React, { useEffect, useState } from 'react';
import { createProduct, fetchProducts, fetchCategories, createCategory } from '../../services/api';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { Button, MenuItem } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { ImageListItemBar } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

// import ListSubheader from '@mui/material/ListSubheader';
// import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Collapse from '@mui/material/Collapse';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import DraftsIcon from '@mui/icons-material/Drafts';
// import SendIcon from '@mui/icons-material/Send';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import StarBorder from '@mui/icons-material/StarBorder';

const ProductList: React.FC = () => {
	const [products, setProducts] = useState<any[]>([]);
	const [categories, setCategories] = useState<any[]>([]);
	const [newProduct, setNewProduct] = useState({ name: '', price: '', victual:'', category:''});
	const [newCategory, setNewCategory] = useState({ name: '', description: '', open:false});
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	// const [open, setOpen] = React.useState(true);

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true);
			handleFetchProduct();
			handleFetchCategory();
		};

		loadProducts();
	}, []);

	const handleFetchProduct = async () => {
		try {
			const data = await fetchProducts();
			setProducts(data.data);
		} catch (error) {
			console.error('Error fetching products:', error);
		}
		finally {
			setLoading(false);
		}
	};

	const handleFetchCategory = async () => {
		try {
			const data = await fetchCategories();
			setCategories(data.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
		finally {
			setLoading(false);
		}
	};

	const handleAddProduct = async () => {
		try {
			await createProduct(newProduct);
			setNewProduct({ name: '', price: '', victual:'', category:''});
			handleFetchProduct();
			handleFetchCategory();
		} catch (error) {
			console.error('Error adding product:', error);
		}
	};

	const handleAddCategory = async () => {
		try {
			await createCategory(newCategory);
			setNewCategory({ name: '', description: '', open:false});
			handleFetchCategory();
		} catch (error) {
			console.error('Error adding product:', error);
		}
	};

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
		<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey', borderRadius:"10px" }}>
			<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
				<Grid size={6}>
					<Stack spacing={2}>
						{/* Add new product part */}
						<Typography variant="h4" gutterBottom>
								Products
						</Typography>
						<Typography variant="h6" gutterBottom>
								Create New Product
						</Typography>
						<Stack spacing={2} direction="row">
							<FormControl fullWidth variant="standard" >
							<InputLabel id="victuals-select-label" autoFocus>Victual</InputLabel>
								<Select
									required
									labelId="victuals-select-label"
									id="victuals-select-label"
									value={newProduct.victual}
									onChange={(e: { target: { value: any; }; }) => setNewProduct({ ...newProduct, victual: e.target.value })}
									>
									<MenuItem value="food">Food</MenuItem>
									<MenuItem value="beverage">Beverage</MenuItem>
								</Select>
							</FormControl>
							{/* <FormControl fullWidth variant="standard">
								<InputLabel id="category-select-label" autoFocus>Category</InputLabel>
									<Select
										labelId="category-select-label"
										id="category-select-label"
										value={newProduct.category}
										MenuProps={MenuProps}
										onChange={(e: { target: { value: any; }; }) => setNewProduct({ ...newProduct, category: e.target.value })}
										>
									{categories.map((category) => (
										<MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
									))}
									</Select>
							</FormControl> */}
							<Autocomplete 
								disablePortal
								options={categories.map((cat)=>cat.name)}
								sx={{ width: 500 }}
								onChange={(_e: any, newValue: string) => {
									setNewProduct({ ...newProduct, category: newValue })
								}}
								renderInput={(newProduct) => <TextField {...newProduct} label="Category" variant="standard" required
								/>}
								
							/>
						</Stack>
						<Stack spacing={2} direction="row">
							<TextField
								autoFocus
								required
								margin="dense"
								id="productName"
								name="productName"
								label="Product Name"
								type="text"
								fullWidth
								variant="standard"
								value={newProduct.name}
								onChange={(e: { target: { value: any; }; }) => setNewProduct({ ...newProduct, name: e.target.value })}
							/>
							<TextField
								autoFocus
								required
								margin="dense"
								id="price"
								name="price"
								label="Price"
								type="text"
								fullWidth
								variant="standard"
								value={newProduct.price}
								onChange={(e: { target: { value: any; }; }) => setNewProduct({ ...newProduct, price: e.target.value })}
							/>
						</Stack>
						<Stack spacing={3}>
							<Button onClick={handleAddProduct} variant="contained"
								disabled={newProduct.name==""||newProduct.category==""||newProduct.victual==""||newProduct.price==""}
							>Add New Product</Button>
						</Stack>
						<Stack spacing={2} direction="row"/>
					</Stack>
				</Grid>
				<Grid size={6}>
				<Stack spacing={2}>
						<Typography variant="h4" gutterBottom>
								Category
						</Typography>
						<Typography variant="h6" gutterBottom>
								Create New Category for Product
						</Typography>
						<Stack spacing={2} direction="row">
							<TextField
								autoFocus
								required
								margin="dense"
								id="productName"
								name="productName"
								label="Category Name"
								type="text"
								fullWidth
								variant="standard"
								value={newCategory.name}
								onChange={(e: { target: { value: any; }; }) => setNewCategory({ ...newCategory, name: e.target.value })}
							/>
							<TextField
								autoFocus
								margin="dense"
								id="description"
								name="description"
								label="Description"
								type="text"
								fullWidth
								variant="standard"
								value={newCategory.description}
								onChange={(e: { target: { value: any; }; }) => setNewCategory({ ...newCategory, description: e.target.value })}
							/>
						</Stack>
						<Stack spacing={3}>
							<Button onClick={handleAddCategory} variant="contained">Add New Category</Button>
						</Stack>
					</Stack>
				</Grid>
				<Grid size={6}>
					<Stack spacing={2}>
						<TextField id="outlined-basic" label="Search products..." variant="outlined" onChange={(e) => setSearchQuery(e.target.value)}/>
						<Box sx={{
							mb: 2,
							display: "flex",
							flexDirection: "column",
							height: 500
						}}>
							<ImageList cols={3} rowHeight={164}>
							{products.filter((product) =>
										product.name.toLowerCase().includes(searchQuery.toLowerCase())
									).map((product) => (
									<ImageListItem key={product.id}>
										<ImageButton focusRipple>
											<ImageBackdrop className="MuiImageBackdrop-root" />
											<Image onClick={() => alert(product)}>
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
				</Grid>
				<Grid size={6}>
				</Grid>
      </Grid>			
		</Box>
	);
};

export default ProductList;
