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
}

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTasks: (tasks: Task[]) => void;
  updateTask: (updatedTask: Task) => void;
  filter: FilterInput;
  setFilter: React.Dispatch<React.SetStateAction<FilterInput>>;
  setTaskToEdit: React.Dispatch<React.SetStateAction<Task | null>>;
  taskToEdit: Task | null;
  setIsModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isModelVisible: boolean;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  expandedTask: Task | null;
  setExpandedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

type FilterInput = {
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
}

interface UpdateSortOrderDto {
  activeTaskId: string;
  overTaskId?: string;
  columnLastTaskId?: string;
  newStatus: TaskStatus;
}

type UpdateTaskDto = Partial<CreateTaskDto>;

export { Role, TaskPriority, TaskStatus };
export type {
  CreateTaskDto,
  FilterInput,
  Task,
  TaskContextType,
  UpdateSortOrderDto,
  UpdateTaskDto,
  User,
};
