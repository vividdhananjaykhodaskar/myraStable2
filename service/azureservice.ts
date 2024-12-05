export const generateSpeech = async (text: any, call_id?: string, signal?: any) => {
  try {
    const response = await fetch(`/api/speech?${call_id ? `id=${call_id}` : ""}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal: signal,
    });
    if (response.ok) {
      return response.blob();
    } else {
      console.error("Error generating speech");
    }
  } catch (error) {
    return false;
  }
};

export const generateSpeechNew = async (text: any, call_id?: string, signal?: any, voice: any = {} ) => {
  try {
    const response = await fetch(`/api/speech?${call_id ? `id=${call_id}` : ""}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voice }),
      signal: signal,
    });
    if (response.ok) {
      return response?.body?.getReader();
    } else {
      console.error("Error generating speech");
    }
  } catch (error) {
    return false;
  }
};
