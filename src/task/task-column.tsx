import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRequest } from "ahooks";
import { Typography } from "antd";
import { capitalize, isNil } from "lodash";
import { DateTime } from "luxon";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import api from "../axios";
import { getStatusInfo } from "../utils/components";
import { FilterInput, Task, TaskStatus } from "../utils/types";
import { TaskLoadingCard } from "./loading-card";
import { SortableTaskCard } from "./task-card";
import { useTasks } from "./task-context";
const { Title } = Typography;
const DroppableColumn: React.FC<{
  status: TaskStatus;
  tasks: Task[];
  filter: FilterInput;
}> = React.memo(({ status, tasks, filter }) => {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  const { data, loading, runAsync } = useRequest(
    async (params: Record<string, any>) => {
      const response = await api.get<Task[]>("/tasks/list", {
        params,
      });
      return response.data;
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      const parsedFilter: Record<string, string | null> = {};
      if (filter?.priority) {
        parsedFilter["filter.priority"] = filter.priority;
      }

      if (filter?.dueDate) {
        if (filter.dueDate.gte && !isNil(filter.dueDate.gte)) {
          parsedFilter["filter.dueDate.gte"] = DateTime.fromISO(
            filter.dueDate.gte
          ).toISO();
        }
        if (filter.dueDate.lte && !isNil(filter.dueDate.lte)) {
          parsedFilter["filter.dueDate.lte"] = DateTime.fromISO(
            filter.dueDate.lte
          ).toISO();
        }
      }

      parsedFilter["filter.status"] = status;

      await runAsync(parsedFilter);
    };
    fetchData();
  }, [filter, status, runAsync]);
  const { addTasks } = useTasks();

  useEffect(() => {
    if (data && data?.length) {
      addTasks(data);
    }
  }, [addTasks, data]);

  const [highlighted, setHighlighted] = useState<boolean>(false);

  useEffect(() => {
    if (isOver) {
      setHighlighted(true);
      const timer = setTimeout(() => setHighlighted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOver]);

  const { icon, className } = getStatusInfo(status);

  return (
    <AnimatePresence>
      <SortableContext
        key={status}
        id={status}
        items={tasks?.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div
          ref={setNodeRef}
          id={status}
          className={`rounded-xl p-4 pb-[300px] shadow-md h-full min-h-[300px] border border-gray-200 transition-colors duration-200 ${
            highlighted ? "bg-blue-100 border-blue-300" : "bg-gray-100"
          }`}
          animate={{
            backgroundColor: isOver
              ? "rgba(191, 219, 254, 0.3)"
              : "rgba(247, 250, 252, 1)",
            borderColor: isOver ? "#93c5fd" : "#e5e7eb",
          }}
        >
          <div
            className={`flex items-center mb-4  font-semibold text-lg border-b border-gray-300 pb-2 gap-2 ${className}`}
          >
            {icon}
            <p>{capitalize(status).replace("_", " ")}</p>
          </div>
          {loading &&
            Array(3)
              .fill(0)
              .map((_, i) => <TaskLoadingCard key={i} />)}
          {tasks?.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </motion.div>
      </SortableContext>
    </AnimatePresence>
  );
});

export { DroppableColumn };
