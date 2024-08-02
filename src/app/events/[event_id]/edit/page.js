// app/events/[event_id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export default function EditEvent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const event_id = params.event_id;

  useEffect(() => {
    console.log(event_id);
    if (event_id && event_id !== "new") {
      // Simulating API call to get event data
      setTimeout(() => {
        const dummyEvent = {
          event_name: "Sample Event",
          event_description: "This is a sample event description.",
          event_location: "New York, NY",
          event_price: 50,
          event_capacity: 100,
        };
        form.setFieldsValue(dummyEvent);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [event_id, form]);

  const onFinish = (values) => {
    console.log("Form values:", values);
    message.success("Event saved successfully!");
    router.push("/events/organizer-dashboard");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          {event_id === "new" ? "Create New Event" : "Edit Event"}
        </h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            name="event_name"
            label="Event Name"
            rules={[
              { required: true, message: "Please input the event name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="event_description"
            label="Event Description"
            rules={[
              {
                required: true,
                message: "Please input the event description!",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="event_location"
            label="Event Location"
            rules={[
              { required: true, message: "Please input the event location!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="event_date_time"
            label="Event Date and Time"
            rules={[
              {
                required: true,
                message: "Please select the event date and time!",
              },
            ]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="event_price"
            label="Ticket Price ($)"
            rules={[
              { required: true, message: "Please input the ticket price!" },
            ]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="event_capacity"
            label="Event Capacity"
            rules={[
              { required: true, message: "Please input the event capacity!" },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="event_picture"
            label="Event Picture"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload name="event_picture" listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Event Picture</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            >
              {event_id === "new" ? "Create Event" : "Save Changes"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
