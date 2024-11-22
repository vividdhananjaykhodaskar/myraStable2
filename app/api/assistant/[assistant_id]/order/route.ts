import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";
import { OrderModel } from "@/mongodb/models/mainModel";

export async function POST(request: Request, { params }: { params: { assistant_id: string } }) {
  const data = await request.json();

  try {
    await connectMongo();
    const asiorder: any = await OrderModel.create({ ...data, assistant_id: params.assistant_id });

    return NextResponse.json({ message: "Order Created", data: asiorder }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
