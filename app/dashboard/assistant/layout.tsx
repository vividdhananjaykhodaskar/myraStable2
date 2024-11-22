import AssitantList from "@/component/pages/assistant/AssitantList";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={"p-5 bg-[rgb(0,24,26,0.5)] xl:h-screen flex flex-wrap flex-grow w-3/4"}>
      <AssitantList />
      {children}
    </div>
  );
}
