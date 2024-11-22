import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  active: boolean;
}

const initialState: CounterState = {
  active: true,
};

const genDataSlice = createSlice({
  name: "genData",
  initialState,
  reducers: {
    handleSidebar: (state, action) => {
      state.active = action.payload;
    },
  },
});

export const { handleSidebar } = genDataSlice.actions;

export default genDataSlice.reducer;
