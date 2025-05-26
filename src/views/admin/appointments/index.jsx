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

const AppointmentsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState({
    doctorId: "",
    clinicId: "",
    fromDate: "",
    toDate: "",
    isBooked: "",
    consultationType: "",
    limit: 100000000,
  });

  const toast = useToast();

  const { data, isLoading, error } = useGetAppointmentsQuery({
    ...filters,
    // fromDate: selectedDate.toISOString().split("T")[0],
    // toDate: selectedDate.toISOString().split("T")[0],
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
          left="50%"
          transform="translateX(-50%)"
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
      title: "Error",
      description: "Failed to fetch appointments",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={{ base: 12, lg: 3 }}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Filters
            </Text>
            <Flex direction="column" gap={4}>
              <Select
                name="doctorId"
                value={filters.doctorId}
                onChange={handleFilterChange}
                placeholder="Select Doctor"
              >
                {doctors?.data?.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullName}
                  </option>
                ))}
              </Select>

              <Select
                name="clinicId"
                value={filters.clinicId}
                onChange={handleFilterChange}
                placeholder="Select Clinic"
              >
                {clinics?.data?.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </Select>

              <Select
                name="consultationType"
                value={filters.consultationType}
                onChange={handleFilterChange}
                placeholder="Consultation Type"
              >
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="AT_CLINIC">At Clinic</option>
                <option value="FREE_ONLINE">Free Online</option>
              </Select>

              <Select
                name="isBooked"
                value={filters.isBooked}
                onChange={handleFilterChange}
                placeholder="Booking Status"
              >
                <option value="true">Booked</option>
                <option value="false">Available</option>
              </Select>

              <Button
                colorScheme="blue"
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
                Reset Filters
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
            />
            <Box mt={4}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Appointments for {selectedDate.toDateString()}
              </Text>
              {isLoading ? (
                <Text>Loading appointments...</Text>
              ) : (
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  {getAppointmentsForDate(selectedDate).map((appointment) => (
                    <Box
                      key={appointment.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      bg={appointment.isBooked ? "red.50" : "green.50"}
                    >
                      <Text fontWeight="bold">
                        {appointment.startTime} - {appointment.endTime}
                      </Text>
                      <Text>Type: {appointment.consultationType}</Text>
                      <Text>
                        Status: {appointment.isBooked ? "Booked" : "Available"}
                      </Text>
                      {appointment.clinicName && (
                        <Text>Clinic: {appointment.clinicName}</Text>
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