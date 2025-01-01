import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Store {
    id: number;
    name: string;
}

interface StoreState {
    selectedStore: Store | null;
}

const initialState: StoreState = {
    selectedStore: null,
};

const storeSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        setSelectedStore: (state, action: PayloadAction<Store>) => {
            state.selectedStore = action.payload;
        },
    },
});

export const { setSelectedStore } = storeSlice.actions;

export default storeSlice.reducer;
