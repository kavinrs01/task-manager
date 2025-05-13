import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback } from "react";
import { Role, Task, User } from "../utils/types";
import { useTasks } from "./task-context";

import { DeleteOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { useAppSelector } from "../store";
import { deleteTaskQuery } from "./query";

interface DeleteTaskButtonProps {
  task: Task;
  setDeleteLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteLoading?: boolean;
}

interface EditTaskButtonProps {
  task: Task;
}

const EditTaskButton: React.FC<EditTaskButtonProps> = React.memo(({ task }) => {
  const { setTaskToEdit, setIsModelVisible, setExpandedTask, setIsExpanded } =
    useTasks();
  const currentUser = useAppSelector<User | null>((state) => state.currentUser);
  const onClickEdit = useCallback(() => {
    setTaskToEdit(task);
    setIsModelVisible(true);
    setExpandedTask(null);
    setIsExpanded(false);
  }, [setTaskToEdit, task, setIsModelVisible, setExpandedTask, setIsExpanded]);
  if (currentUser?.role === Role.USER && !task?.isPrivate) return null;
  return (
    <Button
      variant="solid"
      color="primary"
      onClick={onClickEdit}
      onTouchEnd={(e) => {
        e.stopPropagation();
        onClickEdit();
      }}
      icon={<EditOutlined />}
    />
  );
});

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = React.memo(
  ({ task, setDeleteLoading, isDeleteLoading: isDeleteLoadingProp }) => {
    const { updateTask, setExpandedTask, setIsExpanded } = useTasks();
    const currentUser = useAppSelector<User | null>(
      (state) => state.currentUser
    );
    const { loading: isDeleteLoading, runAsync: deleteTask } = useRequest(
      deleteTaskQuery,
      { manual: true }
    );

    const onClickDelete = useCallback(async () => {
      if (setDeleteLoading) setDeleteLoading(true);
      try {
        const deletedTask = await deleteTask(task?.id);
        if (!deletedTask) return;
        updateTask(deletedTask);
        setExpandedTask(null);
        setIsExpanded(false);
      } finally {
        if (setDeleteLoading) setDeleteLoading(false);
      }
    }, [
      deleteTask,
      setDeleteLoading,
      setExpandedTask,
      setIsExpanded,
      task?.id,
      updateTask,
    ]);
    if (currentUser?.role === Role.USER && !task?.isPrivate) return null;
    return (
      <Button
        variant="solid"
        color="red"
        loading={isDeleteLoading || isDeleteLoadingProp}
        disabled={isDeleteLoading || isDeleteLoadingProp}
        onClick={onClickDelete}
        onTouchEnd={(e) => {
          e.stopPropagation();
          onClickDelete();
        }}
        icon={<DeleteOutlined />}
      />
    );
  }
);

export { DeleteTaskButton, EditTaskButton };
