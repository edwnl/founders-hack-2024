import { Montserrat } from "next/font/google";
import "./globals.css";
import "antd/dist/reset.css";
import ClientLayout from "@/components/ClientLayout";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Meetix",
  description: "Where events meet connections.",
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
