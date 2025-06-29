import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Switch,
  Flex,
  HStack,
  useColorModeValue,
  Card,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useGetDoctorScheduleExceptionsQuery, useDeleteDoctorScheduleExceptionMutation } from "api/doctorScheduleExceptionSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useUpdateDoctorScheduleExceptionMutation } from "api/doctorScheduleExceptionSlice";
import { useTranslation } from 'react-i18next';

const DoctorScheduleException = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgColor = useColorModeValue('white', 'gray.700');
  const tableBg = useColorModeValue('white', 'gray.700');
  const tableRowHover = useColorModeValue('gray.50', 'gray.600');
  const switchBg = useColorModeValue('gray.100', 'gray.600');
  
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
      background: bgColor,
      color: textColor,
    });
    if (result.isConfirmed) {
      try {
        await deleteException(id).unwrap();
        Swal.fire({
          title: t('deleted'),
          text: t('exceptionDeleted'),
          icon: 'success',
          background: bgColor,
          color: textColor,
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: t('error'),
          text: error.data?.message || t('failedDeleteException'),
          icon: 'error',
          background: bgColor,
          color: textColor,
        });
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
      Swal.fire({
        title: t('updated'),
        text: t('exceptionUpdated'),
        icon: 'success',
        background: bgColor,
        color: textColor,
      });
      refetch();
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: error.data?.message || t('failedUpdateException'),
        icon: 'error',
        background: bgColor,
        color: textColor,
      });
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} dir={isRTL ? "rtl" : "ltr"}>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        py="15px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
        bg={bgColor}
      >
        <Flex px="25px" mb="20px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            {t('doctorScheduleExceptions')}
          </Text>
          
          <Button 
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => navigate("/admin/doctor-schedule-exceptions/add")}
            width="200px"
          >
            {t('addNewException')}
          </Button>
        </Flex>

        {isLoading ? (
          <Text px="25px" color={textColor}>{t('loadingExceptions')}</Text>
        ) : (
          <>
            <Box px="25px">
              <Table variant="simple" colorScheme={bgColor}>
                <Thead>
                  <Tr bg={bgColor}>
                    <Th color="gray.400">{t('exceptionDate')}</Th>
                    <Th color="gray.400">{t('day')}</Th>
                    <Th color="gray.400">{t('schedule')}</Th>
                    <Th color="gray.400">{t('isCancelled')}</Th>
                    <Th color="gray.400">{t('actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {exceptions?.data?.map((exception) => (
                    <Tr 
                      key={exception.id}
                      bg={bgColor}
                      _hover={{ bg: tableRowHover }}
                    >
                      <Td color={textColor}>{exception.formattedDate}</Td>
                      <Td color={textColor}>{exception.dayName}</Td>
                      <Td color={textColor}>{exception.scheduleId ? t('specificSchedule') : t('allSchedules')}</Td>
                      <Td>
                        <Switch
                          dir="ltr"
                          isChecked={exception.isCancelled}
                          onChange={() => handleToggleCancelled(exception.id, exception.isCancelled)}
                          colorScheme={exception.isCancelled ? 'red' : 'green'}
                          bg={switchBg}
                        />
                      </Td>
                      <Td>
                        <HStack spacing={2} direction={isRTL ? "row-reverse" : "row"}>
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            variant="ghost"
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
            </Box>

            {/* Pagination */}
            <Flex 
              justifyContent="space-between" 
              alignItems="center" 
              px="25px" 
              py="10px"
              direction={isRTL ? "row-reverse" : "row"}
            >
              <Text color={textColor} fontSize="sm">
                {t('page')} {exceptions?.pagination?.page || 1} {t('of')} {exceptions?.pagination?.totalPages || 1}
              </Text>
              <HStack>
                <Button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  variant="outline"
                  size="sm"
                  mr="10px"
                >
                  {t('previous')}
                </Button>
                <Button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= (exceptions?.pagination?.totalPages || 1)}
                  variant="outline"
                  size="sm"
                >
                  {t('next')}
                </Button>
              </HStack>
            </Flex>
          </>
        )}
      </Card>
    </Box>
  );
};

export default DoctorScheduleException;