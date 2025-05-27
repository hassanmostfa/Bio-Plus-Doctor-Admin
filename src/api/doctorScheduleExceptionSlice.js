import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://back.biopluskw.com/api/v1";

export const doctorScheduleExceptionApi = createApi({
  reducerPath: "doctorScheduleExceptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const doctor_token = localStorage.getItem("doctor_token");
      if (doctor_token) {
        headers.set("Authorization", `Bearer ${doctor_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["DoctorScheduleException"],
  endpoints: (builder) => ({
    // Get all doctor schedule exceptions
    getDoctorScheduleExceptions: builder.query({
      query: (params) => ({
        url: "/admin/doctor-schedule/exceptions/all",
        method: "GET",
        params,
      }),
      providesTags: ["DoctorScheduleException"],
    }),

    // Get doctor schedule exception by ID
    getDoctorScheduleExceptionById: builder.query({
      query: (id) => ({
        url: `/admin/doctor-schedule/exceptions/${id}`,
        method: "GET",
      }),
      providesTags: ["DoctorScheduleException"],
    }),

    // Create doctor schedule exception
    createDoctorScheduleException: builder.mutation({
      query: (data) => ({
        url: "/admin/doctor-schedule/exceptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DoctorScheduleException"],
    }),

    // Update doctor schedule exception
    updateDoctorScheduleException: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/doctor-schedule/exceptions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["DoctorScheduleException"],
    }),

    // Delete doctor schedule exception
    deleteDoctorScheduleException: builder.mutation({
      query: (id) => ({
        url: `/admin/doctor-schedule/exceptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DoctorScheduleException"],
    }),
  }),
});

export const {
  useGetDoctorScheduleExceptionsQuery,
  useGetDoctorScheduleExceptionByIdQuery,
  useCreateDoctorScheduleExceptionMutation,
  useUpdateDoctorScheduleExceptionMutation,
  useDeleteDoctorScheduleExceptionMutation,
} = doctorScheduleExceptionApi; 