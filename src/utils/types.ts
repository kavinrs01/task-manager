import { Dayjs } from "dayjs";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  sortOrder: number;
  assignedToUser: Partial<User>;
  assignedToUserId: string;
  createdByUser: Partial<User>;
  createdByUserId: string;
  isArchived: boolean;
  isPrivate: boolean;
}

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTasks: (tasks: Task[]) => void;
  updateTask: (updatedTask: Task) => void;
  filter: TaskFilterDto;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilterDto>>;
  setTaskToEdit: React.Dispatch<React.SetStateAction<Task | null>>;
  taskToEdit: Task | null;
  setIsModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isModelVisible: boolean;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  expandedTask: Task | null;
  setExpandedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

type TaskFilterDto = {
  priority?: TaskPriority;
  dueDate?: {
    gte?: string;
    lte?: string;
  };
};

interface CreateTaskDto {
  title: string;
  assignedToUserId: string;
  description?: string;
  dueDate: string | Dayjs;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortOrder?: number;
  isPrivate: boolean;
}

interface UpdateSortOrderDto {
  activeTaskId: string;
  overTaskId?: string;
  columnLastTaskId?: string;
  newStatus: TaskStatus;
}
interface TaskListArgs {
  take?: number;
  cursor?: string;
  filter?: TaskFilterDto;
}
interface TaskArgsFormattedDto {
  "filter.priority"?: TaskPriority;
  "filter.dueDate.gte"?: string;
  "filter.dueDate.lte"?: string;
  "filter.status"?: TaskStatus;
  take?: number;
  cursor?: string;
}

interface LoginDto {
  email: string;
  password: string;
}
type UpdateTaskDto = Partial<CreateTaskDto>;

export { Role, TaskPriority, TaskStatus };
export type {
  CreateTaskDto,
  TaskFilterDto,
  Task,
  TaskContextType,
  UpdateSortOrderDto,
  UpdateTaskDto,
  User,
  TaskArgsFormattedDto,
  TaskListArgs,
  LoginDto,
};
