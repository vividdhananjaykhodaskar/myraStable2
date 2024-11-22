export const getAllUserAssistant = () => {
  return fetch("/api/assistant", {
    method: "get",
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

export const createAssistant = (data: any) => {
  return fetch("/api/assistant", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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

export const updateAssistant = (data: any, id: string) => {
  return fetch("/api/assistant/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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

export const getShareAssistant = (assistant_id: any, share_key: string) => {
  return fetch(`/api/assistant/${assistant_id}/share`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      share_key: share_key,
    }),
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

export const deleteAssistant = (id: string) => {
  return fetch("/api/assistant/" + id, {
    method: "delete",
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

export const duplicteAssistant = (id: string) => {
  return fetch("/api/assistant/" + id, {
    method: "get",
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

export const createInegration = (data: any) => {
  return fetch(`/api/integration`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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

export const getDemoAssistent = () => {
  return fetch(`/api/assistant/demo`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
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

export const updateMenu = (id: string) => {
  return fetch(`/api/integration/${id}/new_menu`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
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
