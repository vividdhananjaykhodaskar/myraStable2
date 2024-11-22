import { POSCollectionModel } from "@/mongodb/models/mainModel";

export async function POST(request: Request) {
  const req: any = await request.json();
  try {
    const res_pos = await POSCollectionModel.findOne({ restaurant_id: req.restID });
    const details = {
      http_code: 200,
      status: "success",
      store_status: res_pos.active === true ? "1" : "0",
      message: "Store Delivery Status fetched successfully",
    };
    return Response.json(details, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
