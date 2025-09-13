import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.biopluskw.com/api/v1";

// Custom baseQuery with redirect on 401
export const baseQueryWithRedirect = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("doctor_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Remove token and redirect to login
    localStorage.removeItem("doctor_token");
    window.location.href = "/admin/auth/sign-in"; // ⬅️ redirect
  }

  return result;
};
