import { Montserrat } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import ClientLayout from "@/components/ClientLayout";
import themeConfig from "@/theme/themeConfig";
import NavBar from "@/components/NavBar";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Meetix",
  description: "Ticketing with friends.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
