import AssitantList from "@/component/pages/assistant/AssitantList";
import RazorPayment from '@/component/pages/razorpay/RazorPayment'
import TopBar from "@/component/TopBar";
import { useAppSelector } from "@/redux";
import { Coins } from "lucide-react";
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={"p-5 bg-[rgb(0,24,26,0.5)] xl:h-screen flex flex-wrap flex-grow w-3/4"}>
      <TopBar/>
      <AssitantList />
      {children}
    </div>
  );
}
