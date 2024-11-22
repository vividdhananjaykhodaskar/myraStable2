import connectMongo from "@/mongodb/connectmongoDb";
import { CallCollectionModel } from "@/mongodb/models/mainModel";

export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  await connectMongo();
  let callData = await CallCollectionModel.findById(id);

  if (callData) {
    const currentTime = new Date();
    const timediffence = currentTime.getTime() - new Date(callData.createdAt).getTime();
    const totalSeconds = Math.floor(timediffence / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    callData.call_end_time = currentTime;
    callData.last_activity = currentTime;
    callData.call_duration = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    callData.active = false;

    callData = await callData.save();
  }

  return Response.json(callData, { status: 200 });
}
