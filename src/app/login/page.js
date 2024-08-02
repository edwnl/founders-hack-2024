// app/page.js
"use client";

import {LoginForm} from "@/components/LoginForm";
import {Radio, Typography} from "antd";
import Link from "next/link";
import {Montserrat} from "next/font/google";
import {useState} from "react";
import {log} from "next/dist/server/typescript/utils";
import {useSearchParams} from "next/navigation";

const montserrat = Montserrat({ subsets: ["latin"] });
const {Title} = Typography;
export default function LoginPage() {
  const [loginMode, setLoginMode] = useState(useSearchParams().get("type") ?? "user");
  const loginModeChange = (e) => {
    setLoginMode(e.target.value);
  }
    return (
        <div className="min-h-screen bg-background p-8 flex flex-col justify-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 w-1/4">
            <h1 className="text-3xl font-bold text-foreground mb-6">Welcome back to Meetix 👋</h1>
              <Radio.Group value={loginMode} onChange={loginModeChange} className={"pb-5"}>
                <Radio.Button value={"user"}>Login as User</Radio.Button>
                <Radio.Button value={"organizer"}>Login as Organiser</Radio.Button>
              </Radio.Group>
              <LoginForm loginMode={loginMode}/>
              <h3>Not register yet? <Link href={"/signup"} className={"underline"}>Join now!</Link></h3>
          </div>
        </div>
);
}