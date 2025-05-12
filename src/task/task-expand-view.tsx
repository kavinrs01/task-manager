import { Modal, Typography } from "antd";
import React, { useState } from "react";
import {
  AssigneeTag,
  DueDateTag,
  PriorityTag,
  PrivateTaskTag,
  StatusTag,
} from "../utils/components";
import { DeleteTaskButton, EditTaskButton } from "./action-btns";
import { useTasks } from "./task-context";

const { Title, Paragraph } = Typography;

const TaskModal: React.FC = React.memo(() => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);
  const {
    expandedTask: task,
    isExpanded: open,
    setExpandedTask,
    setIsExpanded,
  } = useTasks();

  const onClose = () => {
    setExpandedTask(null);
    setIsExpanded(false);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-2">
          <PrivateTaskTag isPrivate={task?.isPrivate || false} />
          <Title level={4} className="!mb-0 text-gray-800">
            Task Details
          </Title>
          {task && <DeleteTaskButton task={task} />}
          {task && <EditTaskButton task={task} />}
        </div>
      }
      centered
      width={"90%"}
    >
      {task && (
        <div className=" bg-transparent border-none  p-2">
          <Title level={4} className="mb-2 text-gray-800">
            {task?.title}
          </Title>
          {task?.description && (
            <Paragraph
              className="mb-4 text-gray-600"
              ellipsis={{
                rows: 2,
                expandable: "collapsible",
                expanded: isDescriptionExpanded,
                onExpand: (_, info) => setIsDescriptionExpanded(info.expanded),
              }}
              copyable
            >
              {task?.description}
            </Paragraph>
          )}

          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Priority:</span>
              <PriorityTag priority={task.priority} />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Status:</span>
              <StatusTag status={task.status} />
            </div>

            <div className="flex items-center gap-2 col-span-full">
              <span className="font-medium text-gray-700">Due Date:</span>
              <DueDateTag dueDate={task.dueDate} />
            </div>
            <div className="flex items-center gap-2 col-span-full">
              <span className="font-medium text-gray-700">Assignee:</span>
              <AssigneeTag task={task} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
});

export { TaskModal };
