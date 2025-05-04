import { configureStore } from "@reduxjs/toolkit";
import { currentUserReducer } from "./slice";
const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
  },
});
type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = AppStore["dispatch"];
export { store };
export type { AppDispatch, AppStore, RootState };
