export const loginFunction = (data: any) => {
  return fetch("/api/login", {
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

export const signupFunction = (data: any) => {
  return fetch("/api/signup", {
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

export const logoutFunction = () => {
  return fetch("/api/logout", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const result = await res.json();
      if (res.ok) {
        return { success: true, message: result.message };
      }

      return { success: false, message: result.message };
    })
    .catch(() => ({ success: false, message: "somthing went worng" }));
};

export const verifyAccount = (token: string) => {
  return fetch(`/api/verifyAccount?token=${token}`, {
    method: "POST",
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
    .catch(() => ({ success: false, message: "Something went wrong" }));
};
