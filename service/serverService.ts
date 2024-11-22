import { cookies } from "next/headers";
import { headers } from "next/headers";

export const getUserData = () => {
  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host");
  const baseUrl = `${protocol}://${host}`;
  return fetch(baseUrl + "/api/user", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
  })
    .then(async (res) => {
      const result = await res.json();
      if (res.ok) {
        return { success: true, message: result.message, data: result.data };
      }
      return { success: false, message: result.message };
    })
    .catch((e) => ({ success: false, message: "somthing went worng" }));
};
