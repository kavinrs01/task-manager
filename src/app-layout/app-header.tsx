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
  const currentUser = useAppSelector<User | null>(
      (state) => state.currentUser
    );
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    removeAccessToken();
    removeRefreshToken();
    dispatch(currentUserActions.removeCurrentUser());
    navigate("/login");
  };

  return (
    <div className="flex flex-row items-center gap-3 w-full px-1 justify-between py-2 flex-wrap">
      <div className="flex flex-row items-center">
        <img src="/logo.png" className="w-[100px]"></img>
      </div>
 
      <div className="flex flex-row items-center gap-3 flex-wrap">
        <p className="text-white whitespace-nowrap">{currentUser?.name + " | " + currentUser?.email}</p>
        <Button type="primary" onClick={handleLogout} icon={<LogoutOutlined />}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export { AppHeader };
