import { User } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";
import { encryptPassword, GenerateSalt } from "@/lib/ecrypt";

export async function POST(request: Request) {
  const { token, newPassword } = await request.json();

  if (!token || !newPassword) {
    return NextResponse.json({ message: "Token and new password are required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired password reset token" },
        { status: 400 }
      );
    }

    if (Date.now() > user.passwordResetTokenExpires.getTime()) {
      return NextResponse.json(
        { message: "Password reset token has expired" },
        { status: 400 }
      );
    }

    const newsalt = await GenerateSalt();
    const hashedPassword = await encryptPassword(newPassword, newsalt);

    user.password = hashedPassword;
    user.salt = newsalt; 
    user.passwordResetToken = null;  
    user.passwordResetTokenExpires = null; 
    await user.save();

    return NextResponse.json(
      { message: "Password has been successfully changed" },
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
