// app/events/user-dashboard/page.js
"use client";

import React, { useState } from "react";
import { Button, List, Switch, Card, Typography, Space } from "antd";
import Link from "next/link";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { dummyUserEvents } from "@/app/events/user-dashboard/dummy-data";

const { Text } = Typography;

export default function UserDashboard() {
  const [matchMakerProfiles, setMatchMakerProfiles] = useState({});

  const toggleMatchMaker = (eventId) => {
    setMatchMakerProfiles((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Your Events</h1>
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
