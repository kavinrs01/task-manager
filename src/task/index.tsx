import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { Typography } from "antd";
import { useCallback, useMemo, useState } from "react";
import { TaskStatus } from "../utils/types";
import { CreateTaskModal } from "./create-task";
import { SortableTaskCard } from "./task-card";
import { DroppableColumn } from "./task-column";
import { useTasks } from "./task-context";

const { Title } = Typography;

const TaskBoardView: React.FC = () => {
  const { tasks, setTasks } = useTasks();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTaskId(null);

      if (!over || active.id === over.id) return;

      const activeTask = tasks.find((t) => t.id === active.id);
      if (!activeTask) return;

      const isDroppingOnColumn = Object.keys(TaskStatus).includes(
        over.id as string
      );
      const newStatus: TaskStatus | null = isDroppingOnColumn
        ? (over.id as TaskStatus)
        : tasks.find((t) => t.id === over.id)?.status ?? null;

      if (!newStatus) return;

      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex((t) => t.id === active.id);
      const [taskToMove] = updatedTasks.splice(taskIndex, 1);
      taskToMove.status = newStatus;

      const tasksInNewStatus = updatedTasks.filter(
        (t) => t.status === newStatus
      );

      let newSortOrder: number;
      if (isDroppingOnColumn || tasksInNewStatus.length === 0) {
        newSortOrder = tasksInNewStatus.length + 1;
      } else {
        const overIndex = tasksInNewStatus.findIndex((t) => t.id === over.id);
        if (overIndex === 0) {
          newSortOrder = tasksInNewStatus[0].sortOrder / 2;
        } else if (overIndex === -1) {
          const last = tasksInNewStatus[tasksInNewStatus.length - 1];
          newSortOrder = last.sortOrder + 1;
        } else {
          const prev = tasksInNewStatus[overIndex - 1];
          const next = tasksInNewStatus[overIndex];
          newSortOrder = (prev.sortOrder + next.sortOrder) / 2;
        }
      }
      taskToMove.sortOrder = newSortOrder;
      updatedTasks.push(taskToMove);

      const normalizedTasks = Object.values(TaskStatus).flatMap((status) =>
        updatedTasks
          .filter((task) => task.status === status)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((task, index) => ({ ...task, sortOrder: index + 1 }))
      );

      setTasks(normalizedTasks);
    },
    [setTasks, tasks]
  );

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeTaskId) || null,
    [activeTaskId, tasks]
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <div className="mb-6 flex flex-row justify-between items-center">
        <Title level={3} className="text-gray-800 ">
          Task Board
        </Title>
        <CreateTaskModal />
      </div>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(TaskStatus).map((status) => {
            return (
              <DroppableColumn status={status} key={status}></DroppableColumn>
            );
          })}
        </div>
        <DragOverlay>
          {activeTask && (
            <div className="opacity-80 shadow-lg">
              <SortableTaskCard task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export { TaskBoardView };
