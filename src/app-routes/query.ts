import api from "../axios";
import { User } from "../utils/types";

const getMeQuery = async():Promise<User> => {
  const response = await api.get("/auth/me")
  return response.data
};

export { getMeQuery };