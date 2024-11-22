import {
  CallCollectionModel,
  CallConversationModel,
} from "@/mongodb/models/mainModel";
import { updateCallGroqTokensCount } from "@/service/prservice";

export async function POST(request: Request) {
  const { searchParams, host, protocol } = new URL(request.url);
  const call_id = searchParams.get("id");
  const req: any = await request.json();
  let userRequest = null;
  if (req?.messages?.length > 0) {
    const lastMessage = req.messages[req.messages.length - 1];
    if (lastMessage?.role === "user") {
      userRequest = { ...lastMessage, timeStamp: new Date() };
    }
  }

  try {
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const chatCompletion = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(req),
    })
      .then((res) => res.json())
      .catch(() => false);

    if (chatCompletion?.error) {
      return Response.json({ message: chatCompletion?.error?.message, success: false }, { status: 400 });
    }
    let result = "";
    if (chatCompletion) {
      result = chatCompletion?.choices[0]?.message?.content ?? "";
      if (call_id) {
        const cr_path = `${protocol}//${host}/api/call/token?id=${call_id}`;
        updateCallGroqTokensCount(cr_path, {
          groq_input_tokens: chatCompletion?.usage.prompt_tokens,
          groq_output_tokens: chatCompletion?.usage.completion_tokens,
        });
        const callCollection = await CallCollectionModel.findById(call_id);
        if (callCollection?.conversation) {
          const conversation = await CallConversationModel.findById(
            callCollection.conversation
          );
          if (conversation) {
            if (userRequest) conversation.messages.push(userRequest);
            conversation.messages.push({
              role: "system",
              content: result,
              timestamp: new Date(),
            });

            await conversation.save();
          }
        }
      }
    }

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(error, { status: 400 });
  }
}
