// app/events/page.js
"use client";

import React, { useState, useEffect } from "react";
import { Button, List, Card, Typography, Space, Input } from "antd";
import Link from "next/link";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { getAllEvents } from "@/app/events/actions";

const { Text } = Typography;

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (search = "") => {
    setLoading(true);
    try {
      const fetchedEvents = await getAllEvents(search);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchEvents(value);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">All Events</h1>
          <Input
            placeholder="Search events"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
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
                        <TeamOutlined />
                        <Text>Capacity: {event.event_capacity}</Text>
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

export default EventsPage;
