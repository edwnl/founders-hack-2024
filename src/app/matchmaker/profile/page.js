// app/matchmaker/profile/page.js
"use client";

import { useState, useEffect } from "react";
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
  message,
  Form,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { withGuard } from "@/components/GuardRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  loadMatchmakerProfile,
  saveMatchmakerProfile,
  updateDateOfBirth,
} from "./actions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebase/config";
import moment from "moment";
import { Timestamp } from "@firebase/firestore";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const prompts = {
  prompt1: [
    "What's your favorite way to spend a weekend?",
    "If you could learn any skill instantly, what would it be?",
    "What's the most adventurous thing you've ever done?",
  ],
  prompt2: [
    "What's your go-to comfort food?",
    "If you could only eat one cuisine for the rest of your life, what would it be?",
    "What's the weirdest food combination you enjoy?",
  ],
  prompt3: [
    "What's one thing you can't stand?",
    "If you could change one thing about the world, what would it be?",
    "What's a popular opinion you disagree with?",
  ],
};

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
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    matchmaker_name: "",
    date_of_birth: null,
    location: "",
    matchmaker_preference: "",
    matchmaker_bio: "",
    matchmaker_pictures: [null, null, null, null, null, null],
    matchmaker_prompts: {},
    events_attended: 0,
    matching_events: 0,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dobModalVisible, setDobModalVisible] = useState(false);
  const [selectedDOB, setSelectedDOB] = useState(null);
  const [newImages, setNewImages] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    console.log("Profile state updated:", profile);
  }, [profile]);
    async function fetchProfile() {
      if (user) {
        const result = await loadMatchmakerProfile(user.uid);
        if (result.success) {
          const profileData = result.data;
          setProfile((prevProfile) => ({
            ...prevProfile,
            ...profileData,
          }));
          form.setFieldsValue(profileData);
          if (!profileData.date_of_birth) {
            setDobModalVisible(true);
          }
        } else {
          message.error(result.error);
        }
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user, form]);

  const handleProfileChange = (field, value) => {
    console.log(
      `handleProfileChange called with field: ${field}, value:`,
      value,
    );
    setProfile((prevProfile) => {
      const newProfile = { ...prevProfile, [field]: value };
      console.log("Previous profile:", prevProfile);
      console.log("New profile:", newProfile);
      return newProfile;
    });
  };

  const handlePromptChange = (promptKey, value) => {
    console.log(
      `handlePromptChange called with promptKey: ${promptKey}, value:`,
      value,
    );
    setProfile((prevProfile) => {
      const newProfile = {
        ...prevProfile,
        matchmaker_prompts: {
          ...prevProfile.matchmaker_prompts,
          [promptKey]: value,
        },
      };
      console.log("Previous profile:", prevProfile);
      console.log("New profile:", newProfile);
      return newProfile;
    });
  };

  const handleImageUpload = (index, info) => {
    if (info.file.status === "done") {
      const newImagesCopy = [...newImages];
      newImagesCopy[index] = info.file.originFileObj;
      setNewImages(newImagesCopy);

      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(info.file.originFileObj);
      const newPictures = [...profile.matchmaker_pictures];
      newPictures[index] = info.file.response.url; // Assuming the server returns the image URL
      newPictures[index] = previewUrl;
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

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();

      console.log(values);

      // Check if all required fields are filled
      if (
        !values.matchmaker_bio ||
        !values.location ||
        !values.matchmaker_preference
      ) {
        message.error("Please fill out your bio, city, and preferences.");
        return;
      }

      // Check if at least one image is uploaded
      if (!profile.matchmaker_pictures.some((pic) => pic !== null)) {
        message.error("Please upload at least one image.");
        return;
      }

      // Check if all prompts are filled
      const promptValues = [values.prompt_1, values.prompt_2, values.prompt_3];
      const matchmaker_prompts = {};
      let allPromptsFilledOut = true;

      promptValues.forEach((promptValue, index) => {
        if (promptValue && promptValue.question && promptValue.answer) {
          matchmaker_prompts[promptValue.question] = promptValue.answer;
        } else {
          allPromptsFilledOut = false;
        }
      });

      if (!allPromptsFilledOut) {
        message.error("Please complete all three prompts before saving.");
        return;
      }

      // Upload new images
      const updatedPictures = [...profile.matchmaker_pictures];
      for (let i = 0; i < newImages.length; i++) {
        if (newImages[i]) {
          const file = newImages[i];
          const storageRef = ref(
            storage,
            `matchmaker_images/${user.uid}/${Date.now()}_${file.name}`,
          );
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          updatedPictures[i] = url;
        }
      }

      const profileData = {
        ...values,
        matchmaker_prompts,
        matchmaker_pictures: updatedPictures,
      };

      const result = await saveMatchmakerProfile(user.uid, profileData);
      if (result.success) {
        message.success(result.message);
        setNewImages([null, null, null, null, null, null]);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error("Please fill in all required fields.");
    }
  };

  const renderEditModal = () => {
    let content;
    switch (editingField) {
      case "Personal Info":
        content = (
          <>
            <Input
              placeholder="Name"
              value={profile.matchmaker_name}
              onChange={(e) =>
                handleProfileChange("matchmaker_name", e.target.value)
              }
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
      case "Prompt 1":
      case "Prompt 2":
      case "Prompt 3":
        const promptKey = editingField;
        content = (
          <>
            <Select
              style={{ width: "100%" }}
              placeholder="Select a prompt"
              value={profile.matchmaker_prompts?.[promptKey]?.question}
              onChange={(value) =>
                handlePromptChange(promptKey, { question: value, answer: "" })
              }
            >
              {prompts[promptKey].map((prompt) => (
                <Option key={prompt} value={prompt}>
                  {prompt}
                </Option>
              ))}
            </Select>
            <Input.TextArea
              style={{ marginTop: "10px" }}
              placeholder="Your answer"
              value={profile.matchmaker_prompts?.[promptKey]?.answer || ""}
              onChange={(e) =>
                handlePromptChange(promptKey, {
                  question: profile.matchmaker_prompts?.[promptKey]?.question,
                  answer: e.target.value,
                })
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8 pb-24">
      <div className="max-w-5xl mx-auto">
        <Form form={form} onFinish={handleSaveProfile}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className="h-[200px] flex flex-col justify-center relative">
                <Button
                  className="absolute top-2 right-2"
                  icon={<EditOutlined />}
                  onClick={() => showEditModal("Personal Info")}
                />
                <Title level={4}>{profile.matchmaker_name}</Title>
                <p>
                  Age:{" "}
                  {profile.date_of_birth
                    ? moment().diff(
                        moment(profile.date_of_birth.toDate()),
                        "years",
                      )
                    : "Not set"}
                </p>
                <p>{profile.location}</p>
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
              </Card>
              <Card className="mt-4 h-[200px] flex flex-col justify-center relative">
                <Button
                  className="absolute top-2 right-2"
                  icon={<EditOutlined />}
                  onClick={() => showEditModal("bio")}
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
                  onClick={() => showEditModal("Prompt 1")}
                />
                <Title level={5}>
                  {profile.matchmaker_prompts?.prompt1?.question ||
                    "Select a prompt"}
                </Title>
                <Paragraph>
                  {profile.matchmaker_prompts?.prompt1?.answer ||
                    "Your answer here..."}
                </Paragraph>
              </Card>
              <Card className="mt-4 h-[200px] flex flex-col justify-center relative">
                <Button
                  className="absolute top-2 right-2"
                  icon={<EditOutlined />}
                  onClick={() => showEditModal("Prompt 2")}
                />
                <Title level={5}>
                  {profile.matchmaker_prompts?.prompt2?.question ||
                    "Select a prompt"}
                </Title>
                <Paragraph>
                  {profile.matchmaker_prompts?.prompt2?.answer ||
                    "Your answer here..."}
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
                  onClick={() => showEditModal("Prompt 3")}
                />
                <Title level={5}>
                  {profile.matchmaker_prompts?.prompt3?.question ||
                    "Select a prompt"}
                </Title>
                <Paragraph>
                  {profile.matchmaker_prompts?.prompt3?.answer ||
                    "Your answer here..."}
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
        </Form>
      </div>
      {renderEditModal()}
      <div className="fixed bottom-0 left-0 right-0 bg-background p-4 shadow-md">
        <div className="max-w-48 mx-auto">
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSaveProfile}
            block
          >
            Save Profile
          </Button>
        </div>
      </div>
      <Modal
        title="Set Your Date of Birth"
        open={dobModalVisible}
        onOk={async () => {
          if (selectedDOB) {
            const dobTimestamp = Timestamp.fromDate(selectedDOB.toDate());
            const result = await updateDateOfBirth(user.uid, dobTimestamp);
            if (result.success) {
              handleProfileChange("date_of_birth", dobTimestamp);
              setDobModalVisible(false);
              message.success("Date of birth updated successfully");
            } else {
              message.error(result.error);
            }
          } else {
            message.error("Please select your date of birth");
          }
        }}
        onCancel={() => setDobModalVisible(false)}
        closable={false}
        maskClosable={false}
      >
        <p>
          We need your date of birth to ensure you are eligible for our service
          and to provide you with age-appropriate matches. Please note that this
          information cannot be changed later.
        </p>
        <Form.Item
          name="date_of_birth"
          label="Date of Birth"
          rules={[
            { required: true, message: "Please select your date of birth" },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            onChange={(date) => setSelectedDOB(date)}
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default withGuard(MatchmakerProfilePage, {
  requireAuth: true,
  requiredMode: "user",
});
