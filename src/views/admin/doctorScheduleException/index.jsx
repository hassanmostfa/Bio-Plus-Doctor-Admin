import React, { useState } from "react";
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
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { useGetDoctorScheduleExceptionsQuery, useDeleteDoctorScheduleExceptionMutation } from "api/doctorScheduleExceptionSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DoctorScheduleException = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    page: 1,
    limit: 10,
  });

  const { data: exceptions, isLoading, refetch } = useGetDoctorScheduleExceptionsQuery(filters);
  const { data: doctors } = useGetDoctorsQuery();
  const [deleteException] = useDeleteDoctorScheduleExceptionMutation();

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

  const resetFilters = () => {
    setFilters({
      doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
      page: 1,
      limit: 10,
    });
  };

  const handleEdit = (id) => {
    navigate(`/admin/doctor-schedule-exceptions/edit/${id}`);
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
        await deleteException(id).unwrap();
        Swal.fire("Deleted!", "Schedule exception has been deleted.", "success");
        refetch();
      } catch (error) {
        Swal.fire("Error!", error.data?.message || "Failed to delete exception", "error");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={12}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <HStack justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold">
                Doctor Schedule Exceptions
              </Text>
              <Button colorScheme="blue" onClick={() => navigate("/admin/doctor-schedule-exceptions/add")}>
                Add New Exception
              </Button>
            </HStack>

            {/* Filters Section */}
            {/* <Box mb={4} p={4} borderWidth={1} borderRadius="md">
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

                <GridItem colSpan={3}>
                  <Button colorScheme="gray" onClick={resetFilters} mt={8}>
                    Reset Filters
                  </Button>
                </GridItem>
              </Grid>
            </Box> */}

            {isLoading ? (
              <Text>Loading exceptions...</Text>
            ) : (
              <>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Doctor</Th>
                      <Th>Exception Date</Th>
                      <Th>Schedule</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {exceptions?.data?.map((exception) => (
                      <Tr key={exception.id}>
                        <Td>{exception.doctorName}</Td>
                        <Td>{formatDate(exception.exceptionDate)}</Td>
                        <Td>{exception.scheduleId ? "Specific Schedule" : "All Schedules"}</Td>
                        <Td>
                          <Switch
                            isChecked={!exception.isCancelled}
                            isReadOnly
                            colorScheme={!exception.isCancelled ? "green" : "red"}
                          />
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => handleEdit(exception.id)}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleDelete(exception.id)}
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
                    Page {exceptions?.pagination?.page || 1} of {exceptions?.pagination?.totalPages || 1}
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
                      isDisabled={filters.page >= (exceptions?.pagination?.totalPages || 1)}
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

export default DoctorScheduleException; 