import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Tag, Typography } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  sortOrder: number;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design Login Page",
    description: "Create login UI",
    status: "Todo",
    priority: "High",
    dueDate: "2025-05-05",
    sortOrder: 1,
  },
  {
    id: "2",
    title: "API Integration",
    description: "Connect GraphQL endpoints",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-05-07",
    sortOrder: 1,
  },
  {
    id: "3",
    title: "Code Cleanup",
    description: "Remove unused components",
    status: "Done",
    priority: "Low",
    dueDate: "2025-05-03",
    sortOrder: 1,
  },
  {
    id: "4",
    title: "Write Tests",
    description: "Write unit tests",
    status: "Todo",
    priority: "Medium",
    dueDate: "2025-05-10",
    sortOrder: 2,
  },
  {
    id: "5",
    title: "Database Migration",
    description: "Migrate schema",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-05-08",
    sortOrder: 2,
  },
  {
    id: "6",
    title: "Documentation",
    description: "API docs",
    status: "Done",
    priority: "Low",
    dueDate: "2025-05-04",
    sortOrder: 2,
  },
];

const statuses = ["Todo", "In Progress", "Done"];

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return "red";
    case "Medium":
      return "orange";
    case "Low":
      return "blue";
  }
};

// Card Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const SortableTaskCard = ({ task }: { task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1, // Reduced opacity while dragging
  };
  const priorityColor = getPriorityColor(task.priority);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Todo":
        return <InfoCircleOutlined />;
      case "In Progress":
        return <ClockCircleOutlined />;
      case "Done":
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
      <Card className="!border-0 !shadow-none">
        <Title level={5} className="mb-1">
          {task.title}
        </Title>
        <Text type="secondary" className="block mb-2 text-sm">
          {task.description}
        </Text>
        <div className="flex justify-between text-sm items-center">
          <Tag color={priorityColor} className="mr-2">
            {task.priority}
          </Tag>
          <div className="flex items-center">
            <Tag icon={getStatusIcon(task.status)} className="mr-2">
              {task.status}
            </Tag>
            <Tag icon={<CalendarOutlined />} className="flex items-center">
              {task.dueDate}
            </Tag>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const DroppableColumn = ({
  status,
  children,
}: {
  status: string;
  children: React.ReactNode;
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  const [highlighted, setHighlighted] = useState(false);

  // Use useEffect to apply the highlight class
  useEffect(() => {
    if (isOver) {
      setHighlighted(true);
      const timer = setTimeout(() => setHighlighted(false), 300); // Short duration
      return () => clearTimeout(timer);
    }
  }, [isOver]);

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "Todo":
        return "To Do";
      case "In Progress":
        return "In Progress";
      case "Done":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      id={status}
      className={`rounded-xl p-4 shadow-md min-h-[300px] border border-gray-200 transition-colors duration-200 ${
        highlighted ? "bg-blue-100 border-blue-300" : "bg-gray-100"
      }`}
      animate={{
        backgroundColor: isOver
          ? "rgba(191, 219, 254, 0.3)" // Lighter blue highlight
          : "rgba(247, 250, 252, 1)", // Tailwind's gray-100 as rgba
        borderColor: isOver ? "#93c5fd" : "#e5e7eb", // Tailwind's blue-300 and gray-200
      }}
    >
      <Title
        level={4}
        className="mb-4 text-gray-800 font-semibold text-lg border-b border-gray-300 pb-2"
      >
        {getStatusTitle(status)}
      </Title>
      <AnimatePresence>{children}</AnimatePresence>
    </motion.div>
  );
};

export default function BoardView() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const isDroppingOnColumn = statuses.includes(over.id as string);
    const newStatus = isDroppingOnColumn
      ? (over.id as string)
      : tasks.find((t) => t.id === over.id)?.status;

    if (!newStatus) return;

    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((t) => t.id === active.id);
    const [taskToMove] = updatedTasks.splice(taskIndex, 1);
    taskToMove.status = newStatus;

    const tasksInNewStatus = updatedTasks.filter((t) => t.status === newStatus);

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

    const normalizedTasks = statuses.flatMap((status) =>
      updatedTasks
        .filter((task) => task.status === status)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((task, index) => ({ ...task, sortOrder: index + 1 }))
    );

    setTasks(normalizedTasks);
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Title level={3} className="text-gray-800 mb-6">
        Task Board
      </Title>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map((status) => {
            const filteredTasks = tasks
              .filter((t) => t.status === status)
              .sort((a, b) => a.sortOrder - b.sortOrder);
            return (
              <SortableContext
                key={status}
                id={status}
                items={filteredTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn status={status}>
                  {filteredTasks.map((task) => (
                    <SortableTaskCard key={task.id} task={task} />
                  ))}
                </DroppableColumn>
              </SortableContext>
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
}
