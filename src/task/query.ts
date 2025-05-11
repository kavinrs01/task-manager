import api from "../axios";
import { Task, UpdateSortOrderDto } from "../utils/types";

const updateSortOderQuery = async (data: UpdateSortOrderDto) => {
  const response = await api.patch<Task>("/tasks/sort-order", {
    ...data,
  });
  return response.data;
};

export { updateSortOderQuery };
