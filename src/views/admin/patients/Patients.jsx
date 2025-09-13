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
  Avatar,
  Tooltip,
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
  Divider
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
  EmailIcon,
  PhoneIcon
} from '@chakra-ui/icons';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGetDoctorPatientsQuery } from 'api/patientsSlice';
import { useTranslation } from 'react-i18next';

const columnHelper = createColumnHelper();

const Patients = () => {
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
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
  });

  // API calls
  const { data: patientsResponse, isLoading, error, refetch } = useGetDoctorPatientsQuery({ 
    page, 
    limit, 
    search: filters.search,
    ...filters 
  });

  // Extract data and pagination
  const tableData = patientsResponse?.data?.items || [];
  const pagination = patientsResponse?.data?.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 1 };

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
    });
    setSearch('');
    setPage(1);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    onOpen();
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

  const formatGender = (gender) => {
    return gender === 'MALE' ? t('male') : t('female');
  };

  const getGenderColor = (gender) => {
    return gender === 'MALE' ? 'blue' : 'pink';
  };

  // Transform data for table
  const transformedData = React.useMemo(() => {
    return tableData.map((patient) => ({
      id: patient.patientId,
      name: patient.patientInfo.name,
      email: patient.patientInfo.email,
      phone: patient.patientInfo.phoneNumber,
      gender: patient.patientInfo.gender,
      area: patient.patientInfo.area || '-',
      // Keep full patient data for modal
      fullPatientData: patient,
    }));
  }, [tableData, t]);

  // Table columns
  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('patientName')}
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Avatar 
            size="sm" 
            name={info.getValue()} 
            mr={3}
            bg="blue.500"
            color="white"
          />
          <Text color={textColor} fontWeight="medium">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('email')}
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <EmailIcon mr={2} color="gray.500" />
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('phone', {
      id: 'phone',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('phone')}
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <PhoneIcon mr={2} color="gray.500" />
          <Text color={textColor} fontSize="sm">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('gender', {
      id: 'gender',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('gender')}
        </Text>
      ),
      cell: (info) => (
        <Badge 
          colorScheme={getGenderColor(info.getValue())}
          p={1}
          borderRadius="md"
        >
          {formatGender(info.getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor('area', {
      id: 'area',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('area')}
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'actions',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('actions')}
        </Text>
      ),
      cell: (info) => {
        const rowData = info.row.original;
        return (
          <Flex align="center">
            <Tooltip label={t('viewDetails')}>
              <IconButton
                aria-label="View patient details"
                icon={<Icon as={FaEye} />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={() => handleViewPatient(rowData.fullPatientData)}
                mr={2}
              />
            </Tooltip>
          </Flex>
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
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            {t('patients')}
          </Text>
          
          <Text color="gray.500" fontSize="sm">
            {t('totalPatients')}: {pagination.totalItems}
          </Text>
        </Flex>

        {/* Search and Filters Row */}
        <HStack px="25px" mb="20px" spacing={4} align="center">
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder={t('searchPatients')}
              value={search}
              onChange={handleSearchChange}
              size="sm"
              variant="outline"
              borderRadius="md"
              borderColor={borderColor}
            />
          </InputGroup>

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
              {t('noPatientsFound')}
            </Text>
            <Text color="gray.500" fontSize="sm">
              {t('noPatientsDescription')}
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

      {/* Patient Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Avatar 
                size="md" 
                name={selectedPatient?.patientInfo?.name} 
                mr={3}
                bg="blue.500"
                color="white"
              />
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  {selectedPatient?.patientInfo?.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {t('patientDetails')}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                {/* Personal Information */}
                <Box>
                  <Text fontSize="md" fontWeight="bold" mb={3} color={textColor}>
                    {t('personalInformation')}
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {t('email')}
                      </Text>
                      <Flex align="center">
                        <EmailIcon mr={2} color="gray.500" />
                        <Text color={textColor}>
                          {selectedPatient.patientInfo.email}
                        </Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {t('phone')}
                      </Text>
                      <Flex align="center">
                        <PhoneIcon mr={2} color="gray.500" />
                        <Text color={textColor}>
                          {selectedPatient.patientInfo.phoneNumber}
                        </Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {t('gender')}
                      </Text>
                      <Badge 
                        colorScheme={getGenderColor(selectedPatient.patientInfo.gender)}
                        p={1}
                        borderRadius="md"
                        width="fit-content"
                      >
                        {formatGender(selectedPatient.patientInfo.gender)}
                      </Badge>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {t('area')}
                      </Text>
                      <Text color={textColor}>
                        {selectedPatient.patientInfo.area || '-'}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {t('parentUser')}
                      </Text>
                      <Text color={textColor}>
                        {selectedPatient.parentUser ? selectedPatient.parentUser.name || t('yes') : t('no')}
                      </Text>
                    </GridItem>
                  </Grid>
                </Box>

                <Divider />

                {/* Appointment Statistics */}
                <Box>
                  <Text fontSize="md" fontWeight="bold" mb={3} color={textColor}>
                    {t('appointmentStatistics')}
                  </Text>
                  <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                    <GridItem>
                      <Box textAlign="center" p={3} bg="blue.50" borderRadius="md">
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                          {selectedPatient.appointmentSummary.total}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {t('totalAppointments')}
                        </Text>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Box textAlign="center" p={3} bg="green.50" borderRadius="md">
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                          {selectedPatient.appointmentSummary.completed}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {t('completed')}
                        </Text>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <Box textAlign="center" p={3} bg="orange.50" borderRadius="md">
                        <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                          {selectedPatient.appointmentSummary.upcoming}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {t('upcoming')}
                        </Text>
                      </Box>
                    </GridItem>
                  </Grid>
                </Box>

                <Divider />

                {/* Visit Information */}
                <Box>
                  <Text fontSize="md" fontWeight="bold" mb={3} color={textColor}>
                    {t('visitInformation')}
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {t('firstVisit')}
                      </Text>
                      <Text color={textColor}>
                        {formatDate(selectedPatient.appointmentSummary.firstVisit)}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {t('lastVisit')}
                      </Text>
                      <Text color={textColor}>
                        {formatDate(selectedPatient.appointmentSummary.lastVisit)}
                      </Text>
                    </GridItem>
                  </Grid>
                </Box>

                <Divider />

                {/* Revenue Information */}
                <Box>
                  <Text fontSize="md" fontWeight="bold" mb={3} color={textColor}>
                    {t('revenueInformation')}
                  </Text>
                  <Box textAlign="center" p={4} bg="green.50" borderRadius="md">
                    <Text fontSize="3xl" fontWeight="bold" color="green.500">
                      kwd {selectedPatient.appointmentSummary.totalRevenue}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {t('totalRevenue')}
                    </Text>
                  </Box>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => {
                onClose();
                navigate(`/admin/patients/${selectedPatient?.patientId}/appointments`);
              }}
            >
              {t('viewAllAppointments')}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Patients;
