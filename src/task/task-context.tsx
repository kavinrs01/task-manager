import { unionBy } from "lodash";
import React, { createContext, useContext, useState } from "react";
import { Task, TaskContextType } from "../utils/types";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasksState] = useState<Task[]>([]);

  const setTasks = (newTasks: Task[]) => {
    setTasksState(newTasks);
  };

  const addTasks = (tasks: Task[]) => {
    setTasksState((prev) => unionBy(prev, tasks, "id"));
  };

  const updateTask = (updatedTask: Task) => {
    setTasksState((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTasks, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
