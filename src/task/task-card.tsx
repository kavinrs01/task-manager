import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Tag, Typography } from "antd";
import { DateTime } from "luxon";
import { motion, MotionStyle, Variants } from "motion/react";
import { Task, TaskPriority, TaskStatus } from "../utils/types";

const { Title, Text } = Typography;

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return "red";
    case TaskPriority.MEDIUM:
      return "orange";
    case TaskPriority.LOW:
      return "blue";
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const SortableTaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isSorting,
    isDragging,
    setDraggableNodeRef,
  } = useSortable({ id: task.id });
  const style: MotionStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: isSorting && isDragging ? "1px dashed #000" : "none",
    backgroundColor: isSorting && isDragging ? "#f0f0f0" : "white",
  };
  const priorityColor = getPriorityColor(task.priority);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return <InfoCircleOutlined />;
      case TaskStatus.IN_PROGRESS:
        return <ClockCircleOutlined />;
      case TaskStatus.COMPLETED:
        return <CheckCircleOutlined />;
      default:
        return null;
    }
  };

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
      className="!mb-3 bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 rounded-md" // Added hover effect
    >
      <Card className="!border-0 !shadow-none " ref={setDraggableNodeRef}>
        <Title level={5} className="mb-1">
          {task.title}
        </Title>
        <Text type="secondary" className="block mb-2 text-sm">
          {task.description}
        </Text>
        <div className="flex text-sm items-center flex-wrap gap-2">
          <Tag color={priorityColor} className="mr-2">
            {task.priority}
          </Tag>
          <div className="flex items-center flex-wrap gap-2">
            <Tag icon={getStatusIcon(task.status)} className="mr-2">
              {task.status}
            </Tag>
            <Tag icon={<CalendarOutlined />} className="flex items-center">
              {DateTime.fromISO(task.dueDate).toFormat("dd/MM/yyyy HH:mm")}
            </Tag>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export { SortableTaskCard };
