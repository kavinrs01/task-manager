import { Card, Skeleton } from "antd";

const TaskLoadingCard: React.FC = () => {
  return (
    <Card className="!border-0 !shadow-none ">
      <Skeleton active title paragraph={{ rows: 2 }} />
    </Card>
  );
};

export { TaskLoadingCard };
