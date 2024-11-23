export const getComplation = async () => {
  return fetch("/api/complation/config", { cache: "no-store" }).then((res) => res.json());
};

export const getCallLogs = async ({ page = 1, limit = 20 }) => {
  return fetch(`/api/call?page=${page}&limit=${limit}`, {
    cache: "no-store",
  }).then((res) => res.json());
};

export const updateComplation = async (data: any) => {
  return fetch(`/api/complation/config`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result._id;
      }
      return false;
    })
    .catch(() => false);
};

export const createCall = async (data: any) => {
  return fetch(`/api/call`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result.data._id;
      }
      return false;
    })
    .catch(() => false);
};

export const endCall = async (id: string) => {
  return fetch(`/api/call/end?id=${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result._id;
      }
      return false;
    })
    .catch(() => false);
};

export const updateCall = (call_id: string, data: any) => {
  return fetch(`/api/call?id=${call_id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result._id;
      }
      return false;
    })
    .catch(() => false);
};

export const updateCallGroqTokensCount = (path: string, data: any) => {
  return fetch(path, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result._id;
      }
      return false;
    })
    .catch(() => false);
};

export const updateCallCharCount = (path: string, data: any) => {
  return fetch(path, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result._id;
      }
      return false;
    })
    .catch(() => false);
};

export const getMenu = () => {
  return fetch("/api/restaurant/mymenu", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result;
      }
      return false;
    })
    .catch(() => false);
};

export const CreateOrder = (data: any) => {
  return fetch(`/api/restaurant/order`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result;
      }
      return false;
    })
    .catch(() => false);
};

export const createPosOrder = async (assitant_id: string, data: any) => {
  return fetch(`/api/assistant/${assitant_id}/order`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result;
      }
      return false;
    })
    .catch(() => false);
};

export const getConversationForCall = async (id: string) => {
  if (!id) {
    throw new Error("Call ID is required to fetch the conversation.");
  }

  return fetch(`/api/call/conversation?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        return result.callData; 
      }
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch the conversation.");
    })
    .catch((error) => {
      console.error("Error fetching conversation:", error);
      return null;
    });
};

export const getCallOverview = async ({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}) => {
  if (!start_date || !end_date) {
    throw new Error("Both 'start_date' and 'end_date' are required.");
  }
  return fetch(`/api/call/overview?start_date=${start_date}&end_date=${end_date}`, {
    cache: "no-store",
  }).then((res) => res.json());
};
