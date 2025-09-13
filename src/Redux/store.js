import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { roleApi } from "api/roleSlice";
import { apiService } from "api/userSlice";
import { appointmentApi } from "api/appointmentSlice";
import { doctorScheduleApi } from "api/doctorScheduleSlice";
import { doctorApi } from "api/doctorSlice";
import { clinicApi } from "api/clinicSlice";
import { doctorScheduleExceptionApi } from "api/doctorScheduleExceptionSlice";
import authReducer from "./authSlice";
import { filesApi } from "api/filesSlice";
import { specializationApi } from "api/doctorSpecializationSlice";
import { patientsApi } from "api/patientsSlice";
import { appointmentsApi } from "api/appointmentsSlice";

// import { userApi, authReducer } from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiService.reducerPath]: apiService.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [clinicApi.reducerPath]: clinicApi.reducer,
    [doctorScheduleApi.reducerPath]: doctorScheduleApi.reducer,
    [doctorScheduleExceptionApi.reducerPath]: doctorScheduleExceptionApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
    [specializationApi.reducerPath]: specializationApi.reducer,
    [patientsApi.reducerPath]: patientsApi.reducer,
    [appointmentsApi.reducerPath]: appointmentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiService.middleware,
      roleApi.middleware,
      appointmentApi.middleware,
      doctorScheduleApi.middleware,
      doctorApi.middleware,
      clinicApi.middleware,
      doctorScheduleExceptionApi.middleware,
      filesApi.middleware,
      specializationApi.middleware,
      patientsApi.middleware,
      appointmentsApi.middleware
    ),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
