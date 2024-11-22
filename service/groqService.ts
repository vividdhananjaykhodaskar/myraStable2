export async function handleGroq(
  messages: {
    role: string;
    content: string;
  }[],
  config: any,
  call_id?: string,
  signal?: any
) {
  const details = {
    messages: messages,
    model: config.groq_model,
    temperature: config.groq_temperature,
    max_tokens: config.groq_token,
    top_p: 1,
    stream: false,
    stop: null,
  };
  const chatCompletion = await fetch(`/api/complation?${call_id ? `id=${call_id}` : ""}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
    signal: signal,
  })
    .then((res) => res.json())
    .then((res) => res.data);

  return chatCompletion;
}
