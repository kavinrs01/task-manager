import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd";
import { capitalize } from "lodash";
import React, { useEffect, useState } from "react";
import api from "../axios";
import { useAppSelector } from "../store";
import { TaskPriority, TaskStatus, User } from "../utils/types";
import { useTasks } from "./task-context";

interface CreateTaskFormProps {
  onTaskCreated: () => void;
  onCancel: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onTaskCreated,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useAppSelector<User | null>((state) => state.currentUser);
  const { addTasks } = useTasks();
  useEffect(() => {
    if (!currentUser) return;
    const fetchUsers = async () => {
      const response = await api.get("/auth/team-members");
      setUsers([currentUser, ...response.data]);
    };
    fetchUsers();
  }, [currentUser]);

  const priorityOptions = Object.values(TaskPriority).map((priority) => ({
    value: priority,
    label: capitalize(priority),
  }));

  const statusOptions = Object.values(TaskStatus).map((status) => ({
    value: status,
    label: capitalize(status),
  }));

  const assigneeOptions = users.map((user) => ({
    value: user.id,
    label: user.id === currentUser?.id ? "You" : user.name,
  }));

  const onFinish = async (values: any) => {
    try {
      const response = await api.post("/tasks/create", {
        ...values,
      });
      if (!response.data) return;
      addTasks([response.data]);
      form.resetFields();
      onTaskCreated();
    } catch (error: any) {
      console.error(
        "Failed to create task:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        assignedToUserId: currentUser?.id,
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

      <Space className="mb-2" wrap>
        <Form.Item name="priority" label="Priority" required>
          <Select
            placeholder="Select priority"
            options={priorityOptions}
            style={{ width: 120 }}
          />
        </Form.Item>

        <Form.Item name="status" label="Status" required>
          <Select
            placeholder="Select status"
            options={statusOptions}
            style={{ width: 120 }}
          />
        </Form.Item>

        <Form.Item name="assignedToUserId" label="Assignee" required>
          <Select
            placeholder="Assign to"
            options={assigneeOptions}
            style={{ width: 150 }}
          />
        </Form.Item>

        <Form.Item name="dueDate" label="Due Date" required>
          <Form.Item name="dueDate" label="Due Date" required>
            <DatePicker
              showTime
              style={{ width: 200 }}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select due date & time"
            />
          </Form.Item>
        </Form.Item>
      </Space>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Create Task
        </Button>
      </div>
    </Form>
  );
};

const CreateTaskModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Modal
        title={
          <div className="flex items-center justify-between">
            <span className="font-semibold">New Task</span>
          </div>
        }
        open={isVisible}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
        style={{ paddingBottom: "16px" }}
        className="w-full max-w-lg"
      >
        <CreateTaskForm
          onTaskCreated={() => {
            setIsVisible(false);
          }}
          onCancel={handleCancel}
        />
      </Modal>
      <Button type="primary" onClick={() => setIsVisible(true)}>
        Create Task
      </Button>
    </>
  );
};

export { CreateTaskModal };
