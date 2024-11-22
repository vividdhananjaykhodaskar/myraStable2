import { createOrder } from "@/service/petpoojaservice";

export async function POST(request: Request) {
  const req: any = await request.json();
  try {
    const new_order = await createOrder(req);
    if (new_order) {
      return Response.json({ message: "Order created successfully", data: new_order }, { status: 200 });
    } else {
      return Response.json({ message: "Something went wrong" }, { status: 400 });
    }
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
