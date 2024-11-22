import Sidebar from "@/component/pages/Sidebar";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="h-full relative flex flex-wrap">
      <Sidebar />

      {children}
    </div>
  );
}
