import { lucia, validateRequest } from "../../../lib/auth";
import connectMongo from "@/mongodb/connectmongoDb";
import { User,Session } from "@/mongodb/models/mainModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { encryptPassword } from "@/lib/ecrypt";


export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    await connectMongo();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 409 });
    }

    const hashedPassword = await encryptPassword(password, existingUser.salt);
    if (hashedPassword !== existingUser.password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const existinfSession = await Session.findOne({ user_id: existingUser._id });
    if (!existinfSession) {
      const session = await lucia.createSession(existingUser._id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } else {
      const sessionCookie = lucia.createSessionCookie(existinfSession._id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }

    return NextResponse.json({ message: "Logged in successfully", data: existingUser }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.toString() }, { status: 500 });
  }
}
