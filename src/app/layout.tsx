import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import SessionWrapper from "./sessionwrapper";
import { PopupProvider } from '../../components/context/PopupContext';

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
      <body className={inter.className}>
        <SessionWrapper>
          <PopupProvider>
            <Header />
            <main>{children}</main>
            {/* <Footer /> */}
          </PopupProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
