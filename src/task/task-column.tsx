import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRequest } from "ahooks";
import { Typography } from "antd";
import { capitalize } from "lodash";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import api from "../axios";
import { Task, TaskStatus } from "../utils/types";
import { TaskLoadingCard } from "./loading-card";
import { SortableTaskCard } from "./task-card";
import { useTasks } from "./task-context";
const { Title } = Typography;
const DroppableColumn: React.FC<{
  status: TaskStatus;
}> = ({ status }) => {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  const { data, error, loading, run } = useRequest(
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
    run({
      "filter.status": status,
    });
  }, [run, status]);
  const { tasks, addTasks } = useTasks();

  useEffect(() => {
    if (data) {
      addTasks(data);
    }
  }, [addTasks, data]);
  const [highlighted, setHighlighted] = useState<boolean>(false);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.status === status),
    [tasks, status]
  );

  useEffect(() => {
    if (isOver) {
      setHighlighted(true);
      const timer = setTimeout(() => setHighlighted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOver]);

  return (
    <AnimatePresence>
      <SortableContext
        key={status}
        id={status}
        items={filteredTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div
          ref={setNodeRef}
          id={status}
          className={`rounded-xl p-4 pb-[500px] shadow-md min-h-[300px] border border-gray-200 transition-colors duration-200 ${
            highlighted ? "bg-blue-100 border-blue-300" : "bg-gray-100"
          }`}
          animate={{
            backgroundColor: isOver
              ? "rgba(191, 219, 254, 0.3)"
              : "rgba(247, 250, 252, 1)",
            borderColor: isOver ? "#93c5fd" : "#e5e7eb",
          }}
        >
          <Title
            level={4}
            className="mb-4 text-gray-800 font-semibold text-lg border-b border-gray-300 pb-2"
          >
            {capitalize(status).replace("_", " ")}
          </Title>
          {loading &&
            Array(3)
              .fill(0)
              .map((_, i) => <TaskLoadingCard key={i} />)}
          {filteredTasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </motion.div>
      </SortableContext>
    </AnimatePresence>
  );
};

export { DroppableColumn };
