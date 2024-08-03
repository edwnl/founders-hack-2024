// app/matchmaker/profile/EditModal.js
import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { promptQuestions } from "@/app/matchmaker/profile/ProfileHelpers";

const { Option } = Select;

const EditModal = ({ visible, onClose, field, initialValues, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (field.startsWith("Prompt")) {
        // Set the form values specific to the current prompt
        const promptData = initialValues.matchmaker_prompts?.[field] || {};
        form.setFieldsValue({
          question: promptData.question || undefined,
          answer: promptData.answer || "",
        });
      } else {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form, field]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (field.startsWith("Prompt")) {
        onUpdate({
          matchmaker_prompts: {
            ...initialValues.matchmaker_prompts,
            [field]: {
              question: values.question,
              answer: values.answer,
            },
          },
        });
      } else {
        onUpdate(values);
      }
      onClose();
    });
  };

  const renderFormItems = () => {
    switch (field) {
      case "personalInfo":
        return (
          <>
            <Form.Item
              name="matchmaker_name"
              label="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="location"
              label="City"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="matchmaker_preference"
              label="Preference"
              rules={[
                { required: true, message: "Please select your preference!" },
              ]}
            >
              <Select>
                <Option value="FRIENDS">Looking for Friends</Option>
                <Option value="MORE_THAN_FRIENDS">More than Friends</Option>
              </Select>
            </Form.Item>
          </>
        );
      case "matchmaker_bio":
        return (
          <Form.Item
            name="matchmaker_bio"
            label="Bio"
            rules={[{ required: true, message: "Please input your bio!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        );
      case "Prompt 1":
      case "Prompt 2":
      case "Prompt 3":
        return (
          <>
            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true, message: "Please select a question!" }]}
            >
              <Select>
                {promptQuestions[field].map((q, index) => (
                  <Option key={index} value={q}>
                    {q}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="answer"
              label="Answer"
              rules={[{ required: true, message: "Please input your answer!" }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={`Edit ${field}`}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        {renderFormItems()}
      </Form>
    </Modal>
  );
};

export default EditModal;
