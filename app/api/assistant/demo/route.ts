import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";
import { ConfigurationModel } from "@/mongodb/models/mainModel";

export async function GET(request: Request) {
  const demo_id = "66d2fadf31b9d53d104d2f5f";

  try {
    await connectMongo();
    const assistants = await ConfigurationModel.findOne({ _id: demo_id }).populate("integration_id");

    if (!assistants) {
      return NextResponse.json({ message: "Invalid Assistant ID" }, { status: 401 });
    }

    return NextResponse.json({ message: "Valid Call", data: assistants }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
