import { Inter } from "next/font/google";
import classNames from "classnames";
import localFont from "next/font/local";
import { DeepgramContextProvider } from "../lib/context/DeepgramContextProvider";
import type { Metadata, Viewport } from "next";
import { Providers } from "@/redux/provider";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { validateRequest } from "@/lib/auth";
import ClientInit from "@/component/pages/initdata";
import { getUserData } from "@/service/serverService";
import Header from "@/component/pages/Header";

const inter = Inter({ subsets: ["latin"] });
const favorit = localFont({
  src: "../lib/fonts/ABCFavorit-Bold.woff2",
  variable: "--font-favorit",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  width: "device-width",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://aura-tts-demo.deepgram.com"),
  title: "Myra - Voice AI Captain",
  description: `Voice AI for everyone - Replacing Call Centres to Digital call centres`,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { session } = await validateRequest();
  
  let user;
  if (session) {
    user = await getUserData();
  }

  return (
    <Providers>
      <html lang="en" className="h-dvh">
        <body className={`h-full dark ${classNames(favorit.variable, inter.className)}`}>
          <ClientInit user={user} />
          <DeepgramContextProvider>
            <Header user={user}/>
            {children}
          </DeepgramContextProvider>
          <ToastContainer />
        </body>
      </html>
    </Providers>
  );
}
