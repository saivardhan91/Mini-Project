import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app"; // Correct path to your app slice

// Persistence Configuration
const rootPersistConfig = {
    key: 'root', // Root key for persistence
    storage,     // Using local storage
    keyPrefix: 'redux-', // Optional prefix for storage keys
};

// Combine all reducers
const rootReducer = combineReducers({
    app: appReducer, // Adding app reducer
});

export { rootPersistConfig, rootReducer };
