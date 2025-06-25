import React, { useState } from "react";
import {
  Box,
  Flex,
  Select,
  Input,
  Button,
  Text,
  useToast,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useGetAppointmentsQuery } from "api/appointmentSlice";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.css";
import { LuImageMinus } from "react-icons/lu";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetClinicsQuery } from "api/clinicSlice";
import { useTranslation } from 'react-i18next';

const AppointmentsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    clinicId: "",
    fromDate: "",
    toDate: "",
    isBooked: "",
    consultationType: "",
    limit: 100000000,
  });

  const toast = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data, isLoading, error } = useGetAppointmentsQuery({
    ...filters,
  });

  const { data: doctors } = useGetDoctorsQuery();
  const { data: clinics } = useGetClinicsQuery();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getAppointmentsForDate = (date) => {
    if (!data?.data) return [];
    return data.data.filter(
      (appointment) =>
        new Date(appointment.date).toDateString() === date.toDateString()
    );
  };

  const tileContent = ({ date }) => {
    const appointments = getAppointmentsForDate(date);
    if (appointments.length > 0) {
      return (
        <Box
          position="absolute"
          bottom="2px"
          right={isRTL ? "unset" : "50%"}
          left={isRTL ? "50%" : "unset"}
          transform={isRTL ? "translateX(-50%)" : "translateX(50%)"}
          bg="blue.500"
          color="white"
          borderRadius="full"
          w="20px"
          h="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
        >
          {appointments.length}
        </Box>
      );
    }
    return null;
  };

  if (error) {
    toast({
      title: t('error'),
      description: t('failedFetchAppointments'),
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} dir={isRTL ? "rtl" : "ltr"}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4} textAlign={isRTL ? "right" : "left"}>
              {t('filters')}
            </Text>
            <Flex direction="column" gap={4}>
              <Select
                name="consultationType"
                value={filters.consultationType}
                onChange={handleFilterChange}
                placeholder={t('consultationType')}
              >
                <option value="GOOGLE_MEET">{t('googleMeet')}</option>
                <option value="AT_CLINIC">{t('atClinic')}</option>
                <option value="FREE_ONLINE">{t('freeOnline')}</option>
              </Select>

              <Select
                name="isBooked"
                value={filters.isBooked}
                onChange={handleFilterChange}
                placeholder={t('bookingStatus')}
              >
                <option value="true">{t('booked')}</option>
                <option value="false">{t('available')}</option>
              </Select>

              <Button
                variant="darkBrand"
		  	        fontWeight="500"
        	      borderRadius="70px"
                px="24px"
                py="5px" 
                color="white"
                ml={4}
                width="full"
                mt={4}
                onClick={() => setFilters({
                  doctorId: "",
                  clinicId: "",
                  fromDate: "",
                  toDate: "",
                  isBooked: "",
                  consultationType: "",
                  limit: 100000000,
                })}
                size="sm"
              >
                {t('resetFilters')}
              </Button>
            </Flex>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 9 }}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              className="appointments-calendar"
              locale={isRTL ? "ar" : "en"}
              next2Label={null}
              prev2Label={null}
            />
            <Box mt={4}>
              <Text fontSize="xl" fontWeight="bold" mb={4} textAlign={isRTL ? "right" : "left"}>
                {t('appointmentsFor', { date: selectedDate.toDateString() })}
              </Text>
              {isLoading ? (
                <Text textAlign={isRTL ? "right" : "left"}>{t('loadingAppointments')}</Text>
              ) : (
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {getAppointmentsForDate(selectedDate).map((appointment) => (
                    <Box
                      key={appointment.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      bg={appointment.isBooked ? "red.50" : "green.50"}
                      textAlign={isRTL ? "right" : "left"}
                    >
                      <Text fontWeight="bold">
                        {appointment.startTime} - {appointment.endTime}
                      </Text>
                      <Text>{t('type')}: {t(appointment.consultationType)}</Text>
                      <Text>
                        {t('status')}: {appointment.isBooked ? t('booked') : t('available')}
                      </Text>
                      {appointment.clinicName && (
                        <Text>{t('clinic')}: {appointment.clinicName}</Text>
                      )}
                    </Box>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AppointmentsCalendar;