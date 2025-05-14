import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../utils/types";

const initialState: User | null = null;

const currentUserSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    removeCurrentUser: () => {
      return null;
    },
    updateCurrentUser: (state: User | null, action: PayloadAction<User>) => {
      return state
        ? Object.assign(state, action.payload)
        : Object.assign(action.payload);
    },
  },
});

const currentUserActions = currentUserSlice.actions;
const currentUserReducer = currentUserSlice.reducer;
export { currentUserActions, currentUserReducer };
