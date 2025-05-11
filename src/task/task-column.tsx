import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRequest } from "ahooks";
import { capitalize, isNil, last } from "lodash";
import { DateTime } from "luxon";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getStatusInfo } from "../utils/components";
import {
  Task,
  TaskArgsFormattedDto,
  TaskFilterDto,
  TaskStatus,
} from "../utils/types";
import { TaskLoadingCard } from "./loading-card";
import { listTasksQuery } from "./query";
import { SortableTaskCard } from "./task-card";
import { useTasks } from "./task-context";
const DroppableColumn: React.FC<{
  status: TaskStatus;
  tasks: Task[];
  filter: TaskFilterDto;
}> = React.memo(({ status, tasks, filter }) => {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  const { loading, runAsync } = useRequest(listTasksQuery, {
    manual: true,
  });

  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const TAKE = 10;
  const [isFetching, setIsFetching] = useState(false);
  const { addTasks } = useTasks();

  const fetchData = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);

    const parsedFilter: TaskArgsFormattedDto = {
      take: TAKE,
      cursor: cursor,
    };

    if (filter?.priority) {
      parsedFilter["filter.priority"] = filter.priority;
    }

    if (filter?.dueDate) {
      if (filter.dueDate.gte && !isNil(filter.dueDate.gte)) {
        parsedFilter["filter.dueDate.gte"] =
          DateTime.fromISO(filter.dueDate.gte).toISO() || undefined;
      }
      if (filter.dueDate.lte && !isNil(filter.dueDate.lte)) {
        parsedFilter["filter.dueDate.lte"] =
          DateTime.fromISO(filter.dueDate.lte).toISO() || undefined;
      }
    }

    parsedFilter["filter.status"] = status;

    try {
      const newTasks = await runAsync(parsedFilter);

      if (newTasks?.length < TAKE) {
        setHasMore(false);
      }

      if (newTasks?.length > 0) {
        setCursor(last(newTasks)?.id);
        addTasks(newTasks);
      }
    } finally {
      setIsFetching(false);
    }
  }, [
    isFetching,
    hasMore,
    cursor,
    filter.priority,
    filter.dueDate,
    status,
    runAsync,
    addTasks,
  ]);

  useEffect(() => {
    fetchData(); // initial fetch
  }, []);

  const [highlighted, setHighlighted] = useState<boolean>(false);

  useEffect(() => {
    if (isOver) {
      setHighlighted(true);
      const timer = setTimeout(() => setHighlighted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOver]);

  const { icon, className } = useMemo(() => getStatusInfo(status), [status]);
  const scrollableId = `column-${status}`;
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
          id={scrollableId}
          className={`rounded-xl  pb-[300px] shadow-md h-full min-h-[300px] max-h-[600px] overflow-auto border border-gray-200 transition-colors duration-200 ${
            highlighted ? "bg-blue-100 border-blue-300" : "bg-gray-100"
          }`}
          animate={{
            backgroundColor: isOver
              ? "rgba(191, 219, 254, 0.3)"
              : "white",
            borderColor: isOver ? "#93c5fd" : "#e5e7eb",
          }}
        >
          <div
            className={`flex items-center mb-4  font-semibold text-lg border-b border-gray-300 p-2 gap-2 ${className} sticky top-0 z-100 bg-white px-5 `}
          >
            {icon}
            <p>{capitalize(status).replace("_", " ")}</p>
          </div>
          {loading &&
            Array(3)
              .fill(0)
              .map((_, i) => <TaskLoadingCard key={i} />)}
          <InfiniteScroll
            dataLength={tasks.length}
            next={fetchData}
            hasMore={hasMore}
            loader={<TaskLoadingCard />}
            scrollableTarget={scrollableId}
            scrollThreshold={0.9}
            className="p-4 flex flex-col gap-2"
          >
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
          </InfiniteScroll>
        </motion.div>
      </SortableContext>
    </AnimatePresence>
  );
});

export { DroppableColumn };
