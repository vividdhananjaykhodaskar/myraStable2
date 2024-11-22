import { POSCollectionModel } from "@/mongodb/models/mainModel";
export async function GET(request: Request) {
  try {
    const my_data = await POSCollectionModel.findOne({})
    return Response.json({ data: my_data }, { status: 200 })
  } catch (error) {
    console.log(error);
    return Response.json(error, { status: 400 });
  }
}
