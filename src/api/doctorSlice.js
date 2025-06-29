import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define your base URL
const baseUrl = "https://back.biopluskw.com/api/v1";

// Custom baseQuery with redirect on 401
const baseQueryWithRedirect = async (args, api, extraOptions) => {
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

// Create the API slice using RTK Query
export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: baseQueryWithRedirect,
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: (params) => ({
        url: '/admin/doctor',
        params,
      }),
    }),
    getDoctor: builder.query({
      query: (id) => `/admin/doctor/${id}`,
    }),
    addDoctor: builder.mutation({
      query: (data) => ({
        url: "/admin/doctor",
        method: "POST",
        body: data,
      }),
    }),
    assignDoctor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/doctor/${id}/clinics`,
        method: "POST",
        body: data,
      }),
    }),
    updateDoctor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/doctor/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/admin/doctor/${id}`,
        method: "DELETE",
      }),
    }),
    getStatistics: builder.query({
      query: () => ({
        url: "/admin/stats/doctor",
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useAddDoctorMutation,
  useAssignDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  useGetStatisticsQuery,
} = doctorApi;
