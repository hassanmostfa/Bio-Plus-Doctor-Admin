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
  } from '@chakra-ui/react';
  import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
  } from '@tanstack/react-table';
  import * as React from 'react';
  import Card from 'components/card/Card';
  import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from '@chakra-ui/icons';
  import { FaTrash } from 'react-icons/fa6';
  import Swal from 'sweetalert2';
  import { useTranslation } from 'react-i18next';
  
  const columnHelper = createColumnHelper();
  
  const Calendar = () => {
    const { t } = useTranslation();
    const [page, setPage] = React.useState(1); // Current page
    const [limit, setLimit] = React.useState(10); // Items per page
    const [sorting, setSorting] = React.useState([]);
  
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
    // Static availability data
    const availability = [
      { id: 1, date: '2023-10-02', startTime: '09:00', endTime: '17:00' },
      { id: 2, date: '2023-10-04', startTime: '10:00', endTime: '18:00' },
    ];
  
    const columns = [
      columnHelper.accessor('date', {
        id: 'date',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            {t('date')}
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor}>
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('startTime', {
        id: 'startTime',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            {t('startTime')}
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor}>
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('endTime', {
        id: 'endTime',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            {t('endTime')}
          </Text>
        ),
        cell: (info) => (
          <Text color={textColor}>
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('id', {
        id: 'actions',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
          >
            {t('actions')}
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Icon
              w="18px"
              h="18px"
              me="10px"
              color="red.500"
              as={FaTrash}
              cursor="pointer"
              onClick={() => handleDeleteAvailability(info.getValue())}
            />
            <Icon
              w="18px"
              h="18px"
              me="10px"
              color="green.500"
              as={EditIcon}
              cursor="pointer"
              onClick={() => handleUpdateAvailability(info.getValue())}
            />
          </Flex>
        ),
      }),
    ];
  
    const table = useReactTable({
      data: availability, // Use static availability data
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: true,
    });
  
    // Delete function
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
        });
  
        if (result.isConfirmed) {
          // Perform delete operation here
          Swal.fire(t('deleted'), t('availabilityDeleted'), 'success');
        }
      } catch (error) {
        console.error('Failed to delete availability:', error);
        Swal.fire(t('error'), t('failedDeleteAvailability'), 'error');
      }
    };
  
    // Update function
    const handleUpdateAvailability = (id) => {
      // Perform update operation here
      console.log('Update availability with ID:', id);
      Swal.fire(t('info'), t('updateNotImplemented'), 'info');
    };
  
    // Pagination controls
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
      setPage(1); // Reset to the first page when changing the limit
    };
  
    return (
      <div className="container">
        <Card
          flexDirection="column"
          w="100%"
          px="0px"
          overflowX={{ sm: 'scroll', lg: 'hidden' }}
        >
          <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              {t('doctorAvailability')}
            </Text>

             <Button
                variant='darkBrand'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='24px'
                py='5px'
                width={'200px'}
            >
                {t('addDate')}
            </Button>
          </Flex>
          <Box>
            <Table variant="simple" color="gray.500" mb="24px" mt="12px">
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
                              header.getContext(),
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
                {table.getRowModel().rows.map((row) => {
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
                              cell.getContext(),
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
  
          {/* Pagination Controls */}
          <Flex justifyContent="space-between" alignItems="center" px="25px" py="10px">
            <Flex alignItems="center">
              <Text color={textColor} fontSize="sm" mr="10px">
                {t('rowsPerPage')}
              </Text>
              <select
                value={limit}
                onChange={handleLimitChange}
                style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
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
      </div>
    );
  };
  
  export default Calendar;