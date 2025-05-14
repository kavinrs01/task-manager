import {
  ArrowDownOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CiCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  LockOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import { capitalize, keyBy } from "lodash";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { useAppSelector } from "../store";
import { Task, TaskPriority, TaskStatus, User } from "./types";

const getStatusInfo = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return {
        icon: <InfoCircleOutlined className="mr-1 " color="default" />,
        color: "default",
        className: "text-gray-600",
      };
    case TaskStatus.IN_PROGRESS:
      return {
        icon: <ClockCircleOutlined className="mr-1  " color="blue" />,
        color: "blue",
        className: "text-blue-600",
      };
    case TaskStatus.COMPLETED:
      return {
        icon: <CheckCircleOutlined className="mr-1" color="green" />,
        color: "green",
        className: "text-green-600",
      };
    default:
      return {
        icon: <CiCircleOutlined className="mr-1" color="default" />,
        color: "default",
        className: "text-gray-600",
      };
  }
};

const StatusTag: React.FC<{ status: TaskStatus }> = React.memo(({ status }) => {
  const { icon, color } = getStatusInfo(status);
  return (
    <Tag color={color}>
      {icon}
      {capitalize(status).replace("_", " ")}
    </Tag>
  );
});

const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return <ExclamationCircleOutlined className="mr-1" />;
    case TaskPriority.MEDIUM:
      return <WarningOutlined className="mr-1" />;
    case TaskPriority.LOW:
      return <ArrowDownOutlined className="mr-1" />;
    default:
      return null;
  }
};

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return "#f50";
    case TaskPriority.MEDIUM:
      return "orange";
    case TaskPriority.LOW:
      return "blue";
  }
};

const PriorityTag: React.FC<{ priority: TaskPriority }> = React.memo(
  ({ priority }) => {
    const priorityColor = useMemo(() => getPriorityColor(priority), [priority]);
    const icon = useMemo(() => getPriorityIcon(priority), [priority]);
    return (
      <Tag color={priorityColor}>
        {icon}
        {capitalize(priority).replace("_", " ")}
      </Tag>
    );
  }
);

const DueDateTag: React.FC<{ dueDate: string }> = ({ dueDate }) => {
  const now = DateTime.now();
  const isOverdue = DateTime.fromISO(dueDate) < now;
  const formattedDueDate =
    DateTime.fromISO(dueDate).toFormat("dd/MM/yyyy HH:mm");

  if (!dueDate) {
    return (
      <Tag>
        <CalendarOutlined className="mr-1" />
        No Due Date
      </Tag>
    );
  }

  if (isOverdue) {
    return (
      <Tag color="red">
        <WarningOutlined className="mr-1" />
        Overdue: {formattedDueDate}
      </Tag>
    );
  }

  return (
    <Tag>
      <CalendarOutlined className="mr-1" />
      Due: {formattedDueDate}
    </Tag>
  );
};

const PrivateTaskTag: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => {
  if (!isPrivate) return null;
  return (
    <Tag color="yellow" className="mb-2">
      <LockOutlined className=" text-amber-300" />
      Private
    </Tag>
  );
};

const AssigneeTag: React.FC<{ task: Task }> = ({ task }) => {
  const currentUser = useAppSelector<User | null>((state) => state.currentUser);
  const teamMembers = useAppSelector<User[]>(
    (state) => state?.teamMembers || []
  );
  const teamMembersMap = useMemo(() => {
    return keyBy(teamMembers, "id");
  }, [teamMembers]);
  return (
    <Tag>
      <UserOutlined className="mr-1" />
      {task?.assignedToUserId === currentUser?.id
        ? "You"
        : teamMembersMap[task?.assignedToUserId]?.name}
    </Tag>
  );
};

export {
  AssigneeTag,
  DueDateTag,
  getPriorityColor,
  getStatusInfo,
  PriorityTag,
  PrivateTaskTag,
  StatusTag,
};
