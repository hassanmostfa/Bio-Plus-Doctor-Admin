import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Switch,
  Select,
  Input,
  FormControl,
  FormLabel,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useGetDoctorSchedulesQuery, useDeleteDoctorScheduleMutation } from "api/doctorScheduleSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetClinicsQuery } from "api/clinicSlice";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DoctorSchedule = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    doctorId: "",
    isOnline: "",
    clinicId: "",
    dayOfWeek: "",
    isActive: "",
    page: 1,
    limit: 10,
  });

  const { data: schedules, isLoading, refetch } = useGetDoctorSchedulesQuery(filters);
  const { data: doctors } = useGetDoctorsQuery();
  const { data: clinics } = useGetClinicsQuery();
  const [deleteSchedule] = useDeleteDoctorScheduleMutation();

  useEffect(() => {
    refetch();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleLimitChange = (newLimit) => {
    setFilters(prev => ({
      ...prev,
      limit: newLimit,
      page: 1, // Reset to first page when limit changes
    }));
  };

  const resetFilters = () => {
    setFilters({
      doctorId: "",
      isOnline: "",
      clinicId: "",
      dayOfWeek: "",
      isActive: "",
      page: 1,
      limit: 10,
    });
  };

  const handleEdit = (id) => {
    navigate(`/admin/doctor-schedules/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSchedule(id).unwrap();
        Swal.fire("Deleted!", "Schedule has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error!", error.data?.message || "Failed to delete schedule", "error");
      }
    }
  };

  const getDayName = (dayNumber) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber];
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={12}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <HStack justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold">
                Doctor Schedules
              </Text>
              <Button colorScheme="blue" onClick={() => navigate("/admin/doctor-schedules/add")}>
                Add New Schedule
              </Button>
            </HStack>

            {/* Filters Section */}
            <Box mb={4} p={4} borderWidth={1} borderRadius="md">
              <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Doctor</FormLabel>
                  <Select
                    value={filters.doctorId}
                    onChange={(e) => handleFilterChange("doctorId", e.target.value)}
                  >
                    <option value="">All Doctors</option>
                    {doctors?.data?.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.fullName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Consultation Type</FormLabel>
                  <Select
                    value={filters.isOnline}
                    onChange={(e) => handleFilterChange("isOnline", e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="true">Online</option>
                    <option value="false">At Clinic</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Clinic</FormLabel>
                  <Select
                    value={filters.clinicId}
                    onChange={(e) => handleFilterChange("clinicId", e.target.value)}
                  >
                    <option value="">All Clinics</option>
                    {clinics?.data?.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Day of Week</FormLabel>
                  <Select
                    value={filters.dayOfWeek}
                    onChange={(e) => handleFilterChange("dayOfWeek", e.target.value)}
                  >
                    <option value="">All Days</option>
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={filters.isActive}
                    onChange={(e) => handleFilterChange("isActive", e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Select>
                </FormControl>

                {/* <FormControl>
                  <FormLabel>Items per page</FormLabel>
                  <NumberInput
                    min={5}
                    max={50}
                    value={filters.limit}
                    onChange={(value) => handleLimitChange(Number(value))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl> */}

                <GridItem colSpan={2}>
                  <Button colorScheme="gray" onClick={resetFilters} mt={8}>
                    Reset Filters
                  </Button>
                </GridItem>
              </Grid>
            </Box>

            {isLoading ? (
              <Text>Loading schedules...</Text>
            ) : (
              <>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Doctor</Th>
                      <Th>Day</Th>
                      <Th>Time</Th>
                      <Th>Type</Th>
                      <Th>Clinic</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {schedules?.data?.map((schedule) => (
                      <Tr key={schedule.id}>
                        <Td>{schedule.doctorName}</Td>
                        <Td>{schedule.dayName}</Td>
                        <Td>{`${schedule.startTime} - ${schedule.endTime}`}</Td>
                        <Td>{schedule.isOnline ? "Online" : "At Clinic"}</Td>
                        <Td>
                          {!schedule.isOnline && schedule.clinicId
                            ? schedule.clinicName
                            : "-"}
                        </Td>
                        <Td>
                          <Switch
                            isChecked={schedule.isActive}
                            isReadOnly
                            colorScheme={schedule.isActive ? "green" : "red"}
                          />
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => handleEdit(schedule.id)}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleDelete(schedule.id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Pagination */}
                <Flex justify="space-between" align="center" mt={4}>
                  <Text>
                    Page {schedules?.pagination?.page || 1} of {schedules?.pagination?.totalPages || 1}
                  </Text>
                  <HStack>
                    <Button
                      onClick={() => handlePageChange(filters.page - 1)}
                      isDisabled={filters.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handlePageChange(filters.page + 1)}
                      isDisabled={filters.page >= (schedules?.pagination?.totalPages || 1)}
                    >
                      Next
                    </Button>
                  </HStack>
                </Flex>
              </>
            )}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DoctorSchedule; 