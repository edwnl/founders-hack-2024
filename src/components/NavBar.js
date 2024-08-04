"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Layout, Menu, Button, message, Modal, Tag, Space } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  PlusCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  InboxOutlined,
  UserSwitchOutlined,
  TagOutlined,
} from "@ant-design/icons";
import WhiteLogo from "../public/meetix-full-logo-white.svg";
import { useRouter } from "next/navigation";
import { signOut, getAuth } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";

const { Header } = Layout;

const NavBar = () => {
  const auth = getAuth();
  const { user, userMode, updateUserMode } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      message.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      message.error(error.message);
    }
  };

  const showSwitchModal = () => {
    setIsModalVisible(true);
  };

  const handleSwitchConfirm = () => {
    const newUserMode = userMode === "user" ? "organizer" : "user";
    updateUserMode(newUserMode);
    setIsModalVisible(false);
    setMobileMenuVisible(false);
    message.success(`Switched to ${newUserMode} mode`);
    router.push("/dashboard");
  };

  const handleSwitchCancel = () => {
    setIsModalVisible(false);
  };

  const menuItems = {
    user: [
      {
        key: "events",
        icon: <TagOutlined />,
        label: "Events",
        href: "/events",
      },
      {
        key: "dashboard",
        icon: <UserOutlined />,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        key: "profile",
        icon: <TeamOutlined />,
        label: "Matchmaker Profile",
        href: "/matchmaker/profile",
      },
      {
        key: "chats",
        icon: <InboxOutlined />,
        label: "Chats",
        href: "/matchmaker/chats",
      },
      {
        key: "switch",
        icon: <UserSwitchOutlined />,
        label: "Switch to Organizer",
        onClick: showSwitchModal,
      },
    ],
    organizer: [
      {
        key: "events",
        icon: <TagOutlined />,
        label: "Events",
        href: "/events",
      },
      {
        key: "dashboard",
        icon: <UserOutlined />,
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        key: "create",
        icon: <PlusCircleOutlined />,
        label: "Create Event",
        href: "/events/new/edit",
      },
      {
        key: "switch",
        icon: <UserSwitchOutlined />,
        label: "Switch to User",
        onClick: showSwitchModal,
      },
    ],
  };

  const renderMenuItem = (item) => (
    <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
      {item.href ? (
        <Link href={item.href} onClick={() => setMobileMenuVisible(false)}>
          {item.label}
        </Link>
      ) : (
        item.label
      )}
    </Menu.Item>
  );

  const renderAuthButton = () => {
    if (!user) {
      return (
        <Space size="small" className={"ml-4"}>
          <Link href="/signup">
            <Button
              className={"bg-white text-black hover:bg-gray-200"}
              size="middle"
              icon={<UserOutlined />}
            >
              Sign Up
            </Button>
          </Link>
          <Link href="/login">
            <Button icon={<LoginOutlined />} size="middle">
              Login
            </Button>
          </Link>
        </Space>
      );
    } else {
      return (
        <Button icon={<LogoutOutlined />} onClick={handleSignOut}>
          Sign Out
        </Button>
      );
    }
  };

  return (
    <>
      <Header className="p-0 h-auto bg-black text-white">
        <div className="flex justify-between items-center h-16 px-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src={WhiteLogo}
                alt="Meetix Logo"
                width={120}
                height={40}
              />
            </Link>
            {user && (
              <Tag
                color={userMode === "user" ? "blue" : "green"}
                className="ml-2"
              >
                {userMode === "user" ? "User" : "Organizer"}
              </Tag>
            )}
          </div>

          {user && (
            <div className="hidden lg:block">
              <Menu
                className="border-none bg-transparent"
                mode="horizontal"
                disabledOverflow={true}
                selectable={false}
                selectedKeys={[]}
              >
                {menuItems[userMode].map(renderMenuItem)}
              </Menu>
            </div>
          )}

          <div className="flex items-center">
            {renderAuthButton()}
            {user && (
              <div className="lg:hidden ml-4">
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                />
              </div>
            )}
          </div>
        </div>

        {mobileMenuVisible && user && (
          <div className="lg:hidden">
            <Menu mode="vertical" className="border-none bg-transparent">
              {menuItems[userMode].map(renderMenuItem)}
            </Menu>
          </div>
        )}
      </Header>

      <Modal
        title="Switch User Type"
        open={isModalVisible}
        onOk={handleSwitchConfirm}
        onCancel={handleSwitchCancel}
      >
        <p>
          Are you sure you want to switch to{" "}
          {userMode === "user" ? "Organizer" : "User"} mode?
        </p>
      </Modal>
    </>
  );
};

export default NavBar;
