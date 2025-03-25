import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../../components/Header/header";
import SessionWrapper from "./sessionwrapper";
import UserAction from "../../components/userAction/userAction";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,  // Only children prop
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-[100vh]`}>
        <SessionWrapper>
            <UserAction />
            <Header />
            <main>{children}</main>
            {/* <Footer /> */}
            <Toaster />
        </SessionWrapper>
      </body>
    </html>
  );
}
