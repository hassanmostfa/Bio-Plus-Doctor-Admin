import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { useUpdateDoctorScheduleMutation, useGetDoctorScheduleByIdQuery } from "api/doctorScheduleSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetClinicsQuery } from "api/clinicSlice";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon } from "@chakra-ui/icons";

const EditDoctorSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState({
    doctorId: "",
    isOnline: false,
    clinicId: null,
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    isActive: true,
  });

  const { data: schedule, isLoading } = useGetDoctorScheduleByIdQuery(id);
  const { data: doctors } = useGetDoctorsQuery();
  const { data: clinics } = useGetClinicsQuery();
  const [updateSchedule] = useUpdateDoctorScheduleMutation();

  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    if (hours === 12) {
      hours = modifier === "PM" ? 12 : 0;
    } else {
      hours = modifier === "PM" ? hours + 12 : hours;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

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

  useEffect(() => {
    if (schedule?.data) {
      setFormData({
        isOnline: schedule.data.isOnline,
        clinicId: schedule.data.clinicId || null,
        dayOfWeek: schedule.data.dayOfWeek.toString(),
        startTime: convertTo24Hour(schedule.data.startTime),
        endTime: convertTo24Hour(schedule.data.endTime),
        isActive: schedule.data.isActive,
      });
    }
  }, [schedule]);

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
      await updateSchedule({
        id,
        schedule: submitData,
      }).unwrap();
      Swal.fire({
        title: t('success'),
        text: t('doctorScheduleUpdated'),
        icon: 'success',
      }).then(() => {
        navigate('/admin/doctor-schedules');
      });
    } catch (error) {
      Swal.fire({
        title: t('error'),
        text: error.data?.message || t('failedUpdateSchedule'),
        icon: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }} dir={isRTL ? "rtl" : "ltr"}>
        <Text textAlign={isRTL ? "right" : "left"}>{t('loading')}</Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} dir={isRTL ? "rtl" : "ltr"}>
      <Grid templateColumns='repeat(12, 1fr)' gap={6}>
        <GridItem colSpan={12}>
          <Box bg='white' p={4} borderRadius='lg' boxShadow='sm'>
            <HStack justify="space-between" mb={4}>
              <Button 
                leftIcon={<ChevronLeftIcon />} 
                variant="outline" 
                onClick={() => navigate('/admin/doctor-schedules')}
                mr={isRTL ? 0 : 2}
                ml={isRTL ? 2 : 0}
              >
                {t('back')}
              </Button>
              <Text fontSize="xl" fontWeight="bold" textAlign={isRTL ? "right" : "left"}>
                {t('editDoctorSchedule')}
              </Text>
              <Box width="100px" /> {/* Spacer to balance the layout */}
            </HStack>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align='stretch'>
                <FormControl>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('onlineConsultation')}</FormLabel>
                  <Switch
                    dir="ltr"
                    name='isOnline'
                    isChecked={formData.isOnline}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('clinic')}</FormLabel>
                  <Select
                    name='clinicId'
                    value={formData.clinicId || ''}
                    onChange={handleInputChange}
                  >
                    <option value=''>{t('selectClinic')}</option>
                    {clinics?.data?.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('dayOfWeek')}</FormLabel>
                  <Select
                    name='dayOfWeek'
                    value={formData.dayOfWeek}
                    onChange={handleInputChange}
                  >
                    <option value=''>{t('selectDay')}</option>
                    <option value='0'>{t('sunday')}</option>
                    <option value='1'>{t('monday')}</option>
                    <option value='2'>{t('tuesday')}</option>
                    <option value='3'>{t('wednesday')}</option>
                    <option value='4'>{t('thursday')}</option>
                    <option value='5'>{t('friday')}</option>
                    <option value='6'>{t('saturday')}</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('startTime')}</FormLabel>
                  <Input
                    type='time'
                    name='startTime'
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('endTime')}</FormLabel>
                  <Input
                    type='time'
                    name='endTime'
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel textAlign={isRTL ? "right" : "left"}>{t('active')}</FormLabel>
                  <Switch
                    dir="ltr"
                    name='isActive'
                    isChecked={formData.isActive}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button 
                type='submit'
                mt={4}
                variant="darkBrand"
		  	        fontWeight="500"
        	      borderRadius="70px"
                px="24px"
                py="5px" 
                color="white"
                ml={4}
                width="full"
                >
                  {t('updateSchedule')}
                </Button>
              </VStack>
            </form>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default EditDoctorSchedule;