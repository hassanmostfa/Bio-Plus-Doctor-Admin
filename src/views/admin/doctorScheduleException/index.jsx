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
import { EditIcon, DeleteIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUpdateDoctorScheduleExceptionMutation } from "api/doctorScheduleExceptionSlice";
import { useTranslation } from 'react-i18next';

const DoctorScheduleException = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
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
      page: 1,
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
      cancelButtonText: t('cancel'),
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
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} dir={isRTL ? "rtl" : "ltr"}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={12}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <HStack justify="space-between" mb={4}>
              <HStack>
                <Text fontSize="xl" fontWeight="bold" textAlign={isRTL ? "right" : "left"}>
                  {t('doctorScheduleExceptions')}
                </Text>
              </HStack>
              <Button 
                variant="darkBrand"
                fontWeight="500"
                borderRadius="70px"
                px="24px"
                py="5px" 
                color="white"
                ml={4}
                width={200}
                onClick={() => navigate("/admin/doctor-schedule-exceptions/add")}
              >
                {t('addNewException')}
              </Button>
            </HStack>

            {isLoading ? (
              <Text textAlign={isRTL ? "right" : "left"}>{t('loadingExceptions')}</Text>
            ) : (
              <>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('exceptionDate')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('day')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('schedule')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('isCancelled')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('actions')}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {exceptions?.data?.map((exception) => (
                      <Tr key={exception.id}>
                        <Td textAlign={isRTL ? "right" : "left"}>{exception.formattedDate}</Td>
                        <Td textAlign={isRTL ? "right" : "left"}>{exception.dayName}</Td>
                        <Td textAlign={isRTL ? "right" : "left"}>{exception.scheduleId ? t('specificSchedule') : t('allSchedules')}</Td>
                        <Td textAlign={isRTL ? "right" : "left"}>
                          <Switch
                            dir="ltr"
                            isChecked={exception.isCancelled}
                            onChange={() => handleToggleCancelled(exception.id, exception.isCancelled)}
                            colorScheme={exception.isCancelled ? 'red' : 'green'}
                          />
                        </Td>
                        <Td textAlign={isRTL ? "right" : "left"}>
                          <HStack spacing={2} direction={isRTL ? "row-reverse" : "row"}>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => handleEdit(exception.id)}
                              aria-label={t('edit')}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleDelete(exception.id)}
                              aria-label={t('delete')}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Pagination */}
                <Flex justify="space-between" align="center" mt={4} direction={isRTL ? "row-reverse" : "row"}>
                  <Text textAlign={isRTL ? "right" : "left"}>
                    {t('page')} {exceptions?.pagination?.page || 1} {t('of')} {exceptions?.pagination?.totalPages || 1}
                  </Text>
                  <HStack direction={isRTL ? "row-reverse" : "row"}>
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