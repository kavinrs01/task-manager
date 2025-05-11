import { Card, Skeleton } from "antd";
import React from "react";

const TaskLoadingCard: React.FC = React.memo(() => {
  return (
    <Card className="!border-0 !shadow-none ">
      <Skeleton active title paragraph={{ rows: 2 }} />
    </Card>
  );
});

export { TaskLoadingCard };
