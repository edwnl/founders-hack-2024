// app/matchmaker/profile/page.js
"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Statistic,
  Typography,
  Select,
  Input,
  DatePicker,
  Upload,
  Modal,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import moment from "moment";
import ImgCrop from "antd-img-crop";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const prompts = [
  "What's your ideal first date?",
  "Your go-to karaoke song?",
  "Beach or mountains?",
  "What's your favorite travel memory?",
  "If you could have dinner with anyone, who would it be?",
  "What's your most unusual talent?",
];

const australianCities = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Gold Coast",
  "Newcastle",
  "Canberra",
  "Wollongong",
  "Hobart",
];

const MatchmakerProfilePage = () => {
  const [profile, setProfile] = useState({
    matchmaker_name: "Your Name",
    birthdate: moment().subtract(25, "years"),
    location: "Sydney",
    matchmaker_preference: "FRIENDS",
    matchmaker_bio: "Write a short bio about yourself...",
    matchmaker_pictures: [
      "https://picsum.photos/400/400", // Example of an already uploaded image
      null,
      null,
      null,
      null,
      null,
    ],
    matchmaker_prompts: {
      "What's your ideal first date?":
        "A cozy coffee shop and a walk in the park.",
      "Your go-to karaoke song?": "Don't Stop Believin' by Journey",
      "Beach or mountains?":
        "Mountains all the way! Love the fresh air and hiking trails.",
    },
    events_attended: 0,
    matching_events: 0,
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const handleProfileChange = (field, value) => {
    setProfile((prevProfile) => ({ ...prevProfile, [field]: value }));
  };

  const handlePromptChange = (index, question, answer) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      matchmaker_prompts: {
        ...prevProfile.matchmaker_prompts,
        [question]: answer,
      },
    }));
  };

  const handleImageUpload = (index, info) => {
    if (info.file.status === "done") {
      const newPictures = [...profile.matchmaker_pictures];
      newPictures[index] = info.file.response.url; // Assuming the server returns the image URL
      handleProfileChange("matchmaker_pictures", newPictures);
    }
  };

  const showEditModal = (field) => {
    setEditingField(field);
    setEditModalVisible(true);
  };

  const handleEditModalOk = () => {
    setEditModalVisible(false);
    setEditingField(null);
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
    setEditingField(null);
  };

  const renderEditModal = () => {
    let content;
    switch (editingField) {
      case "personalInfo":
        content = (
          <>
            <Input
              placeholder="Name"
              value={profile.matchmaker_name}
              onChange={(e) =>
                handleProfileChange("matchmaker_name", e.target.value)
              }
            />
            <DatePicker
              style={{ width: "100%", marginTop: "10px" }}
              value={profile.birthdate}
              onChange={(date) => handleProfileChange("birthdate", date)}
            />
            <Select
              style={{ width: "100%", marginTop: "10px" }}
              value={profile.location}
              onChange={(value) => handleProfileChange("location", value)}
            >
              {australianCities.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
            <Select
              style={{ width: "100%", marginTop: "10px" }}
              value={profile.matchmaker_preference}
              onChange={(value) =>
                handleProfileChange("matchmaker_preference", value)
              }
            >
              <Option value="FRIENDS">Looking for Friends</Option>
              <Option value="MORE_THAN_FRIENDS">More than Friends</Option>
            </Select>
          </>
        );
        break;
      case "bio":
        content = (
          <Input.TextArea
            value={profile.matchmaker_bio}
            onChange={(e) =>
              handleProfileChange("matchmaker_bio", e.target.value)
            }
            rows={4}
          />
        );
        break;
      case "prompt1":
      case "prompt2":
      case "prompt3":
        const index = parseInt(editingField.slice(-1)) - 1;
        content = (
          <>
            <Select
              style={{ width: "100%" }}
              placeholder="Select a prompt"
              value={Object.keys(profile.matchmaker_prompts)[index]}
              onChange={(value) => handlePromptChange(index, value, "")}
            >
              {prompts.map((prompt) => (
                <Option key={prompt} value={prompt}>
                  {prompt}
                </Option>
              ))}
            </Select>
            <Input.TextArea
              style={{ marginTop: "10px" }}
              placeholder="Your answer"
              value={Object.values(profile.matchmaker_prompts)[index] || ""}
              onChange={(e) =>
                handlePromptChange(
                  index,
                  Object.keys(profile.matchmaker_prompts)[index],
                  e.target.value,
                )
              }
            />
          </>
        );
        break;
      default:
        content = null;
    }

    return (
      <Modal
        title={`Edit ${editingField}`}
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        {content}
      </Modal>
    );
  };

  const renderImageUpload = (index) => (
    <ImgCrop rotate aspect={1} modalTitle="Crop Image" shape="round">
      <Upload
        listType="picture-card"
        showUploadList={false}
        action="/api/upload" // You need to implement this API endpoint
        onChange={(info) => handleImageUpload(index, info)}
        className={`!important rounded-lg overflow-hidden`}
      >
        {profile.matchmaker_pictures[index] ? (
          <img
            src={profile.matchmaker_pictures[index]}
            alt={`Profile ${index + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </ImgCrop>
  );

  return (
    <div className="min-h-screen bg-background p-8 pb-24">
      <div className="max-w-5xl mx-auto">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center relative">
              <Button
                className="absolute top-2 right-2"
                icon={<EditOutlined />}
                onClick={() => showEditModal("personalInfo")}
              />
              <Title level={4}>{profile.matchmaker_name}</Title>
              <p>Age: {moment().diff(profile.birthdate, "years")}</p>
              <p>{profile.location}</p>
              <Tag
                color={
                  profile.matchmaker_preference === "FRIENDS" ? "blue" : "pink"
                }
              >
                {profile.matchmaker_preference === "FRIENDS"
                  ? "Looking for Friends"
                  : "More than Friends"}
              </Tag>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center relative">
              <Button
                className="absolute top-2 right-2"
                icon={<EditOutlined />}
                onClick={() => showEditModal("bio")}
              />
              <Paragraph>{profile.matchmaker_bio}</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            {renderImageUpload(0)}
          </Col>
          <Col xs={24} md={8}>
            {renderImageUpload(1)}
          </Col>

          <Col xs={24} md={8}>
            {renderImageUpload(2)}
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center relative">
              <Button
                className="absolute top-2 right-2"
                icon={<EditOutlined />}
                onClick={() => showEditModal("prompt1")}
              />
              <Title level={5}>
                {Object.keys(profile.matchmaker_prompts)[0]}
              </Title>
              <Paragraph>
                {Object.values(profile.matchmaker_prompts)[0]}
              </Paragraph>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center relative">
              <Button
                className="absolute top-2 right-2"
                icon={<EditOutlined />}
                onClick={() => showEditModal("prompt2")}
              />
              <Title level={5}>
                {Object.keys(profile.matchmaker_prompts)[1]}
              </Title>
              <Paragraph>
                {Object.values(profile.matchmaker_prompts)[1]}
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            {renderImageUpload(3)}
          </Col>

          <Col xs={24} md={8}>
            {renderImageUpload(4)}
          </Col>
          <Col xs={24} md={8}>
            {renderImageUpload(5)}
          </Col>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center relative">
              <Button
                className="absolute top-2 right-2"
                icon={<EditOutlined />}
                onClick={() => showEditModal("prompt3")}
              />
              <Title level={5}>
                {Object.keys(profile.matchmaker_prompts)[2]}
              </Title>
              <Paragraph>
                {Object.values(profile.matchmaker_prompts)[2]}
              </Paragraph>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Events Attended"
                    value={profile.events_attended}
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Matching Events"
                    value={profile.matching_events}
                    prefix={<TeamOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      {renderEditModal()}
      <div className="fixed bottom-0 left-0 right-0 bg-background p-4 shadow-md">
        <div className="max-w-48 mx-auto">
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={() => console.log(profile)}
            block
          >
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchmakerProfilePage;