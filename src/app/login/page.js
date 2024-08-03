// app/page.js
"use client";

import { useState, useEffect } from "react";
import { Button, Form, Input, message, Radio, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";

const montserrat = Montserrat({ subsets: ["latin"] });
const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loginMode, setLoginMode] = useState("user");
  const auth = getAuth();
  const router = useRouter();
  const { updateUserMode } = useAuth();

  const loginModeChange = (e) => {
    const newMode = e.target.value;
    setLoginMode(newMode);
  };

  const onFinish = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      message.success("Logged in successfully");
      localStorage.setItem("userType", loginMode);
      updateUserMode(loginMode);
      router.push(
        loginMode === "user"
          ? "/events/user-dashboard"
          : "/events/organizer-dashboard",
      );
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div
      className={`mt-32 bg-background p-8 flex flex-col justify-center ${montserrat.className}`}
    >
      <div className="max-w-sm w-full mx-auto">
        <Title level={2} className="text-center">
          Welcome back to <br></br>{" "}
          <span
            className={
              "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            }
          >
            Meetix
          </span>
          👋
        </Title>
        <Form
          form={form}
          name="LoginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item className="mb-4">
            <Radio.Group
              value={loginMode}
              onChange={loginModeChange}
              className="w-full mb-6"
            >
              <Radio.Button value="user" className="w-1/2 text-center">
                Login as User
              </Radio.Button>
              <Radio.Button value="organizer" className="w-1/2 text-center">
                Login as Organiser
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>
        </Form>
        <Text className="block text-center">
          Not registered yet?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Join now!
          </Link>
        </Text>
      </div>
    </div>
  );
}
