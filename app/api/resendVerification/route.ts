import { User } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";
import { sendEmailVerification } from "@/lib/emailService";
import crypto from "crypto";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email address" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "This email is already verified." },
        { status: 400 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    const tokenExpires = new Date();
    tokenExpires.setHours(tokenExpires.getHours() + 1);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

  
    sendEmailVerification(user.email, verificationToken);

    return NextResponse.json(
      { message: "A new verification link has been sent to your email." },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
