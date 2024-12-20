import { User } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/emailService";
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

    if (user.isVerified === false) {
      return NextResponse.json(
        { message: "This account is not verified." },
        { status: 400 }
      );
    }

    if (
      user.passwordResetTokenExpires &&
      Date.now() - user.passwordResetTokenExpires.getTime() < 30000
    ) {
      return NextResponse.json(
        { message: "A reset token was set recently. Please try again later." },
        { status: 400 }
      );
    }

    const passwordResetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenExpires = passwordResetTokenExpires;
    await user.save();

    // Send password reset email
    sendPasswordResetEmail(user.email, passwordResetToken);

    return NextResponse.json(
      { message: "A password reset link has been sent successfully to your email." },
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
