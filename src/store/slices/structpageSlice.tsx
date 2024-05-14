import { createSlice } from "@reduxjs/toolkit";

let initialState = { count: 0 };

export const slice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) { state.count = state.count + 1; },
    decrement(state) { state.count = state.count - 1; },
    random(state, action) { state.count = action.payload; }
  }
});

export const sliceReducers = slice.actions;