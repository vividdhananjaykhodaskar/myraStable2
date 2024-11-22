import { configureStore } from "@reduxjs/toolkit";
import insDataReducer from "./indSourceSlice";
import genDataReducer from "./genSlice";

export const store = configureStore({
  reducer: {
    insdata: insDataReducer,
    gendata: genDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
