import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";
import { ConfigurationModel, User } from "@/mongodb/models/mainModel";

export async function POST(request: Request, { params }: { params: { assistant_id: string } }) {
  const data = await request.json();
  const assistant_id = params.assistant_id;
  const { share_key } = data;

  try {
    await connectMongo();
    const assistants = await ConfigurationModel.findOne({ _id: assistant_id, share_key: share_key }).populate("integration_id");
    const user  = await User.findById(assistants.user_id)
    if(user.credits <= 0){
      return NextResponse.json({ message: "No Credits" }, { status: 402 });
    }
    if (!assistants) {
      return NextResponse.json({ message: "Invalid Share Key" }, { status: 401 });
    }

    return NextResponse.json({ message: "Valid Call", data: assistants }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
