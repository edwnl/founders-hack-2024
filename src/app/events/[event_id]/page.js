"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Modal,
  InputNumber,
  message,
  Card,
  Descriptions,
  Statistic,
  Row,
  Col,
  Steps,
  Result,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  TagOutlined,
  ShoppingCartOutlined,
  CheckOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import dayjs from "dayjs";
import { withGuard } from "@/components/GuardRoute";
import { useAuth } from "@/contexts/AuthContext";
import { buyTickets, fetchEvent } from "@/app/events/[event_id]/actions";

function EventDetails() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const params = useParams();
  const router = useRouter();
  const event_id = params.event_id;
  const { user } = useAuth();

  async function getEventData() {
    setLoading(true);
    const result = await fetchEvent(event_id);
    if (result.success) {
      setEvent(result.data);
    } else {
      message.error(result.error);
    }
    setLoading(false);
  }

  useEffect(() => {
    getEventData();
  }, [event_id]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    setCheckoutStep(0);
    setTicketQuantity(1);
  };

  const handleBuyTickets = async () => {
    if (checkoutStep === 0) {
      setCheckoutStep(1);
    } else {
      try {
        // Simulating payment process
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = await buyTickets(event_id, user.uid, ticketQuantity);

        if (result.success) {
          message.success(result.message);
          setCheckoutStep(2);
        } else {
          message.error(result.error);
        }
      } catch (error) {
        message.error("Error processing the transaction.");
        console.error("Error: ", error);
      }
    }
  };

  const goToMatchmaking = () => {
    router.push(`/matchmaker/${event_id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background p-8 flex justify-center items-center">
        <Result
          status="404"
          title="Event Not Found"
          subTitle="Sorry, the event you are looking for does not exist."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className={"flex"}>
          <h1 className="text-3xl font-bold text-foreground mb-6">
            View Event
          </h1>
          {user && user.uid === event.organizer_id && (
            <Button
              onClick={() => router.push(`/events/${event_id}/edit`)}
              className={"ml-4"}
            >
              Edit Event
            </Button>
          )}
        </div>
        <Card
          cover={
            <div className="relative w-full h-96">
              <Image
                src={event.event_picture}
                alt={event.event_name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          }
        >
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {event.event_name}
          </h1>
          <p className="text-muted-foreground mb-6">
            {event.event_description}
          </p>

          <Descriptions bordered>
            <Descriptions.Item label="Date" span={3}>
              <CalendarOutlined className="mr-2" />
              {dayjs(event.event_start).format("MMMM D, YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Time" span={3}>
              <CalendarOutlined className="mr-2" />
              {dayjs(event.event_start).format("h:mm A")} -{" "}
              {dayjs(event.event_end).format("h:mm A")}
            </Descriptions.Item>
            <Descriptions.Item label="Location" span={3}>
              <EnvironmentOutlined className="mr-2" />
              {event.event_location}
            </Descriptions.Item>
          </Descriptions>

          <Row gutter={16} className="mt-6">
            <Col span={8}>
              <Statistic
                title="Price"
                value={event.event_price}
                prefix={<DollarOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Capacity"
                value={event.event_capacity}
                prefix={<TeamOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Available Tickets"
                value={event.event_capacity}
                prefix={<TagOutlined />}
              />
            </Col>
          </Row>
        </Card>

        <Button
          type="primary"
          size="large"
          onClick={showModal}
          className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 w-full mt-6"
        >
          Buy Tickets
        </Button>
      </div>

      <Modal
        title={checkoutStep === 2 ? "Purchase Successful" : "Buy Tickets"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Steps
          current={checkoutStep}
          items={[
            { title: "Select", icon: <ShoppingCartOutlined /> },
            { title: "Pay", icon: <DollarOutlined /> },
            { title: "Done", icon: <CheckOutlined /> },
          ]}
          className="mb-6"
        />

        {checkoutStep === 0 && (
          <div>
            <Descriptions bordered column={1} className="mb-4">
              <Descriptions.Item label="Event">
                {event.event_name}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {dayjs(event.event_start).format("MMMM D, YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                {dayjs(event.event_start).format("h:mm A")} -{" "}
                {dayjs(event.event_end).format("h:mm A")}
              </Descriptions.Item>
              <Descriptions.Item label="Price per Ticket">
                ${event.event_price}
              </Descriptions.Item>
            </Descriptions>
            <div className="flex items-center justify-between mb-4">
              <span>Number of Tickets:</span>
              <InputNumber
                min={1}
                max={event.available_tickets}
                value={ticketQuantity}
                onChange={setTicketQuantity}
              />
            </div>
            <Statistic
              title="Total"
              value={event.event_price * ticketQuantity}
              prefix="$"
              className="mb-4"
            />
            <Button
              type="primary"
              onClick={handleBuyTickets}
              className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 w-full"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
        {checkoutStep === 1 && (
          <div>
            <Descriptions bordered column={1} className="mb-4">
              <Descriptions.Item label="Event">
                {event.event_name}
              </Descriptions.Item>
              <Descriptions.Item label="Tickets">
                {ticketQuantity}
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                ${event.event_price * ticketQuantity}
              </Descriptions.Item>
            </Descriptions>
            <Button
              type="primary"
              onClick={handleBuyTickets}
              className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 w-full"
            >
              Confirm Payment
            </Button>
          </div>
        )}
        {checkoutStep === 2 && (
          <div>
            <Result
              status="success"
              title="Purchase Successful!"
              subTitle={`You have successfully purchased ${ticketQuantity} ticket(s) for ${event.event_name}.`}
            />
            <Card
              title={
                <>
                  <HeartOutlined /> Meetix Matchmaker
                </>
              }
              className="mb-4"
            >
              <p>
                Meetix Matchmaker helps you connect with other attendees before
                the event. Find potential friends or dates who share your
                interests!
              </p>
              <Button
                type="primary"
                onClick={goToMatchmaking}
                className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 mt-2"
              >
                Try Matchmaker
              </Button>
            </Card>
            <div className="flex justify-between">
              <Button onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button onClick={handleCancel}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default withGuard(EventDetails, { requireAuth: true });
