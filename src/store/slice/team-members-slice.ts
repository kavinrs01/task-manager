import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { unionBy } from "lodash";
import { User } from "../../utils/types";

const initialState: User[] = [];

const teamMembersSlice = createSlice({
  name: "teamMembers",
  initialState: initialState,
  reducers: {
    updateTeamMembers: (state: User[], action: PayloadAction<User[]>) => {
      return unionBy(action.payload, state, "id");
    },
  },
});

const teamMembersActions = teamMembersSlice.actions;
const teamMembersReducer = teamMembersSlice.reducer;
export { teamMembersActions, teamMembersReducer };
