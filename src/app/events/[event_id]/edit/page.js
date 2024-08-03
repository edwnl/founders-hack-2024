// app/events/[event_id]/edit/OrganizerDashboard.js
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
  Card,
  Descriptions,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  TagOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import dayjs from "dayjs";
import { withGuard } from "@/components/GuardRoute";
import NO_IMAGE_LANDSCAPE from "../../../../public/no-image-landscape.png";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

function EditEvent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(NO_IMAGE_LANDSCAPE);
  const router = useRouter();
  const params = useParams();
  const event_id = params.event_id;

  useEffect(() => {
    if (event_id && event_id !== "new") {
      // Simulating API call to get event data
      setTimeout(() => {
        const dummyEvent = {
          id: event_id,
          event_name: "Sample Event",
          event_description:
            "This is a sample event description. It's going to be an amazing event you don't want to miss!",
          event_location: "New York, NY",
          event_date_time: [
            dayjs().add(1, "month"),
            dayjs().add(1, "month").add(3, "hour"),
          ],
          event_price: 50,
          event_capacity: 100,
          available_tickets: 50,
        };
        form.setFieldsValue(dummyEvent);
        setImageUrl(dummyEvent.event_picture || NO_IMAGE_LANDSCAPE);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [event_id, form]);

  const onFinish = (values) => {
    console.log("Form values:", values);
    message.success("Event saved successfully!");
    router.push("/dashboard");
  };

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.response.url);
      message.success("Image uploaded successfully");
    } else if (info.file.status === "error") {
      message.error("Image upload failed");
    }
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
          <Card
            cover={
              <div className="relative w-full h-96">
                <Image
                  src={imageUrl}
                  alt="Event cover"
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Upload
                  name="event_picture"
                  showUploadList={false}
                  onChange={handleImageUpload}
                  action="/api/upload" // Replace with your actual upload endpoint
                >
                  <Button
                    icon={<EditOutlined />}
                    className="absolute bottom-4 right-4 bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  >
                    Edit Image
                  </Button>
                </Upload>
              </div>
            }
          >
            <Form.Item
              name="event_name"
              label="Event Name"
              rules={[
                { required: true, message: "Please input the event name!" },
              ]}
            >
              <Input size="large" />
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

            <Descriptions bordered>
              <Descriptions.Item label="Date & Time" span={3}>
                <Form.Item
                  name="event_date_time"
                  rules={[
                    {
                      required: true,
                      message: "Please select the event date and time!",
                    },
                  ]}
                  noStyle
                >
                  <RangePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    className="w-full"
                  />
                </Form.Item>
              </Descriptions.Item>
              <Descriptions.Item label="Location" span={3}>
                <Form.Item
                  name="event_location"
                  rules={[
                    {
                      required: true,
                      message: "Please input the event location!",
                    },
                  ]}
                  noStyle
                >
                  <Input prefix={<EnvironmentOutlined />} />
                </Form.Item>
              </Descriptions.Item>
            </Descriptions>

            <Row gutter={16} className="mt-6">
              <Col span={8}>
                <Form.Item
                  name="event_price"
                  label="Ticket Price ($)"
                  rules={[
                    {
                      required: true,
                      message: "Please input the ticket price!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    prefix={<DollarOutlined />}
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="event_capacity"
                  label="Event Capacity"
                  rules={[
                    {
                      required: true,
                      message: "Please input the event capacity!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    prefix={<TeamOutlined />}
                    className="w-full"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="available_tickets"
                  label="Available Tickets"
                  rules={[
                    {
                      required: true,
                      message: "Please input the available tickets!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    prefix={<TagOutlined />}
                    className="w-full"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 w-full"
              size="large"
            >
              {event_id === "new" ? "Create Event" : "Save Changes"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default withGuard(EditEvent, {
  requireAuth: true,
  requiredMode: "organizer",
});
