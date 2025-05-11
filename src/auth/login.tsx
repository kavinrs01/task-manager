import { LockOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { Button, Card, Form, Input, message, Typography } from "antd";
import React, { useState } from "react";
import { currentUserActions, useAppDispatch } from "../store";
import { loginQuery } from "./query";

const { Title, Text, Link } = Typography;

interface LoginFormValues {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { runAsync } = useRequest(loginQuery, {
    manual: true,
  });
  const dispatch = useAppDispatch();
  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      if (values.email && values.password) {
        const response = await runAsync({
          email: values.email,
          password: values.password,
        });

        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        const user = response?.user;
        dispatch(currentUserActions.updateCurrentUser(user));
        message.success("Login successful!");
      } else {
        message.error("Please enter both email and password.");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      message.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl p-6">
        <div className="text-center mb-6">
          <Title level={2} className="!mb-2">
            Welcome Back
          </Title>
          <Text type="secondary">Please sign in to your account</Text>
        </div>

        <Form
          name="login-form"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          {/* <div className="flex justify-end mb-4">
            <Link href="/forgot-password">Forgot password?</Link>
          </div> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              icon={<LoginOutlined />}
              loading={loading}
              disabled={loading}
            >
              Log in
            </Button>
          </Form.Item>

          {/* <Text>
            Don’t have an account? <Link href="/signup">Register now</Link>
          </Text> */}
        </Form>
      </Card>
    </div>
  );
};

export default Login;
