"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import WhiteLogo from "../public/meetix-full-logo-white.svg";

const { Header } = Layout;

const NavBar = () => {
  const [userState, setUserState] = useState("organizer"); // 'notLoggedIn', 'user', 'organizer'
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const menuItems = {
    user: [
      {
        key: "events",
        icon: <CalendarOutlined />,
        label: "Events",
        href: "/events",
      },
      {
        key: "dashboard",
        icon: <UserOutlined />,
        label: "Dashboard",
        href: "/events/user-dashboard",
      },
      {
        key: "matchmaker",
        icon: <TeamOutlined />,
        label: "Matchmaker",
        href: "/matchmaker/profile",
      },
    ],
    organizer: [
      {
        key: "events",
        icon: <CalendarOutlined />,
        label: "Events",
        href: "/events",
      },
      {
        key: "dashboard",
        icon: <UserOutlined />,
        label: "Dashboard",
        href: "/events/organizer-dashboard",
      },
      {
        key: "create",
        icon: <PlusCircleOutlined />,
        label: "Create Events",
        href: "/events/create",
      },
    ],
  };

  const renderMenuItem = (item) => (
    <Menu.Item key={item.key} icon={item.icon}>
      <Link href={item.href} onClick={() => setMobileMenuVisible(false)}>
        {item.label}
      </Link>
    </Menu.Item>
  );

  const renderAuthButton = () => {
    if (userState === "notLoggedIn") {
      return (
        <>
          <Link href="/login">
            <Button type="text" icon={<LoginOutlined />}>
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button type="primary">Sign Up</Button>
          </Link>
        </>
      );
    } else {
      return (
        <Button
          icon={<LogoutOutlined />}
          onClick={() => setUserState("notLoggedIn")}
        >
          Sign Out
        </Button>
      );
    }
  };

  return (
    <Header className="p-0 h-auto bg-black text-white">
      <div className="flex justify-between items-center h-16 px-8">
        <Link href="/" className="flex items-center">
          <Image src={WhiteLogo} alt="Meetix Logo" width={120} height={40} />
        </Link>

        {userState !== "notLoggedIn" && (
          <div className="hidden md:block">
            <Menu
              className="border-none bg-transparent"
              mode="horizontal"
              disabledOverflow={true}
              selectable={false}
              selectedKeys={[]}
            >
              {menuItems[userState].map(renderMenuItem)}
            </Menu>
          </div>
        )}

        <div className="flex items-center">
          {renderAuthButton()}
          <div className="md:hidden ml-4">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            />
          </div>
        </div>
      </div>

      {mobileMenuVisible && userState !== "notLoggedIn" && (
        <div className="lg:hidden">
          <Menu mode="vertical" className="border-none bg-transparent">
            {menuItems[userState].map(renderMenuItem)}
          </Menu>
        </div>
      )}
    </Header>
  );
};

export default NavBar;
