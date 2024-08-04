// app/events/organizer-dashboard/OrganizerDashboard.js
"use client";

import React, { useState, useEffect } from "react";
import { Button, List, Card, Typography, Space, Modal, message } from "antd";
import Link from "next/link";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getOrganizerEvents } from "@/app/dashboard/actions";

const { Text } = Typography;

function OrganizerDashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchOrganizerEvents();
    }
  }, [user]);

  const fetchOrganizerEvents = async () => {
    try {
      const organizerEvents = await getOrganizerEvents(user.uid);
      console.log(organizerEvents);
      console.log(user.uid);
      setEvents(organizerEvents);
    } catch (error) {
      message.error("Failed to fetch organizer events");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Your Events</h1>
          <Button
            type="primary"
            className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            onClick={showModal}
          >
            Create New Event
          </Button>
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
                    <Button>View Listing</Button>
                  </Link>,
                  <Link key="edit" href={`/events/${event._id}/edit`}>
                    <Button>Edit Event</Button>
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
                        <Text>Total Attendees: {event.attendees.length}</Text>
                      </Space>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
      <Modal
        title="Create New Event"
        open={isModalVisible}
        onOk={() => router.push("/events/new/edit")}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <p>Are you sure you want to create a new event?</p>
      </Modal>
    </div>
  );
}

export default OrganizerDashboard;
