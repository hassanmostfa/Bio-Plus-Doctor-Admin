import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRedirect } from './baseQuery';

export const appointmentsApi = createApi({
  reducerPath: 'appointmentsApi',
  baseQuery: baseQueryWithRedirect,
  tagTypes: ['Appointments'],
  endpoints: (builder) => ({
    getDoctorAppointmentsDashboard: builder.query({
      query: () => ({
        url: '/admin/doctor-appointments/dashboard',
        method: 'GET',
      }),
      providesTags: ['Appointments'],
    }),
    getDoctorAppointments: builder.query({
      query: (params = {}) => {
        const {
          timeFilter,
          startDate,
          endDate,
          status,
          consultationType,
          paymentStatus,
          search,
          page = 1,
          limit = 10
        } = params;

        const queryParams = new URLSearchParams();
        
        if (timeFilter) queryParams.append('timeFilter', timeFilter);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        if (status) queryParams.append('status', status);
        if (consultationType) queryParams.append('consultationType', consultationType);
        if (paymentStatus) queryParams.append('paymentStatus', paymentStatus);
        if (search) queryParams.append('search', search);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);

        return {
          url: `/admin/doctor-appointments/?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Appointments'],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ appointmentId, status }) => ({
        url: `/admin/doctor-appointments/${appointmentId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
});

export const {
  useGetDoctorAppointmentsDashboardQuery,
  useGetDoctorAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} = appointmentsApi;
