"use client";

import { Button, Space } from "antd";
import Link from "next/link";
import IconBackground from "@/components/PeopleBackground";
import {
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import React from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function LandingPageContent() {
  const { user, userMode } = useAuth();

  const renderAuthButtons = () => {
    if (user) {
      return (
        <Link href={"/dashboard"}>
          <Button
            type="primary"
            icon={<DashboardOutlined />}
            className={"bg-white text-black hover:bg-gray-200"}
            size="large"
          >
            Go to {userMode === "organizer" ? "Organizer" : "User"} Dashboard
          </Button>
        </Link>
      );
    } else {
      return (
        <>
          <Link href="/signup">
            <Button
              type="primary"
              icon={<UserOutlined />}
              className={"bg-white text-black hover:bg-gray-200"}
              size="large"
            >
              Sign Up Now
            </Button>
          </Link>
          <Link href="/login">
            <Button icon={<LoginOutlined />} size="large">
              Login
            </Button>
          </Link>
        </>
      );
    }
  };

  return (
    <div className="flex flex-grow flex-col items-center justify-center bg-black text-white p-8 md:mb-0 mb-24">
      <IconBackground />
      <h1 className="md:text-6xl text-5xl font-bold mb-4 text-center">
        Where Events meet
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Connections.
        </span>
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center">
        Discover events, make friends, and find your perfect match - all in one
        place.
      </p>
      <Space size="small">{renderAuthButtons()}</Space>
    </div>
  );
}

export default function LandingPage() {
  return (
    <AuthProvider>
      <LandingPageContent />
    </AuthProvider>
  );
}