import { validateRequest } from "@/lib/auth";
import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";
import { default_config } from "@/lib/constant";
import crypto from "crypto";
import { ConfigurationModel, User } from "@/mongodb/models/mainModel";

export async function GET(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await connectMongo();
    const assistants = await ConfigurationModel.find({ user_id: user.id }).populate("integration_id");
    return NextResponse.json({ message: "User Assistants", data: assistants }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    await connectMongo();
    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      return NextResponse.json({ message: "User not exists" }, { status: 409 });
    }

    const rendonToken = crypto.randomBytes(32).toString("hex");
    const newUser = await ConfigurationModel.create({
      ...default_config,
      assistent_name: name,
      welcome_message: `Welcome, how can I assist you?`,
      share_key: rendonToken,
      user_id: user.id,
    });

    return NextResponse.json({ message: "Assistant created", data: newUser }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const { id, name } = await request.json();
    await connectMongo();
    const existingUser = await User.findById(user.id);
    if (!existingUser) {
      return NextResponse.json({ message: "User not exists" }, { status: 409 });
    }

    const newUser = await ConfigurationModel.findByIdAndUpdate(id, {
      assistent_name: name,
    });

    return NextResponse.json({ message: "Assistant updated", data: newUser }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
