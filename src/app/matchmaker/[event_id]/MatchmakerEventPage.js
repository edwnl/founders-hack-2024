// app/matchmaker/[eventId]/MatchmakerEventPage.js
"use client";

import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Statistic, Tag } from "antd";
import {
  CalendarOutlined,
  CloseOutlined,
  HeartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const MatchmakerEventPage = ({ eventId, profiles }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentProfile, setCurrentProfile] = useState(null);

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setCurrentProfile(profiles[currentProfileIndex]);
    }
  }, [profiles, currentProfileIndex]);

  if (!profiles || profiles.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8 flex justify-center items-center">
        <Card>No matchmaker profiles available for this event.</Card>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background p-8 flex justify-center items-center">
        <Card>Loading profile...</Card>
      </div>
    );
  }

  const handleLike = () => {
    setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
  };

  const handleDislike = () => {
    setCurrentProfileIndex((prevIndex) => (prevIndex + 1) % profiles.length);
  };

  const matchmaker = currentProfile.matchmaker || {};
  const pictures = matchmaker.matchmaker_pictures || [];
  const prompts = matchmaker.matchmaker_prompts || {};

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center">
              <h2 className="text-xl font-bold">
                {matchmaker.matchmaker_name || "N/A"},{" "}
                {calculateAge(matchmaker.date_of_birth)}
              </h2>
              <Tag
                color={
                  matchmaker.matchmaker_preference === "FRIENDS"
                    ? "blue"
                    : "pink"
                }
              >
                {matchmaker.matchmaker_preference === "FRIENDS"
                  ? "Looking for Friends"
                  : "More than Friends"}
              </Tag>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center">
              <p className="text-center">
                {matchmaker.matchmaker_bio || "No bio available"}
              </p>
            </Card>
          </Col>
          {pictures.slice(0, 6).map((pic, index) => (
            <Col key={index} xs={24} md={8}>
              <Image
                src={pic}
                alt={`Profile ${index + 1}`}
                className="w-full h-[416px] object-cover rounded-lg"
                width={400}
                height={600}
              />
            </Col>
          ))}
          {Object.entries(prompts).map(([question, answer], index) => (
            <Col key={index} xs={24} md={8}>
              <Card className="h-[200px] flex flex-col justify-center">
                <p className="text-sm">{question}</p>
                <p className="text-lg font-bold">{answer}</p>
              </Card>
            </Col>
          ))}
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Events Attended"
                    value={
                      currentProfile.tickets ? currentProfile.tickets.length : 0
                    }
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Matching Events"
                    value={
                      matchmaker.matchmaker_tickets
                        ? matchmaker.matchmaker_tickets.length
                        : 0
                    }
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

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return "N/A";
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export default MatchmakerEventPage;
