import connectMongo from "@/mongodb/connectmongoDb";
import { CallCollectionModel } from "@/mongodb/models/mainModel";

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const req: any = await request.json();

  try {
    await connectMongo();
    const my_data = await CallCollectionModel.findById(id);
    my_data.character_count = my_data.character_count + req.character_count;
    my_data.save();

    return Response.json({ message: "Configuration updated successfully" }, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
