import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRedirect } from './baseQuery';

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
    getDoctorProfile: builder.query({
      query: () => ({
        url: "/admin/doctor-profile/",
      }),
    }),
    updateDoctorProfile: builder.mutation({
      query: (data) => ({
        url: "/admin/doctor-profile/",
        method: "PUT",
        body: data,
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
  useGetDoctorProfileQuery,
  useUpdateDoctorProfileMutation,
} = doctorApi;
