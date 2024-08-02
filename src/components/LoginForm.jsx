import {Button, Checkbox, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

export const LoginForm = () => {
  return (
      <Form
          name={"LoginForm"}
          initialValues={{remember: true}}
          onFinish={values => {
            console.log("Success: ", values)
          }}>
        <Form.Item
            name={"email"}
            rules={[{
              required: true,
              message: "Please input your username",
            }]}><Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
            name={"password"}
            rules={[{
              required: true,
              message: "Please input your username",
            }]}><Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
            name={"remember"}
            valuePropName={"checked"}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item
        >
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Submit
        </Button>
        </Form.Item>
      </Form>
  )
}