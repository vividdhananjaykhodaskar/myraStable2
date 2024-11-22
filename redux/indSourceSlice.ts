import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  user: { [key: string]: any } | null;
  assistants: any;
  currentAssistant: any;
}

const initialState: CounterState = {
  user: null,
  assistants: [],
  currentAssistant: null,
};

const insDataSlice = createSlice({
  name: "insData",
  initialState,
  reducers: {
    handleUser: (state, action) => {
      state.user = action.payload;
    },
    handleAssistants: (state, action) => {
      state.assistants = action.payload;
    },
    handleCurrentAssistant: (state, action) => {
      state.currentAssistant = action.payload;
    },
  },
});

export const { handleUser, handleAssistants, handleCurrentAssistant } = insDataSlice.actions;

export default insDataSlice.reducer;
