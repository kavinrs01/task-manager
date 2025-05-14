import { ExpandAltOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, Typography } from "antd";
import { motion, MotionStyle } from "motion/react";
import React, { useCallback, useMemo, useState } from "react";
import {
  AssigneeTag,
  DueDateTag,
  PriorityTag,
  PrivateTaskTag,
  StatusTag,
} from "../utils/components";
import { Task } from "../utils/types";
import { DeleteTaskButton, EditTaskButton } from "./action-btns";
import { useTasks } from "./task-context";

const { Title, Paragraph, Text } = Typography;

const SortableTaskCard: React.FC<{ task: Task }> = React.memo(({ task }) => {
  const { setIsExpanded, setExpandedTask } = useTasks();
  const [showActions, setShowActions] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isSorting,
    isDragging,
    over,
  } = useSortable({ id: task.id });

  const style: MotionStyle = useMemo(
    () => ({
      touchAction: "none",
      transform: CSS.Transform.toString(transform),
      transition,
      border: isSorting && isDragging ? "1px dashed #000" : "none",
      backgroundColor: isSorting && isDragging ? "#f5f5f5" : "#fff",
    }),
    [isDragging, isSorting, transform, transition]
  );

  const onClickExpand = useCallback(() => {
    setExpandedTask(task);
    setIsExpanded(true);
  }, [setExpandedTask, setIsExpanded, task]);

  const toggleActions = () => setShowActions((prev) => !prev);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="!mb-3 rounded-md relative overflow-hidden flex flex-col gap-2 shadow-md cursor-grab"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchEnd={toggleActions}
    >
      {/* Drag & Action Overlay */}
      {(showActions || isDeleteLoading) && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full flex-col flex items-center justify-center z-10 bg-gray-300/40 border-2 border-gray-50 gap-2"
          style={{ transition: "opacity 0.2s ease-in-out" }}
        >
          <Text className="p-2 font-semibold bg-white rounded-md">
            Drag to reorder or update status
          </Text>
          <div
            onKeyDown={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            className="flex items-center justify-center p-2 rounded-md bg-white cursor-auto gap-1"
          >
            <DeleteTaskButton
              task={task}
              setDeleteLoading={setDeleteLoading}
              isDeleteLoading={isDeleteLoading}
            />
            <EditTaskButton task={task} />
            <Button
              onClick={onClickExpand}
              onTouchEnd={(e) => {
                e.stopPropagation();
                onClickExpand();
              }}
              icon={<ExpandAltOutlined />}
            />
          </div>
        </motion.div>
      )}

      {/* Task Card Content */}
      <div className="flex flex-col gap-3">
        {over?.id === task.id && (
          <motion.div
            className="bg-blue-100/50 rounded-md flex items-center justify-center text-blue-500 font-semibold h-[100px] mb-3 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            Drop Here
          </motion.div>
        )}
        <Card className="!p-0.5 !bg-white">
          <PrivateTaskTag isPrivate={task.isPrivate} />
          <Title level={5}>{task.title}</Title>
          {task.description && (
            <Paragraph className="block mb-2 text-sm" ellipsis={{ rows: 2 }}>
              {task.description}
            </Paragraph>
          )}
          <div className="flex text-sm items-center flex-wrap gap-2">
            <PriorityTag priority={task.priority} />
            <div className="flex items-center flex-wrap gap-2">
              <StatusTag status={task.status} />
              <DueDateTag dueDate={task.dueDate} />
            </div>
            <AssigneeTag task={task} />
          </div>
        </Card>
      </div>
    </motion.div>
  );
});

export { SortableTaskCard };
