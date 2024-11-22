const createThreadandRuns = async (userInput: string) => {
  return fetch("https://api.openai.com/v1/threads/runs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${'test'}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
      Connection: "Keep-Alive",
    },
    body: JSON.stringify({
      assistant_id: process.env.ASSISTANTID,
      thread: {
        messages: [{ role: "user", content: userInput }],
      },
    }),
  }).then((res) => res.json());
};

const addMessageToThread = async (thread_id: string, userInput: string) => {
  return fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${'test'}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
      Connection: "Keep-Alive",
    },
    body: JSON.stringify({ role: "user", content: userInput }),
  }).then((res) => res.json());
};

const runToThread = async (thread_id: string) => {
  return fetch(`https://api.openai.com/v1/threads/${thread_id}/runs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${'test'}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
      Connection: "Keep-Alive",
    },
    body: JSON.stringify({ assistant_id: process.env.ASSISTANTID }),
  }).then((res) => res.json());
};

const checkStatus = async (threadId: string, runId: string) => {
  return fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${'test'}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
      Connection: "Keep-Alive",
    },
  }).then((res) => res.json());
};

const listMessage = async (thread_id: string) => {
  return fetch(`https://api.openai.com/v1/threads/${thread_id}/messages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${'test'}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
      Connection: "Keep-Alive",
    },
  }).then((res) => res.json());
};

export const getGeneratedResponse = async (
  thread_id: string,
  userInput: string
) => {
  let run;
  if (!thread_id) {
    run = await createThreadandRuns(userInput);
    thread_id = run.thread_id;
  } else {
    await addMessageToThread(thread_id, userInput);
    run = await runToThread(thread_id);
  }

  let startTime = Date.now();
  while (["queued", "in_progress", "cancelling"].includes(run.status)) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    run = await checkStatus(run.thread_id, run.id);

    if (Date.now() - startTime > 60000) {
      break;
    }
  }

  let output = "";
  if (run.status === "completed") {
    const messagesDat = await listMessage(run.thread_id);

    const assistantMessages = messagesDat.data.map(
      (message: any) => message.content[0].text.value
    );
    output = assistantMessages[0];
  }

  return { text: output, thread_id };
};

export const checkresponse = (input: any) => {
  const firstIndex = input.indexOf("{");
  const lastIndex = input.lastIndexOf("}");
  if (firstIndex >= 0 && lastIndex >= 0) {
    return true;
  }
  return false;
};
