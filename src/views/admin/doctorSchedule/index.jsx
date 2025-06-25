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
  Badge,
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
import { useTranslation } from 'react-i18next';

const DoctorSchedule = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
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
      page: 1,
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
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
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
        await deleteSchedule(id).unwrap();
        Swal.fire(t('deleted'), t('scheduleDeleted'), 'success');
        refetch();
      } catch (error) {
        Swal.fire(t('error'), error.data?.message || t('failedDeleteSchedule'), 'error');
      }
    }
  };

  const getDayName = (dayNumber) => {
    const days = [
      t('sunday'), t('monday'), t('tuesday'), t('wednesday'), t('thursday'), t('friday'), t('saturday')
    ];
    return days[dayNumber];
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} dir={isRTL ? "rtl" : "ltr"}>
      <Grid templateColumns='repeat(12, 1fr)' gap={6}>
        <GridItem colSpan={12}>
          <Box bg='white' p={4} borderRadius='lg' boxShadow='sm'>
            <HStack justify='space-between' mb={4}>
              <Text fontSize='xl' fontWeight='bold' textAlign={isRTL ? "right" : "left"}>
                {t('doctorSchedules')}
              </Text>
              <Button
              variant="darkBrand"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px" 
              color="white"
              ml={4}
              width={150}
              onClick={() => navigate('/admin/doctor-schedules/add')}
              >
                {t('addNewSchedule')}
              </Button>
            </HStack>
            
            {/* Filters Section */}
            <Box mb={4} p={4} borderWidth={1} borderRadius='md'>
              <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(5, 1fr)' }} gap={4}>
                <FormControl gridColumn={{ base: '1', md: '1' }}>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('consultationType')}</FormLabel>
                  <Select
                    value={filters.isOnline}
                    onChange={(e) => handleFilterChange('isOnline', e.target.value)}
                  >
                    <option value=''>{t('allTypes')}</option>
                    <option value='true'>{t('online')}</option>
                    <option value='false'>{t('atClinic')}</option>
                  </Select>
                </FormControl>

                <FormControl gridColumn={{ base: '1', md: '2' }}>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('dayOfWeek')}</FormLabel>
                  <Select
                    value={filters.dayOfWeek}
                    onChange={(e) => handleFilterChange('dayOfWeek', e.target.value)}
                  >
                    <option value=''>{t('allDays')}</option>
                    <option value='0'>{t('sunday')}</option>
                    <option value='1'>{t('monday')}</option>
                    <option value='2'>{t('tuesday')}</option>
                    <option value='3'>{t('wednesday')}</option>
                    <option value='4'>{t('thursday')}</option>
                    <option value='5'>{t('friday')}</option>
                    <option value='6'>{t('saturday')}</option>
                  </Select>
                </FormControl>

                <FormControl gridColumn={{ base: '1', md: '3' }}>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('status')}</FormLabel>
                  <Select
                    value={filters.isActive}
                    onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  >
                    <option value=''>{t('allStatus')}</option>
                    <option value='true'>{t('active')}</option>
                    <option value='false'>{t('inactive')}</option>
                  </Select>
                </FormControl>

                <FormControl gridColumn={{ base: '1', md: '4' }}>
                  <FormLabel visibility="hidden">{t('reset')}</FormLabel>
                  <Button 
                    colorScheme='gray' 
                    onClick={resetFilters}
                    width="full"
                  >
                    {t('resetFilters')}
                  </Button>
                </FormControl>
              </Grid>
            </Box>

            {isLoading ? (
              <Text textAlign={isRTL ? "right" : "left"}>{t('loadingSchedules')}</Text>
            ) : (
              <>
                <Table variant='simple'>
                  <Thead>
                    <Tr>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('doctor')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('day')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('time')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('type')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('clinic')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('status')}</Th>
                      <Th textAlign={isRTL ? "right" : "left"}>{t('actions')}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {schedules?.data?.map((schedule) => (
                      <Tr key={schedule.id}>
                        <Td textAlign={isRTL ? "right" : "left"}>{schedule.doctorName}</Td>
                        <Td textAlign={isRTL ? "right" : "left"}>{schedule.dayName}</Td>
                        <Td textAlign={isRTL ? "right" : "left"}>{`${schedule.startTime} - ${schedule.endTime}`}</Td>
                        <Td textAlign={isRTL ? "right" : "left"}>{schedule.isOnline ? t('online') : t('atClinic')}</Td>
                        <Td textAlign={isRTL ? "right" : "left"}>
                          {!schedule.isOnline && schedule.clinicId
                            ? schedule.clinicName
                            : '-'}
                        </Td>
                        <Td textAlign={isRTL ? "right" : "left"}>
                          <Badge 
                            colorScheme={schedule.isActive ? 'green' : 'red'}
                            p={1}
                            borderRadius="md"
                          >
                            {schedule.isActive ? t('active') : t('inactive')}
                          </Badge>
                        </Td>
                        <Td textAlign={isRTL ? "right" : "left"}>
                          <HStack spacing={2} direction={isRTL ? "row-reverse" : "row"}>
                            <IconButton
                              icon={<EditIcon />}
                              size='sm'
                              onClick={() => handleEdit(schedule.id)}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size='sm'
                              colorScheme='red'
                              onClick={() => handleDelete(schedule.id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {/* Pagination */}
                <Flex justify='space-between' align='center' mt={4} direction={isRTL ? "row-reverse" : "row"}>
                  <Text textAlign={isRTL ? "right" : "left"}>
                    {t('page')} {schedules?.pagination?.page || 1} {t('of')} {schedules?.pagination?.totalPages || 1}
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
                      isDisabled={filters.page >= (schedules?.pagination?.totalPages || 1)}
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

export default DoctorSchedule;