// app/page.js
"use client";

import {LoginForm} from "@/components/LoginForm";
import {Radio, Typography} from "antd";
import Link from "next/link";
import {Montserrat} from "next/font/google";
import {useState} from "react";

const montserrat = Montserrat({ subsets: ["latin"] });
const {Title} = Typography;
export default function LoginPage(props) {
  const [loginMode, setLoginMode] = useState(props);
  const loginModeChange = (e) => {
    setLoginMode(e.target.value);
  }
    return (
        <div className="min-h-screen bg-background p-8 flex-col justify-center max-h-full">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-6">Login to Meetix</h1>
              <Radio.Group value={registrationMode} onChange={registrationModeChange} className={"pb-5"}>
                <Radio.Button value={"user"}>New User</Radio.Button>
                <Radio.Button value={"organizer"}>New Organiser</Radio.Button>
              </Radio.Group>
              <LoginForm/>
              <h3>Not register yet? <Link href={"/signup"}>Join now!</Link></h3>
          </div>
        </div>
);
}