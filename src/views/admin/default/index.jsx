import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import MiniStatistics from "components/card/MiniStatistics";
import {
  MdOutlineGroup,
  MdAssignment,
  MdPeople,
  MdPersonAdd,
  MdSchedule,
  MdPending,
  MdCheckCircle,
  MdAttachMoney,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import { columnsDataCheck } from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import { IoTodayOutline as IoToday } from "react-icons/io5";
import { MdOnlinePrediction } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { FaClinicMedical } from "react-icons/fa";
import { useGetDoctorAppointmentsDashboardQuery } from "api/appointmentsSlice";
import { useGetDoctorPatientsSummaryQuery } from "api/patientsSlice";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function UserReports() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const { data: appointmentsDashboard, isLoading: isLoadingAppointments } = useGetDoctorAppointmentsDashboardQuery();
  const { data: patientsSummary, isLoading: isLoadingPatients } = useGetDoctorPatientsSummaryQuery();

  const cardData = [
    { 
      name: t('todayAppointments'), 
      value: appointmentsDashboard?.data?.todayAppointments || 0, 
      icon: IoToday,
      route: '/admin/appointments-calendar'
    },
    { 
      name: t('upcomingThisWeek'), 
      value: appointmentsDashboard?.data?.upcomingThisWeek || 0, 
      icon: MdSchedule,
      route: '/admin/appointments-calendar'
    },
    { 
      name: t('pendingConfirmation'), 
      value: appointmentsDashboard?.data?.pendingConfirmation || 0, 
      icon: MdPending,
      route: '/admin/appointments-calendar'
    },
    { 
      name: t('completedThisMonth'), 
      value: appointmentsDashboard?.data?.completedThisMonth || 0, 
      icon: MdCheckCircle,
      route: '/admin/appointments-calendar'
    },
    { 
      name: t('revenueThisMonth'), 
      value: appointmentsDashboard?.data?.revenueThisMonth || 0, 
      icon: MdAttachMoney,
      route: '/admin/appointments-calendar'
    },
    { 
      name: t('totalPatients'), 
      value: patientsSummary?.data?.totalPatients || 0, 
      icon: MdPeople,
      route: '/admin/patients'
    },
    { 
      name: t('newPatientsThisMonth'), 
      value: patientsSummary?.data?.newPatientsThisMonth || 0, 
      icon: MdPersonAdd,
      route: '/admin/patients'
    },
    { 
      name: t('patientsWithUpcoming'), 
      value: patientsSummary?.data?.patientsWithUpcoming || 0, 
      icon: MdSchedule,
      route: '/admin/appointments-calendar'
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  // Format consultation type for display
  const formatConsultationType = (type) => {
    switch (type) {
      case 'GOOGLE_MEET':
        return { text: 'Google Meet', color: 'blue' };
      case 'FREE_ONLINE':
        return { text: 'Free Online', color: 'green' };
      case 'AT_CLINIC':
        return { text: 'At Clinic', color: 'purple' };
      default:
        return { text: type, color: 'gray' };
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoadingAppointments || isLoadingPatients) {
    return <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>{t('loading')}</Box>;
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
        {cardData.map((card, index) => (
          <Box
            key={index}
            cursor="pointer"
            onClick={() => handleCardClick(card.route)}
            _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={<Icon w="32px" h="32px" as={card.icon} color={brandColor} />}
                />
              }
              name={card.name}
              value={card.value}
            />
          </Box>
        ))}
      </SimpleGrid>

      {/* Recent Completed Appointments */}
      {appointmentsDashboard?.data?.recentCompleted && appointmentsDashboard.data.recentCompleted.length > 0 && (
        <Card mt="20px" bg={cardBg}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              {t('recentCompletedAppointments')}
            </Text>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color={textColor}>{t('appointmentNumber')}</Th>
                    <Th color={textColor}>{t('patientName')}</Th>
                    <Th color={textColor}>{t('appointmentDate')}</Th>
                    <Th color={textColor}>{t('consultationType')}</Th>
                    <Th color={textColor}>{t('fee')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {appointmentsDashboard.data.recentCompleted.map((appointment) => {
                    const consultationType = formatConsultationType(appointment.consultationType);
                    return (
                      <Tr key={appointment.id}>
                        <Td color={textColor}>
                          {appointment.appointmentNumber}
                        </Td>
                        <Td color={textColor}>
                          {appointment.patientName}
                        </Td>
                        <Td color={textColor}>
                          {formatDate(appointment.appointmentDate)}
                        </Td>
                        <Td>
                          <Badge colorScheme={consultationType.color}>
                            {consultationType.text}
                          </Badge>
                        </Td>
                        <Td color={textColor}>
                          {appointment.fee} kwd
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      )}

      {/* Existing Components Below
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} title="Highest Requested Pharmacy" />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} title="Highest Booked Doctors" />
      </SimpleGrid> */}
    </Box>
  );
}
