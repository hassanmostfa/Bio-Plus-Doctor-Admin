import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Select,
  Card,
  Badge,
  HStack,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  VStack
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, DeleteIcon, CloseIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useGetDoctorSchedulesQuery, useDeleteDoctorScheduleMutation } from 'api/doctorScheduleSlice';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const columnHelper = createColumnHelper();

const FreeSessions = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  
  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const background = useColorModeValue('white', 'gray.800');

  // State for table
  const [sorting, setSorting] = React.useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Filters state - specifically for free sessions
  const [filters, setFilters] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    isFreeSession: true, // Always true for this component
    isOnline: "",
    clinicId: "",
    dayOfWeek: "",
    isActive: "",
  });

  // API calls
  const { data: schedulesResponse, isLoading, error, refetch } = useGetDoctorSchedulesQuery({ ...filters, page, limit });
  const [deleteSchedule] = useDeleteDoctorScheduleMutation();

  // Extract data and pagination
  const tableData = schedulesResponse?.data || [];
  const pagination = schedulesResponse?.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 1 };

  useEffect(() => {
    refetch();
  }, [filters, page, limit]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
      isFreeSession: true, // Always keep this true
      isOnline: "",
      clinicId: "",
      dayOfWeek: "",
      isActive: "",
    });
    setPage(1);
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
        Swal.fire({
          title: t('deleted'),
          text: t('scheduleDeleted'),
          icon: 'success',
        });
        refetch();
      } catch (error) {
        Swal.fire({
          title: t('error'),
          text: error.data?.message || t('failedDeleteSchedule'),
          icon: 'error',
        });
      }
    }
  };

  // Transform data for table
  const transformedData = React.useMemo(() => {
    return tableData.map((schedule) => ({
      id: schedule.id,
      doctor: schedule.doctorName,
      day: schedule.dayName,
      time: `${schedule.startTime} - ${schedule.endTime}`,
      type: schedule.isOnline ? t('online') : t('atClinic'),
      clinic: !schedule.isOnline && schedule.clinicId ? schedule.clinicName : '-',
      status: schedule.isActive ? 'active' : 'inactive',
      isFreeSession: schedule.isFreeSession ? t('yes') : t('no'),
    }));
  }, [tableData, t]);

  // Table columns
  const columns = [
    columnHelper.accessor('doctor', {
      id: 'doctor',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('doctor')}
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('day', {
      id: 'day',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('day')}
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('time', {
      id: 'time',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('time')}
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('type', {
      id: 'type',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('type')}
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('clinic', {
      id: 'clinic',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('clinic')}
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('isFreeSession', {
      id: 'isFreeSession',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('isFreeSession')}
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme="green"
          p={1}
          borderRadius="md"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('status')}
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme={info.getValue() === 'active' ? 'green' : 'red'}
          p={1}
          borderRadius="md"
        >
          {info.getValue() === 'active' ? t('active') : t('inactive')}
        </Badge>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'actions',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('actions')}
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <IconButton
            aria-label="Edit schedule"
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={() => navigate(`/admin/doctor-schedules/edit/${info.getValue()}`)}
            mr={2}
          />
          <IconButton
            aria-label="Delete schedule"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDelete(info.getValue())}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: transformedData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  // Pagination controls
  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} dir={isRTL ? "rtl" : "ltr"}>
        <Card
          flexDirection="column"
          w="100%"
          px="0px"
          py="15px"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          <Flex justify="center" align="center" h="200px">
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text color={textColor}>{t('loading')}...</Text>
            </VStack>
          </Flex>
        </Card>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} dir={isRTL ? "rtl" : "ltr"}>
        <Card
          flexDirection="column"
          w="100%"
          px="0px"
          py="15px"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          <Alert status="error" mx="25px">
            <AlertIcon />
            {t('errorLoadingData')}
          </Alert>
        </Card>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} dir={isRTL ? "rtl" : "ltr"}>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        py="15px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" mb="20px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            {t('freeSessions')}
          </Text>
          
          <Button
            variant="outline"
            colorScheme="blue"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => navigate('/admin/doctor-schedules')}
            width="150px"
          >
            {t('backToSchedules')}
          </Button>
        </Flex>

        {/* Info Alert */}
        <Box px="25px" mb="20px">
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            {t('freeSessionsInfo')}
          </Alert>
        </Box>

        {/* Filters Row */}
        <HStack px="25px" mb="20px" spacing={4} align="center">
          <Select
            value={filters.isOnline}
            onChange={(e) => handleFilterChange('isOnline', e.target.value)}
            width="150px"
            size="sm"
            variant="outline"
            borderRadius="md"
            borderColor={borderColor}
            placeholder={t('allTypes')}
          >
            <option value="true">{t('online')}</option>
            <option value="false">{t('atClinic')}</option>
          </Select>
          
          <Select
            value={filters.dayOfWeek}
            onChange={(e) => handleFilterChange('dayOfWeek', e.target.value)}
            width="150px"
            size="sm"
            variant="outline"
            borderRadius="md"
            borderColor={borderColor}
            placeholder={t('allDays')}
          >
            <option value="0">{t('sunday')}</option>
            <option value="1">{t('monday')}</option>
            <option value="2">{t('tuesday')}</option>
            <option value="3">{t('wednesday')}</option>
            <option value="4">{t('thursday')}</option>
            <option value="5">{t('friday')}</option>
            <option value="6">{t('saturday')}</option>
          </Select>

          <Select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            width="150px"
            size="sm"
            variant="outline"
            borderRadius="md"
            borderColor={borderColor}
            placeholder={t('allStatuses')}
          >
            <option value="true">{t('active')}</option>
            <option value="false">{t('inactive')}</option>
          </Select>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<CloseIcon />}
            onClick={resetFilters}
          >
            {t('resetFilters')}
          </Button>
        </HStack>

        {/* No Data State */}
        {tableData.length === 0 ? (
          <Box px="25px" py="50px" textAlign="center">
            <Text color={textColor} fontSize="lg" mb="10px">
              {t('noFreeSessionsFound')}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {t('noFreeSessionsDescription')}
            </Text>
          </Box>
        ) : (
          <>
            <Box px="25px" mb="4px">
              <Table variant="simple" color="gray.500" mb="24px">
                <Thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          colSpan={header.colSpan}
                          pe="10px"
                          borderColor={borderColor}
                          cursor="pointer"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <Flex
                            justifyContent="space-between"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted()] ?? null}
                          </Flex>
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody>
                  {table.getRowModel().rows.map((row) => (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: '14px' }}
                          minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                          borderColor="transparent"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Pagination Controls */}
            <Flex justifyContent="space-between" alignItems="center" px="25px" py="10px">
              <Flex alignItems="center">
                <Text color={textColor} fontSize="sm" mr="10px">
                  {t('rowsPerPage')}:
                </Text>
                <Select
                  value={limit}
                  onChange={handleLimitChange}
                  width="100px"
                  size="sm"
                  variant="outline"
                  borderRadius="md"
                  borderColor={borderColor}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </Select>
              </Flex>
              <Text color={textColor} fontSize="sm">
                {t('page')} {pagination.page} {t('of')} {pagination.totalPages}
              </Text>
              <Flex>
                <Button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  mr="10px"
                >
                  <Icon as={ChevronLeftIcon} mr="5px" />
                  {t('previous')}
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={page === pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  {t('next')}
                  <Icon as={ChevronRightIcon} ml="5px" />
                </Button>
              </Flex>
            </Flex>
          </>
        )}
      </Card>
    </Box>
  );
};

export default FreeSessions;
