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
} from "@chakra-ui/react";
import { useCreateDoctorScheduleMutation } from "api/doctorScheduleSlice";
import { useGetDoctorsQuery } from "api/doctorSlice";
import { useGetClinicsQuery } from "api/clinicSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

const AddDoctorSchedule = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    doctorId: JSON.parse(localStorage.getItem("doctor"))?.id,
    isOnline: false,
    clinicId: null,
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    isActive: true,
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
    
    // Prepare the data for submission
    const submitData = {
      ...formData,
      dayOfWeek: parseInt(formData.dayOfWeek),
      clinicId:  formData.clinicId,
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
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={12}>
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {t('addNewDoctorSchedule')}
            </Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                {/* <FormControl isRequired>
                  <FormLabel>Doctor</FormLabel>
                  <Select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
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
                    name="isOnline"
                    isChecked={formData.isOnline}
                    onChange={handleInputChange}
                  />
                </FormControl>

                {/* {!formData.isOnline && ( */}
                  <FormControl isRequired>
                    <FormLabel>{t('clinic')}</FormLabel>
                    <Select
                      name="clinicId"
                      value={formData.clinicId || ""}
                      onChange={handleInputChange}
                    >
                      <option value="">{t('selectClinic')}</option>
                      {clinics?.data?.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                {/* )} */}

                <FormControl isRequired>
                  <FormLabel>{t('dayOfWeek')}</FormLabel>
                  <Select
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleInputChange}
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
                  <FormLabel>{t('startTime')}</FormLabel>
                  <Input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('endTime')}</FormLabel>
                  <Input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('active')}</FormLabel>
                  <Switch
                    name="isActive"
                    isChecked={formData.isActive}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full">
                  {t('createSchedule')}
                </Button>
              </VStack>
            </form>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default AddDoctorSchedule; 