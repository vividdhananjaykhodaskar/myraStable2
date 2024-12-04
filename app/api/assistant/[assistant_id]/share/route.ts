import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";
import { ConfigurationModel, User } from "@/mongodb/models/mainModel";

export async function POST(
  request: Request,
  { params }: { params: { assistant_id: string } }
) {
  const data = await request.json();
  const assistant_id = params.assistant_id;
  const { share_key } = data;

  // Validate input early
  if (!assistant_id || !share_key) {
    return NextResponse.json(
      { message: "Assistant ID and Share Key are required" },
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    // Fetch assistant with the given ID and share key
    const assistants = await ConfigurationModel.findOne({
      _id: assistant_id,
      share_key: share_key,
    }).populate("integration_id");

    if (!assistants) {
      return NextResponse.json(
        { message: "Invalid Share Key" },
        { status: 401 }
      );
    }

    // Fetch user associated with the assistant
    const user = await User.findById(assistants.user_id);

    if (!user) {
      return NextResponse.json(
        { message: "User Not Found" },
        { status: 404 }
      );
    }

    if (user.credits <= 0) {
      return NextResponse.json({ message: "No Credits" }, { status: 402 });
    }

    // Success response
    return NextResponse.json(
      { message: "Valid Call", data: assistants },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error in POST /assistant:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
