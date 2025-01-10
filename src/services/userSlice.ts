import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: number;
    name: string;
    role: string; // Role of the user
}

const initialState: UserState = {
    id: 1,
    name: 'John Doe',
    role: 'cashier', // Default role
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserRole(state, action: PayloadAction<string>) {
            state.role = action.payload; // Update the user's role
        },
        setUser(_state, action: PayloadAction<UserState>) {
            return action.payload; // Replace the entire user state
        },
    },
});

export const { setUserRole, setUser } = userSlice.actions;
export default userSlice.reducer;
