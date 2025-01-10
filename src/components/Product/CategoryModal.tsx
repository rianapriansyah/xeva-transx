import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Actions, Category } from '../../types/interfaceModel';


interface CategoryModalProps {
	category:Category;
	isModalOpen: boolean;
	action: Actions;
	onCloseModal: () => void;
	onSaveCategory: (category: Category) => void; // Callback for saving the category
	onDeleteCategory: (category: Category) => void; // Callback for saving the category
}

const CategoryModal: React.FC<CategoryModalProps> = ({
	category,
	isModalOpen,
	action,
	onCloseModal,
	onSaveCategory,
	onDeleteCategory
}) => {

  const [localCategory, setLocalCategory] = useState<Category>(category); // Local state for the note

	useEffect(() => {
		setLocalCategory(category); // Update localCategory when the modal opens
	}, [category]);

	const handleAction = async () => {
		setLocalCategory(localCategory);

		if(action==Actions.Delete){
			onDeleteCategory(localCategory); // Call the save function passed from the parent
		}else{
			onSaveCategory(localCategory); // Call the save function passed from the parent
		}		
	};

return (
    <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
        <DialogTitle>{`${action.toString()} Kategori`}</DialogTitle>
        <DialogContent>
				<Stack spacing={2}>
				<Stack spacing={2} direction="row">
						<TextField
							disabled={action==Actions.Delete}
							autoFocus
							required
							margin="dense"
							id="categoryName"
							name="categoryName"
							label="Nama Kategori"
							type="text"
							fullWidth
							variant="standard"
							value={localCategory.name}
							onChange={(e: { target: { value: any; }; }) => setLocalCategory({ ...localCategory, name: e.target.value })}
						/>
						<TextField
							disabled={action==Actions.Delete}
							autoFocus
							required
							margin="dense"
							id="price"
							name="categoryDescription"
							label="Deskripsi"
							type="text"
							fullWidth
							variant="standard"
							value={localCategory.description}
							onChange={(e: { target: { value: any; }; }) => setLocalCategory({ ...localCategory, description: e.target.value })}
						/>
					</Stack>
				</Stack>
        </DialogContent>
        <DialogActions>
				<Button onClick={onCloseModal}>Batal</Button>
				<Button onClick={()=>handleAction()}>{`${action.toString()} Kategori`}</Button>
        </DialogActions>
    </Dialog>
	);
};

export default CategoryModal;
