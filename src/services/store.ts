import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storeReducer from './storeSlice';
import userReducer from './userSlice'; // Import the user slice

// Combine reducers (if you have multiple reducers, add them here)
const rootReducer = combineReducers({
    store: storeReducer, // Key must match the slice name
    user: userReducer,   // User-specific reducer for roles
});

// Utility function to save state to localStorage
const saveToLocalStorage = (state: RootState) => {
    try {
        localStorage.setItem('reduxState', JSON.stringify(state));
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
};

// Utility function to load state from localStorage
const loadFromLocalStorage = (): Partial<RootState> | undefined => {
    try {
        const serializedState = localStorage.getItem('reduxState');
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
        return undefined;
    }
};

// Load the initial state from localStorage
const preloadedState = loadFromLocalStorage();

// Configure the Redux store
export const store = configureStore({
    reducer: rootReducer, // Use the combined reducer
    preloadedState, // Use the loaded state
});

// Export RootState and AppDispatch types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Subscribe to store changes and save them to localStorage
store.subscribe(() => {
    saveToLocalStorage(store.getState());
});
