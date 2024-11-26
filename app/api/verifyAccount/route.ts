import { User } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Verification token is required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const currentTime = new Date();

    if (user.verificationTokenExpires && currentTime > user.verificationTokenExpires) {
      return NextResponse.json({ message: "Verification token has expired. Please request a new one." }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully! You can now log in." }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
