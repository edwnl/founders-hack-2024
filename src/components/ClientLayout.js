"use client";

import { ConfigProvider, Layout } from "antd";
import { AuthProvider } from "@/contexts/AuthContext";
import themeConfig from "@/theme/themeConfig";
import NavBar from "@/components/NavBar";

const { Content } = Layout;

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <ConfigProvider theme={themeConfig}>
        <Layout className="min-h-screen flex flex-col">
          <NavBar />
          <Content className="flex-grow flex flex-col">{children}</Content>
        </Layout>
      </ConfigProvider>
    </AuthProvider>
  );
}
