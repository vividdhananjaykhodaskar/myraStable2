import { Lucia, User, Session } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { cookies } from "next/headers";
import { cache } from "react";
import connectMongo from "@/mongodb/connectmongoDb";
import { IUser } from "../mongodb/models/User";
import { ISession } from "../mongodb/models/Session";

const mongoConnection = await connectMongo();
const db = mongoConnection.connection.db;
const Users: any = db?.collection<IUser>("users") ?? undefined;
const Sessions: any = db?.collection<ISession>("sessions") ?? undefined;

const adapter = new MongodbAdapter(Sessions, Users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      id: attributes._id,
      name: attributes.name,
      email: attributes.email,
      contact: attributes.contact,
    };
  },
});

export const validateRequest = cache(async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {}
  return result;
});
