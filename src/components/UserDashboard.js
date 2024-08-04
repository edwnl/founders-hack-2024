// app/events/user-dashboard/UserDashboard.js
"use client";

import React, { useState, useEffect } from "react";
import { Button, List, Switch, Card, Typography, Space, message } from "antd";
import Link from "next/link";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { getUserEvents, toggleMatchMaker } from "@/app/dashboard/actions";

const { Text } = Typography;

function UserDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserEvents();
    }
  }, [user]);

  const fetchUserEvents = async () => {
    try {
      const userEvents = await getUserEvents(user.uid);
      console.log(userEvents);
      setEvents(userEvents);
    } catch (error) {
      message.error("Failed to fetch user events");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMatchMaker = async (eventId, isMatchMaker) => {
    try {
      await toggleMatchMaker(user.uid, eventId, isMatchMaker);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, isMatchMaker } : event,
        ),
      );
      message.success("MatchMaker status updated successfully");
    } catch (error) {
      message.error("Failed to update MatchMaker status");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Your Events</h1>
        </div>
        <List
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={events}
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
                    href={`matchmaker/${event._id}`}
                  >
                    <Button disabled={!event.isMatchMaker}>MatchMaker</Button>
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
                        <Text>
                          {new Date(event.event_start).toLocaleDateString()}
                        </Text>
                      </Space>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>{`${new Date(event.event_start).toLocaleTimeString()} - ${new Date(event.event_end).toLocaleTimeString()}`}</Text>
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
                          checked={event.isMatchMaker}
                          onChange={(checked) =>
                            handleToggleMatchMaker(event._id, checked)
                          }
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
