import { Button } from "antd";
import React from "react";

import { useNavigate } from "react-router-dom";
import { removeAccessToken, removeRefreshToken } from "../auth/tokenService";
import { currentUserActions, useAppDispatch, useAppSelector } from "../store";
import { LogoutOutlined } from "@ant-design/icons";
import "./styles.less";
import { User } from "../utils/types";

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector<User | null>((state) => state.currentUser);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    removeAccessToken();
    removeRefreshToken();
    dispatch(currentUserActions.removeCurrentUser());
    navigate("/login");
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full px-1 justify-between py-2 flex-wrap">
      <div className="flex flex-row items-center gap-1 min-w-0">
        <img src="/logo.png" className="w-[100px]" />
        <p className="text-white whitespace-nowrap truncate w-full sm:w-[200px] md:w-[300px]">
          {currentUser?.name + " | " + currentUser?.email}
        </p>
      </div>
      <Button type="primary" onClick={handleLogout} icon={<LogoutOutlined />} className="align-self-end text-left">
        Logout
      </Button>
    </div>
  );
};

export { AppHeader };
