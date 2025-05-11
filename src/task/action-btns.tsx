import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback } from "react";
import { Task } from "../utils/types";
import { useTasks } from "./task-context";

import { DeleteOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import api from "../axios";

interface DeleteTaskButtonProps {
  task: Task;
}

interface EditTaskButtonProps {
  task: Task;
}

const EditTaskButton: React.FC<EditTaskButtonProps> = React.memo(({ task }) => {
  const { setTaskToEdit, setIsModelVisible, setExpandedTask, setIsExpanded } =
    useTasks();

  const onClickEdit = useCallback(() => {
    setTaskToEdit(task);
    setIsModelVisible(true);
    setExpandedTask(null);
    setIsExpanded(false);
  }, [setTaskToEdit, task, setIsModelVisible, setExpandedTask, setIsExpanded]);

  return (
    <Button
      variant="solid"
      color="primary"
      onClick={onClickEdit}
      icon={<EditOutlined />}
    />
  );
});

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = React.memo(
  ({ task }) => {
    const { updateTask, setExpandedTask, setIsExpanded } = useTasks();

    const { loading: isDeleteLoading, runAsync: deleteTask } = useRequest(
      async () => {
        const response = await api.delete<Task>(`/tasks/${task.id}`);
        return response.data;
      },
      { manual: true }
    );

    const onClickDelete = useCallback(async () => {
      const deletedTask = await deleteTask();
      if (!deletedTask) return;
      updateTask(deletedTask);
      setExpandedTask(null);
      setIsExpanded(false);
    }, [deleteTask, setExpandedTask, setIsExpanded, updateTask]);

    return (
      <Button
        variant="solid"
        color="red"
        loading={isDeleteLoading}
        disabled={isDeleteLoading}
        onClick={onClickDelete}
        icon={<DeleteOutlined />}
      />
    );
  }
);

export { DeleteTaskButton, EditTaskButton };
