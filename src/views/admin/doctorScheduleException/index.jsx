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
  Badge,
  Select,
  FormControl,
  FormLabel,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { useGetDoctorScheduleExceptionsQuery, useDeleteDoctorScheduleExceptionMutation } from "api/doctorScheduleExceptionSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUpdateDoctorScheduleExceptionMutation } from "api/doctorScheduleExceptionSlice";
import { useTranslation } from 'react-i18next';

const DoctorScheduleException = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    page: 1,
    limit: 10,
  });

  const { data: exceptions, isLoading, refetch } = useGetDoctorScheduleExceptionsQuery(filters);
  const { data: doctors } = useGetDoctorsQuery();
  const [deleteException] = useDeleteDoctorScheduleExceptionMutation();
  const [updateException] = useUpdateDoctorScheduleExceptionMutation();

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
      title: t('areYouSure'),
      text: t('noRevert'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('yesDeleteIt'),
    });
    if (result.isConfirmed) {
      try {
        await deleteException(id).unwrap();
        Swal.fire(t('deleted'), t('exceptionDeleted'), 'success');
        refetch();
      } catch (error) {
        Swal.fire(t('error'), error.data?.message || t('failedDeleteException'), 'error');
      }
    }
  };

  const handleToggleCancelled = async (id, currentValue) => {
    try {
      await updateException({
        id,
        data: {
          isCancelled: !currentValue
        }
      }).unwrap();
      Swal.fire(t('updated'), t('exceptionUpdated'), 'success');
      refetch();
    } catch (error) {
      Swal.fire(t('error'), error.data?.message || t('failedUpdateException'), 'error');
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
                {t('doctorScheduleExceptions')}
              </Text>
              <Button colorScheme="blue" onClick={() => navigate("/admin/doctor-schedule-exceptions/add")}>
                {t('addNewException')}
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
              <Text>{t('loadingExceptions')}</Text>
            ) : (
              <>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>{t('exceptionDate')}</Th>
                      <Th>{t('day')}</Th>
                      <Th>{t('schedule')}</Th>
                      <Th>{t('isCancelled')}</Th>
                      <Th>{t('actions')}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {exceptions?.data?.map((exception) => (
                      <Tr key={exception.id}>
                        <Td>{exception.formattedDate}</Td>
                        <Td>{exception.dayName}</Td>
                        <Td>{exception.scheduleId ? t('specificSchedule') : t('allSchedules')}</Td>
                        <Td>
                          <Switch
                            isChecked={exception.isCancelled}
                            onChange={() => handleToggleCancelled(exception.id, exception.isCancelled)}
                            colorScheme={exception.isCancelled ? 'red' : 'green'}
                          />
                        </Td>
                        <Td>
                          <HStack spacing={2}>
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
                    {t('page')} {exceptions?.pagination?.page || 1} {t('of')} {exceptions?.pagination?.totalPages || 1}
                  </Text>
                  <HStack>
                    <Button
                      onClick={() => handlePageChange(filters.page - 1)}
                      isDisabled={filters.page === 1}
                    >
                      {t('previous')}
                    </Button>
                    <Button
                      onClick={() => handlePageChange(filters.page + 1)}
                      isDisabled={filters.page >= (exceptions?.pagination?.totalPages || 1)}
                    >
                      {t('next')}
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