// app/events/user-dashboard/OrganizerDashboard.js
"use client";

import React, { useState, useEffect } from "react";
import { Button, List, Switch, Card, Typography, Space } from "antd";
import Link from "next/link";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { dummyUserEvents } from "@/components/dummy-user-data";
import { withGuard } from "@/components/GuardRoute";
import { useAuth } from "@/contexts/AuthContext"; // Import the useAuth hook

const { Text } = Typography;

function UserDashboard() {
  const [matchMakerProfiles, setMatchMakerProfiles] = useState({});
  const { user, userMode } = useAuth(); // Use the useAuth hook

  useEffect(() => {
    if (!user) {
      console.log("Not logged in");
      // You might want to redirect to a login page here
    } else {
      console.log(user.uid); // user id
      console.log(userMode); // 'user' or 'organizer'
    }
  }, [user, userMode]);

  const toggleMatchMaker = (eventId) => {
    setMatchMakerProfiles((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  if (!user) {
    return <div>Please log in to view your dashboard</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Your Events</h1>
          <Text>Welcome, {user.uid}</Text>
        </div>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={dummyUserEvents}
          renderItem={(event) => (
            <List.Item>
              <Card
                hoverable
                style={{ width: "100%" }}
                cover={
                  <img
                    alt={event.event_name}
                    src={event.event_picture}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                }
                actions={[
                  <Link key="view" href={`/events/${event._id}`}>
                    <Button>View Event</Button>
                  </Link>,
                  <Link
                    key="matchmaker"
                    href={`/events/${event._id}/matchmaker`}
                  >
                    <Button disabled={!matchMakerProfiles[event._id]}>
                      MatchMaker
                    </Button>
                  </Link>,
                ]}
              >
                <Card.Meta
                  title={event.event_name}
                  description={
                    <Space direction="vertical">
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{event.event_location}</Text>
                      </Space>
                      <Space>
                        <CalendarOutlined />
                        <Text>{event.event_start.toLocaleDateString()}</Text>
                      </Space>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>{`${event.event_start.toLocaleTimeString()} - ${event.event_end.toLocaleTimeString()}`}</Text>
                      </Space>
                      <Space>
                        <DollarOutlined />
                        <Text>Price: ${event.event_price}</Text>
                      </Space>
                      <Space>
                        <IdcardOutlined />
                        <Text>Your Tickets: {event.user_tickets}</Text>
                      </Space>
                      <Space>
                        <Text>Show in Match Maker:</Text>
                        <Switch
                          checked={matchMakerProfiles[event._id]}
                          onChange={() => toggleMatchMaker(event._id)}
                        />
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default UserDashboard;