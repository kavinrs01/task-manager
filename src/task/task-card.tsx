import { ExpandAltOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, Typography } from "antd";
import { motion, MotionStyle, Variants } from "motion/react";
import React, { useCallback, useMemo } from "react";
import { DueDateTag, PriorityTag, StatusTag } from "../utils/components";
import { Task } from "../utils/types";
import { DeleteTaskButton, EditTaskButton } from "./action-btns";
import { useTasks } from "./task-context";

const { Title, Paragraph } = Typography;

const SortableTaskCard: React.FC<{ task: Task }> = React.memo(({ task }) => {
  const { setIsExpanded, setExpandedTask } = useTasks();

  const cardVariants: Variants = useMemo(() => {
    return {
      hidden: { opacity: 0, y: -10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
    };
  }, []);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isSorting,
    isDragging,
  } = useSortable({ id: task.id });
  const style: MotionStyle = useMemo(() => {
    return {
      transform: CSS.Transform.toString(transform),
      transition,
      border: isSorting && isDragging ? "1px dashed #000" : "none",
      backgroundColor: isSorting && isDragging ? "#f5f5f5" : "white",
    };
  }, [isDragging, isSorting, transform, transition]);

  const onClickExpand = useCallback(() => {
    setExpandedTask(task);
    setIsExpanded(true);
  }, [setExpandedTask, setIsExpanded, task]);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="!mb-3 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 rounded-md relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 cursor-grab rounded-md hover:opacity-100 opacity-0"
        style={{
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        <div
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          className="flex items-center justify-center p-2 rounded-md bg-gray-200 cursor-auto gap-1"
        >
          <DeleteTaskButton task={task} />
          <EditTaskButton task={task} />
          <Button
            variant="solid"
            color="primary"
            onClick={onClickExpand}
            icon={<ExpandAltOutlined />}
          />
        </div>
      </motion.div>
      <Card className="!border-0 !shadow-none !bg-transparent relative">
        <Title level={5} className="">
          {task.title}
        </Title>
        <Paragraph
          className="block mb-2 text-sm"
          ellipsis={{
            rows: 2,
          }}
        >
          {task.description}
        </Paragraph>

        <div className="flex text-sm items-center flex-wrap gap-2">
          <PriorityTag priority={task.priority} />
          <div className="flex items-center flex-wrap gap-2">
            <StatusTag status={task.status} />
            <DueDateTag dueDate={task.dueDate} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

export { SortableTaskCard };
