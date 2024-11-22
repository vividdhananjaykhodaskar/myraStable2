import { validateRequest } from "@/lib/auth";
import connectMongo from "@/mongodb/connectmongoDb";
import { CallCollectionModel, CallConversationModel } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  const callData = await CallCollectionModel.find({ user_id: user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await CallCollectionModel.countDocuments({
    user_id: user.id,
  });
  return Response.json({ callData, totalCount }, { status: 200 });
}

export async function POST(request: Request) {
  const req: any = await request.json();
  const { welcomeMessage, ...restOfData } = req;

  try {
    await connectMongo();

    let callConversation = null;
    const conversationData = {
      messages: [
        {
          role: "system",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
    };

    callConversation = await CallConversationModel.create(conversationData);



    const callData = await CallCollectionModel.create({
      ...restOfData,
      call_end_time: null,
      call_duration: null,
      groq_input_tokens: 0,
      groq_output_tokens: 0,
      last_activity: new Date(),
      active: true,
      conversation: callConversation ? callConversation._id : null,
    });

    return Response.json({ message: "Call started", success: true, data: callData }, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const req: any = await request.json();

  try {
    await connectMongo();
    const my_data = await CallCollectionModel.findById(id);

    for (const key in req) {
      if (req[key]) {
        my_data[key] = req[key];
      }
    }

    my_data.save();

    return Response.json({ message: "Configuration updated successfully" }, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
