import React, { useState } from "react";
import {
  Box,
  Flex,
  Select,
  Button,
  Text,
  useToast,
  Grid,
  GridItem,
  useColorModeValue,
  Card,
  Badge,
} from "@chakra-ui/react";
import { useGetAppointmentsQuery } from "api/appointmentSlice";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.css";
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

  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const bookedBg = useColorModeValue('red.50', 'red.900');
  const availableBg = useColorModeValue('green.50', 'green.900');

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
        <Badge
          position="absolute"
          bottom="2px"
          right={isRTL ? "unset" : "50%"}
          left={isRTL ? "50%" : "unset"}
          transform={isRTL ? "translateX(-50%)" : "translateX(50%)"}
          colorScheme="blue"
          borderRadius="full"
          w="20px"
          h="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
        >
          {appointments.length}
        </Badge>
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
      position: isRTL ? 'top-left' : 'top-right',
    });
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} dir={isRTL ? "rtl" : "ltr"}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          <Card p={4} borderRadius="lg" bg={cardBg}>
            <Text color={textColor} fontSize="xl" fontWeight="bold" mb={4}>
              {t('filters')}
            </Text>
            <Flex direction="column" gap={4}>
              <Select
                name="consultationType"
                value={filters.consultationType}
                onChange={handleFilterChange}
                placeholder={t('consultationType')}
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
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
                bg={inputBg}
                color={textColor}
                borderColor={borderColor}
              >
                <option value="true">{t('booked')}</option>
                <option value="false">{t('available')}</option>
              </Select>

              <Button
                variant="darkBrand"
                color="white"
                fontSize="sm"
                fontWeight="500"
                borderRadius="70px"
                px="24px"
                py="5px"
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
              >
                {t('resetFilters')}
              </Button>
            </Flex>
          </Card>
        </GridItem>
        <GridItem colSpan={{ base: 12, lg: 9 }}>
          <Card p={4} borderRadius="lg" bg={cardBg}>
            <Box className={useColorModeValue('', 'dark-calendar')}>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileContent={tileContent}
                className="appointments-calendar"
                locale={isRTL ? "ar" : "en"}
                next2Label={null}
                prev2Label={null}
              />
            </Box>
            <Box mt={4}>
              <Text color={textColor} fontSize="xl" fontWeight="bold" mb={4}>
                {t('appointmentsFor', { date: selectedDate.toDateString() })}
              </Text>
              {isLoading ? (
                <Text color={textColor}>{t('loadingAppointments')}</Text>
              ) : (
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                  {getAppointmentsForDate(selectedDate).map((appointment) => (
                    <Card
                      key={appointment.id}
                      p={4}
                      borderWidth="1px"
                      borderColor={borderColor}
                      bg={appointment.isBooked ? bookedBg : availableBg}
                      textAlign={isRTL ? "right" : "left"}
                    >
                      <Text fontWeight="bold" color={textColor}>
                        {appointment.startTime} - {appointment.endTime}
                      </Text>
                      <Text color={textColor}>
                        {t('type')}: {t(appointment.consultationType)}
                      </Text>
                      <Text color={textColor}>
                        {t('status')}: 
                        <Badge 
                          ml={2}
                          colorScheme={appointment.isBooked ? 'red' : 'green'}
                        >
                          {appointment.isBooked ? t('booked') : t('available')}
                        </Badge>
                      </Text>
                      {appointment.clinicName && (
                        <Text color={textColor}>
                          {t('clinic')}: {appointment.clinicName}
                        </Text>
                      )}
                    </Card>
                  ))}
                </Grid>
              )}
            </Box>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AppointmentsCalendar;