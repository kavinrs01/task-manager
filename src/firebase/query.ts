import api from "../axios";
import { Task } from "../utils/types";

const getSubscribedTask = async (id: string) => {
  const response = await api.get<Task | null>(`/tasks/getSubscribedTask/${id}`);
  return response.data;
};

export { getSubscribedTask };
