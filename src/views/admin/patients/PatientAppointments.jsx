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
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ArrowBackIcon,
  CalendarIcon,
  TimeIcon
} from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPatientAppointmentsQuery } from 'api/patientsSlice';
import { useTranslation } from 'react-i18next';

const columnHelper = createColumnHelper();

const PatientAppointments = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const { patientId } = useParams();
  
  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const background = useColorModeValue('white', 'gray.800');

  // State for table
  const [sorting, setSorting] = React.useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // API calls
  const { data: appointmentsResponse, isLoading, error, refetch } = useGetPatientAppointmentsQuery({ 
    patientId,
    page, 
    limit
  });

  // Extract data and pagination
  const tableData = appointmentsResponse?.data?.items || [];
  const pagination = appointmentsResponse?.data?.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 1 };

  useEffect(() => {
    refetch();
  }, [page, limit, patientId]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return timeString;
  };

  const formatConsultationType = (type) => {
    switch (type) {
      case 'AT_CLINIC':
        return { text: t('atClinic'), color: 'blue' };
      case 'FREE_ONLINE':
        return { text: t('freeOnline'), color: 'green' };
      case 'GOOGLE_MEET':
        return { text: t('googleMeet'), color: 'purple' };
      default:
        return { text: type, color: 'gray' };
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return { text: t('confirmed'), color: 'blue' };
      case 'COMPLETED':
        return { text: t('completed'), color: 'green' };
      case 'CANCELLED':
        return { text: t('cancelled'), color: 'red' };
      case 'PENDING':
        return { text: t('pending'), color: 'orange' };
      default:
        return { text: status, color: 'gray' };
    }
  };

  const formatPaymentStatus = (status) => {
    switch (status) {
      case 'PAID':
        return { text: t('paid'), color: 'green' };
      case 'PENDING':
        return { text: t('pending'), color: 'orange' };
      case 'FAILED':
        return { text: t('failed'), color: 'red' };
      default:
        return { text: status, color: 'gray' };
    }
  };

  // Transform data for table
  const transformedData = React.useMemo(() => {
    return tableData.map((appointment) => ({
      id: appointment.id,
      appointmentNumber: appointment.appointmentNumber,
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      duration: appointment.duration,
      consultationType: appointment.consultationType,
      status: appointment.status,
      fee: appointment.fee,
      paymentMethod: appointment.paymentMethod,
      paymentStatus: appointment.paymentStatus,
      clinicName: appointment.clinicName,
      meetingLink: appointment.meetingLink,
      createdAt: appointment.createdAt,
    }));
  }, [tableData, t]);

  // Table columns
  const columns = [
    columnHelper.accessor('appointmentDate', {
      id: 'appointmentDate',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('appointmentDate')}
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <CalendarIcon mr={2} color="gray.500" />
          <Text color={textColor} fontSize="sm">
            {formatDate(info.getValue())}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('startTime', {
      id: 'time',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('time')}
        </Text>
      ),
      cell: (info) => {
        const row = info.row.original;
        return (
          <Flex align="center">
            <TimeIcon mr={2} color="gray.500" />
            <Text color={textColor} fontSize="sm">
              {formatTime(row.startTime)} - {formatTime(row.endTime)}
            </Text>
          </Flex>
        );
      },
    }),
    columnHelper.accessor('consultationType', {
      id: 'consultationType',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('consultationType')}
        </Text>
      ),
      cell: (info) => {
        const consultationType = formatConsultationType(info.getValue());
        return (
          <Badge 
            colorScheme={consultationType.color}
            p={1}
            borderRadius="md"
          >
            {consultationType.text}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('status')}
        </Text>
      ),
      cell: (info) => {
        const status = formatStatus(info.getValue());
        return (
          <Badge 
            colorScheme={status.color}
            p={1}
            borderRadius="md"
          >
            {status.text}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('fee', {
      id: 'fee',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('fee')}
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color="green.500" fontWeight="bold" fontSize="sm">
            kwd {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('paymentMethod', {
      id: 'paymentMethod',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('paymentMethod')}
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue() || '-'}
        </Text>
      ),
    }),
    columnHelper.accessor('paymentStatus', {
      id: 'paymentStatus',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('paymentStatus')}
        </Text>
      ),
      cell: (info) => {
        const paymentStatus = formatPaymentStatus(info.getValue());
        return (
          <Badge 
            colorScheme={paymentStatus.color}
            p={1}
            borderRadius="md"
          >
            {paymentStatus.text}
          </Badge>
        );
      },
    }),
    columnHelper.accessor('clinicName', {
      id: 'clinicName',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('clinic')}
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue() || '-'}
        </Text>
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
          <HStack spacing={4}>
            <IconButton
              aria-label="Back to patients"
              icon={<ArrowBackIcon />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => navigate('/admin/patients')}
            />
            <Box>
              <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
                {t('patientAppointments')}
              </Text>
              <Text color="gray.500" fontSize="sm">
                {t('totalAppointments')}: {pagination.totalItems}
              </Text>
            </Box>
          </HStack>
        </Flex>


        {/* No Data State */}
        {tableData.length === 0 ? (
          <Box px="25px" py="50px" textAlign="center">
            <Text color={textColor} fontSize="lg" mb="10px">
              {t('noAppointmentsFound')}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {t('noAppointmentsDescription')}
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

export default PatientAppointments;
