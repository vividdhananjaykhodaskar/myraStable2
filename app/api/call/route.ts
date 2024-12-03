import { validateRequest } from "@/lib/auth";
import connectMongo from "@/mongodb/connectmongoDb";
import { CallCollectionModel, CallConversationModel } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";
import { startCall, updateCallConfig } from '../../../lib/service/callService'

export const revalidate = 0;

export async function GET(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  const callData = await CallCollectionModel.find({ user_id: user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await CallCollectionModel.countDocuments({
    user_id: user.id,
  });
  return Response.json({ callData, totalCount }, { status: 200 });
}

export async function POST(request:Request) {
  const req = await request.json();

  try {
    const response = await startCall(req);
    return Response.json(response, { status: 200 });
  } catch (error) {
    return Response.json({ message: error, success: false }, { status: 400 });
  }
}


export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const req: any = await request.json();

  if (!id) {
    return Response.json({ message: "ID is required", success: false }, { status: 400 });
  }

  try {
    const response = await updateCallConfig(id, req);
    return Response.json(response, { status: 200 });
  } catch (error: any) {
    return Response.json({ message: error.message, success: false }, { status: 400 });
  }
}