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
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
        Modal,
        ModalOverlay,
        ModalContent,
        ModalHeader,
  ModalFooter,
  ModalBody,
        ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  Divider,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
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
  SearchIcon, 
  CloseIcon,
  ViewIcon,
  EditIcon,
  CalendarIcon,
  TimeIcon,
  ChevronDownIcon
} from '@chakra-ui/icons';
import { MdPerson, MdAttachMoney, MdLocationOn } from 'react-icons/md';
import { useGetDoctorAppointmentsQuery, useUpdateAppointmentStatusMutation } from 'api/appointmentsSlice';
    import { useTranslation } from 'react-i18next';
    
    const columnHelper = createColumnHelper();
    
    const Appointments = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const toast = useToast();
  
  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const background = useColorModeValue('white', 'gray.800');
  const modalBg = useColorModeValue('white', 'gray.800');
  const modalHeaderBg = useColorModeValue('blue.50', 'blue.900');
  const modalHeaderBorder = useColorModeValue('gray.200', 'gray.600');
  const modalFooterBg = useColorModeValue('gray.50', 'gray.700');
  const modalFooterBorder = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const patientIconBg = useColorModeValue('green.100', 'green.800');
  const patientIconColor = useColorModeValue('green.600', 'green.300');
  const appointmentIconBg = useColorModeValue('purple.100', 'purple.800');
  const appointmentIconColor = useColorModeValue('purple.600', 'purple.300');
  const paymentIconBg = useColorModeValue('orange.100', 'orange.800');
  const paymentIconColor = useColorModeValue('orange.600', 'orange.300');
  const locationIconBg = useColorModeValue('teal.100', 'teal.800');
  const locationIconColor = useColorModeValue('teal.600', 'teal.300');
  const headerIconBg = useColorModeValue('blue.100', 'blue.800');
  const headerIconColor = useColorModeValue('blue.600', 'blue.300');

  // State for table
  const [sorting, setSorting] = React.useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    timeFilter: '',
    startDate: '',
    endDate: '',
    status: '',
    consultationType: '',
    paymentStatus: '',
  });

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // API calls
  const { data: appointmentsResponse, isLoading, error, refetch } = useGetDoctorAppointmentsQuery({ 
    page, 
    limit, 
    ...filters 
  });
  const [updateAppointmentStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  // Extract data and pagination
  const tableData = appointmentsResponse?.data?.items || [];
  const pagination = appointmentsResponse?.data?.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 1 };

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleFilterChange('search', value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      timeFilter: '',
      startDate: '',
      endDate: '',
      status: '',
      consultationType: '',
      paymentStatus: '',
    });
    setSearch('');
    setPage(1);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    onOpen();
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus({ 
        appointmentId, 
        status: newStatus 
      }).unwrap();
      
      toast({
        title: t('statusUpdated'),
        description: t('appointmentStatusUpdated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToUpdateStatus'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
      patientName: appointment.patient?.name || '-',
      patientEmail: appointment.patient?.email || '-',
      patientPhone: appointment.patient?.phoneNumber || '-',
      consultationType: appointment.consultationType,
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      duration: appointment.duration,
      status: appointment.status,
      fee: appointment.fee,
      paymentMethod: appointment.paymentMethod,
      paymentStatus: appointment.paymentStatus,
      clinicName: appointment.clinic?.name || '-',
      clinicLocation: appointment.clinicLocation?.name || '-',
      meetingDetails: appointment.meetingDetails,
      familyMember: appointment.familyMember,
      createdAt: appointment.createdAt,
    }));
  }, [tableData, t]);

  // Table columns
        const columns = [
    columnHelper.accessor('appointmentNumber', {
      id: 'appointmentNumber',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('appointmentNumber')}
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontWeight="medium" fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('patientName', {
      id: 'patientName',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('patientName')}
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
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
    columnHelper.accessor('actions', {
      id: 'actions',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('actions')}
        </Text>
      ),
      cell: (info) => {
        const row = info.row.original;
        return (
          <HStack spacing={2}>
            <IconButton
              aria-label="View details"
              icon={<ViewIcon />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleViewDetails(row)}
            />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Update status"
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                colorScheme="green"
                rightIcon={<ChevronDownIcon />}
              />
              <MenuList>
                <MenuItem onClick={() => handleUpdateStatus(row.id, 'CONFIRMED')}>
                  {t('confirmed')}
                </MenuItem>
                <MenuItem onClick={() => handleUpdateStatus(row.id, 'COMPLETED')}>
                  {t('completed')}
                </MenuItem>
                <MenuItem onClick={() => handleUpdateStatus(row.id, 'CANCELLED')}>
                  {t('cancelled')}
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        );
      },
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
          <Box>
            <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
                {t('appointments')}
                </Text>
            <Text color="gray.500" fontSize="sm">
              {t('totalAppointments')}: {pagination.totalItems}
            </Text>
          </Box>
            </Flex>
    
        {/* Search and Filters Row */}
        <HStack px="25px" mb="20px" spacing={4} align="center" wrap="wrap">
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder={t('searchAppointments')}
              value={search}
              onChange={handleSearchChange}
              size="sm"
              variant="outline"
              borderRadius="md"
              borderColor={borderColor}
            />
          </InputGroup>
          
                <Select
            value={filters.timeFilter}
            onChange={(e) => handleFilterChange('timeFilter', e.target.value)}
            width="150px"
                    size="sm"
            variant="outline"
            borderRadius="md"
            borderColor={borderColor}
            placeholder={t('allTime')}
          >
            <option value="today">{t('today')}</option>
            <option value="upcoming">{t('upcoming')}</option>
            <option value="past">{t('past')}</option>
            <option value="this_week">{t('thisWeek')}</option>
            <option value="this_month">{t('thisMonth')}</option>
                </Select>
    
                <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            width="150px"
                    size="sm"
            variant="outline"
            borderRadius="md"
            borderColor={borderColor}
            placeholder={t('allStatuses')}
          >
            <option value="CONFIRMED">{t('confirmed')}</option>
            <option value="COMPLETED">{t('completed')}</option>
            <option value="CANCELLED">{t('cancelled')}</option>
                </Select>
    
                <Select
            value={filters.consultationType}
            onChange={(e) => handleFilterChange('consultationType', e.target.value)}
            width="150px"
                    size="sm"
            variant="outline"
            borderRadius="md"
            borderColor={borderColor}
            placeholder={t('allTypes')}
          >
            <option value="AT_CLINIC">{t('atClinic')}</option>
            <option value="FREE_ONLINE">{t('freeOnline')}</option>
            <option value="GOOGLE_MEET">{t('googleMeet')}</option>
                </Select>
    
                <Select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            width="150px"
                    size="sm"
            variant="outline"
            borderRadius="md"
            borderColor={borderColor}
            placeholder={t('allPaymentStatuses')}
          >
            <option value="PAID">{t('paid')}</option>
            <option value="PENDING">{t('pending')}</option>
            <option value="FAILED">{t('failed')}</option>
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

      {/* Appointment Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent 
          bg={modalBg} 
          borderRadius="xl"
          boxShadow="2xl"
        >
          <ModalHeader 
            bg={modalHeaderBg} 
            borderRadius="xl 0 0 0"
            borderBottom="1px solid"
            borderColor={modalHeaderBorder}
          >
            <Flex align="center" gap={3}>
              <Box
                p={2}
                borderRadius="lg"
                bg={headerIconBg}
              >
                <CalendarIcon color={headerIconColor} />
              </Box>
              <Box>
                <Text fontSize="xl" fontWeight="bold" color={textColor}>
                  {t('appointmentDetails')}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {selectedAppointment?.appointmentNumber}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            {selectedAppointment && (
              <VStack spacing={6} align="stretch">
                {/* Status Badge */}
                <Flex justify="center">
                  <Badge 
                    colorScheme={formatStatus(selectedAppointment.status).color}
                    p={3}
                    borderRadius="full"
                    fontSize="md"
                    fontWeight="bold"
                  >
                    {formatStatus(selectedAppointment.status).text}
                  </Badge>
                </Flex>

                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                  {/* Patient Information Card */}
                  <Card bg={cardBg} p={4} borderRadius="lg">
                    <Flex align="center" mb={4}>
                      <Box
                        p={2}
                        borderRadius="lg"
                        bg={patientIconBg}
                        mr={3}
                      >
                        <Icon as={MdPerson} color={patientIconColor} />
                      </Box>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {t('patientInformation')}
                      </Text>
                    </Flex>
                    <VStack align="start" spacing={3}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('name')}</Text>
                        <Text fontWeight="medium" color={textColor}>{selectedAppointment.patientName}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('email')}</Text>
                        <Text fontWeight="medium" color={textColor}>{selectedAppointment.patientEmail}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('phone')}</Text>
                        <Text fontWeight="medium" color={textColor}>{selectedAppointment.patientPhone}</Text>
                      </Box>
                      {selectedAppointment.familyMember && (
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>{t('familyMember')}</Text>
                          <Text fontWeight="medium" color={textColor}>{selectedAppointment.familyMember}</Text>
                        </Box>
                      )}
                    </VStack>
                  </Card>

                  {/* Appointment Information Card */}
                  <Card bg={cardBg} p={4} borderRadius="lg">
                    <Flex align="center" mb={4}>
                      <Box
                        p={2}
                        borderRadius="lg"
                        bg={appointmentIconBg}
                        mr={3}
                      >
                        <CalendarIcon color={appointmentIconColor} />
                      </Box>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {t('appointmentInformation')}
                      </Text>
                    </Flex>
                    <VStack align="start" spacing={3}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('appointmentDate')}</Text>
                        <Text fontWeight="medium" color={textColor}>{formatDate(selectedAppointment.appointmentDate)}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('time')}</Text>
                        <Text fontWeight="medium" color={textColor}>
                          {formatTime(selectedAppointment.startTime)} - {formatTime(selectedAppointment.endTime)}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('duration')}</Text>
                        <Text fontWeight="medium" color={textColor}>{selectedAppointment.duration} {t('minutes')}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('consultationType')}</Text>
                        <Badge 
                          colorScheme={formatConsultationType(selectedAppointment.consultationType).color}
                          p={1}
                          borderRadius="md"
                        >
                          {formatConsultationType(selectedAppointment.consultationType).text}
                        </Badge>
                      </Box>
                    </VStack>
                  </Card>

                  {/* Payment Information Card */}
                  <Card bg={cardBg} p={4} borderRadius="lg">
                    <Flex align="center" mb={4}>
                      <Box
                        p={2}
                        borderRadius="lg"
                        bg={paymentIconBg}
                        mr={3}
                      >
                        <Icon as={MdAttachMoney} color={paymentIconColor} />
                      </Box>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {t('paymentInformation')}
                      </Text>
                    </Flex>
                    <VStack align="start" spacing={3}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('fee')}</Text>
                        <Text fontWeight="bold" color="green.500" fontSize="lg">
                          kwd {selectedAppointment.fee}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('paymentMethod')}</Text>
                        <Text fontWeight="medium" color={textColor}>{selectedAppointment.paymentMethod}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('paymentStatus')}</Text>
                        <Badge 
                          colorScheme={formatPaymentStatus(selectedAppointment.paymentStatus).color}
                          p={1}
                          borderRadius="md"
                        >
                          {formatPaymentStatus(selectedAppointment.paymentStatus).text}
                        </Badge>
                      </Box>
                    </VStack>
                  </Card>

                  {/* Location Information Card */}
                  <Card bg={cardBg} p={4} borderRadius="lg">
                    <Flex align="center" mb={4}>
                      <Box
                        p={2}
                        borderRadius="lg"
                        bg={locationIconBg}
                        mr={3}
                      >
                        <Icon as={MdLocationOn} color={locationIconColor} />
                      </Box>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {t('locationInformation')}
                      </Text>
                    </Flex>
                    <VStack align="start" spacing={3}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('clinic')}</Text>
                        <Text fontWeight="medium" color={textColor}>{selectedAppointment.clinicName}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>{t('location')}</Text>
                        <Text fontWeight="medium" color={textColor}>{selectedAppointment.clinicLocation}</Text>
                      </Box>
                      {selectedAppointment.meetingDetails && (
                        <>
                          <Box>
                            <Text fontSize="sm" color="gray.500" mb={1}>{t('meetingLink')}</Text>
                            <Text fontWeight="medium" color={textColor}>
                              {selectedAppointment.meetingDetails.meetingLink || '-'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.500" mb={1}>{t('meetingId')}</Text>
                            <Text fontWeight="medium" color={textColor}>
                              {selectedAppointment.meetingDetails.meetingId || '-'}
                            </Text>
                          </Box>
                        </>
                      )}
                    </VStack>
            </Card>
                </Grid>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter 
            bg={modalFooterBg} 
            borderRadius="0 0 xl xl"
            borderTop="1px solid"
            borderColor={modalFooterBorder}
          >
            <Button 
              colorScheme="blue" 
              size="lg"
              onClick={onClose}
              borderRadius="lg"
              px={8}
            >
              {t('close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
        );
    };
    
    export default Appointments;