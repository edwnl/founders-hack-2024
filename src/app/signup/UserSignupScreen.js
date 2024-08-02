import {useState} from "react";
import {Button, DatePicker, Form, Input} from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";



const  UserSignupForm = (props) => {
  const [form] = Form.useForm()

  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: Date,
    userType: ""
  });
  const onFinish = (values) => {
    // e.preventDefault();
    setInfo({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      dateOfBirth: values.dateOfBirth,
      userType: "user",
    })
    console.log(info)
  }
  return (<Form
      form={form}
      name="UserSignupForm"
      initialValues={{remember: true}}
      onFinish={onFinish}
      className={"w-full"}>
    <h1>First Name</h1>
    <Form.Item
        name={"firstName"}
        rules={[{
          required: true,
          message: "Please enter your first name",
        }]}>
      <Input prefix={<UserOutlined/>} placeholder={"First name"}/>
    </Form.Item>
    <h1>Last Name</h1>
    <Form.Item
        name={"lastName"}
        rules={[{
          required: true,
          message: "Please enter your last name",
        }]}>
      <Input prefix={<UserOutlined/>} placeholder={"Last name"}/>
    </Form.Item>
    <h1>Date of Birth</h1>
    <Form.Item
        name={"dateOfBirth"}
        rules={[{
          required: true,
          message: "Please enter your date of birth",
        }]}>
      <DatePicker format="YYYY-MM-DD"/>
    </Form.Item>
    <h1>Email Address</h1>
    <Form.Item
        name={"email"}
        rules={[{
          required: true,
          message: "Please enter your email address",
        }]}>
      <Input prefix={<MailOutlined/>} placeholder={"Email Address"}/>
    </Form.Item>
    <h1>Password</h1>
    <Form.Item
        name={"password"}
        rules={[{
          required: true,
          message: "Please enter your password",
        }]}>
      <Input.Password prefix={<LockOutlined/>} placeholder={"Password"}/>
    </Form.Item>
    <h1>Re-enter your password</h1>
    <Form.Item
        name={"confirmPassword"}
        dependencies={["password"]}
        rules={[{
          required: true,
          message: "Please re-enter your password",
        },
          ({ getFieldValue }) => ({
            validator(_,value){
              if(!value || getFieldValue("password") === value){
                return Promise.resolve();
              }
            return Promise.reject(new Error('The password you entered does not match'))}
          })]}>
      <Input.Password prefix={<LockOutlined/>} placeholder={"Confirm Password"}/>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" style={{width: "100%"}}>
        Submit
      </Button>
    </Form.Item>

  </Form>)
}

export default UserSignupForm;