import { validateRequest } from "@/lib/auth";
import { calculateTotalMinutes, getDuration } from "@/lib/utils";
import connectMongo from "@/mongodb/connectmongoDb";
import {
  CallCollectionModel,
  ConfigurationModel,
  User,
} from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const loggedInUser = await User.findById(user.id);
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

    const callData = await CallCollectionModel.find({
      user_id: user.id,
      createdAt: { $gte: start, $lte: end },
      assistant: { $ne: null }, // TODO: remove this in the future and handle the error if the assistant id is null
    });

    const totalCalls = callData.length;

    const costMap: Record<string, number> = {};

    const totalMinutes = calculateTotalMinutes(callData, costMap);

    const costPerMinute = loggedInUser?.callCost ?? 0.059;
    for (const date in costMap) {
      costMap[date] *= costPerMinute;
    }

    const totalCost = totalMinutes * costPerMinute;
    const avgCostPerMin = totalMinutes > 0 ? totalCost / totalMinutes : 0;

    const currStartDate = new Date(startDate);
    const currEndDate = new Date(endDate);

    const sortedDates = Object.keys(costMap).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const currCostArray = [];
    const dates = [];

    let currentDate = new Date(currStartDate);
    while (currentDate <= currEndDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const currentDateString = `${year}-${month}-${day}`;

      dates.push(currentDateString);
      currCostArray.push(
        costMap[currentDateString] !== undefined
          ? costMap[currentDateString].toFixed(2)
          : 0
      );

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const assistantIdGroupCombined = await CallCollectionModel.aggregate([
      {
        $match: {
          user_id: `${user.id}`,
          createdAt: { $gte: start, $lte: end },
          assistant: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assistant", // Group by assistant_id
          count: { $sum: 1 }, // Count the number of calls per assistant
          calls: {
            $push: {
              call_end_time: "$call_end_time",
              call_duration: "$call_duration",
              groq_input_tokens: "$groq_input_tokens",
              groq_output_tokens: "$groq_output_tokens",
              last_activity: "$last_activity",
              character_count: "$character_count",
              completion_model: "$completion_model",
              active: "$active",
              user_id: "$user_id",
              conversation: "$conversation",
              assistant: "$assistant",
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the '_id' field
          assistant_id: "$_id", // Rename '_id' to 'assistant_id'
          count: 1, // Keep the count of calls
          calls: 1, // Keep the calls array
        },
      },
    ]);

    // Process the data similarly to your original pipeline
    const assistance: string[] = [];
    const noOfCalls: number[] = [];
    const assistantNames = await ConfigurationModel.find({
      user_id: `${user.id}`,
    }).exec();
    const assistantNameMap = assistantNames.reduce((acc, item) => {
      acc[item._id] = item.assistent_name;
      return acc;
    }, {});

    assistantIdGroupCombined.forEach((item) => {
      assistance.push(item.assistant_id);
      noOfCalls.push(item.count);
    });

    // Sorting by the number of calls in descending order
    const sortedData = assistance
      .map((assistantId, index) => ({
        assistanceName: assistantNameMap[assistantId] || "Unknown",
        noOfCalls: noOfCalls[index],
      }))
      .sort((a, b) => b.noOfCalls - a.noOfCalls);

    const sortedAssistance = sortedData.map((item) => item.assistanceName);
    const sortedNoOfCalls = sortedData.map((item) => item.noOfCalls);

    return NextResponse.json(
      {
        totalCalls,
        totalMinutes,
        totalCost,
        avgCostPerMin,
        currCostArray,
        dates,
        assistance: sortedAssistance,
        noOfCalls: sortedNoOfCalls,
        assistantIdGroupByAssistant: assistantIdGroupCombined, // Return the combined result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);

    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
