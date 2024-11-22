import { validateRequest } from "@/lib/auth";
import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";
import { User } from "@/mongodb/models/mainModel";

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await connectMongo();
    const userData = await User.findById(user.id);
    return NextResponse.json({ message: "user details", data: userData }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
