import { unionBy } from "lodash";
import api from "../axios";
import {
  CreateTaskDto,
  Task,
  TaskArgsFormattedDto,
  UpdateSortOrderDto,
  UpdateTaskDto,
  User,
} from "../utils/types";

const updateSortOderQuery = async (data: UpdateSortOrderDto) => {
  const response = await api.patch<Task>("/tasks/sort-order", {
    ...data,
  });
  return response.data;
};
const listTasksQuery = async (params: TaskArgsFormattedDto) => {
  const response = await api.get<Task[]>("/tasks/list", {
    params,
  });
  return response.data;
};

const deleteTaskQuery = async (id: string) => {
  const response = await api.delete<Task>(`/tasks/${id}`);
  return response.data;
};

const editTaskQuery = async (data: UpdateTaskDto, id: string) => {
  const response = await api.put<Task>(`/tasks/${id}`, {
    ...data,
  });
  return response.data;
};

const createTaskQuery = async (data: CreateTaskDto) => {
  const response = await api.post("/tasks/create", {
    ...data,
  });
  return response.data;
};

const getTeamMembersQuery = async (currentUser?: User) => {
  const response = await api.get("/auth/team-members");
  if (!currentUser) return response.data;
  return unionBy([currentUser], response.data, "id");
};

export {
  deleteTaskQuery,
  listTasksQuery,
  updateSortOderQuery,
  editTaskQuery,
  createTaskQuery,getTeamMembersQuery
};
