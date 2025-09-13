import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRedirect } from './baseQuery';

export const doctorScheduleExceptionApi = createApi({
  reducerPath: "doctorScheduleExceptionApi",
  baseQuery: baseQueryWithRedirect,
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