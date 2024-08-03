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
  "Prompt 1": [
    "What's your favorite way to spend a weekend?",
    "If you could learn any skill instantly, what would it be?",
    "What's the most adventurous thing you've ever done?",
  ],
  "Prompt 2": [
    "What's your go-to comfort food?",
    "If you could only eat one cuisine for the rest of your life, what would it be?",
    "What's the weirdest food combination you enjoy?",
  ],
  "Prompt 3": [
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
  const [profileForm] = Form.useForm();
  const [editForm] = Form.useForm();
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
    // Update profile form fields when profile changes
    profileForm.setFieldsValue({
      matchmaker_name: profile.matchmaker_name,
      location: profile.location,
      matchmaker_preference: profile.matchmaker_preference,
      matchmaker_bio: profile.matchmaker_bio,
      prompt_1: profile.matchmaker_prompts?.["Prompt 1"],
      prompt_2: profile.matchmaker_prompts?.["Prompt 2"],
      prompt_3: profile.matchmaker_prompts?.["Prompt 3"],
    });
  }, [profile, profileForm]);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const result = await loadMatchmakerProfile(user.uid);
        if (result.success) {
          const profileData = result.data;
          setProfile((prevProfile) => ({
            ...prevProfile,
            ...profileData,
          }));
          profileForm.setFieldsValue(profileData);
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
  }, [user, profileForm]);

  const handleImageUpload = (index, info) => {
    if (info.file.status === "done") {
      const newImagesCopy = [...newImages];
      newImagesCopy[index] = info.file.originFileObj;
      setNewImages(newImagesCopy);

      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(info.file.originFileObj);
      const newPictures = [...profile.matchmaker_pictures];
      newPictures[index] = previewUrl;
      setProfile((prev) => ({
        ...prev,
        matchmaker_pictures: newPictures,
      }));
    }
  };

  const showEditModal = (field) => {
    setEditingField(field);
    // Set the initial values for the edit form
    if (field === "Personal Info") {
      editForm.setFieldsValue({
        matchmaker_name: profile.matchmaker_name,
        location: profile.location,
        matchmaker_preference: profile.matchmaker_preference,
      });
    } else if (field === "bio") {
      editForm.setFieldsValue({
        matchmaker_bio: profile.matchmaker_bio,
      });
    } else if (field.startsWith("Prompt")) {
      const promptKey = field.toLowerCase().replace(" ", "_");
      editForm.setFieldsValue({
        [promptKey]: profile.matchmaker_prompts?.[field],
      });
    }
    setEditModalVisible(true);
  };

  const handleEditModalOk = () => {
    editForm.validateFields().then((values) => {
      if (editingField === "Personal Info") {
        setProfile((prev) => ({
          ...prev,
          matchmaker_name: values.matchmaker_name,
          location: values.location,
          matchmaker_preference: values.matchmaker_preference,
        }));
      } else if (editingField === "bio") {
        setProfile((prev) => ({
          ...prev,
          matchmaker_bio: values.matchmaker_bio,
        }));
      } else if (editingField.startsWith("Prompt")) {
        const promptKey = editingField.toLowerCase().replace(" ", "_");
        setProfile((prev) => ({
          ...prev,
          matchmaker_prompts: {
            ...prev.matchmaker_prompts,
            [editingField]: values[promptKey],
          },
        }));
      }
      setEditModalVisible(false);
      setEditingField(null);
    });
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
    setEditingField(null);
  };

  const handleSaveProfile = async () => {
    try {
      const values = await profileForm.validateFields();
      console.log("Form values:", values);

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
      const promptFields = ["prompt_1", "prompt_2", "prompt_3"];
      const matchmaker_prompts = {};
      let allPromptsFilledOut = true;

      promptFields.forEach((field) => {
        const promptValue = values[field];
        if (promptValue && promptValue.question && promptValue.answer) {
          matchmaker_prompts[field.replace("_", " ")] = promptValue;
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

      // Prepare the profile data to be saved
      const profileData = {
        matchmaker_name: values.matchmaker_name,
        location: values.location,
        matchmaker_preference: values.matchmaker_preference,
        matchmaker_bio: values.matchmaker_bio,
        matchmaker_prompts,
        matchmaker_pictures: updatedPictures,
      };

      // Save the profile data
      const result = await saveMatchmakerProfile(user.uid, profileData);
      if (result.success) {
        message.success(result.message);
        setNewImages([null, null, null, null, null, null]);

        // Update the local profile state
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...profileData,
        }));
      } else {
        message.error(result.error);
      }
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Please fill in all required fields.");
    }
  };

  const renderEditModal = () => {
    let content;
    switch (editingField) {
      case "Personal Info":
        content = (
          <>
            <Form.Item
              name="matchmaker_name"
              label="Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="location"
              label="City"
              rules={[{ required: true, message: "Please select your city" }]}
            >
              <Select style={{ width: "100%" }}>
                {australianCities.map((city) => (
                  <Option key={city} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="matchmaker_preference"
              label="Preference"
              rules={[
                { required: true, message: "Please select your preference" },
              ]}
            >
              <Select style={{ width: "100%" }}>
                <Option value="FRIENDS">Looking for Friends</Option>
                <Option value="MORE_THAN_FRIENDS">More than Friends</Option>
              </Select>
            </Form.Item>
          </>
        );
        break;
      case "bio":
        content = (
          <Form.Item
            name="matchmaker_bio"
            rules={[{ required: true, message: "Please enter your bio" }]}
          >
            <Input.TextArea rows={4} placeholder="Tell us about yourself..." />
          </Form.Item>
        );
        break;
      case "Prompt 1":
      case "Prompt 2":
      case "Prompt 3":
        const promptKey = editingField.toLowerCase().replace(" ", "_");
        content = (
          <Form.Item
            name={promptKey}
            rules={[{ required: true, message: "Please fill out this prompt" }]}
          >
            <div>
              <Select
                style={{ width: "100%", marginBottom: "10px" }}
                placeholder="Select a prompt"
              >
                {prompts[editingField].map((prompt) => (
                  <Option key={prompt} value={prompt}>
                    {prompt}
                  </Option>
                ))}
              </Select>
              <Input.TextArea placeholder="Your answer" />
            </div>
          </Form.Item>
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
        <Form form={editForm} layout="vertical">
          {content}
        </Form>
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
        <Form form={profileForm} onFinish={handleSaveProfile}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className="h-[200px] flex flex-col justify-center relative">
                <Button
                  className="absolute top-2 right-2"
                  icon={<EditOutlined />}
                  onClick={() => showEditModal("Personal Info")}
                />
                <Title level={4}>
                  {profile.matchmaker_name || "Add your name"}
                </Title>
                <p>
                  Age:{" "}
                  {profile.date_of_birth
                    ? moment().diff(
                        moment(profile.date_of_birth.toDate()),
                        "years",
                      )
                    : "Not set"}
                </p>
                <p>{profile.location || "Select your city"}</p>
                <Tag
                  color={
                    profile.matchmaker_preference === "FRIENDS"
                      ? "blue"
                      : profile.matchmaker_preference === "MORE_THAN_FRIENDS"
                        ? "pink"
                        : "default"
                  }
                >
                  {profile.matchmaker_preference === "FRIENDS"
                    ? "Looking for Friends"
                    : profile.matchmaker_preference === "MORE_THAN_FRIENDS"
                      ? "More than Friends"
                      : "Select your preference"}
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
                  {profile.matchmaker_prompts?.["Prompt 1"]?.question ||
                    "Select a prompt"}
                </Title>
                <Paragraph>
                  {profile.matchmaker_prompts?.["Prompt 1"]?.answer ||
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
                  {profile.matchmaker_prompts?.["Prompt 2"]?.question ||
                    "Select a prompt"}
                </Title>
                <Paragraph>
                  {profile.matchmaker_prompts?.["Prompt 2"]?.answer ||
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
                  {profile.matchmaker_prompts?.["Prompt 3"]?.question ||
                    "Select a prompt"}
                </Title>
                <Paragraph>
                  {profile.matchmaker_prompts?.["Prompt 3"]?.answer ||
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
              setProfile((prev) => ({ ...prev, date_of_birth: dobTimestamp }));
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
