import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { lucia, validateRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { session, user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return NextResponse.json({ message: "logout sucessfully", success: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.toString() }, { status: 500 });
  }
}
