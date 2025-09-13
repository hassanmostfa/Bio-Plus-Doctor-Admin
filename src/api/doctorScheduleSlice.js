import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRedirect } from './baseQuery';

export const doctorScheduleApi = createApi({
  reducerPath: "doctorScheduleApi",
  baseQuery: baseQueryWithRedirect,

  endpoints: (builder) => ({
    // Get all doctor schedules
    getDoctorSchedules: builder.query({
      query: (params) => ({
        url: "/admin/doctor-schedule",
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          doctorId: params?.doctorId,
          clinicId: params?.clinicId,
          dayOfWeek: params?.dayOfWeek,
          isOnline: params?.isOnline,
          isActive: params?.isActive,
          isFreeSession: params?.isFreeSession,
        },
      }),
    }),

    // Get doctor schedule by ID
    getDoctorScheduleById: builder.query({
      query: (id) => ({
        url: `/admin/doctor-schedule/${id}`,
        method: "GET",
      }),
    }),

    // Create doctor schedule
    createDoctorSchedule: builder.mutation({
      query: (schedule) => ({
        url: "/admin/doctor-schedule",
        method: "POST",
        body: schedule,
      }),
    }),

    // Update doctor schedule
    updateDoctorSchedule: builder.mutation({
      query: ({ id, schedule }) => ({
        url: `/admin/doctor-schedule/${id}`,
        method: "PUT",
        body: schedule,
      }),
    }),

    // Delete doctor schedule
    deleteDoctorSchedule: builder.mutation({
      query: (id) => ({
        url: `/admin/doctor-schedule/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDoctorSchedulesQuery,
  useGetDoctorScheduleByIdQuery,
  useCreateDoctorScheduleMutation,
  useUpdateDoctorScheduleMutation,
  useDeleteDoctorScheduleMutation,
} = doctorScheduleApi; 