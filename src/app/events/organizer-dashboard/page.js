// app/events/organizer-dashboard/page.js
"use client";

import { useState } from "react";
import { Button, List, Modal } from "antd";
import Link from "next/link";
import { dummyEvents } from "@/app/events/organizer-dashboard/dummy-data";

export default function OrganizerDashboard() {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
            onClick={showModal}
            className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          >
            Create New Event
          </Button>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={dummyEvents}
          renderItem={(event) => (
            <List.Item
              className="mb-4 overflow-hidden flex flex-col md:flex-row"
              actions={[
                <Link key="view" href={`/events/${event._id}`}>
                  <Button>View Listing</Button>
                </Link>,
                <Link key="edit" href={`/events/${event._id}/edit`}>
                  <Button>Edit Event</Button>
                </Link>,
              ]}
            >
              <div className="flex items-center w-full">
                <div className="w-48 h-27 mr-4 overflow-hidden rounded-lg">
                  <img
                    src={event.event_picture}
                    alt={event.event_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <List.Item.Meta
                  title={event.event_name}
                  description={
                    <>
                      <p>{event.event_location}</p>
                      <p>
                        {event.event_start.toLocaleDateString()}
                        {""}
                        {event.event_start.toLocaleTimeString()} -
                        {event.event_end.toLocaleDateString()}{" "}
                        {event.event_end.toLocaleTimeString()}
                      </p>
                      <p>Price: ${event.event_price}</p>
                      <p>Current Attendees: {event.attendees.length}</p>
                    </>
                  }
                />
              </div>
            </List.Item>
          )}
        />
        <Modal
          title="Create New Event"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="create"
              type="primary"
              onClick={handleCancel}
              className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            >
              Create
            </Button>,
          ]}
        >
          <p>Event creation form will be added here.</p>
        </Modal>
      </div>
    </div>
  );
}
