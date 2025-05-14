import api from "../axios";
import { LoginDto, User } from "../utils/types";

const loginQuery = async (data: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
}> => {
  const response = await api.post("/auth/login", {
    ...data,
  });
  return response.data;
};

export { loginQuery };
