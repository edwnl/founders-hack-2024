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
  Spin,
} from "antd";
import {
  EditOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  TagOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import dayjs from "dayjs";
import { withGuard } from "@/components/GuardRoute";
import { createEvent, loadEvent, updateEvent, uploadImage } from "./actions";
import NO_IMAGE_LANDSCAPE from "../../../../public/no-image-landscape.png";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../../firebase/config";
import { useAuth } from "@/contexts/AuthContext";
const { RangePicker } = DatePicker;
const { TextArea } = Input;

function EditEvent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(NO_IMAGE_LANDSCAPE);
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const event_id = params.event_id;
  const [isNewEvent, setNewEvent] = useState(event_id === "new");

  useEffect(() => {
    async function fetchEvent() {
      if (!isNewEvent) {
        const result = await loadEvent(event_id);
        if (result.success) {
          const eventData = result.data;

          form.setFieldsValue({
            ...eventData,
            event_date_time: [
              dayjs(eventData.event_start),
              dayjs(eventData.event_end),
            ],
          });

          setImageUrl(eventData.event_picture || NO_IMAGE_LANDSCAPE);
        } else {
          setError(result.error);
        }
      }
      setLoading(false);
    }
    fetchEvent();
  }, [event_id, form, isNewEvent]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let uploadedImageUrl = imageUrl;

      if (newImage) {
        const storageRef = ref(
          storage,
          `event_images/${Date.now()}_${newImage.name}`,
        );
        await uploadBytes(storageRef, newImage);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      const eventData = {
        ...values,
        event_picture: uploadedImageUrl,
        event_start: values.event_date_time[0].toISOString(),
        event_end: values.event_date_time[1].toISOString(),
        organizer_id: user.uid,
      };

      let result;
      if (isNewEvent) {
        result = await createEvent(eventData);
      } else {
        result = await updateEvent(event_id, eventData);
      }

      if (result.success) {
        message.success(result.message);
        if (isNewEvent) router.push("/dashboard");
      } else {
        message.error(result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      message.error(
        `Failed to ${isNewEvent ? "create" : "update"} event: ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);

      // Store the file for later upload
      setNewImage(file);

      message.success(
        "Image selected successfully. It will be uploaded when you save the changes.",
      );
    }
  };

  if (loading) {
    return <Spin className={"mx-auto my-auto"} spinning={loading} />;
  }

  if (error) {
    return <Card className={"mx-auto my-auto text-md"}>{error}</Card>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className={"flex"}>
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {isNewEvent ? "Create a new Event" : "Edit Event"}
          </h1>
          {!isNewEvent && (
            <Button
              onClick={() => router.push(`/events/${event_id}`)}
              className={"ml-4"}
            >
              View Event
            </Button>
          )}
        </div>

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
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                  onChange={handleImageUpload}
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
              <Col span={12}>
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
              <Col span={12}>
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
              {isNewEvent ? "Create Event" : "Save Changes"}
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
