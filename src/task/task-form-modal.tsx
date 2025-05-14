import { PlusOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
} from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect } from "react";
import { useAppSelector } from "../store";
import { PriorityTag, StatusTag } from "../utils/components";
import {
  CreateTaskDto,
  Role,
  TaskPriority,
  TaskStatus,
  User,
} from "../utils/types";
import { createTaskQuery, editTaskQuery } from "./query";
import { useTasks } from "./task-context";

interface CreateTaskFormProps {
  done: () => void;
  onCancel: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = React.memo(
  ({ done, onCancel }) => {
    const { taskToEdit } = useTasks();
    const currentUser = useAppSelector<User | null>(
      (state) => state.currentUser
    );
    const { loading: isEditLoading, runAsync: editTask } = useRequest(
      editTaskQuery,
      {
        manual: true,
      }
    );
    const { loading: isCreateLoading, runAsync: createTask } = useRequest(
      createTaskQuery,
      {
        manual: true,
      }
    );
    const teamMembers = useAppSelector<User[]>(
      (state) => state?.teamMembers || []
    );

    const [form] = Form.useForm<CreateTaskDto>();
    const { addTasks, updateTask } = useTasks();

    useEffect(() => {
      if (!taskToEdit) return;
      form.setFieldsValue({
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        assignedToUserId: taskToEdit.assignedToUserId,
        isPrivate: taskToEdit.isPrivate,
        dueDate: dayjs(taskToEdit.dueDate),
      });
    }, [form, taskToEdit]);

    const priorityOptions = Object.values(TaskPriority).map((priority) => ({
      value: priority,
      label: (
        <div className="pb-1">
          <PriorityTag priority={priority} />
        </div>
      ),
    }));

    const statusOptions = Object.values(TaskStatus).map((status) => ({
      value: status,
      label: (
        <div className="pb-1">
          <StatusTag status={status} />
        </div>
      ),
    }));

    const assigneeOptions = teamMembers?.map((user) => ({
      value: user.id,
      label: user.id === currentUser?.id ? "You" : user.name,
    }));

    const onFinish = async (values: CreateTaskDto) => {
      try {
        if (taskToEdit) {
          const editedTask = await editTask(
            {
              ...values,
              dueDate: dayjs(values.dueDate).toISOString(),
            },
            taskToEdit.id
          );
          if (!editedTask) return message.error("Failed to update task.");
          updateTask(editedTask);
        } else {
          const createdTask = await createTask({
            ...values,
            dueDate: dayjs(values.dueDate).toISOString(),
          });
          if (!createdTask) return message.error("Failed to create task.");
          addTasks([createdTask]);
        }
        form.resetFields();
        done();
      } catch (error: any) {
        console.error(
          "Failed to create task:",
          error.response?.data || error.message
        );
      }
    };

    return (
      <Form<CreateTaskDto>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: TaskStatus.TODO,
          priority: TaskPriority.LOW,
          assignedToUserId: currentUser?.id,
          isPrivate: currentUser?.role === Role.USER ? true : false,
        }}
        className="flex flex-col gap-4"
      >
        <Form.Item
          label="Task Title"
          name="title"
          rules={[{ required: true, message: "Please enter the task title!" }]}
        >
          <Input placeholder="Task title" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Add description..." rows={4} />
        </Form.Item>

        <Form.Item
          name="isPrivate"
          label="Private Task"
          valuePropName="checked"
          extra={
            currentUser?.role === Role.USER
              ? "As a user, tasks you create are private and this cannot be changed."
              : "Enable to make this task visible only to you."
          }
        >
          <Switch
            disabled={currentUser?.role === Role.USER}
            onChange={(checked) => {
              if (checked) {
                form.setFieldsValue({ assignedToUserId: currentUser?.id });
              }
            }}
          />
        </Form.Item>

        <div className="mb-2 flex gap-1 flex-wrap">
          <Form.Item
            name="priority"
            label="Priority"
            required
            rules={[{ required: true, message: "Please select priority!" }]}
          >
            <Select
              placeholder="Select priority"
              options={priorityOptions}
              style={{ width: 150 }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select
              placeholder="Select status"
              options={statusOptions}
              style={{ width: 150 }}
            />
          </Form.Item>

          <Form.Item
            shouldUpdate={(prev, current) =>
              prev.isPrivate !== current.isPrivate
            }
          >
            {() => {
              const isPrivate = form.getFieldValue("isPrivate");
              const isUser = currentUser?.role === Role.USER;
              const isDisabled = isPrivate || isUser;

              return (
                <Form.Item
                  name="assignedToUserId"
                  label="Assignee"
                  required
                  rules={[
                    { required: true, message: "Please select assignee!" },
                  ]}
                  extra={
                    isUser || isPrivate
                      ? "You can only assign tasks to yourself when the task is private."
                      : undefined
                  }
                >
                  <Select
                    placeholder="Assign to"
                    options={assigneeOptions}
                    style={{ width: 150 }}
                    disabled={isDisabled}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            required
            rules={[{ required: true, message: "Please select due date!" }]}
          >
            <DatePicker
              showTime
              style={{ width: 200 }}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select due date & time"
            />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreateLoading || isEditLoading}
            disabled={isCreateLoading || isEditLoading}
          >
            {taskToEdit ? "Update task" : "Create task"}
          </Button>
        </div>
      </Form>
    );
  }
);

const CreateTaskModal: React.FC = React.memo(() => {
  const { isModelVisible, setIsModelVisible, setTaskToEdit } = useTasks();

  const handleCancel = useCallback(() => {
    setIsModelVisible(false);
    setTaskToEdit(null);
  }, [setIsModelVisible, setTaskToEdit]);

  const handleDone = useCallback(() => {
    setIsModelVisible(false);
    setTaskToEdit(null);
  }, [setIsModelVisible, setTaskToEdit]);

  return (
    <>
      <Modal
        title={
          <div className="flex items-center justify-between">
            <span className="font-semibold">New Task</span>
          </div>
        }
        open={isModelVisible}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
        width={"90%"}
        style={{ paddingBottom: "16px" }}
        className="w-full max-w-lg"
      >
        <CreateTaskForm done={handleDone} onCancel={handleCancel} />
      </Modal>
      <Button
        type="primary"
        onClick={() => setIsModelVisible(true)}
        icon={<PlusOutlined />}
      >
        Create Task
      </Button>
    </>
  );
});

export { CreateTaskModal };
