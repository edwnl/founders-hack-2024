"use client";

import "./globals.css";
import { Montserrat } from "next/font/google";
import { ConfigProvider, theme } from "antd";
import Navbar from "@/components/NavBar";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <html lang="en" className="dark">
        <body
          className={`${montserrat.className} bg-background text-foreground min-h-screen`}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </ConfigProvider>
  );
}
