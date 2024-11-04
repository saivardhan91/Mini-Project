import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  info: {
    open: false,
    type: "contact", // Corrected spelling
  },
};

// Create slice
const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Toggle sidebar
    toggleSidebar(state) {
      state.info.open = !state.info.open;
    },
    // Update info type
    updateInfoType(state, action) {
      state.info.type = action.payload.type;
    },
  },
});

// Export reducer
export default slice.reducer;

// Export actions
export const { toggleSidebar, updateInfoType } = slice.actions;

// Action creators
export function ToggleSidebar() {
  return (dispatch) => {
    dispatch(toggleSidebar());
  };
}

export function UpdateInfoType(type) {
  return (dispatch) => {
    dispatch(updateInfoType({ type }));
  };
}
