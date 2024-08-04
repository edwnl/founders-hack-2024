// app/matchmaker/[event-id]/page.js
"use client";

import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Statistic, Tag } from "antd";
import {
  CalendarOutlined,
  CloseOutlined,
  HeartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { fetchMatchmakerProfiles } from "./actions";
import { useAuth } from "@/contexts/AuthContext";

const MatchmakerEventPage = ({ params }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matched, setMatched] = useState(false);
  const eventID = params.event_id;
  const { user } = useAuth();

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        if (user) {
          const fetchedProfiles = await fetchMatchmakerProfiles(
            eventID,
            user.uid,
          );
          setProfiles(fetchedProfiles);
        }
      } catch (error) {
        console.error("Error loading profiles:", error);
        // You might want to set an error state here and display it to the user
      }
    };

    loadProfiles();
  }, [eventID, user]);

  const handleLike = async () => {
    // Implement like logic here
    // You may want to create another server action for this
    console.log("Liked:", currentProfile.id);
    setCurrentProfileIndex((prevIndex) => prevIndex + 1);
  };

  const handleDislike = () => {
    setCurrentProfileIndex((prevIndex) => prevIndex + 1);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (profiles.length === 0 || currentProfileIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-background p-8 flex justify-center items-center">
        <Card>No more profiles to display.</Card>
      </div>
    );
  }

  const currentProfile = profiles[currentProfileIndex];
  const matchmakerData = currentProfile.matchmaker;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center">
              <h2 className="text-xl font-bold">
                {matchmakerData.matchmaker_name},{" "}
                {calculateAge(matchmakerData.date_of_birth)}
              </h2>
              <p>{matchmakerData.location}</p>
              <Tag
                color={
                  matchmakerData.matchmaker_preference === "FRIENDS"
                    ? "blue"
                    : "pink"
                }
              >
                {matchmakerData.matchmaker_preference === "FRIENDS"
                  ? "Looking for Friends"
                  : "More than Friends"}
              </Tag>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center">
              <p className="text-center">{matchmakerData.matchmaker_bio}</p>
            </Card>
          </Col>
          {matchmakerData.matchmaker_pictures.map((pic, index) => (
            <Col xs={24} md={8} key={index}>
              <Image
                src={pic}
                alt={`Profile ${index + 1}`}
                className="w-full h-[416px] object-cover rounded-lg"
                width={400}
                height={600}
              />
            </Col>
          ))}
          {Object.values(matchmakerData.matchmaker_prompts).map(
            (prompt, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="h-[200px] flex flex-col justify-center">
                  <p className="text-sm">{prompt.question}</p>
                  <p className="text-lg font-bold">{prompt.answer}</p>
                </Card>
              </Col>
            ),
          )}
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Events Attended"
                    value={Object.keys(currentProfile.tickets || {}).length}
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Organised Events"
                    value={(currentProfile.organised_events || []).length}
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
