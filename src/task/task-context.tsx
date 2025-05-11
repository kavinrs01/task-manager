import { unionBy } from "lodash";
import React, { createContext, useCallback, useContext, useState } from "react";
import { FilterInput, Task, TaskContextType } from "../utils/types";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModelVisible, setIsModelVisible] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterInput>({});

  const setTasks = useCallback((newTasks: Task[]) => {
    setTasksState(newTasks);
  }, []);

  const addTasks = useCallback((tasks: Task[]) => {
    setTasksState((prev) => unionBy(prev, tasks, "id"));
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasksState((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        addTasks,
        updateTask,
        filter,
        setFilter,
        taskToEdit,
        setTaskToEdit,
        isModelVisible,
        setIsModelVisible,
        isExpanded,
        setIsExpanded,
        expandedTask,
        setExpandedTask,
      }}
    >
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
