import { removeAccessToken, removeRefreshToken } from "./tokenService";

export const logout = () => {
  removeAccessToken();
  removeRefreshToken();
  window.location.href = "/login";
};
