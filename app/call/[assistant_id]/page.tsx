import MyCall from "@/component/pages/call";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

const Home = async ({ searchParams }: any) => {
  const share = searchParams.share;
  const share_key = searchParams.share_key;
  
  if (!share || !share_key) {
    const { user } = await validateRequest();
    if (!user) {
      return redirect("/");
    }
  }

  return (
    <div className="h-full overflow-hidden">
      <MyCall share={share} share_key={share_key} />
    </div>
  );
};

export default Home;
