    import {
        Box,
        Flex,
        Icon,
        Input,
        Select,
        Table,
        Tbody,
        Td,
        Text,
        Th,
        Thead,
        Tr,
        useColorModeValue,
        useDisclosure,
        Modal,
        ModalOverlay,
        ModalContent,
        ModalHeader,
        ModalCloseButton,
        ModalBody,
        ModalFooter,
        Button,
    } from '@chakra-ui/react';
    import {
        createColumnHelper,
        flexRender,
        getCoreRowModel,
        getSortedRowModel,
        useReactTable,
    } from '@tanstack/react-table';
    import React, { useState } from 'react';
    import Card from 'components/card/Card';
    import { FaEye } from 'react-icons/fa6';
    
    const columnHelper = createColumnHelper();
    
    const Appointments = () => {
        const [data, setData] = useState([
        {
            username: 'John Doe',
            userType: 'Registered User',
            email: 'john.doe@example.com',
            phoneNo: '+96599123456',
            doctor: 'Dr. Smith',
            clinic: 'City Clinic',
            clinicCategory: 'General',
            appointmentType: 'Online',
            appointmentDate: '2025-02-20',
        },
        {
            username: 'Jane Smith',
            userType: 'Family Account',
            email: 'jane.smith@example.com',
            phoneNo: '+96599123457',
            doctor: 'Dr. Johnson',
            clinic: 'Health Plus',
            clinicCategory: 'Dental',
            appointmentType: 'At Clinic',
            appointmentDate: '2025-02-21',
        },
        {
            username: 'Emily Johnson',
            userType: 'Registered User',
            email: 'emily.johnson@example.com',
            phoneNo: '+96599123458',
            doctor: 'Dr. Brown',
            clinic: 'Care Clinic',
            clinicCategory: 'Pediatric',
            appointmentType: 'Online',
            appointmentDate: '2025-02-22',
        },
        ]);
    
        const [sorting, setSorting] = useState([]);
        
        // Filter states
        const [doctorFilter, setDoctorFilter] = useState('');
        const [clinicFilter, setClinicFilter] = useState('');
        const [clinicCategoryFilter, setClinicCategoryFilter] = useState('');
        const [appointmentTypeFilter, setAppointmentTypeFilter] = useState('');
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');
        const [filteredData, setFilteredData] = useState(data); // State for filtered data
    
        // Extract unique filter options
        const doctors = [...new Set(data.map((appointment) => appointment.doctor))];
        const clinics = [...new Set(data.map((appointment) => appointment.clinic))];
        const clinicCategories = [...new Set(data.map((appointment) => appointment.clinicCategory))];
        const appointmentTypes = [...new Set(data.map((appointment) => appointment.appointmentType))];
    
        // Apply all filters
        const applyFilters = (doctor, clinic, clinicCategory, appointmentType, start, end) => {
        const filtered = data.filter((appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate);
    
            // Date range filter
            const startFilter = start ? new Date(start) : null;
            const endFilter = end ? new Date(end) : null;
            const matchesDate =
            (!startFilter || appointmentDate >= startFilter) && (!endFilter || appointmentDate <= endFilter);
    
            // Doctor filter
            const matchesDoctor = !doctor || appointment.doctor === doctor;
    
            // Clinic filter
            const matchesClinic = !clinic || appointment.clinic === clinic;
    
            // Clinic category filter
            const matchesClinicCategory = !clinicCategory || appointment.clinicCategory === clinicCategory;
    
            // Appointment type filter
            const matchesAppointmentType = !appointmentType || appointment.appointmentType === appointmentType;
    
            return (
            matchesDate &&
            matchesDoctor &&
            matchesClinic &&
            matchesClinicCategory &&
            matchesAppointmentType
            );
        });
    
        setFilteredData(filtered);
        };
    
        // Handle filter changes
        const handleDoctorFilterChange = (e) => {
        const selectedDoctor = e.target.value;
        setDoctorFilter(selectedDoctor);
        applyFilters(selectedDoctor, clinicFilter, clinicCategoryFilter, appointmentTypeFilter, startDate, endDate);
        };
    
        const handleClinicFilterChange = (e) => {
        const selectedClinic = e.target.value;
        setClinicFilter(selectedClinic);
        applyFilters(doctorFilter, selectedClinic, clinicCategoryFilter, appointmentTypeFilter, startDate, endDate);
        };
    
        const handleClinicCategoryFilterChange = (e) => {
        const selectedClinicCategory = e.target.value;
        setClinicCategoryFilter(selectedClinicCategory);
        applyFilters(doctorFilter, clinicFilter, selectedClinicCategory, appointmentTypeFilter, startDate, endDate);
        };
    
        const handleAppointmentTypeFilterChange = (e) => {
        const selectedAppointmentType = e.target.value;
        setAppointmentTypeFilter(selectedAppointmentType);
        applyFilters(doctorFilter, clinicFilter, clinicCategoryFilter, selectedAppointmentType, startDate, endDate);
        };
    
        const handleApplyDateFilter = () => {
        applyFilters(doctorFilter, clinicFilter, clinicCategoryFilter, appointmentTypeFilter, startDate, endDate);
        };
    
        const textColor = useColorModeValue('secondaryGray.900', 'white');
        const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
    
        const columns = [
        columnHelper.accessor('username', {
            header: 'Username',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('userType', {
            header: 'User Type',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('phoneNo', {
            header: 'Phone No',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('doctor', {
            header: 'Doctor',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('clinic', {
            header: 'Clinic',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('clinicCategory', {
            header: 'Clinic Category',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('appointmentType', {
            header: 'Appointment Type',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        columnHelper.accessor('appointmentDate', {
            header: 'Appointment Date',
            cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
        }),
        ];
    
        const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        });
    
        return (
        <div className="container">
            <Card
            flexDirection="column"
            w="100%"
            px="0px"
            overflowX={{ sm: 'scroll', lg: 'hidden' }}
            >
            <Flex px="25px" mb="20px" justifyContent="space-between" align="center">
                <Text
                color={textColor}
                fontSize="22px"
                fontWeight="700"
                lineHeight="100%"

                >
                Appointments
                </Text>
            </Flex>
    
            {/* Filters */}
            <Flex mb="20px" mx={"10px"} wrap="wrap" justifyContent="space-around">
                {/* Doctor Filter */}
                <Box>

                <Select
                    placeholder="Filter by Doctor"
                    value={doctorFilter}
                    onChange={handleDoctorFilterChange}
                    size="sm"
                    borderRadius="15px"
                    width="250px"
                    bg={'gray.100'}
                    padding={'10px'}
                >
                    {doctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                        {doctor}
                    </option>
                    ))}
                </Select>
                </Box>
    
                {/* Clinic Filter */}
                <Box>
                <Select
                    placeholder="Filter by Clinic"
                    value={clinicFilter}
                    onChange={handleClinicFilterChange}
                    size="sm"
                    borderRadius="15px"
                    width="250px"
                    bg={'gray.100'}
                    padding={'10px'}
                >
                    {clinics.map((clinic) => (
                    <option key={clinic} value={clinic}>
                        {clinic}
                    </option>
                    ))}
                </Select>
                </Box>
    
                {/* Clinic Category Filter */}
                <Box>
                <Select
                    placeholder="Filter by Clinic Category"
                    value={clinicCategoryFilter}
                    onChange={handleClinicCategoryFilterChange}
                    size="sm"
                    borderRadius="15px"
                    width="250px"
                    bg={'gray.100'}
                    padding={'10px'}
                >
                    {clinicCategories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                    ))}
                </Select>
                </Box>
    
                {/* Appointment Type Filter */}
                <Box>
                <Select
                    placeholder="Filter by Appointment Type"
                    value={appointmentTypeFilter}
                    onChange={handleAppointmentTypeFilterChange}
                    size="sm"
                    borderRadius="15px"
                    width="250px"
                    bg={'gray.100'}
                    padding={'10px'}
                >
                    {appointmentTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                    ))}
                </Select>
                </Box>
    
            </Flex>
            
            <Flex mb="20px" mx={"20px"} wrap="wrap" justifyContent="space-around" alignItems={'center'}>
                {/* Date Range Filter */}
                <Box>

                <Text color={textColor} mb={'10px'} fontWeight={'bold'} fontSize={'sm'}>
                From Date
                </Text>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="sm"
                    borderRadius="15px"
                    padding="20px"
                    bg={'gray.100'}
                    width={'400px'}
                    
                />
                </Box>
                <Box>
                <Text color={textColor} mb={'10px'} fontWeight={'bold'} fontSize={'sm'}>
                    To Date
                </Text>
                <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="sm"
                    borderRadius="15px"
                    padding="20px"
                    bg={'gray.100'}
                    width={'400px'}
                />
                </Box>
                <Box>
                <Button
                    onClick={handleApplyDateFilter}
                    variant="darkBrand"
                    color="white"
                    fontSize="sm"
                    fontWeight="500"
                    borderRadius="70px"
                    px="24px"
                    py="5px"
                    width={'200px'}
                    mt={'20px'}
                >
                    Apply Filter
                </Button>
                </Box>

            </Flex>
            {/* Table */}
            <Box overflowX="auto">
                <Table variant="simple" color="gray.500" mb="24px" mt="12px" minWidth="1000px">
                <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                        return (
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
                        );
                        })}
                    </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table
                    .getRowModel()
                    .rows.slice(0, 11)
                    .map((row) => {
                        return (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                            return (
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
                            );
                            })}
                        </Tr>
                        );
                    })}
                </Tbody>
                </Table>
            </Box>
            </Card>
        </div>
        );
    };
    
    export default Appointments;