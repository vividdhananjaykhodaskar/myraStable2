import connectMongo from "@/mongodb/connectmongoDb";
import { OrderModel } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { assistant_id: string; id: string } }) {
  try {
    const req_data = await request.json();
    await connectMongo();

    const existingOrder = await OrderModel.findById(params.id);

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not exists" }, { status: 409 });
    }

    for (let key in req_data) {
      existingOrder[key] = req_data[key];
    }
    await existingOrder.save();

    return NextResponse.json({ message: "Integaration updated", data: existingOrder }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
