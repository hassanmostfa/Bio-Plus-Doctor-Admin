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
  Card,
  Select,
  IconButton,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from '@chakra-ui/icons';
import { FaTrash } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const columnHelper = createColumnHelper();

const Calendar = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [sorting, setSorting] = React.useState([]);

  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgColor = useColorModeValue('white', 'gray.800');
  const tableBg = useColorModeValue('white', 'gray.700');
  const tableRowHover = useColorModeValue('gray.50', 'gray.600');
  const inputBg = useColorModeValue('white', 'gray.700');

  // Static availability data
  const availability = [
    { id: 1, date: '2023-10-02', startTime: '09:00', endTime: '17:00' },
    { id: 2, date: '2023-10-04', startTime: '10:00', endTime: '18:00' },
  ];

  const columns = [
    columnHelper.accessor('date', {
      id: 'date',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('date')}
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('startTime', {
      id: 'startTime',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('startTime')}
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
    }),
    columnHelper.accessor('endTime', {
      id: 'endTime',
      header: () => (
        <Text fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          {t('endTime')}
        </Text>
      ),
      cell: (info) => <Text color={textColor}>{info.getValue()}</Text>,
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
            aria-label={t('delete')}
            icon={<FaTrash />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => handleDeleteAvailability(info.getValue())}
            mr={2}
          />
          <IconButton
            aria-label={t('edit')}
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={() => handleUpdateAvailability(info.getValue())}
          />
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: availability,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleDeleteAvailability = async (id) => {
    try {
      const result = await Swal.fire({
        title: t('areYouSure'),
        text: t('noRevert'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('yesDeleteIt'),
        background: bgColor,
        color: textColor,
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: t('deleted'),
          text: t('availabilityDeleted'),
          icon: 'success',
          background: bgColor,
          color: textColor,
        });
      }
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: t('failedDeleteAvailability'),
        icon: 'error',
        background: bgColor,
        color: textColor,
      });
    }
  };

  const handleUpdateAvailability = (id) => {
    Swal.fire({
      title: t('info'),
      text: t('updateNotImplemented'),
      icon: 'info',
      background: bgColor,
      color: textColor,
    });
  };

  const handleNextPage = () => {
    if (page < Math.ceil(availability.length / limit)) {
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

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} dir={isRTL ? "rtl" : "ltr"}>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
        bg={bgColor}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            {t('doctorAvailability')}
          </Text>
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            width="200px"
          >
            {t('addDate')}
          </Button>
        </Flex>

        <Box px="25px">
          <Table variant="simple" colorScheme={bgColor}>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id} bg={bgColor}>
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
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                <Tr key={row.id} bg={tableBg} _hover={{ bg: tableRowHover }}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      fontSize={{ sm: '14px' }}
                      minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                      borderColor="transparent"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
              {t('rowsPerPage')}
            </Text>
            <Select
              value={limit}
              onChange={handleLimitChange}
              width="100px"
              size="sm"
              variant="outline"
              borderRadius="md"
              borderColor={borderColor}
              bg={inputBg}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </Flex>
          <Text color={textColor} fontSize="sm">
            {t('page')} {page} {t('of')} {Math.ceil(availability.length / limit)}
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
              disabled={page === Math.ceil(availability.length / limit)}
              variant="outline"
              size="sm"
            >
              {t('next')}
              <Icon as={ChevronRightIcon} ml="5px" />
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};

export default Calendar;