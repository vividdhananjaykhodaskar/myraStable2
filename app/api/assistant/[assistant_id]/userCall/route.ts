import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";
import { ConfigurationModel, User } from "@/mongodb/models/mainModel";
import { validateRequest } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { assistant_id: string } }
) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Invalid Session" },
      { status: 401 }
    );
  }

  const { assistant_id } = params;

  if (!assistant_id) {
    return NextResponse.json(
      { success: false, error: "Missing Assistant ID" },
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    const assistants = await ConfigurationModel.findOne({
      _id: assistant_id,
      user_id: user.id,
    }).populate("integration_id");

    if (!assistants) {
      return NextResponse.json(
        { success: false, error: "Assistant Not Found" },
        { status: 404 }
      );
    }

    const currUser = await User.findById(assistants.user_id);
    if (currUser.credits <= 0) {
      return NextResponse.json(
        { success: false, error: "Insufficient Credits" },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { success: true, data: assistants },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /assistant:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
