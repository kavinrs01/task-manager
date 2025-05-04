import { Button } from "antd";
import React from "react";

import { useNavigate } from "react-router-dom";
import "./styles.less";

const AppHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full px-4 justify-between py-2">
      <div className="flex flex-row items-center">
        <img src="/logo.png" className="px-5"></img>
      </div>

      <div className="flex flex-row items-center gap-6">
        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export { AppHeader };
