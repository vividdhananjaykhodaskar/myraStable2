import { validateRequest } from "@/lib/auth";
import connectMongo from "@/mongodb/connectmongoDb";
import { CallCollectionModel } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { user } = await validateRequest();
  
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }
  
    await connectMongo();
  
    const { searchParams } = new URL(request.url);
    
    const id = searchParams.get("id");
    
    if (!id) {
      return Response.json(
        { message: "Missing required parameter: id" },
        { status: 400 }
      );
    }
  
    try {
      const callData = await CallCollectionModel.findById(id).populate("conversation");

      if (callData && callData.conversation) {
        callData.conversation.messages.sort((a:any, b:any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      }
      if (!callData) {
        return Response.json(
          { message: "CallCollection not found" },
          { status: 404 }
        );
      }
  
      return Response.json({ callData }, { status: 200 });
    } catch (error) {
      console.error("Error fetching call data:", error);
      return Response.json(
        { message: "Internal Server Error", error },
        { status: 500 }
      );
    }
  }
  