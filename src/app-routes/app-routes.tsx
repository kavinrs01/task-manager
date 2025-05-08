import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppLayout } from "../app-layout/app-layout";
import { AppLoader } from "../app-loader/app-loader";
import Login from "../auth/login";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
} from "../auth/tokenService";
import api from "../axios";
import { currentUserActions, useAppDispatch, useAppSelector } from "../store";
import { TaskBoardView } from "../task";
import { TaskProvider } from "../task/task-context";
import { User } from "../utils/types";
import { PrivateRoute } from "./private-route";
import { PublicRoute } from "./public-route";

const AppRouter: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector<User | null>((state) => state.currentUser);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = useMemo(() => !!currentUser?.id, [currentUser]);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setIsInitialized(true);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        const user = response.data;
        dispatch(currentUserActions.updateCurrentUser(user));
      } catch (err) {
        removeAccessToken();
        removeRefreshToken();
        dispatch(currentUserActions.removeCurrentUser());
        navigate("/login");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch, navigate]);

  if (!isInitialized) return <AppLoader />;

  return (
    <Routes>
      <Route
        path="/app"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/app/home" replace />} />
        <Route
          path="/app/home"
          element={
            <TaskProvider>
              {" "}
              <TaskBoardView />
            </TaskProvider>
          }
        />
      </Route>

      <Route
        path="/login"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/app/home" : "/login"} />}
      />
    </Routes>
  );
};

export { AppRouter };
