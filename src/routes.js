import React from 'react';
import { Icon } from '@chakra-ui/react';
import {MdHome,} from 'react-icons/md';

import { MdAdminPanelSettings } from 'react-icons/md';
import { TiMinus } from 'react-icons/ti';
import { FaRegCalendarDays } from 'react-icons/fa6';
import { RiLogoutCircleLine } from "react-icons/ri";
import { LuClipboardList } from "react-icons/lu";
import { MdSchedule } from "react-icons/md";
import { MdEventBusy } from "react-icons/md";

// Admin Imports
import MainDashboard from 'views/admin/default';
import Admins from 'views/admin/admins/Admins';
import AddAdmin from 'views/admin/admins/AddAdmin';
import Roles from 'views/admin/roles/Roles';
import AddRole from 'views/admin/roles/AddRole';
import ProtectedRoute from 'components/protectedRoute/ProtectedRoute';
import EditRole from 'views/admin/roles/EditRole';
import EditAdmin from 'views/admin/admins/EditAdmin';
import ShowAdmin from 'views/admin/admins/ShowAdmin';
import Appointments from 'views/admin/appointments/Appointments';
import Calendar from 'views/admin/calendar/Calendar';
import AppointmentsCalendar from 'views/admin/appointments';
import DoctorSchedule from 'views/admin/doctorSchedule';
import AddDoctorSchedule from 'views/admin/doctorSchedule/AddDoctorSchedule';
import EditDoctorSchedule from 'views/admin/doctorSchedule/EditDoctorSchedule';
import DoctorScheduleException from "views/admin/doctorScheduleException/index";
import AddDoctorScheduleException from "views/admin/doctorScheduleException/AddDoctorScheduleException";
import EditDoctorScheduleException from "views/admin/doctorScheduleException/EditDoctorScheduleException";

const routes = [
  {
    name: 'superAdmin',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component:<ProtectedRoute><MainDashboard /></ProtectedRoute> ,
    showInSidebar: true,
  },
  /* Start Admin Routes */
  // {
  //   name: 'Admin Management',
  //   layout: '/admin',
  //   icon: (
  //     <Icon
  //     as={MdAdminPanelSettings}
  //     width="20px"
  //     height="20px"
  //     color="#8f9bba"
  //     />
  //   ),
  //   component: null,
  //   showInSidebar: true,
  //   subRoutes: [
  //     {
  //       name: 'Admins',
  //       path: '/admins',
  //       icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
  //       component: <Admins />,
  //       showInSidebar: true,
  //     },
  //     {
  //       name: 'Rules',
  //       path: '/rules',
  //       icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
  //       component: <Roles />,
  //       showInSidebar: true,
  //     },
  //   ],
  // },
  // {
  //   name: 'Admin Management',
  //   layout: '/admin',
  //   path: '/add-New-Rule',
  //   icon: (
  //     <Icon as={FaRegCalendarDays} width="20px" height="20px" color="inherit" />
  //   ),
  //   component: <AddRole />,
  //   showInSidebar: false,
  // },
  // {
  //   name: 'Admin Management',
  //   layout: '/admin',
  //   path: '/edit/rule/:id',
  //   icon: (
  //     <Icon as={FaRegCalendarDays} width="20px" height="20px" color="inherit" />
  //   ),
  //   component: <EditRole />,
  //   showInSidebar: false,
  // },
  // {
  //   name: 'Admin Management',
  //   layout: '/admin',
  //   path: '/add-admin',
  //   component: <AddAdmin />,
  //   showInSidebar: false,
  // },
  // {
  //   name: 'Admin Management',
  //   layout: '/admin',
  //   path: '/edit-admin/:id',
  //   component: <EditAdmin />,
  //   showInSidebar: false,
  // },
  // {
  //   name: 'Admin Management',
  //   layout: '/admin',
  //   path: '/admin/details/:id',
  //   component: <ShowAdmin />,
  //   showInSidebar: false,
  // },
  /* End Admin Routes */
  // {
  //   name: 'Calendar',
  //   layout: '/admin',
  //   path: '/calendar',
  //   component: <Calendar />,
  //   icon: <Icon as={FaRegCalendarDays} width="20px" height="20px" color="inherit" />,
  //   showInSidebar: true,
  // },
  {
    name: 'calendarView',
    layout: '/admin',
    path: '/appointments-calendar',
    component: <AppointmentsCalendar />,
    icon: <Icon as={FaRegCalendarDays} width="20px" height="20px" color="inherit" />,
    showInSidebar: true,
  },
  {
    name: 'doctorSchedules',
    layout: '/admin',
    path: '/doctor-schedules',
    component: <DoctorSchedule />,
    icon: <Icon as={MdSchedule} width="20px" height="20px" color="inherit" />,
    showInSidebar: true,
  },
  {
    name: 'Add Doctor Schedule',
    layout: '/admin',
    path: '/doctor-schedules/add',
    component: <AddDoctorSchedule />,
    showInSidebar: false,
  },
  {
    name: 'Edit Doctor Schedule',
    layout: '/admin',
    path: '/doctor-schedules/edit/:id',
    component: <EditDoctorSchedule />,
    showInSidebar: false,
  },
  {
    name: 'doctorScheduleExceptions',
    layout: '/admin',
    path: '/doctor-schedule-exceptions',
    icon: <Icon as={MdEventBusy} width="20px" height="20px" color="inherit" />,
    component: <DoctorScheduleException />,
    showInSidebar: true,
  },
  {
    name: 'add',
    layout: '/admin',
    path: '/doctor-schedule-exceptions/add',
    icon: <Icon as={MdEventBusy} width="20px" height="20px" color="inherit" />,
    component: <AddDoctorScheduleException />,
  },
  {
    name: 'edit',
    layout: '/admin',
    path: '/doctor-schedule-exceptions/edit/:id',
    icon: <Icon as={MdEventBusy} width="20px" height="20px" color="inherit" />,
    component: <EditDoctorScheduleException />,
  },
// {
//     name: 'Appointments',
//     layout: '/admin',
//     path: '/appointments',
//     icon: (
//       <Icon as={LuClipboardList} width="20px" height="20px" color="inherit" />
//     ),
//     component: <Appointments />,
//     showInSidebar: true,
//   },
  
  {
    name: 'logout',
    path: '/logout',
    icon: <RiLogoutCircleLine />, // Add an appropriate icon
    layout: '/admin', // Adjust the layout as needed
    showInSidebar: true,
  },
  
];

export default routes;
