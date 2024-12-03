import { CallCollectionModel, CallConversationModel } from "../../mongodb/models/mainModel";
import connectMongo from "../../mongodb/connectmongoDb";
export async function startCall({ welcomeMessage, ...restOfData }:{welcomeMessage:string}) {
  try {
    // await connectMongo();
    console.log({ welcomeMessage, ...restOfData },"got in main function")
    // Create the call conversation
    const conversationData = {
      messages: [
        {
          role: "system",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
    };
    const callConversation = await CallConversationModel.create(conversationData);
    // Create the call data
    const callData = await CallCollectionModel.create({
      ...restOfData,
      call_end_time: null,
      call_duration: null,
      groq_input_tokens: 0,
      groq_output_tokens: 0,
      last_activity: new Date(),
      active: true,
      conversation: callConversation ? callConversation._id : null,
    });
    return { message: "Call started", success: true, data: callData };
  } catch (error:any) {
    throw new Error(error?.message || "Failed to start the call");
  }
}
export async function updateCallConfig(id: string, updateData: any) {
  try {
    // await connectMongo();
    // Fetch the call data by ID
    const my_data = await CallCollectionModel.findById(id);
    if (!my_data) {
      throw new Error("Call record not found");
    }
    // Update the fields
    for (const key in updateData) {
      if (updateData[key] !== undefined) {
        my_data[key] = updateData[key];
      }
    }
    // Save the updated data
    await my_data.save();
    return { message: "Configuration updated successfully", success: true };
  } catch (error: any) {
    throw new Error(error?.message || "Failed to update configuration");
  }
}