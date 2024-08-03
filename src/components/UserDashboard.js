// app/events/user-dashboard/OrganizerDashboard.js
"use client";

import React, { useState, useEffect } from "react";
import { Button, List, Switch, Card, Typography, Space, Spin } from "antd";
import Link from "next/link";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { withGuard } from "@/components/GuardRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Adjust this import based on your Firebase setup

const { Text } = Typography;

function UserDashboard() {
  const [matchMakerProfiles, setMatchMakerProfiles] = useState({});
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, userMode } = useAuth();

  useEffect(() => {
    async function fetchUserEvents() {
      if (user) {
        setLoading(true);
        const eventsRef = collection(db, 'event');
        const q = query(eventsRef, where("matchmaker_attendees", "array-contains", user.uid));
        
        try {
          const querySnapshot = await getDocs(q);
          const events = [];
          querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
          });
          setUserEvents(events);
        } catch (error) {
          console.error("Error fetching user events: ", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserEvents();
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
                        <Text>{new Date(event.event_start).toLocaleDateString()}</Text>
                      </Space>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>{`${new Date(event.event_start).toLocaleTimeString()}`}</Text>
                      </Space>
                      <Space>
                        <DollarOutlined />
                        <Text>Price: ${event.event_price}</Text>
                      </Space>
                      <Space>
                        <IdcardOutlined />
                        <Text>Your Tickets: 1</Text>
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