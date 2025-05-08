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

export type { Task, User };
export { Role, TaskStatus, TaskPriority };
export interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTasks: (tasks: Task[]) => void;
  updateTask: (updatedTask: Task) => void;
}