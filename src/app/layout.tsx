import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import SessionWrapper from "./sessionwrapper"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children, session
}: Readonly<{
  children: React.ReactNode;
  session?: any;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper session={session} >
          {/* <Header /> */}
          <main>
            {children}
          </main>
          {/* <Footer /> */}
        </SessionWrapper>
      </body>
    </html>
  );
}
