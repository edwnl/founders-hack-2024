// app/matchmaker/[event-id]/page.js
"use client";

import {useEffect, useState} from "react";
import {Button, Card, Col, Row, Statistic, Tag} from "antd";
import {CalendarOutlined, CloseOutlined, HeartOutlined, TeamOutlined,} from "@ant-design/icons";
import {getAttendeesOfAnEvent} from "@/app/matchmaker/[event_id]/service";
import Image from "next/image";

const MatchmakerEventPage = ({ params }) => {
  const [attendees, setAttendees] = useState([]);
  const [currentAttendeeIndex, setCurrentAttendeeIndex] = useState(0);
  const eventID = params.event_id;
  useEffect(() => {
    // Fetch attendees for the event
    const getData = async () => {
      const data = await getAttendeesOfAnEvent(eventID);
      setAttendees(data);
    }

    getData().catch(console.error)
    // Fetch recommendation
    // (async () => {
    //   // "use server";
    //   // const matches = await findMatches("1");
    //   console.log("matches")
    //   console.log( matches);
    // })()
  }, []);

  const handleLike = () => {
    // TODO: Implement like logic here
   };

  const handleDislike = () => {
    // Implement dislike logic here
    setCurrentAttendeeIndex((prevIndex) => prevIndex + 1);
  };

  if (attendees.length === 0 || currentAttendeeIndex >= attendees.length) {
    return (
      <div className="min-h-screen bg-background p-8 flex justify-center items-center">
        <Card>No more attendees to display.</Card>
      </div>
    );
  }

  const currentAttendee = attendees[currentAttendeeIndex];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center">
              <h2 className="text-xl font-bold">
                {currentAttendee.matchmaker_name}, {currentAttendee.age}
              </h2>
              <p>{currentAttendee.location}</p>
              <Tag
                color={
                  currentAttendee.matchmaker_preference === "FRIENDS"
                    ? "blue"
                    : "pink"
                }
              >
                {currentAttendee.matchmaker_preference === "FRIENDS"
                  ? "Looking for Friends"
                  : "More than Friends"}
              </Tag>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center">
              <p className="text-center">{currentAttendee.matchmaker_bio}</p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Image
              src={currentAttendee.matchmaker_pictures[0]}
              alt="Profile 1"
              className="w-full h-[416px] object-cover rounded-lg"
              width={400}
              height={600}
            />
          </Col>
          <Col xs={24} md={8}>
            <Image
              src={currentAttendee.matchmaker_pictures[1]}
              alt="Profile 2"
              className="w-full h-[416px] object-cover rounded-lg"
              width={400}
              height={600}
            />
          </Col>
          <Col xs={24} md={8}>
            <Image
              src={currentAttendee.matchmaker_pictures[2]}
              alt="Profile 3"
              className="w-full h-[416px] object-cover rounded-lg"
              width={400}
              height={600}
            />
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center">
              <p className="text-sm">
                {Object.keys(currentAttendee.matchmaker_prompts)[0]}
              </p>
              <p className="text-lg font-bold">
                {Object.values(currentAttendee.matchmaker_prompts)[0]}
              </p>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center">
              <p className="text-sm">
                {Object.keys(currentAttendee.matchmaker_prompts)[1]}
              </p>
              <p className="text-lg font-bold">
                {Object.values(currentAttendee.matchmaker_prompts)[1]}
              </p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Image
              src={currentAttendee.matchmaker_pictures[3]}
              alt="Profile 4"
              className="w-full h-[416px] object-cover rounded-lg"
              width={400}
              height={600}
            />
          </Col>
          <Col xs={24} md={8}>
            <Image
              src={currentAttendee.matchmaker_pictures[4]}
              alt="Profile 5"
              className="w-full h-[416px] object-cover rounded-lg"
              width={400}
              height={600}
            />
          </Col>
          <Col xs={24} md={8}>
            <Image
              src={currentAttendee.matchmaker_pictures[5]}
              alt="Profile 6"
              className="w-full h-[416px] object-cover rounded-lg"
              width={400}
              height={600}
            />
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center">
              <p className="text-sm">
                {Object.keys(currentAttendee.matchmaker_prompts)[2]}
              </p>
              <p className="text-lg font-bold">
                {Object.values(currentAttendee.matchmaker_prompts)[2]}
              </p>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Events Attended"
                    value={currentAttendee.events_attended}
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Matching Events"
                    value={currentAttendee.matching_events}
                    prefix={<TeamOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={handleDislike}
            size="large"
            className="bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90"
          />
          <Button
            shape="circle"
            icon={<HeartOutlined />}
            onClick={handleLike}
            size="large"
            className="bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          />
        </div>
      </div>
    </div>
  );
};

export default MatchmakerEventPage;
