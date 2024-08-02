// app/page.js
"use client";

import {LoginForm} from "@/components/LoginForm";
import {Typography} from "antd";
import Link from "next/link";
import {Montserrat} from "next/font/google";
import UserSignupForm from "@/app/signup/UserSignupScreen";
import {useState} from "react";
import { Radio, Select } from 'antd';

const montserrat = Montserrat({ subsets: ["latin"] });
const {Title} = Typography;
export default function SignUpPage(props) {
  const [registrationMode, setRegistrationMode] = useState("user");
  const registrationModeChange = (e) => {
    setRegistrationMode(e.target.value);
  }
  return (
      <div className="flex flex-col justify-center min-h-[calc(100vh-40px)] bg-background px-4">
        <div className="max-w-3xl min-w-2xl mx-auto flex flex-col items-center gap-4">
          <Title>Register as a {registrationMode === "user" ? "new user" : "new organizer"}</Title>

          <Radio.Group value={registrationMode} onChange={registrationModeChange} className={"pb-5"}>
            <Radio.Button value={"user"}>New User</Radio.Button>
            <Radio.Button value={"organizer"}>New Organiser</Radio.Button>
          </Radio.Group>
          <UserSignupForm />
          <h3 className={"m-4"}>Already have an account? <Link href={"/login"}>Login here</Link></h3>
        </div>
      </div>
  );
}