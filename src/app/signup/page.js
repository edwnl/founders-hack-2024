// app/signup/page.js
"use client";

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Radio,
  Typography,
  Row,
  Col,
} from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createUserDocument } from "@/app/signup/actions";

const montserrat = Montserrat({ subsets: ["latin"] });
const { Title, Text } = Typography;

export default function SignUpPage() {
  const [form] = Form.useForm();
  const auth = getAuth();
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );
      const user = userCredential.user;

      const result = await createUserDocument({
        uid: user.uid,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        userType: registrationMode,
      });

      if (result.success) {
        message.success("User registered successfully");
        router.push("/login");
      } else {
        message.error(result.message);
      }
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
          Sign up now for
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Meetix
          </span>
          🚀
        </Title>
        <Form
          form={form}
          name="SignUpForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          className={"mt-8"}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: "Please enter your first name" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                rules={[
                  { required: true, message: "Please enter your last name" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email Address" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Text className="block text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </Text>
      </div>
    </div>
  );
}
