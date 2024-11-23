import { validateRequest } from "@/lib/auth";
import { getDuration } from "@/lib/utils";
import connectMongo from "@/mongodb/connectmongoDb";
import { CallCollectionModel } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    if (
      !startDate ||
      !endDate ||
      isNaN(Date.parse(startDate)) ||
      isNaN(Date.parse(endDate))
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid or missing date range. Please provide valid 'start_date' and 'end_date'.",
        },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch all call data within the date range
    const callData = await CallCollectionModel.find({
      user_id: user.id,
      createdAt: { $gte: start, $lte: end },
    });

    const totalCount = callData.length;

    // Helper function to convert duration to seconds
    const timeStringToSeconds = (timeString: string): number => {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };

    // Calculate total minutes
    const totalMinutes = callData.reduce((sum, item) => {
      const duration = item.call_duration || getDuration(item); // Assuming getDuration is available
      return sum + timeStringToSeconds(duration) / 60;
    }, 0);

    return NextResponse.json({ totalCount, totalMinutes }, { status: 200 });
  } catch (error) {
    console.error("Error processing the request:", error);

    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
