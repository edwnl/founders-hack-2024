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
import dynamic from 'next/dynamic';
const useAuth = dynamic(() => import('@/contexts/AuthContext').then(mod => mod.useAuth), { ssr: false });
import { getUserData } from '@/app/actions/userActions';

const { Text } = Typography;

function UserDashboard() {
  const [matchMakerProfiles, setMatchMakerProfiles] = useState({});
  const [userData, setUserData] = useState(null);
  const { user, userMode } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          console.log("Fetching user data...");
          const data = await getUserData();
          console.log("User data fetched:", data);
          setUserData(data || {}); // Default to an empty object if data is undefined
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData({}); // Default to an empty object on error
        }
      }
    };

    fetchUserData();
  }, [user]);

  const toggleMatchMaker = (eventId) => {
    setMatchMakerProfiles((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  if (!user) {
    return <div>Please log in to view your dashboard</div>;
  }

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Your Events</h1>
          <Text>Welcome, {user.uid}</Text>
        </div>
        {userData ? (
          <div className="mb-4">
            <Text>User ID: {userData.id || 'N/A'}</Text> {/* Add fallback if userData.id is undefined */}
          </div>
        ) : (
          <div className="mb-4">Loading user data...</div>
        )}
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
          dataSource={userEvents}
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
                  <Link key="view" href={`/events/${event.id}`}>
                    <Button>View Event</Button>
                  </Link>,
                  <Link
                    key="matchmaker"
                    href={`/events/${event.id}/matchmaker`}
                  >
                    <Button disabled={!matchMakerProfiles[event.id]}>
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
                        <Text>{event.event_start?.toLocaleDateString() || 'N/A'}</Text> {/* Add fallback */}
                      </Space>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>{`${event.event_start?.toLocaleTimeString() || 'N/A'} - ${event.event_end?.toLocaleTimeString() || 'N/A'}`}</Text> {/* Add fallback */}
                      </Space>
                      <Space>
                        <DollarOutlined />
                        <Text>Price: ${event.event_price || 'N/A'}</Text> {/* Add fallback */}
                      </Space>
                      <Space>
                        <IdcardOutlined />
                        <Text>Your Tickets: {event.user_tickets || 'N/A'}</Text> {/* Add fallback */}
                      </Space>
                      <Space>
                        <Text>Show in Match Maker:</Text>
                        <Switch
                          checked={matchMakerProfiles[event.id]}
                          onChange={() => toggleMatchMaker(event.id)}
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
