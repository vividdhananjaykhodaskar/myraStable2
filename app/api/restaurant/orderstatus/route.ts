import connectMongo from "@/mongodb/connectmongoDb";
import { OrderModel } from "@/mongodb/models/mainModel";

export async function POST(request: Request) {
  const req: any = await request.json();

  try {
    await connectMongo();

    const existingOrder = await OrderModel.findOne({});
    existingOrder.status = req;
    await existingOrder.save();

    return Response.json({ message: "Order Status", data: existingOrder }, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
