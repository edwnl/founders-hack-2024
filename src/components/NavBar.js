// components/Navbar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Dropdown, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'user' or 'organizer'

  const renderDesktopMenu = () => {
    if (!isLoggedIn) {
      return (
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button
              type="link"
              className="text-muted-foreground hover:text-foreground"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button type="primary">Sign Up</Button>
          </Link>
        </div>
      );
    }

    const menuItems =
      userType === "organizer"
        ? ["Events", "Dashboard", "Create Events"]
        : ["Events", "Dashboard", "Matchmaker"];

    return (
      <>
        <div className="hidden md:flex items-center space-x-4 flex-grow justify-center">
          {menuItems.map((item) => (
            <Link key={item} href={`/${item.toLowerCase().replace(" ", "-")}`}>
              <Button
                type="link"
                className="text-muted-foreground hover:text-foreground"
              >
                {item}
              </Button>
            </Link>
          ))}
        </div>
        <Button
          onClick={() => console.log("sign out")}
          type="link"
          className="hidden md:block text-muted-foreground hover:text-foreground"
        >
          Sign Out
        </Button>
      </>
    );
  };

  const mobileMenu = (
    <Menu theme="dark">
      {isLoggedIn ? (
        <>
          <Menu.Item key="events">
            <Link href="/events">Events</Link>
          </Menu.Item>
          <Menu.Item key="dashboard">
            <Link href="/dashboard">Dashboard</Link>
          </Menu.Item>
          {userType === "organizer" ? (
            <Menu.Item key="create-events">
              <Link href="/create-events">Create Events</Link>
            </Menu.Item>
          ) : (
            <Menu.Item key="matchmaker">
              <Link href="/matchmaker">Matchmaker</Link>
            </Menu.Item>
          )}
          <Menu.Item key="signout" onClick={handleSignOut}>
            Sign Out
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login">
            <Link href="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="signup">
            <Link href="/signup">Sign Up</Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <nav className="bg-background py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-md font-semibold text-foreground">
          EventMatchmaker
        </Link>
        {renderDesktopMenu()}
        <Dropdown
          overlay={mobileMenu}
          trigger={["click"]}
          className="md:hidden"
        >
          <Button type="link" className="text-muted-foreground p-0">
            <MenuOutlined />
          </Button>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
