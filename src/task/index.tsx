import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRequest } from "ahooks";
import { Spin, Typography } from "antd";
import { findIndex, groupBy, last, orderBy, uniqBy } from "lodash";
import { DateTime } from "luxon";
import React, { useCallback, useMemo, useState } from "react";
import { Task, TaskFilterDto, TaskStatus } from "../utils/types";
import { updateSortOderQuery } from "./query";
import "./styles.less";
import { SortableTaskCard } from "./task-card";
import { DroppableColumn } from "./task-column";
import { useTasks } from "./task-context";
import { TaskModal } from "./task-expand-view";
import TaskFilter from "./task-filter";
import { CreateTaskModal } from "./task-form-modal";

const { Title } = Typography;

const TaskBoardView: React.FC = React.memo(() => {
  const { tasks, updateTask, setFilter, setTasks, filter } = useTasks();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [loadingColumn, setLoadingColumn] = useState<TaskStatus>();

  const { loading, runAsync } = useRequest(updateSortOderQuery, {
    manual: true,
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  }, []);

  const groupedAndSortedTasks: Record<TaskStatus, Task[]> = useMemo(() => {
    const filteredTasks = tasks.filter((task) => {
      if (task?.isArchived) return false;
      if (filter?.priority && task.priority !== filter.priority) {
        return false;
      }

      if (filter?.dueDate) {
        const taskDate = DateTime.fromISO(task.dueDate);

        if (
          filter.dueDate.gte &&
          taskDate < DateTime.fromISO(filter.dueDate.gte)
        ) {
          return false;
        }

        if (
          filter.dueDate.lte &&
          taskDate > DateTime.fromISO(filter.dueDate.lte)
        ) {
          return false;
        }
      }

      return true;
    });

    const grouped = groupBy(filteredTasks, "status");

    return Object.values(TaskStatus).reduce((acc, status) => {
      const taskGroup = grouped[status] || [];
      acc[status] = orderBy(uniqBy(taskGroup, "id"), ["sortOrder"], ["desc"]);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks, filter]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTaskId(null);
      if (!over || active.id === over.id) return;

      const activeTask = tasks.find((t) => t.id === active.id);
      if (!activeTask) return;

      const isDroppingOnColumn = Object.keys(TaskStatus).includes(
        over.id as string
      );
      const statusOfDropColumn: TaskStatus | null = isDroppingOnColumn
        ? (over.id as TaskStatus)
        : tasks.find((t) => t.id === over.id)?.status ?? null;

      if (!statusOfDropColumn) return;
      setLoadingColumn(statusOfDropColumn);
      const overTask = tasks.find((t) => t.id === over.id);
      const orderedTasks = orderBy(tasks, ["sortOrder"], ["desc"]);
      console.log(overTask);
      const overIndex = overTask
        ? findIndex(orderedTasks, { id: overTask.id })
        : -1;
      const prevTask = overIndex > 0 ? orderedTasks[overIndex - 1] : null;

      let newSortOrder: number;
      if (prevTask && overTask) {
        // Place between prev and over
        newSortOrder = (prevTask.sortOrder + overTask.sortOrder) / 2;
      } else if (overTask) {
        // Place above overTask
        newSortOrder = overTask.sortOrder + 1;
      } else {
        // No overTask, place at bottom of the column
        const lastInColumn = last(groupedAndSortedTasks[statusOfDropColumn]);
        newSortOrder = (lastInColumn?.sortOrder ?? 0) - 1;
      }

      const updatedTasks = tasks.map((t) => {
        if (t.id === activeTask.id) {
          return {
            ...t,
            ...(activeTask.status === statusOfDropColumn
              ? {}
              : { status: statusOfDropColumn }),
            sortOrder: newSortOrder,
          };
        }
        return t;
      });

      setTasks(updatedTasks);
      const updatedTask = await runAsync({
        activeTaskId: activeTask.id,
        overTaskId: overTask?.id,
        newStatus: statusOfDropColumn,
        columnLastTaskId: isDroppingOnColumn
          ? last(groupedAndSortedTasks[statusOfDropColumn])?.id
          : undefined,
      });

      updateTask(updatedTask);
    },
    [groupedAndSortedTasks, runAsync, setTasks, tasks, updateTask]
  );
  //Notes
  // if not overTask and same status means move to last of the same status ,
  //  if overTask and same status means order changed ,
  // if not overTask  and not status are equal means move to last of other status ,
  //  if overTask and  status  changed means order and status changed

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeTaskId) || null,
    [activeTaskId, tasks]
  );

  const onFilterChange = (filter: TaskFilterDto) => {
    setFilter(filter);
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full">
      <div className="mb-2 flex flex-row justify-between items-center">
        <Title level={3} className="text-gray-800 ">
          Task Board
        </Title>

        <CreateTaskModal />
        <TaskModal />
      </div>
      <TaskFilter onFilterChange={onFilterChange} previousFilter={filter} />
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        autoScroll
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(TaskStatus).map((status) => {
            return (
              <Spin
                spinning={loading && loadingColumn === status}
                key={status}
                wrapperClassName="column-spinner-container h-full min-h-[300px]"
              >
                <DroppableColumn
                  status={status}
                  filter={filter}
                  tasks={groupedAndSortedTasks[status]}
                />
              </Spin>
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
});

export { TaskBoardView };
