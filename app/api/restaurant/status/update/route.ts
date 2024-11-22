import { POSCollectionModel } from "@/mongodb/models/mainModel";

export async function POST(request: Request) {
  const req: any = await request.json();
  try {
    const res_pos = await POSCollectionModel.findOne({ restaurant_id: req.restID });
    res_pos.active = !!req.store_status;
    await res_pos.save();

    return Response.json({ message: "Store Status updated successfully" }, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
