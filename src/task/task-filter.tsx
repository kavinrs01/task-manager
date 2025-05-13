import { DatePicker, Select, Space, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import { PriorityTag } from "../utils/components";
import { TaskFilterDto, TaskPriority } from "../utils/types";

const { Text } = Typography;

type Props = {
  onFilterChange: (filter: TaskFilterDto) => void;
  previousFilter: TaskFilterDto;
};

const TaskFilter: React.FC<Props> = React.memo(
  ({ onFilterChange, previousFilter }) => {
    const handlePriorityChange = (value: TaskPriority | undefined) => {
      onFilterChange({ ...previousFilter, priority: value });
    };

    const handleGteChange = (date: dayjs.Dayjs | null) => {
      onFilterChange({
        ...previousFilter,
        dueDate: {
          ...previousFilter?.dueDate,
          gte: date?.toISOString(),
        },
      });
    };

    const handleLteChange = (date: dayjs.Dayjs | null) => {
      onFilterChange({
        ...previousFilter,
        dueDate: {
          ...previousFilter?.dueDate,
          lte: date?.toISOString(),
        },
      });
    };

    return (
      <Space
        direction="horizontal"
        size="large"
        wrap
        className="mb-2 rounded-md p-4 bg-white shadow-sm w-full"
      >
        <div className="flex flex-col gap-1 w-64">
          <Text strong className="text-sm text-gray-700">
            Priority
          </Text>
          <Select<TaskPriority>
            placeholder="Select Priority"
            allowClear
            size="large"
            onChange={handlePriorityChange}
            value={previousFilter.priority}
            options={Object.values(TaskPriority).map((p) => ({
              label: (
                <div className="pb-1">
                  <PriorityTag priority={p} />
                </div>
              ),
              value: p,
            }))}
            className="w-full  "
          />
        </div>

        <div className="flex flex-col gap-1 w-64">
          <Text strong className="text-sm text-gray-700">
            Due Date Greater Than
          </Text>
          <DatePicker
            showTime
            placeholder="Select start date and time"
            size="large"
            onChange={handleGteChange}
            format="YYYY-MM-DD HH:mm:ss"
            value={
              previousFilter?.dueDate?.gte
                ? dayjs(previousFilter.dueDate.gte)
                : null
            }
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-1 w-64">
          <Text strong className="text-sm text-gray-700">
            Due Date Less Than
          </Text>
          <DatePicker
            showTime
            size="large"
            placeholder="Select end date and time"
            onChange={handleLteChange}
            format="YYYY-MM-DD HH:mm:ss"
            value={
              previousFilter?.dueDate?.lte
                ? dayjs(previousFilter.dueDate.lte)
                : null
            }
            className="w-full "
          />
        </div>
      </Space>
    );
  }
);

export default TaskFilter;
