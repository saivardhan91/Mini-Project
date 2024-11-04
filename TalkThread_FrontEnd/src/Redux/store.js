import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { rootPersistConfig, rootReducer } from './RootReducer'; // Adjust the import path if needed

// Create persisted reducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// Configure the store
const store = configureStore({
    reducer: persistedReducer,  // Use the persisted reducer
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,  // Disable checks for non-serializable values (important for redux-persist)
            immutableCheck: false,    // Disable immutable state checks
        }),
});

// Setup persistor
const persistor = persistStore(store);

// Custom hooks for dispatch and selector
const { dispatch } = store;
const useSelector = useAppSelector;
const useDispatch = () => useAppDispatch();

// Export store, persistor, and custom hooks
export { store, persistor, dispatch, useDispatch, useSelector };
