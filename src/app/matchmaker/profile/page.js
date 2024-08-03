// app/matchmaker/profile/MatchmakerProfilePage.js
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Statistic,
  Typography,
  message,
  Upload,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  EditOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadMatchmakerProfile,
  saveMatchmakerProfile,
} from "@/app/matchmaker/profile/actions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ImgCrop from "antd-img-crop";
import { storage } from "../../../../firebase/config";

const { Title, Paragraph } = Typography;

const MatchmakerProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEditField, setCurrentEditField] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const result = await loadMatchmakerProfile(user.uid);
        if (result.success) {
          setProfile(result.data);
          console.log(result.data);
        } else {
          message.error("Failed to load profile: " + result.error);
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleEdit = (field) => {
    setCurrentEditField(field);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentEditField(null);
  };

  const [newImages, setNewImages] = useState([]);

  const renderImageUpload = (index) => (
    <ImgCrop
      rotationSlider
      aspect={9 / 16}
      modalTitle="Crop Image"
      cropShape="rect"
    >
      <Upload
        listType="picture-card"
        showUploadList={false}
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess("ok");
          }, 0);
        }}
        onChange={(info) => handleImageUpload(index, info)}
        className="!important rounded-lg overflow-hidden"
      >
        {profile.matchmaker_pictures && profile.matchmaker_pictures[index] ? (
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

  const handleImageUpload = (index, info) => {
    if (info.file.status === "done") {
      const newImagesCopy = [...newImages];
      newImagesCopy[index] = info.file.originFileObj;
      setNewImages(newImagesCopy);

      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(info.file.originFileObj);
      setProfile((prev) => ({
        ...prev,
        matchmaker_pictures: [
          ...(prev.matchmaker_pictures || []).slice(0, index),
          previewUrl,
          ...(prev.matchmaker_pictures || []).slice(index + 1),
        ],
      }));
    }
  };

  const handleSaveProfile = async () => {
    console.log(profile);
    const requiredFields = [
      "matchmaker_name",
      "location",
      "matchmaker_preference",
      "matchmaker_bio",
    ];
    const missingFields = requiredFields.filter((field) => !profile[field]);

    if (missingFields.length > 0) {
      message.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    if (newImages.filter(Boolean).length === 0) {
      message.error("Please upload at least one photo");
      return;
    }

    if (
      !profile.matchmaker_prompts ||
      Object.keys(profile.matchmaker_prompts).length < 3
    ) {
      message.error("Please answer all three prompts");
      return;
    }

    try {
      setLoading(true);
      const uploadPromises = newImages.map(async (file, index) => {
        if (file) {
          const storageRef = ref(
            storage,
            `profile_images/${user.uid}/${index}`,
          );
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        }
        return profile.matchmaker_pictures?.[index] || null;
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);

      const updatedProfile = {
        ...profile,
        matchmaker_pictures: uploadedImageUrls.filter(Boolean),
      };

      if (user) {
        const result = await saveMatchmakerProfile(user.uid, updatedProfile);
        if (result.success) {
          message.success("Profile saved successfully");
          setProfile(updatedProfile);
          setNewImages([]); // Clear the newImages array after successful save
        } else {
          message.error("Failed to save profile: " + result.error);
        }
      } else {
        message.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      message.error("An error occurred while saving the profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setProfile((prevProfile) => {
      if (updatedData.promptKey && updatedData.promptData) {
        // Handle prompt updates
        return {
          ...prevProfile,
          matchmaker_prompts: {
            ...prevProfile.matchmaker_prompts,
            [updatedData.promptKey]: updatedData.promptData,
          },
        };
      }
      // Handle other updates
      return { ...prevProfile, ...updatedData };
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8 pb-24">
      <div className="max-w-5xl mx-auto">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="h-[200px] flex flex-col justify-center relative">
              <Button
                className="absolute top-2 right-2"
                icon={<EditOutlined />}
                onClick={() => handleEdit("personalInfo")}
              />
              <Title level={4}>{profile.matchmaker_name || "Your Name"}</Title>
              <p>{profile.location || "Select City"}</p>
              {profile.matchmaker_preference ? (
                <Tag
                  color={
                    profile.matchmaker_preference === "FRIENDS"
                      ? "blue"
                      : "pink"
                  }
                >
                  {profile.matchmaker_preference === "FRIENDS"
                    ? "Looking for Friends"
                    : "More than Friends"}
                </Tag>
              ) : (
                <Tag color="default">Select a Preference</Tag>
              )}
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center relative">
              <Button
                className="absolute top-2 right-2"
                icon={<EditOutlined />}
                onClick={() => handleEdit("matchmaker_bio")}
              />
              <Paragraph>
                {profile.matchmaker_bio || "Tell us about yourself..."}
              </Paragraph>
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
                onClick={() => handleEdit("Prompt 1")}
              />
              <Title level={5}>
                {profile.matchmaker_prompts &&
                profile.matchmaker_prompts["Prompt 1"]
                  ? profile.matchmaker_prompts["Prompt 1"].question
                  : "Select a question"}
              </Title>
              <Paragraph>
                {profile.matchmaker_prompts &&
                profile.matchmaker_prompts["Prompt 1"]
                  ? profile.matchmaker_prompts["Prompt 1"].answer
                  : "Your answer here..."}
              </Paragraph>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center relative">
              <Button
                className="absolute top-2 right-2"
                icon={<EditOutlined />}
                onClick={() => handleEdit("Prompt 2")}
              />
              <Title level={5}>
                {profile.matchmaker_prompts &&
                profile.matchmaker_prompts["Prompt 2"]
                  ? profile.matchmaker_prompts["Prompt 2"].question
                  : "Select a question"}
              </Title>
              <Paragraph>
                {profile.matchmaker_prompts &&
                profile.matchmaker_prompts["Prompt 2"]
                  ? profile.matchmaker_prompts["Prompt 2"].answer
                  : "Your answer here..."}
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
                onClick={() => handleEdit("Prompt 3")}
              />
              <Title level={5}>
                {profile.matchmaker_prompts &&
                profile.matchmaker_prompts["Prompt 3"]
                  ? profile.matchmaker_prompts["Prompt 3"].question
                  : "Select a question"}
              </Title>
              <Paragraph>
                {profile.matchmaker_prompts &&
                profile.matchmaker_prompts["Prompt 3"]
                  ? profile.matchmaker_prompts["Prompt 3"].answer
                  : "Your answer here..."}
              </Paragraph>
            </Card>
            <Card className="mt-4 h-[200px] flex flex-col justify-center">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Events Attended"
                    value={
                      profile.matchmaker_tickets
                        ? profile.matchmaker_tickets.length
                        : 0
                    }
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Matching Events"
                    value={
                      profile.matchmaker_matches
                        ? profile.matchmaker_matches.length
                        : 0
                    }
                    prefix={<TeamOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-background p-4 shadow-md">
        <div className="max-w-48 mx-auto">
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            block
            onClick={handleSaveProfile}
            loading={loading}
          >
            Save Profile
          </Button>
        </div>
      </div>
      <EditModal
        visible={modalVisible}
        onClose={handleModalClose}
        field={currentEditField}
        initialValues={profile}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default MatchmakerProfilePage;
