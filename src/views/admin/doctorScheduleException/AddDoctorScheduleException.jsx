import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  VStack,
  Text,
  useColorModeValue,
  Card,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useCreateDoctorScheduleExceptionMutation } from "api/doctorScheduleExceptionSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetDoctorSchedulesQuery } from "api/doctorScheduleSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon } from "@chakra-ui/icons";

const AddDoctorScheduleException = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgColor = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const switchBg = useColorModeValue('gray.100', 'gray.600');
  
  const [formData, setFormData] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    scheduleId: "",
    exceptionDate: "",
    isCancelled: true,
  });

  const { data: doctors } = useGetDoctorsQuery();
  const { data: schedules } = useGetDoctorSchedulesQuery({ 
    limit: 1000, 
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id 
  });
  const [createException] = useCreateDoctorScheduleExceptionMutation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = { ...formData };
    if (!submitData.scheduleId) {
      delete submitData.scheduleId;
    }
    
    try {
      await createException(submitData).unwrap();
      Swal.fire({
        title: t('success'),
        text: t('exceptionCreated'),
        icon: 'success',
        background: bgColor,
        color: textColor,
        customClass: {
          popup: isRTL ? 'swal2-rtl' : ''
        }
      }).then(() => {
        navigate('/admin/doctor-schedule-exceptions');
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: error.data?.message || t('failedCreateException'),
        icon: 'error',
        background: bgColor,
        color: textColor,
        customClass: {
          popup: isRTL ? 'swal2-rtl' : ''
        }
      });
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} dir={isRTL ? "rtl" : "ltr"}>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        py={"15px"}
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
        bg={bgColor}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Button 
            leftIcon={<ChevronLeftIcon />} 
            variant="outline"
            colorScheme="blue"
            onClick={() => navigate('/admin/doctor-schedule-exceptions')}
            mr={isRTL ? 0 : 2}
            ml={isRTL ? 2 : 0}
          >
            {t('back')}
          </Button>
          
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            {t('addNewScheduleException')}
          </Text>
          
          <Box width="100px" /> {/* Spacer to balance the layout */}
        </Flex>

        <Box px="25px" pb="25px">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                  {t('scheduleOptional')}
                </FormLabel>
                <Select
                  name="scheduleId"
                  value={formData.scheduleId}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: borderColor }}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
                >
                  <option value="">{t('allSchedules')}</option>
                  {schedules?.data?.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {`${schedule.dayName} (${schedule.startTime} - ${schedule.endTime})`}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                  {t('exceptionDate')}
                </FormLabel>
                <Input
                  type="date"
                  name="exceptionDate"
                  value={formData.exceptionDate}
                  onChange={handleInputChange}
                  dir={isRTL ? "rtl" : "ltr"}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: borderColor }}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                  {t('cancelled')}
                </FormLabel>
                <Switch
                  dir="ltr"
                  name="isCancelled"
                  isChecked={formData.isCancelled}
                  onChange={handleInputChange}
                  colorScheme={formData.isCancelled ? 'red' : 'green'}
                  bg={switchBg}
                />
              </FormControl>

              <Button 
                type="submit" 
                variant="darkBrand"
                color="white"
                fontSize="sm"
                fontWeight="500"
                borderRadius="70px"
                px="24px"
                py="5px"
                width="full"
                mt={4}
              >
                {t('createException')}
              </Button>
            </VStack>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default AddDoctorScheduleException;