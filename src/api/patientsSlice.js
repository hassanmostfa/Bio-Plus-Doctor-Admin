import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRedirect } from './baseQuery';

export const patientsApi = createApi({
  reducerPath: 'patientsApi',
  baseQuery: baseQueryWithRedirect,
  tagTypes: ['Patients', 'PatientAppointments'],
  endpoints: (builder) => ({
    getDoctorPatientsSummary: builder.query({
      query: () => ({
        url: '/admin/doctor-patients/summary',
        method: 'GET',
      }),
      providesTags: ['Patients'],
    }),
    getDoctorPatients: builder.query({
      query: (params) => ({
        url: '/admin/doctor-patients/',
        method: 'GET',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search || '',
          ...params,
        },
      }),
      providesTags: ['Patients'],
    }),
    getPatientAppointments: builder.query({
      query: ({ patientId, ...params }) => ({
        url: `/admin/doctor-patients/${patientId}/appointments`,
        method: 'GET',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          ...params,
        },
      }),
      providesTags: (result, error, { patientId }) => [
        { type: 'Patients', id: patientId },
        { type: 'PatientAppointments', id: patientId },
      ],
    }),
  }),
});

export const {
  useGetDoctorPatientsSummaryQuery,
  useGetDoctorPatientsQuery,
  useGetPatientAppointmentsQuery,
} = patientsApi;
