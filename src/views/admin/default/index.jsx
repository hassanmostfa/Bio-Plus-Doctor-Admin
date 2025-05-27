import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import IconBox from "components/icons/IconBox";
import MiniStatistics from "components/card/MiniStatistics";
import {
  MdOutlineGroup,
  MdAssignment,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import { columnsDataCheck } from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import { IoTodayOutline as IoToday } from "react-icons/io5";
import { MdOnlinePrediction } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { FaClinicMedical } from "react-icons/fa";
import { useGetStatisticsQuery } from "api/doctorSlice";

export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const { data: statistics, isLoading } = useGetStatisticsQuery();

  const cardData = [
    { 
      name: "Total Appointments", 
      value: statistics?.data?.totalAppointments || 0, 
      icon: MdAssignment 
    },
    { 
      name: "Today Appointments", 
      value: statistics?.data?.todayAppointments || 0, 
      icon: IoToday 
    },
    { 
      name: "Total Online Appointments", 
      value: statistics?.data?.totalOnlineAppointments || 0, 
      icon: MdOnlinePrediction 
    },
    { 
      name: "Total In Clinic Appointments", 
      value: statistics?.data?.totalClinicAppointments || 0, 
      icon: FaClinicMedical 
    },
  ];

  if (isLoading) {
    return <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>Loading...</Box>;
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px" mb="20px">
        {cardData.map((card, index) => (
          <MiniStatistics
            key={index}
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={<Icon w="32px" h="32px" as={card.icon} color={brandColor} />}
              />
            }
            name={card.name}
            value={card.value}
          />
        ))}
      </SimpleGrid>

      {/* Existing Components Below
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} title="Highest Requested Pharmacy" />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} title="Highest Booked Doctors" />
      </SimpleGrid> */}
    </Box>
  );
}
