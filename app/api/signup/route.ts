import { lucia } from "@/lib/auth";
import { encryptPassword, GenerateSalt } from "@/lib/ecrypt";
import crypto from "crypto";
import { User,ConfigurationModel } from "@/mongodb/models/mainModel";
import connectMongo from "@/mongodb/connectmongoDb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { default_config } from "@/lib/constant";

export async function POST(request: Request) {
  try {
    const { name, email, contact, password } = await request.json();
    await connectMongo();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    const newsalt = await GenerateSalt();
    const hashedPassword = await encryptPassword(password, newsalt);
    const newUser = await User.create({
      email: email,
      name: name,
      contact: contact,
      salt: newsalt,
      password: hashedPassword,
    });

    const rendonToken = crypto.randomBytes(32).toString("hex");
    await ConfigurationModel.create({
      ...default_config,
      assistent_name: newUser.name.charAt(0) + new Date().valueOf(),
      user_id: newUser._id,
      welcome_message: `Welcome, how can I assist you?`,
      share_key: rendonToken,
    });

    const session = await lucia.createSession(newUser._id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({ message: "Signed up successfully", data: newUser }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
