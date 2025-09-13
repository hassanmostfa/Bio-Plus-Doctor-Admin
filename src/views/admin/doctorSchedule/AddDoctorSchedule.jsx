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
  useToast,
  Grid,
  GridItem,
  HStack,
  Flex,
  Card,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCreateDoctorScheduleMutation } from "api/doctorScheduleSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetClinicsQuery } from "api/clinicSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon } from "@chakra-ui/icons";

const AddDoctorSchedule = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Color mode values
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const bgColor = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');

  
  const [formData, setFormData] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    isOnline: false,
    clinicId: null,
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    isActive: true,
    isFreeSession: false,
  });

  const { data: doctors } = useGetDoctorsQuery();
  const { data: clinics } = useGetClinicsQuery();
  const [createSchedule] = useCreateDoctorScheduleMutation();

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      dayOfWeek: parseInt(formData.dayOfWeek),
      clinicId: formData.clinicId,
      startTime: formatTime(formData.startTime),
      endTime: formatTime(formData.endTime),
    };

    try {
      await createSchedule(submitData).unwrap();
      Swal.fire({
        title: t('success'),
        text: t('doctorScheduleCreated'),
        icon: 'success',
      }).then(() => {
        navigate('/admin/doctor-schedules');
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: error.data?.message || t('failedCreateSchedule'),
        icon: 'error',
      });
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} dir={isRTL ? "rtl" : "ltr"}>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        py="15px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
        bg={bgColor}
      >
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Button 
            leftIcon={<ChevronLeftIcon />} 
            variant="outline"
            colorScheme="blue"
            onClick={() => navigate('/admin/doctor-schedules')}
            mr={isRTL ? 0 : 2}
            ml={isRTL ? 2 : 0}
          >
            {t('back')}
          </Button>
          
          <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
            {t('addNewDoctorSchedule')}
          </Text>
          
          <Box width="100px" /> {/* Spacer to balance the layout */}
        </Flex>
        
        <Box px="25px" pb="25px">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <FormControl>
                  <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                    {t('onlineConsultation')}
                  </FormLabel>
                  <Switch
                    dir="ltr"
                    name="isOnline"
                    isChecked={formData.isOnline}
                    onChange={handleInputChange}
                    colorScheme="brand"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                    {t('active')}
                  </FormLabel>
                  <Switch
                    dir="ltr"
                    name="isActive"
                    isChecked={formData.isActive}
                    onChange={handleInputChange}
                    colorScheme="brand"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                    {t('isFreeSession')}
                  </FormLabel>
                  <Switch
                    dir="ltr"
                    name="isFreeSession"
                    isChecked={formData.isFreeSession}
                    onChange={handleInputChange}
                    colorScheme="brand"
                  />
                </FormControl>
              </Grid>

              <FormControl isRequired>
                <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                  {t('clinic')}
                </FormLabel>
                <Select
                  name="clinicId"
                  value={formData.clinicId || ""}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: borderColor }}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
                >
                  <option value="">{t('selectClinic')}</option>
                  {clinics?.data?.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                  {t('dayOfWeek')}
                </FormLabel>
                <Select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: borderColor }}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
                >
                  <option value="">{t('selectDay')}</option>
                  <option value="0">{t('sunday')}</option>
                  <option value="1">{t('monday')}</option>
                  <option value="2">{t('tuesday')}</option>
                  <option value="3">{t('wednesday')}</option>
                  <option value="4">{t('thursday')}</option>
                  <option value="5">{t('friday')}</option>
                  <option value="6">{t('saturday')}</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                  {t('startTime')}
                </FormLabel>
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: borderColor }}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel textAlign={isRTL ? "right" : "left"} color={textColor}>
                  {t('endTime')}
                </FormLabel>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  bg={inputBg}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: borderColor }}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
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
                {t('createSchedule')}
              </Button>
            </VStack>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default AddDoctorSchedule;