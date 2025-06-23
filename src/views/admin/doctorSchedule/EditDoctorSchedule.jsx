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
} from "@chakra-ui/react";
import { useUpdateDoctorScheduleMutation, useGetDoctorScheduleByIdQuery } from "api/doctorScheduleSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetClinicsQuery } from "api/clinicSlice";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

const EditDoctorSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
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
        // doctorId: schedule.data.doctorId,
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
    
    // Prepare the data for submission
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
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Text>{t('loading')}</Text>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Grid templateColumns='repeat(12, 1fr)' gap={6}>
        <GridItem colSpan={12}>
          <Box bg='white' p={4} borderRadius='lg' boxShadow='sm'>
            <Text fontSize='xl' fontWeight='bold' mb={4}>
              {t('editDoctorSchedule')}
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align='stretch'>
                {/* <FormControl isRequired>
                  <FormLabel>Doctor</FormLabel>
                  <Select
                    name="doctorId"
                    // value={formData.doctorId}
                    // onChange={handleInputChange}
                  >
                    <option value="">Select Doctor</option>
                    {doctors?.data?.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.fullName}
                      </option>
                    ))}
                  </Select>
                </FormControl> */}

                <FormControl>
                  <FormLabel>{t('onlineConsultation')}</FormLabel>
                  <Switch
                    name='isOnline'
                    isChecked={formData.isOnline}
                    onChange={handleInputChange}
                  />
                </FormControl> 

                <FormControl isRequired>
                  <FormLabel>{t('clinic')}</FormLabel>
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
                  <FormLabel>{t('dayOfWeek')}</FormLabel>
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
                  <FormLabel>{t('startTime')}</FormLabel>
                  <Input
                    type='time'
                    name='startTime'
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('endTime')}</FormLabel>
                  <Input
                    type='time'
                    name='endTime'
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('active')}</FormLabel>
                  <Switch
                    name='isActive'
                    isChecked={formData.isActive}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type='submit' colorScheme='blue' width='full'>
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