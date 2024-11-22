export const createAssistant = () => {
  return fetch("/api/integration", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const result = await res.json();
      if (res.ok) {
        return { success: true, message: result.message, data: result.data };
      }

      return { success: false, message: result.message };
    })
    .catch(() => ({ success: false, message: "somthing went worng" }));
};

export const deleteIntegration = (thread_id :string)=>{
  return fetch(`/api/integration/${thread_id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    const result = await res.json();
    if (res.ok) {
      return { success: true, message: result.message, data: result.data };
    }

    return { success: false, message: result.message };
  })
  .catch(() => ({ success: false, message: "somthing went worng" }));
}