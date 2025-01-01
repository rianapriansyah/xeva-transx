import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { setSelectedStore } from '../../services/storeSlice';
import { MenuList } from '@mui/material';

const availableStores = [{id:1, name:"Xeva"},{id:2, name:"Omanya"}];

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const handleStoreSelect = (store: typeof availableStores[0]) => {
      handleClose();
      dispatch(setSelectedStore(store));
  };
  
  return (
    <React.Fragment>
      <Button 
        onClick={handleClick}
        >
          Select Store
        </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        slotProps={{
          paper: {
            style: {
              maxHeight: 48 * 5,
              width: '20ch',
            },
          },
        }}
      >
        {availableStores.map((store)=>(
          <MenuList key={store.id}>
            <MenuItem onClick={()=>handleStoreSelect(store)}>{store.name}</MenuItem>
          </MenuList >
        ))}
      </Menu>
    </React.Fragment>
  );
}