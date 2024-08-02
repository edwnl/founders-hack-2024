"use client";

import { Button, Space } from "antd";
import Link from "next/link";
import IconBackground from "@/components/PeopleBackground";

export default function LandingPage() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center bg-black text-white p-16 md:mb-0 mb-24">
      <IconBackground />
      <h1 className="text-6xl font-bold mb-4 text-center">
        Where Events meet
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Connections
        </span>
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center">
        Discover events, make friends, and find your perfect match - all in one
        place.
      </p>
      <Space size="large">
        <Link href={{pathname: "/signup", query:{type: "user"}}}>
          <Button
            type="primary"
            className={"bg-white text-black hover:bg-gray-200"}
            size="large"
          >
            Sign Up as User
          </Button>
        </Link>
        <Link href="/signup?type=organizer">
          <Button size="large">Sign Up as Organizer</Button>
        </Link>
      </Space>
    </div>
  );
}
